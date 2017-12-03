/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.rest;

import com.smartsuites.realm.ActiveDirectoryGroupRealm;
import com.smartsuites.realm.LdapRealm;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.apache.shiro.realm.ldap.JndiLdapContextFactory;
import org.apache.shiro.realm.ldap.JndiLdapRealm;
import org.apache.shiro.realm.text.IniRealm;
import org.apache.shiro.util.JdbcUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * This is class which help fetching users from different realms.
 * getUserList() function is overloaded and according to the realm passed to the function it
 * extracts users from its respective realm
 */
public class GetUserList {

  private static final Logger LOG = LoggerFactory.getLogger(GetUserList.class);

  /**
   * 从 shiro.ini 文件中解析出用户
   * @param r  shiro的ini文件配置对象
   * @return
   */
  public List<String> getUserList(IniRealm r) {
    List<String> userList = new ArrayList<>();
    Map getIniUser = r.getIni().get("users");
    if (getIniUser != null) {
      Iterator it = getIniUser.entrySet().iterator();
      while (it.hasNext()) {
        Map.Entry pair = (Map.Entry) it.next();
        userList.add(pair.getKey().toString().trim());
      }
    }
    return userList;
  }


  /***
   * 从 shiro.ini 文件中获取角色
   * @param r
   * @return
   */
  public List<String> getRolesList(IniRealm r) {
    List<String> roleList = new ArrayList<>();
    Map getIniRoles = r.getIni().get("roles");
    if (getIniRoles != null) {
      Iterator it = getIniRoles.entrySet().iterator();
      while (it.hasNext()) {
        Map.Entry pair = (Map.Entry) it.next();
        roleList.add(pair.getKey().toString().trim());
      }
    }
    return roleList;
  }

  /**
   * 从 LDAP 获取用户列表
   */
  public List<String> getUserList(JndiLdapRealm r, String searchText) {
    List<String> userList = new ArrayList<>();
    String userDnTemplate = r.getUserDnTemplate();
    String userDn[] = userDnTemplate.split(",", 2);
    String userDnPrefix = userDn[0].split("=")[0];
    String userDnSuffix = userDn[1];
    JndiLdapContextFactory CF = (JndiLdapContextFactory) r.getContextFactory();
    try {
      LdapContext ctx = CF.getSystemLdapContext();
      SearchControls constraints = new SearchControls();
      constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
      String[] attrIDs = {userDnPrefix};
      constraints.setReturningAttributes(attrIDs);
      NamingEnumeration result = ctx.search(userDnSuffix, "(" + userDnPrefix + "=*" + searchText +
          "*)", constraints);
      while (result.hasMore()) {
        Attributes attrs = ((SearchResult) result.next()).getAttributes();
        if (attrs.get(userDnPrefix) != null) {
          String currentUser = attrs.get(userDnPrefix).toString();
          userList.add(currentUser.split(":")[1].trim());
        }
      }
    } catch (Exception e) {
      LOG.error("Error retrieving User list from Ldap Realm", e);
    }
    LOG.info("UserList: " + userList);
    return userList;
  }
  
  /**
   * function to extract users from Zeppelin LdapRealm
   */
  public List<String> getUserList(LdapRealm r, String searchText) {
    List<String> userList = new ArrayList<>();
    if (LOG.isDebugEnabled()) {
      LOG.debug("SearchText: " + searchText);
    }
    String userAttribute = r.getUserSearchAttributeName();
    String userSearchRealm = r.getUserSearchBase();
    String userObjectClass = r.getUserObjectClass();
    JndiLdapContextFactory CF = (JndiLdapContextFactory) r.getContextFactory();
    try {
      LdapContext ctx = CF.getSystemLdapContext();
      SearchControls constraints = new SearchControls();
      constraints.setSearchScope(SearchControls.SUBTREE_SCOPE);
      String[] attrIDs = {userAttribute};
      constraints.setReturningAttributes(attrIDs);
      NamingEnumeration result = ctx.search(userSearchRealm, "(&(objectclass=" + 
            userObjectClass + ")(" 
            + userAttribute + "=" + searchText + "))", constraints);
      while (result.hasMore()) {
        Attributes attrs = ((SearchResult) result.next()).getAttributes();
        if (attrs.get(userAttribute) != null) {
          String currentUser;
          if (r.getUserLowerCase()) {
            LOG.debug("userLowerCase true");
            currentUser = ((String) attrs.get(userAttribute).get()).toLowerCase();
          } else {
            LOG.debug("userLowerCase false");
            currentUser = (String) attrs.get(userAttribute).get();            
          }
          if (LOG.isDebugEnabled()) {
            LOG.debug("CurrentUser: " + currentUser);
          }
          userList.add(currentUser.trim());
        }
      }
    } catch (Exception e) {
      LOG.error("Error retrieving User list from Ldap Realm", e);
    }
    return userList;
  }
  
  /***
   * Get user roles from shiro.ini for Zeppelin LdapRealm
   * @param r
   * @return
   */
  public List<String> getRolesList(LdapRealm r) {
    List<String> roleList = new ArrayList<>();
    Map<String, String> roles = r.getListRoles();
    if (roles != null) {
      Iterator it = roles.entrySet().iterator();
      while (it.hasNext()) {
        Map.Entry pair = (Map.Entry) it.next();
        if (LOG.isDebugEnabled()) {
          LOG.debug("RoleKeyValue: " + pair.getKey() + 
                " = " + pair.getValue());
        }
        roleList.add((String) pair.getKey());
      }
    }
    return roleList;
  }
  

  public List<String> getUserList(ActiveDirectoryGroupRealm r, String searchText) {
    List<String> userList = new ArrayList<>();
    try {
      LdapContext ctx = r.getLdapContextFactory().getSystemLdapContext();
      userList = r.searchForUserName(searchText, ctx);
    } catch (Exception e) {
      LOG.error("Error retrieving User list from ActiveDirectory Realm", e);
    }
    return userList;
  }

  /**
   * 从JDBCs获取用户列表
   */
  public List<String> getUserList(JdbcRealm obj) {
    List<String> userlist = new ArrayList<>();
    Connection con = null;
    PreparedStatement ps = null;
    ResultSet rs = null;
    DataSource dataSource = null;
    String authQuery = "";
    String retval[];
    String tablename = "";
    String username = "";
    String userquery = "";
    try {
      dataSource = (DataSource) FieldUtils.readField(obj, "dataSource", true);
      authQuery = (String) FieldUtils.readField(obj, "authenticationQuery", true);
      LOG.info(authQuery);
      String authQueryLowerCase = authQuery.toLowerCase();
      retval = authQueryLowerCase.split("from", 2);
      if (retval.length >= 2) {
        retval = retval[1].split("with|where", 2);
        tablename = retval[0];
        retval = retval[1].split("where", 2);
        if (retval.length >= 2)
          retval = retval[1].split("=", 2);
        else
          retval = retval[0].split("=", 2);
        username = retval[0];
      }

      if (StringUtils.isBlank(username) || StringUtils.isBlank(tablename)) {
        return userlist;
      }

      userquery = String.format("SELECT %s FROM %s", username, tablename);

    } catch (IllegalAccessException e) {
      LOG.error("Error while accessing dataSource for JDBC Realm", e);
      return null;
    }

    try {
      con = dataSource.getConnection();
      ps = con.prepareStatement(userquery);
      rs = ps.executeQuery();
      while (rs.next()) {
        userlist.add(rs.getString(1).trim());
      }
    } catch (Exception e) {
      LOG.error("Error retrieving User list from JDBC Realm", e);
    } finally {
      JdbcUtils.closeResultSet(rs);
      JdbcUtils.closeStatement(ps);
      JdbcUtils.closeConnection(con);
    }
    return userlist;
  }

}
