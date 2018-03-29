/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.rest;

import com.smartsuites.utils.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import com.smartsuites.annotation.ZeppelinApi;
import com.smartsuites.notebook.NotebookAuthorization;
import com.smartsuites.server.JsonResponse;
import com.smartsuites.ticket.TicketContainer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

/**
 * Created for com.smartsuites.rest.message on 17/03/16.
 */

@Path("/login")
@Produces("application/json")
public class LoginRestApi {
  private static final Logger LOG = LoggerFactory.getLogger(LoginRestApi.class);

  /**
   * Required by Swagger.
   */
  public LoginRestApi() {
    super();
  }


  /**
   * Post Login
   * Returns userName & password
   * for anonymous access, username is always anonymous.
   * After getting this ticket, access through websockets become safe
   *
   * @return 200 response
   */
  @POST
  @ZeppelinApi
  public Response postLogin(@FormParam("userName") String userName,
                            @FormParam("password") String password) {
    String message = null;
    JsonResponse response = null;
    // ticket set to anonymous for anonymous user. Simplify testing.
    Subject currentUser = org.apache.shiro.SecurityUtils.getSubject();
    if (currentUser.isAuthenticated()) {
      currentUser.logout();
    }
    if (!currentUser.isAuthenticated()) {
      try {
        UsernamePasswordToken token = new UsernamePasswordToken(userName, password);
        //      token.setRememberMe(true);

        currentUser.getSession().stop();
        currentUser.getSession(true);
        currentUser.login(token);

        HashSet<String> roles = SecurityUtils.getRoles();
        String principal = SecurityUtils.getPrincipal();
        String ticket;
        if ("anonymous".equals(principal))
          ticket = "anonymous";
        else
          ticket = TicketContainer.instance.getTicket(principal);

        Map<String, String> data = new HashMap<>();
        data.put("principal", principal);
        data.put("roles", roles.toString());
        data.put("ticket", ticket);

        message = "登录成功，跳转中...";
        response = new JsonResponse(Response.Status.OK, message, data);
        //if no exception, that's it, we're done!
        
        //set roles for user in NotebookAuthorization module
        NotebookAuthorization.getInstance().setRoles(principal, roles);
      } catch (UnknownAccountException uae) {
        message = "用户不存在，请重试！";
        response = new JsonResponse(Response.Status.EXPECTATION_FAILED, message, "");
        LOG.error("Exception in login: ", uae);
        return response.build();
      } catch (IncorrectCredentialsException ice) {
        message = "密码不匹配，请重试！";
        response = new JsonResponse(Response.Status.EXPECTATION_FAILED, message, "");
        LOG.error("Exception in login: ", ice);
        return response.build();
      } catch (LockedAccountException lae) {
        message = "账户被锁定，请联系管理员！";
        response = new JsonResponse(Response.Status.EXPECTATION_FAILED, message, "");
        LOG.error("Exception in login: ", lae);
        return response.build();
      } catch (AuthenticationException ae) {
        message = "未知异常，请联系管理员！";
        response = new JsonResponse(Response.Status.EXPECTATION_FAILED, message, "");
        LOG.error("Exception in login: ", ae);
        return response.build();
      }
    }

    if (response == null) {
      response = new JsonResponse(Response.Status.FORBIDDEN, message, "");
    }

    LOG.warn(response.toString());
    return response.build();
  }

  @POST
  @Path("logout")
  @ZeppelinApi
  public Response logout() {
    JsonResponse response;
    Subject currentUser = org.apache.shiro.SecurityUtils.getSubject();
    TicketContainer.instance.removeTicket(SecurityUtils.getPrincipal());
    currentUser.getSession().stop();
    currentUser.logout();
    response = new JsonResponse(Response.Status.UNAUTHORIZED, "", "");
    LOG.warn(response.toString());
    return response.build();
  }

}
