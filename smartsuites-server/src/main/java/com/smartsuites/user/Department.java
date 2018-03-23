/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import org.apache.commons.lang3.time.DateFormatUtils;
import org.h2.mvstore.DataUtils;

import java.util.Date;
import java.util.UUID;

public class Department {

    private String department_key;
    private String department_value;
    private String description;
    private String parent_departmentkey;
    private String create_time;

    public Department() {
        this.department_key = UUID.randomUUID().toString();
        this.create_time = DateFormatUtils.format(new Date(),"yyyy-MM-dd hh:mm:ss");
    }

    public String getDepartment_key() {
        return department_key;
    }

    public void setDepartment_key(String department_key) {
        this.department_key = department_key;
    }

    public String getDepartment_value() {
        return department_value;
    }

    public void setDepartment_value(String department_value) {
        this.department_value = department_value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParent_departmentkey() {
        return parent_departmentkey;
    }

    public void setParent_departmentkey(String parent_departmentkey) {
        this.parent_departmentkey = parent_departmentkey;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }
}
