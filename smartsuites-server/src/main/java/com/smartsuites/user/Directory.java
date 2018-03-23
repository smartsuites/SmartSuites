/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import org.apache.commons.lang3.time.DateFormatUtils;

import java.util.Date;
import java.util.UUID;

public class Directory {

    private String id;
    private String directory_name;
    private String directory_path;
    private String description;
    private String parent_directory;
    private String create_time;

    public Directory() {
        this.id = UUID.randomUUID().toString();
        this.create_time = DateFormatUtils.format(new Date(),"yyyy-MM-dd hh:mm:ss");
    }


    public String getDirectory_name() {
        return directory_name;
    }

    public void setDirectory_name(String directory_name) {
        this.directory_name = directory_name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParent_directory() {
        return parent_directory;
    }

    public void setParent_directory(String parent_directory) {
        this.parent_directory = parent_directory;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCreate_time() {
        return create_time;
    }

    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String getDirectory_path() {
        return directory_path;
    }

    public void setDirectory_path(String directory_path) {
        this.directory_path = directory_path;
    }
}
