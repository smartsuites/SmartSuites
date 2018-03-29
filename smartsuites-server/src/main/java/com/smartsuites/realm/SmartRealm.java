/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.realm;

import com.smartsuites.conf.SmartsuitesConfiguration;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.apache.shiro.util.JdbcUtils;
import org.h2.jdbcx.JdbcDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.LinkedHashSet;
import java.util.Set;

public class SmartRealm extends JdbcRealm {
    private static final Logger log = LoggerFactory.getLogger(SmartRealm.class);
    public static final String SALT_MD5 = "c4fd34c3-bd7e-41c9-bbb7-b1727141fd99";
    public static final String CRYPTO_NAME = "MD5";
    public static final int CRYPTO_ITER = 1024;

    // Use Salt to crypto password through md5
    public static String getCryptoCredential(String credential){
        Object obj = new SimpleHash(CRYPTO_NAME, credential, SALT_MD5, CRYPTO_ITER);
        return obj.toString();
    }

    public SmartRealm() {
        this.setSaltStyle(SaltStyle.EXTERNAL);

        //Create DataSource
        JdbcDataSource dataSource = new JdbcDataSource();
        dataSource.setUser("sa");
        dataSource.setPassword("");
        dataSource.setURL(this.getDataBaseUrl());
        this.setDataSource(dataSource);

        // Create Password Matcher
        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
        matcher.setHashAlgorithmName(CRYPTO_NAME);
        matcher.setHashIterations(CRYPTO_ITER);
        this.setCredentialsMatcher(matcher);
    }

    private String getDataBaseUrl(){
        SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();
        StringBuilder url = new StringBuilder("jdbc:h2:");
        url.append(conf.getDataBasePath() + conf.getDataBaseName());
        return url.toString();
    }

    public Set<String> getRoleNamesForUser(String username){
        PreparedStatement ps = null;
        ResultSet rs = null;
        Set<String> roleNames = new LinkedHashSet<String>();
        try {
            ps = this.dataSource.getConnection().prepareStatement(userRolesQuery);
            ps.setString(1, username);

            // Execute query
            rs = ps.executeQuery();

            // Loop over results and add each returned role to a set
            while (rs.next()) {

                String roleName = rs.getString(1);

                // Add the role to the list of names if it isn't null
                if (roleName != null) {
                    roleNames.add(roleName);
                } else {
                    if (log.isWarnEnabled()) {
                        log.warn("Null role name found while retrieving role names for user [" + username + "]");
                    }
                }
            }
        } catch (SQLException e) {
            log.error("Error while retrieving role names for user [" + username + "] {}", e.toString());
            return roleNames;
        } finally {
            JdbcUtils.closeResultSet(rs);
            JdbcUtils.closeStatement(ps);
        }
        return roleNames;
    }

    @Override
    protected String getSaltForUser(String username) {
        return SALT_MD5;
    }
}
