/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import org.apache.commons.lang3.time.DateFormatUtils;

import java.util.Date;

public class User {

    private String username;
    private String password;
    private String user_head;
    private String user_phone;
    private String user_mail;
    private int user_sex;
    private String register_time;
    private String department_key;

    public User() {
        this.register_time = DateFormatUtils.format(new Date(),"yyyy-MM-dd hh:mm:ss");
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUser_head() {
        return user_head;
    }

    public void setUser_head(String user_head) {
        this.user_head = user_head;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }

    public String getUser_mail() {
        return user_mail;
    }

    public int getUser_sex() {
        return user_sex;
    }

    public void setUser_sex(int user_sex) {
        this.user_sex = user_sex;
    }

    public void setUser_mail(String user_mail) {
        this.user_mail = user_mail;
    }


    public String getRegister_time() {
        return register_time;
    }

    public void setRegister_time(String register_time) {
        this.register_time = register_time;
    }

    public String getDepartment_key() {
        return department_key;
    }

    public void setDepartment_key(String department_key) {
        this.department_key = department_key;
    }
}
