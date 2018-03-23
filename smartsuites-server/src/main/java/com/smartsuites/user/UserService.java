/*
 * Copyright (c) 2018. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.user;

import com.smartsuites.conf.SmartsuitesConfiguration;
import com.smartsuites.realm.SmartRealm;
import com.smartsuites.utils.EmbedDataBaseUtils;
import org.apache.hadoop.hdfs.protocol.DirectoryListing;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.taskdefs.SQLExec;
import org.apache.tools.ant.types.EnumeratedAttribute;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.URL;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserService {
    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);
    public static final String TABLE_ROLES = "roles";
    public static final String TABLE_USER_ROLES = "user_roles";
    public static final String TABLE_USERS = "users";
    public static final String TABLE_ROLES_PERMISSIONS = "roles_permissions";
    public static final String TABLE_DEPARTMENT = "department";
    public static final String TABLE_USER_DIRS = "user_dirs";
    public static final String TABLE_DIRECTORY = "directory";
    public static final String TABLE_DIR_NOTES = "dir_notes";

    public static final String INIT_SQL = "smart.sql";

    private static SmartsuitesConfiguration conf = SmartsuitesConfiguration.create();

    private static Connection conn = null;

    private static final String DRIVER_DB = "org.h2.Driver";
    private static String URL_DB = "jdbc:h2:"+ conf.getDataBasePath() + conf.getDataBaseName();

    private static Connection getConnection(){
        if(null == conn){
            synchronized (UserService.class){
                if(null == conn){
                    try {
                        Class.forName("org.h2.Driver");
                        conn = DriverManager.getConnection(URL_DB, "sa", "");
                    } catch (Exception e) {
                        LOG.error("Creating Connect to H2 Error {}", e.toString());
                    }
                }
            }
        }
        return conn;
    }

    public static void closeConnection() {
        try {
            getConnection().close();
        } catch (SQLException e) {
            LOG.error("Stop Connect to H2 Error {}", e.toString());
        }
    }

    /*****************************************************
     *                                                   *
     *             User RelativeAction                   *
     *                                                   *
     *****************************************************/

    // Get All Roles
    public static List<Role> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_ROLES);) {
            while (result.next()) {
                Role role = new Role();
                role.setRole_name(result.getString("role_name"));
                role.setCreate_time(result.getString("create_time"));
                role.setDescription(result.getString("description"));
                roles.add(role);
            }
        } catch (SQLException e) {
            LOG.error("Get All Roles Error {}", e.toString());
            return null;
        }
        return roles;
    }

    // Get All Roles
    public static List<String> getRolesByUser(String username) {
        List<String> roles = new ArrayList<>();
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_USER_ROLES + " where username='" + username + "'");) {
            while (result.next()) {
                roles.add(result.getString("role_name"));
            }
        } catch (SQLException e) {
            LOG.error("Get User Roles Error {}", e.toString());
            return null;
        }
        return roles;
    }

    // Get Dir Roles
    public static List<Directory> getDirsByUser(String username) {
        List<Directory> dirs = new ArrayList<>();

        String sql = "select * from "+ TABLE_DIRECTORY + " where id in (" +
                "select id from "+ TABLE_USER_DIRS + " where username='" + username + "')";

        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery(sql)) {
            while (result.next()) {
                Directory directory = new Directory();
                directory.setId(result.getString("id"));
                directory.setDirectory_name(result.getString("directory_name"));
                directory.setDirectory_path(result.getString("directory_path"));
                directory.setDescription(result.getString("description"));
                directory.setParent_directory(result.getString("parent_directory"));
                directory.setCreate_time(result.getString("create_time"));
                dirs.add(directory);
            }
        } catch (SQLException e) {
            LOG.error("Get User Roles Error {}", e.toString());
            return null;
        }
        return dirs;
    }

    public static List<Directory> getAllChildrenDirs(Directory dir) {
        List<Directory> dirs = new ArrayList<>();

        String sql = "select id from "+ TABLE_DIRECTORY + " where directory_path like '" + dir.getDirectory_path() + "%')";

        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery(sql)) {
            while (result.next()) {
                Directory directory = new Directory();
                directory.setId(result.getString("id"));
                directory.setDirectory_name(result.getString("directory_name"));
                directory.setDirectory_path(result.getString("directory_path"));
                directory.setDescription(result.getString("description"));
                directory.setParent_directory(result.getString("parent_directory"));
                directory.setCreate_time(result.getString("create_time"));
                dirs.add(directory);
            }
        } catch (SQLException e) {
            LOG.error("Get User Roles Error {}", e.toString());
            return null;
        }
        return dirs;
    }

    // Get All Users
    public static List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_USERS);) {
            while (result.next()) {
                User user = new User();
                user.setUsername(result.getString("username"));
                user.setUser_head(result.getString("user_head"));
                user.setUser_phone(result.getString("user_phone"));
                user.setUser_mail(result.getString("user_email"));
                user.setUser_sex(result.getInt("user_sex"));
                user.setRegister_time(result.getString("register_time"));
                user.setDepartment_key(result.getString("department_key"));
                users.add(user);
            }
        } catch (SQLException e) {
            LOG.error("Get All Users Error {}", e.toString());
            return null;
        }
        return users;
    }

    // Get User
    public static User getUserByUsername(String username){
        User user = null;
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_USERS + " where username='" + username + "'")) {
            if (result.next()) {
                user = new User();
                user.setUsername(result.getString("username"));
                user.setUser_head(result.getString("user_head"));
                user.setUser_phone(result.getString("user_phone"));
                user.setUser_mail(result.getString("user_email"));
                user.setUser_sex(result.getInt("user_sex"));
                user.setRegister_time(result.getString("register_time"));
                user.setDepartment_key(result.getString("department_key"));
            }
        } catch (SQLException e) {
            LOG.error("Check Username Exist Error {}", e.toString());
        }
        return user;
    }

    // Create New User
    public static boolean createNewUser(User user) {
        boolean success = false;
        String sql = "INSERT INTO " + TABLE_USERS + " (username, password,user_head,user_phone," +
                "user_email, user_sex, register_time, department_key) VALUES (?,?,?,?,?,?,?,?)";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,user.getUsername());
            statement.setString(2,user.getPassword());
            statement.setString(3,user.getUser_head());
            statement.setString(4,user.getUser_phone());
            statement.setString(5,user.getUser_mail());
            statement.setInt(6,user.getUser_sex());
            statement.setString(7,user.getRegister_time());
            statement.setString(8,user.getDepartment_key());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Create New User Error {}", e.toString());
        }
        return success;
    }

    // Add Role To User
    public static boolean setRoleToUser(User user, String roleName) {
        boolean success = false;
        String sql = "INSERT INTO " + TABLE_USER_ROLES + " (role_name, username) VALUES (?,?)";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,roleName);
            statement.setString(2,user.getUsername());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Set Role To User Error {}", e.toString());
        }
        return success;
    }

    // Check User Exist
    public static boolean isUsernameExist(String username) {
        boolean exist = false;
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_USERS + " where username='" + username + "'")) {
            if (result.next()) {
                exist = true;
            }
        } catch (SQLException e) {
            LOG.error("Check Username Exist Error {}", e.toString());
        }
        return exist;
    }

    // Delete User
    public static boolean deleteUser(String username) {
        boolean success = false;
        String roleSql = "delete from "+ TABLE_USER_ROLES + " where username='" + username + "'";
        String dirSql =  "delete from "+ TABLE_USER_DIRS + " where username='" + username + "'";
        String sql = "DELETE FROM " + TABLE_USERS + " WHERE username='" + username + "'";
        try (Statement statement = getConnection().createStatement()) {
            statement.executeUpdate(roleSql);
            statement.executeUpdate(dirSql);
            statement.executeUpdate(sql);
            success = true;
        } catch (SQLException e) {
            LOG.error("Delete User Error {}", e.toString());
        }
        return success;
    }

    // Update User
    public static boolean updateUser(User user){
        boolean success = false;
        String sql = "UPDATE " + TABLE_USERS + " SET user_head=?,user_phone=?," +
                "user_email=?, user_sex=?, department_key=? where username='" + user.getUsername() + "'";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,user.getUser_head());
            statement.setString(2,user.getUser_phone());
            statement.setString(3,user.getUser_mail());
            statement.setInt(4,user.getUser_sex());
            statement.setString(5,user.getDepartment_key());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Create New User Error {}", e.toString());
        }
        return success;
    }

    // Update Password
    public static boolean updateUserPassword(User user){
        String password = SmartRealm.getCryptoCredential(user.getPassword());
        boolean success = false;
        String sql = "UPDATE " + TABLE_USERS + " SET password=? where username='" + user.getUsername() + "'";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,user.getPassword());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("UPdate Password Error {}", e.toString());
        }
        return success;
    }

    /*****************************************************
     *                                                   *
     *             Dir Relative Action                   *
     *                                                   *
     *****************************************************/

    // Push Dir To User
    public static boolean addDirToUser(String directory, String username){
        boolean success = false;
        String sql = "INSERT INTO " + TABLE_USER_DIRS + " (dir_id, username) VALUES (?,?)";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,directory);
            statement.setString(2,username);
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Add Dir To User Error {}", e.toString());
        }
        return success;
    }

    // Get Dir By Id
    public static Directory getDirById(String dirid){
        Directory directory = null;
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_DIRECTORY + " where id='" + dirid+"'")) {
            if (result.next()) {
                directory = new Directory();
                directory.setId(result.getString("id"));
                directory.setDirectory_name(result.getString("directory_name"));
                directory.setDirectory_path(result.getString("directory_path"));
                directory.setDescription(result.getString("description"));
                directory.setParent_directory(result.getString("parent_directory"));
                directory.setCreate_time(result.getString("create_time"));
            }
        } catch (SQLException e) {
            LOG.error("Check Username Exist Error {}", e.toString());
        }
        return directory;
    }

    // Get All Dirs
    public static List<Directory> getAllDirs() {
        List<Directory> dirs = new ArrayList<>();
        try (Statement statement = getConnection().createStatement();
             ResultSet result = statement.executeQuery("select * from " + TABLE_DIRECTORY);) {
            while (result.next()) {
                Directory directory = new Directory();
                directory.setId(result.getString("id"));
                directory.setDirectory_name(result.getString("directory_name"));
                directory.setDirectory_path(result.getString("directory_path"));
                directory.setDescription(result.getString("description"));
                directory.setParent_directory(result.getString("parent_directory"));
                directory.setCreate_time(result.getString("create_time"));
                dirs.add(directory);
            }
        } catch (SQLException e) {
            LOG.error("Get All Dirs Error {}", e.toString());
            return null;
        }
        return dirs;
    }

    // Create New Dir
    public static boolean createNewDir(Directory parent, Directory child){
        child.setParent_directory(parent.getId());
        child.setDirectory_path(parent.getDirectory_path() + File.separator + child.getDirectory_name());
        boolean success = false;
        String sql = "INSERT INTO " + TABLE_DIRECTORY + " (id,directory_name, directory_path," +
                "description,parent_directory,create_time) VALUES (?,?,?,?,?,?)";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,child.getId());
            statement.setString(2,child.getDirectory_name());
            statement.setString(3,child.getDirectory_path());
            statement.setString(4,child.getDescription());
            statement.setString(5,child.getParent_directory());
            statement.setString(6,child.getCreate_time());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Create Dir Error {}", e.toString());
        }
        return success;
    }

    // Delete Dir
    public static boolean deleteDir(Directory directory) {
        boolean success = false;

        //Remove Dir Pushed To User
        String userSql = "delete from "+ TABLE_USER_DIRS + " where dir_id in (" +
                "select id from "+ TABLE_DIRECTORY + " where directory_path like '" + directory.getDirectory_path() + "%')";

        String noteSql = "delete from "+ TABLE_DIR_NOTES + " where dir_id in (" +
                "select id from "+ TABLE_DIRECTORY + " where directory_path like '" + directory.getDirectory_path() + "%')";

        String dirSql = "delete from "+ TABLE_DIRECTORY + " where id in (" +
                "select id from "+ TABLE_DIRECTORY + " where directory_path like '" + directory.getDirectory_path() + "%')";

        try (Statement statement = getConnection().createStatement()) {
            statement.executeUpdate(userSql);
            statement.executeUpdate(noteSql);
            statement.executeUpdate(dirSql);
            success = true;
        } catch (SQLException e) {
            LOG.error("Delete Dir Error {}", e.toString());
        }

        return success;
    }

    // Update Dir
    public static boolean updateDir(Directory directory){
        boolean success = false;
        String sql = "UPDATE " + TABLE_DIRECTORY + " SET directory_name=?,directory_path=?," +
                "description=?, parent_directory=?, create_time=? where id='" + directory.getId()+"'";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,directory.getDirectory_name());
            statement.setString(2,directory.getDirectory_path());
            statement.setString(3,directory.getDescription());
            statement.setString(4,directory.getParent_directory());
            statement.setString(5,directory.getCreate_time());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Update Dir Error {}", e.toString());
        }
        return success;
    }

    // Push Note To Dir
    public static boolean addNoteToDir(Directory directory, User user, String noteid){
        boolean success = false;
        String sql = "INSERT INTO " + TABLE_DIR_NOTES + " (dir_id, note, username) VALUES (?,?,?)";
        try (PreparedStatement statement = getConnection().prepareStatement(sql)) {
            statement.setString(1,directory.getId());
            statement.setString(2,noteid);
            statement.setString(3,user.getUsername());
            statement.executeUpdate();
            success = true;
        } catch (SQLException e) {
            LOG.error("Add Note To Dir Error {}", e.toString());
        }
        return success;
    }

    // Init Tables
    public static void initDatabase(){
        SQLExec sqlExec = new SQLExec();
        sqlExec.setDriver(DRIVER_DB);
        sqlExec.setUrl(URL_DB);
        sqlExec.setUserid("sa");
        sqlExec.setPassword("");
        sqlExec.setSrc(new File(findSmartSql()));

        //有出错的语句该如何处理
        sqlExec.setOnerror((SQLExec.OnError)(EnumeratedAttribute.getInstance(
                SQLExec.OnError.class, "abort")));
        //sqlExec.setPrint(true); //设置是否输出
        sqlExec.setProject(new Project());
        sqlExec.execute();
        LOG.info("Init the database");
    }

    private static String findSmartSql() {
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        URL url;

        url = SmartsuitesConfiguration.class.getResource(INIT_SQL);
        if (url == null) {
            ClassLoader cl = SmartsuitesConfiguration.class.getClassLoader();
            if (cl != null) {
                url = cl.getResource(INIT_SQL);
            }
        }
        if (url == null) {
            url = classLoader.getResource(INIT_SQL);
        }

        return url.getPath();
    }

    public static boolean isDatabaseExist(){
        for (File file: new File(conf.getDataBasePath()).listFiles()){
            if(file.getName().contains(conf.getDataBaseName()+".mv.db"))
                return true;
        }
        return false;
    }

}
