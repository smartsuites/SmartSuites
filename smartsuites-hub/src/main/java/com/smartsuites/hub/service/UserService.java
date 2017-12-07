/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.hub.service;

import com.smartsuites.hub.model.domain.User;
import com.smartsuites.hub.model.request.LoginUserRequest;
import com.smartsuites.hub.model.request.RegisterUserRequest;
import com.atguigu.commons.constant.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;

@Service
public class UserService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean registerUser(RegisterUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setFirst(true);
        user.setTimestamp(System.currentTimeMillis());

        jdbcTemplate.update("insert into " + Constants.DB_USER() + "(uid,username,password,first,timestamp,prefgenres) values(?,?,?,?,?,?)",
                new Object[]{user.getUid(), user.getUsername(), user.getPassword(), true, user.getTimestamp(), user.getPrefgenres()});

        return true;
    }

    public User loginUser(LoginUserRequest request) {
        User user = findByUsername(request.getUsername());
        if (null == user) {
            return null;
        } else if (!user.passwordMatch(request.getPassword())) {
            return null;
        }
        return user;
    }

    public boolean checkUserExist(String username) {
        return null != findByUsername(username);
    }

    public User findByUsername(String username) {
        User user = null;
        user = jdbcTemplate.query("select * from " + Constants.DB_USER() + " where username=" + username, new ResultSetExtractor<User>() {
            @Override
            public User extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                User user = null;
                if (resultSet.next()) {
                    user = new User();
                    user.setUid(resultSet.getInt("uid"));
                    user.setUsername(resultSet.getString("username"));
                    user.setPassword(resultSet.getString("password"));
                    user.setFirst(resultSet.getBoolean("first"));
                    user.setTimestamp(resultSet.getInt("timestamp"));
                    user.setPrefgenres(resultSet.getString("prefgenres"));
                }
                return user;
            }
        });
        return user;
    }

    public boolean updateUser(User user) {
        jdbcTemplate.update("update " + Constants.DB_USER() + " set first=false,prefgenres=" + user.getPrefgenres() + " where uid =" + user.getUid());
        return true;
    }

    public User findByUID(int uid) {
        User user = null;
        user = jdbcTemplate.query("select *from " + Constants.DB_USER() + " where uid=" + uid, new ResultSetExtractor<User>() {
            @Override
            public User extractData(ResultSet resultSet) throws SQLException, DataAccessException {
                User user = null;
                if (resultSet.next()) {
                    user = new User();
                    user.setUid(resultSet.getInt("uid"));
                    user.setUsername(resultSet.getString("username"));
                    user.setPassword(resultSet.getString("password"));
                    user.setFirst(resultSet.getBoolean("first"));
                    user.setTimestamp(resultSet.getInt("timestamp"));
                    user.setPrefgenres(resultSet.getString("prefgenres"));
                }
                return user;
            }
        });
        return user;
    }

    public void removeUser(String username) {
        jdbcTemplate.execute("delete from " + Constants.DB_USER() + " where username=" + username);
    }

}
