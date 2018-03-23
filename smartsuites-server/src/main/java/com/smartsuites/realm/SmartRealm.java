/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.realm;

import com.smartsuites.conf.SmartsuitesConfiguration;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.realm.jdbc.JdbcRealm;
import org.h2.jdbcx.JdbcDataSource;

public class SmartRealm extends JdbcRealm {

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

    @Override
    protected String getSaltForUser(String username) {
        return SALT_MD5;
    }
}
