/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.interpreter.launcher;

import com.smartsuites.interpreter.launcher.SparkInterpreterLauncher;
import com.smartsuites.conf.ZeppelinConfiguration;
import com.smartsuites.interpreter.InterpreterOption;
import com.smartsuites.interpreter.remote.RemoteInterpreterManagedProcess;
import org.junit.Test;

import java.util.Properties;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class SparkInterpreterLauncherTest {

  @Test
  public void testLocalMode() {
    ZeppelinConfiguration zConf = new ZeppelinConfiguration();
    SparkInterpreterLauncher launcher = new SparkInterpreterLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("SPARK_HOME", "/user/spark");
    properties.setProperty("property_1", "value_1");
    properties.setProperty("master", "local[*]");
    properties.setProperty("spark.files", "file_1");
    properties.setProperty("spark.jars", "jar_1");

    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "spark");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("spark", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/spark", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(2, interpreterProcess.getEnv().size());
    assertEquals("/user/spark", interpreterProcess.getEnv().get("SPARK_HOME"));
    assertEquals(" --master local[*] --conf spark.files='file_1' --conf spark.jars='jar_1'", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_CONF"));
  }

  @Test
  public void testYarnClientMode_1() {
    ZeppelinConfiguration zConf = new ZeppelinConfiguration();
    SparkInterpreterLauncher launcher = new SparkInterpreterLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("SPARK_HOME", "/user/spark");
    properties.setProperty("property_1", "value_1");
    properties.setProperty("master", "yarn-client");
    properties.setProperty("spark.files", "file_1");
    properties.setProperty("spark.jars", "jar_1");

    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "spark");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("spark", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/spark", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(2, interpreterProcess.getEnv().size());
    assertEquals("/user/spark", interpreterProcess.getEnv().get("SPARK_HOME"));
    assertEquals(" --master yarn-client --conf spark.files='file_1' --conf spark.jars='jar_1' --conf spark.yarn.isPython=true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_CONF"));
  }

  @Test
  public void testYarnClientMode_2() {
    ZeppelinConfiguration zConf = new ZeppelinConfiguration();
    SparkInterpreterLauncher launcher = new SparkInterpreterLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("SPARK_HOME", "/user/spark");
    properties.setProperty("property_1", "value_1");
    properties.setProperty("master", "yarn");
    properties.setProperty("spark.submit.deployMode", "client");
    properties.setProperty("spark.files", "file_1");
    properties.setProperty("spark.jars", "jar_1");

    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "spark");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("spark", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/spark", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(2, interpreterProcess.getEnv().size());
    assertEquals("/user/spark", interpreterProcess.getEnv().get("SPARK_HOME"));
    assertEquals(" --master yarn --conf spark.files='file_1' --conf spark.jars='jar_1' --conf spark.submit.deployMode='client' --conf spark.yarn.isPython=true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_CONF"));
  }

  @Test
  public void testYarnClusterMode_1() {
    ZeppelinConfiguration zConf = new ZeppelinConfiguration();
    SparkInterpreterLauncher launcher = new SparkInterpreterLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("SPARK_HOME", "/user/spark");
    properties.setProperty("property_1", "value_1");
    properties.setProperty("master", "yarn-cluster");
    properties.setProperty("spark.files", "file_1");
    properties.setProperty("spark.jars", "jar_1");

    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "spark");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("spark", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/spark", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(3, interpreterProcess.getEnv().size());
    assertEquals("/user/spark", interpreterProcess.getEnv().get("SPARK_HOME"));
    assertEquals("true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_YARN_CLUSTER"));
    assertEquals(" --master yarn-cluster --files .//conf/log4j_yarn_cluster.properties --conf spark.files='file_1' --conf spark.jars='jar_1' --conf spark.yarn.isPython=true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_CONF"));
  }

  @Test
  public void testYarnClusterMode_2() {
    ZeppelinConfiguration zConf = new ZeppelinConfiguration();
    SparkInterpreterLauncher launcher = new SparkInterpreterLauncher(zConf);
    Properties properties = new Properties();
    properties.setProperty("SPARK_HOME", "/user/spark");
    properties.setProperty("property_1", "value_1");
    properties.setProperty("master", "yarn");
    properties.setProperty("spark.submit.deployMode", "cluster");
    properties.setProperty("spark.files", "file_1");
    properties.setProperty("spark.jars", "jar_1");

    InterpreterOption option = new InterpreterOption();
    InterpreterLaunchContext context = new InterpreterLaunchContext(properties, option, null, "groupId", "spark");
    InterpreterClient client = launcher.launch(context);
    assertTrue( client instanceof RemoteInterpreterManagedProcess);
    RemoteInterpreterManagedProcess interpreterProcess = (RemoteInterpreterManagedProcess) client;
    assertEquals("spark", interpreterProcess.getInterpreterGroupName());
    assertEquals(".//interpreter/spark", interpreterProcess.getInterpreterDir());
    assertEquals(".//local-repo/groupId", interpreterProcess.getLocalRepoDir());
    assertEquals(zConf.getInterpreterRemoteRunnerPath(), interpreterProcess.getInterpreterRunner());
    assertEquals(3, interpreterProcess.getEnv().size());
    assertEquals("/user/spark", interpreterProcess.getEnv().get("SPARK_HOME"));
    assertEquals("true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_YARN_CLUSTER"));
    assertEquals(" --master yarn --files .//conf/log4j_yarn_cluster.properties --conf spark.files='file_1' --conf spark.jars='jar_1' --conf spark.submit.deployMode='cluster' --conf spark.yarn.isPython=true", interpreterProcess.getEnv().get("ZEPPELIN_SPARK_CONF"));
  }
}
