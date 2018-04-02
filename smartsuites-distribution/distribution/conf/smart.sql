DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_name` varchar(30) NOT NULL NULL COMMENT '角色名称',
  `create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  PRIMARY KEY (`role_name`)
);

INSERT INTO `roles` VALUES ('ANALYST', null, '分析角色');
INSERT INTO `roles` VALUES ('BUSINESS', null, '业务角色');
INSERT INTO `roles` VALUES ('MANAGER', null, '管理角色');


DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `role_name` varchar(30) NOT NULL COMMENT '角色名称',
  `username` varchar(30) NOT NULL COMMENT '用户名称'
);

INSERT INTO `user_roles` VALUES ('MANAGER', 'admin');



DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(30) NOT NULL COMMENT '用户名称',
  `password` varchar(65) NOT NULL COMMENT '登录密码',
  `user_head` varchar(30) DEFAULT NULL COMMENT '头像',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '手机',
  `user_email` varchar(30) DEFAULT NULL COMMENT '邮箱',
  `user_sex` int(11) DEFAULT NULL COMMENT '性别',
  `register_time` varchar(30) DEFAULT NULL COMMENT '注册时间',
  `department_key` varchar(20) DEFAULT NULL COMMENT '部门编码',
  PRIMARY KEY (`username`)
);

INSERT INTO `users` VALUES ('admin', '522e502efd29549eb33bc598c277a8bf', null, null, null,null,null,null);


DROP TABLE IF EXISTS `roles_permissions`;
CREATE TABLE `roles_permissions` (
  `role_name` varchar(30) NOT NULL COMMENT '角色名称',
  `permission` varchar(30) NOT NULL COMMENT '权限名称'
);




DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `department_key` varchar(20) NOT NULL COMMENT '部门编码',
  `department_name` varchar(40) NOT NULL COMMENT '部门名称',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `parent_departmentkey` varchar(20) DEFAULT NULL COMMENT '上级部门编码',
  `create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`department_key`)
);




DROP TABLE IF EXISTS `user_dirs`;
CREATE TABLE `user_dirs` (
  `dir_id` varchar(50) NOT NULL COMMENT '目录主键',
  `username` varchar(30) NOT NULL COMMENT '用户名称'
);




DROP TABLE IF EXISTS `directory`;
CREATE TABLE `directory` (
  `id` varchar(50) NOT NULL COMMENT '主键',
  `directory_name` varchar(40) NOT NULL COMMENT '目录名称',
  `directory_path` varchar(500) NOT NULL COMMENT '目录',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `parent_directory` varchar(50) NOT NULL COMMENT '上级部门编码',
  `create_time` varchar(30) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
);

INSERT INTO `directory` VALUES ('c4fd34c3-bd7e-41c9-bbb7-b1727141fd99', 'Root', '', 'Root', '-1', null);


DROP TABLE IF EXISTS `dir_notes`;
CREATE TABLE `dir_notes` (
  `dir_id` varchar(50) NOT NULL COMMENT '主键',
  `note` varchar(30) NOT NULL COMMENT 'noteID',
  `username` varchar(30) NOT NULL COMMENT '用户名称'
);

