/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.utils;

import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.realm.SmartRealm;
import com.smartsuites.user.User;
import com.smartsuites.user.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.config.IniSecurityManagerFactory;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.Factory;
import org.h2.tools.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.sql.*;
import java.util.UUID;

/**
 * Start Embed H2 DataBase For Default
 */
@Deprecated
public class EmbedDataBaseUtils {
    private static final Logger LOG = LoggerFactory.getLogger(EmbedDataBaseUtils.class);
    private Server server = null;
    private SmartsuitesConfiguration conf = null;

    private static EmbedDataBaseUtils embedDataBaseUtils = null;
    public static EmbedDataBaseUtils getInstance(SmartsuitesConfiguration configuration){
        if(null == embedDataBaseUtils){
            synchronized (EmbedDataBaseUtils.class){
                if(null == embedDataBaseUtils){
                    embedDataBaseUtils = new EmbedDataBaseUtils(configuration);
                }
            }
        }
        return embedDataBaseUtils;
    }

    private EmbedDataBaseUtils(SmartsuitesConfiguration configuration){
        try {
            this.conf = configuration;
            this.server = Server.createTcpServer("-baseDir", configuration.getDataBasePath());
            this.initTables();
            LOG.info("Create H2 EmbedDataBase Successfully");
        } catch (SQLException e) {
            LOG.error("Create H2 EmbedDataBase Error {}",e.toString());
        }
    }



    public boolean startEmbedDataBaseService(){
        try {
            server.start();
            LOG.info("Staring H2 EmbedDataBase Successfully");
            return true;
        } catch (SQLException e) {
            LOG.error("Starting H2 EmbedDataBase Error {}",e.toString());
            System.exit(1);
            return false;
        }
    }

    public boolean stopEmbedDataBaseService(){
        UserService.closeConnection();
        server.stop();
        LOG.info("Stop H2 EmbedDataBase Successfully");
        return true;
    }

    public void initTables(){
        /*if(!this.isDatabaseExist())
            UserService.initDatabase();*/
    }

    public static void main(String[] args) throws ClassNotFoundException, SQLException {
        /*SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
        EmbedDataBaseUtils.getInstance(conf).startEmbedDataBaseService();

        EmbedDataBaseUtils.getInstance(conf).stopEmbedDataBaseService();*/


        SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
        StringBuilder url = new StringBuilder("jdbc:h2:");
        url.append(conf.getDataBasePath() + conf.getDataBaseName());
        Class.forName("org.h2.Driver");
        Connection conn = DriverManager.getConnection(url.toString(), "sa", "");

        try (Statement statement = conn.createStatement();
             ResultSet result = statement.executeQuery("select * from users")) {
            while (result.next()) {
                User user = new User();
                user.setUsername(result.getString("username"));
                user.setUser_head(result.getString("user_head"));
                user.setUser_phone(result.getString("user_phone"));
                user.setUser_sex(result.getInt("user_sex"));
                user.setRegister_time(result.getString("register_time"));
                user.setDepartment_key(result.getString("department_key"));
                System.out.printf(user.toString());
            }
        } catch (SQLException e) {
            LOG.error("Get All Users Error {}", e.toString());
        }

        conn.close();
        /*System.out.printf(UUID.randomUUID().toString());


        //1、获取SecurityManager工厂，此处使用Ini配置文件初始化SecurityManager
        Factory<SecurityManager> factory =
                new IniSecurityManagerFactory("/Users/wuyufei/GitHub/SmartSuites/smartsuites-distribution/develop/conf/shiro.ini");

        //2、得到SecurityManager实例 并绑定给SecurityUtils
        org.apache.shiro.mgt.SecurityManager securityManager = factory.getInstance();
        org.apache.shiro.SecurityUtils.setSecurityManager(securityManager);

        //3、得到Subject及创建用户名/密码身份验证Token（即用户身份/凭证）
        Subject subject = org.apache.shiro.SecurityUtils.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken("admin", "admin");

        try {
            //4、登录，即身份验证
            subject.login(token);
            //判断是否有角色,没有则会抛出异常
            subject.checkRole("MANAGER");

            //判断是否有权限,没有则会抛出异常
            *//*subject.checkPermission("user:update:1");
            //判断是否有角色
            System.out.println(subject.hasRole("role1"));
            System.out.println(subject.hasRole("role2"));
            System.out.println(subject.hasRole("role3"));
            //判断有权限
            System.out.println(subject.isPermitted("user:update:1"));
            System.out.println(subject.isPermitted("user:delete:2"));*//*
        } catch (AuthenticationException e) {
            //5、身份验证失败
            e.printStackTrace();
        }
        System.out.println(subject.isAuthenticated());
        System.out.println(subject.hasRole("MANAGER"));
        //6、退出
        subject.logout();*/
    }

}
