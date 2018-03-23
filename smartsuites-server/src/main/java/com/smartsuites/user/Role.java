/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import org.apache.commons.lang3.time.DateFormatUtils;

import java.util.Date;

public class Role {

    private String role_name;
    private String create_time;
    private String description;

    public Role() {
        this.create_time = DateFormatUtils.format(new Date(),"yyyy-MM-dd hh:mm:ss");
    }

    public String getRole_name() {
        return role_name;
    }

    public void setRole_name(String role_name) {
        this.role_name = role_name;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
