/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.conf;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.configuration.XMLConfiguration;
import org.apache.commons.configuration.tree.ConfigurationNode;
import org.apache.commons.lang.StringUtils;
import com.smartsuites.util.Util;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.net.URL;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class SmartsuitesConfiguration extends XMLConfiguration {
  private static final String SMARTSUITES_SITE_XML = "smartsuites-site.xml";
  private static final String SMARTSUITES_SITE_XML_DEV = "smartsuites-site-dev.xml";
  private static final long serialVersionUID = 4749305895693848035L;
  private static final Logger LOG = LoggerFactory.getLogger(SmartsuitesConfiguration.class);

  private static final String HELIUM_PACKAGE_DEFAULT_URL = "https://s3.amazonaws.com/helium-package/helium.json";
  //private static final String HELIUM_PACKAGE_DEFAULT_URL = "file:///Users/wuyufei/GitHub/zeppelin/conf/helium.json";
  private static SmartsuitesConfiguration conf;

  public SmartsuitesConfiguration(URL url) throws ConfigurationException {
    setDelimiterParsingDisabled(true);
    load(url);
  }

  public SmartsuitesConfiguration() {
    ConfVars[] vars = ConfVars.values();
    for (ConfVars v : vars) {
      if (v.getType() == ConfVars.VarType.BOOLEAN) {
        this.setProperty(v.getVarName(), v.getBooleanValue());
      } else if (v.getType() == ConfVars.VarType.LONG) {
        this.setProperty(v.getVarName(), v.getLongValue());
      } else if (v.getType() == ConfVars.VarType.INT) {
        this.setProperty(v.getVarName(), v.getIntValue());
      } else if (v.getType() == ConfVars.VarType.FLOAT) {
        this.setProperty(v.getVarName(), v.getFloatValue());
      } else if (v.getType() == ConfVars.VarType.STRING) {
        this.setProperty(v.getVarName(), v.getStringValue());
      } else {
        throw new RuntimeException("Unsupported VarType");
      }
    }

  }


  /**
   * Load from resource.
   * url = SmartsuitesConfiguration.class.getResource(SMARTSUITES_SITE_XML);
   * @throws ConfigurationException
   */
  public static synchronized SmartsuitesConfiguration create() {
    if (conf != null) {
      return conf;
    }

    ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
    URL url;

    url = SmartsuitesConfiguration.class.getResource(SMARTSUITES_SITE_XML);
    if (url == null) {
      ClassLoader cl = SmartsuitesConfiguration.class.getClassLoader();
      if (cl != null) {
        url = cl.getResource(SMARTSUITES_SITE_XML);
      }
    }
    if (url == null) {
      url = classLoader.getResource(SMARTSUITES_SITE_XML);
    }

    // Search For SMARTSUITES_SITE_XML_DEV For Develop
    if(url ==null){
      url = SmartsuitesConfiguration.class.getResource(SMARTSUITES_SITE_XML_DEV);
      if (url == null) {
        ClassLoader cl = SmartsuitesConfiguration.class.getClassLoader();
        if (cl != null) {
          url = cl.getResource(SMARTSUITES_SITE_XML_DEV);
        }
      }
      if (url == null) {
        url = classLoader.getResource(SMARTSUITES_SITE_XML_DEV);
      }
    }

    if (url == null) {
      LOG.warn("Failed to load configuration, proceeding with a default");
      conf = new SmartsuitesConfiguration();
    } else {
      try {
        LOG.info("Load configuration from " + url);
        conf = new SmartsuitesConfiguration(url);
      } catch (ConfigurationException e) {
        LOG.warn("Failed to load configuration from " + url + " proceeding with a default", e);
        conf = new SmartsuitesConfiguration();
      }
    }

    LOG.info("Server Host: " + conf.getServerAddress());
    if (conf.useSsl() == false) {
      LOG.info("Server Port: " + conf.getServerPort());
    } else {
      LOG.info("Server SSL Port: " + conf.getServerSslPort());
    }
    LOG.info("Context Path: " + conf.getServerContextPath());
    LOG.info("SmartSuites Version: " + Util.getVersion());

    return conf;
  }


  private String getStringValue(String name, String d) {
    List<ConfigurationNode> properties = getRootNode().getChildren();
    if (properties == null || properties.isEmpty()) {
      return d;
    }
    for (ConfigurationNode p : properties) {
      if (p.getChildren("name") != null && !p.getChildren("name").isEmpty()
          && name.equals(p.getChildren("name").get(0).getValue())) {
        return (String) p.getChildren("value").get(0).getValue();
      }
    }
    return d;
  }

  private int getIntValue(String name, int d) {
    List<ConfigurationNode> properties = getRootNode().getChildren();
    if (properties == null || properties.isEmpty()) {
      return d;
    }
    for (ConfigurationNode p : properties) {
      if (p.getChildren("name") != null && !p.getChildren("name").isEmpty()
          && name.equals(p.getChildren("name").get(0).getValue())) {
        return Integer.parseInt((String) p.getChildren("value").get(0).getValue());
      }
    }
    return d;
  }

  private long getLongValue(String name, long d) {
    List<ConfigurationNode> properties = getRootNode().getChildren();
    if (properties == null || properties.isEmpty()) {
      return d;
    }
    for (ConfigurationNode p : properties) {
      if (p.getChildren("name") != null && !p.getChildren("name").isEmpty()
          && name.equals(p.getChildren("name").get(0).getValue())) {
        return Long.parseLong((String) p.getChildren("value").get(0).getValue());
      }
    }
    return d;
  }

  private float getFloatValue(String name, float d) {
    List<ConfigurationNode> properties = getRootNode().getChildren();
    if (properties == null || properties.isEmpty()) {
      return d;
    }
    for (ConfigurationNode p : properties) {
      if (p.getChildren("name") != null && !p.getChildren("name").isEmpty()
          && name.equals(p.getChildren("name").get(0).getValue())) {
        return Float.parseFloat((String) p.getChildren("value").get(0).getValue());
      }
    }
    return d;
  }

  private boolean getBooleanValue(String name, boolean d) {
    List<ConfigurationNode> properties = getRootNode().getChildren();
    if (properties == null || properties.isEmpty()) {
      return d;
    }
    for (ConfigurationNode p : properties) {
      if (p.getChildren("name") != null && !p.getChildren("name").isEmpty()
          && name.equals(p.getChildren("name").get(0).getValue())) {
        return Boolean.parseBoolean((String) p.getChildren("value").get(0).getValue());
      }
    }
    return d;
  }

  public String getString(ConfVars c) {
    return getString(c.name(), c.getVarName(), c.getStringValue());
  }

  public String getString(String envName, String propertyName, String defaultValue) {
    if (System.getenv(envName) != null) {
      return System.getenv(envName);
    }
    if (System.getProperty(propertyName) != null) {
      return System.getProperty(propertyName);
    }

    return getStringValue(propertyName, defaultValue);
  }

  public int getInt(ConfVars c) {
    return getInt(c.name(), c.getVarName(), c.getIntValue());
  }

  public int getInt(String envName, String propertyName, int defaultValue) {
    if (System.getenv(envName) != null) {
      return Integer.parseInt(System.getenv(envName));
    }

    if (System.getProperty(propertyName) != null) {
      return Integer.parseInt(System.getProperty(propertyName));
    }
    return getIntValue(propertyName, defaultValue);
  }

  public long getLong(ConfVars c) {
    return getLong(c.name(), c.getVarName(), c.getLongValue());
  }

  public long getLong(String envName, String propertyName, long defaultValue) {
    if (System.getenv(envName) != null) {
      return Long.parseLong(System.getenv(envName));
    }

    if (System.getProperty(propertyName) != null) {
      return Long.parseLong(System.getProperty(propertyName));
    }
    return getLongValue(propertyName, defaultValue);
  }

  public float getFloat(ConfVars c) {
    return getFloat(c.name(), c.getVarName(), c.getFloatValue());
  }

  public float getFloat(String envName, String propertyName, float defaultValue) {
    if (System.getenv(envName) != null) {
      return Float.parseFloat(System.getenv(envName));
    }
    if (System.getProperty(propertyName) != null) {
      return Float.parseFloat(System.getProperty(propertyName));
    }
    return getFloatValue(propertyName, defaultValue);
  }

  public boolean getBoolean(ConfVars c) {
    return getBoolean(c.name(), c.getVarName(), c.getBooleanValue());
  }

  public boolean getBoolean(String envName, String propertyName, boolean defaultValue) {
    if (System.getenv(envName) != null) {
      return Boolean.parseBoolean(System.getenv(envName));
    }

    if (System.getProperty(propertyName) != null) {
      return Boolean.parseBoolean(System.getProperty(propertyName));
    }
    return getBooleanValue(propertyName, defaultValue);
  }

  public boolean useSsl() {
    return getBoolean(ConfVars.SMARTSUITES_SSL);
  }

  public int getServerSslPort() {
    return getInt(ConfVars.SMARTSUITES_SSL_PORT);
  }

  public boolean useClientAuth() {
    return getBoolean(ConfVars.SMARTSUITES_SSL_CLIENT_AUTH);
  }

  public String getServerAddress() {
    return getString(ConfVars.SMARTSUITES_ADDR);
  }

  public int getServerPort() {
    return getInt(ConfVars.SMARTSUITES_PORT);
  }

  public String getServerContextPath() {
    return getString(ConfVars.SMARTSUITES_SERVER_CONTEXT_PATH);
  }

  public String getKeyStorePath() {
    String path = getString(ConfVars.SMARTSUITES_SSL_KEYSTORE_PATH);
    if (path != null && path.startsWith("/") || isWindowsPath(path)) {
      return path;
    } else {
      return getRelativeDir(
          String.format("%s/%s",
              getConfDir(),
              path));
    }
  }

  public String getKeyStoreType() {
    return getString(ConfVars.SMARTSUITES_SSL_KEYSTORE_TYPE);
  }

  public String getKeyStorePassword() {
    return getString(ConfVars.SMARTSUITES_SSL_KEYSTORE_PASSWORD);
  }

  public String getKeyManagerPassword() {
    String password = getString(ConfVars.SMARTSUITES_SSL_KEY_MANAGER_PASSWORD);
    if (password == null) {
      return getKeyStorePassword();
    } else {
      return password;
    }
  }

  public String getTrustStorePath() {
    String path = getString(ConfVars.SMARTSUITES_SSL_TRUSTSTORE_PATH);
    if (path == null) {
      path = getKeyStorePath();
    }
    if (path != null && path.startsWith("/") || isWindowsPath(path)) {
      return path;
    } else {
      return getRelativeDir(
          String.format("%s/%s",
              getConfDir(),
              path));
    }
  }

  public String getTrustStoreType() {
    String type = getString(ConfVars.SMARTSUITES_SSL_TRUSTSTORE_TYPE);
    if (type == null) {
      return getKeyStoreType();
    } else {
      return type;
    }
  }

  public String getTrustStorePassword() {
    String password = getString(ConfVars.SMARTSUITES_SSL_TRUSTSTORE_PASSWORD);
    if (password == null) {
      return getKeyStorePassword();
    } else {
      return password;
    }
  }

  public String getNotebookDir() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_DIR);
  }

  public String getUser() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_USER);
  }

  public String getBucketName() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_BUCKET);
  }

  public String getEndpoint() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_ENDPOINT);
  }

  public String getS3KMSKeyID() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_KMS_KEY_ID);
  }

  public String getS3KMSKeyRegion() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_KMS_KEY_REGION);
  }

  public String getS3EncryptionMaterialsProviderClass() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_EMP);
  }

  public boolean isS3ServerSideEncryption() {
    return getBoolean(ConfVars.SMARTSUITES_NOTEBOOK_S3_SSE);
  }

  public String getS3SignerOverride() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_S3_SIGNEROVERRIDE);
  }

  public String getMongoUri() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_MONGO_URI);
  }

  public String getMongoDatabase() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_MONGO_DATABASE);
  }

  public String getMongoCollection() {
    return getString(ConfVars.SMARTSUITES_NOTEBOOK_MONGO_COLLECTION);
  }

  public boolean getMongoAutoimport() {
    return getBoolean(ConfVars.SMARTSUITES_NOTEBOOK_MONGO_AUTOIMPORT);
  }

  public String getInterpreterListPath() {
    return getRelativeDir(String.format("%s/interpreter-list", getConfDir()));
  }

  public String getInterpreterDir() {
    return getRelativeDir(ConfVars.SMARTSUITES_INTERPRETER_DIR);
  }

  public String getInterpreterJson() {
    return getString(ConfVars.SMARTSUITES_INTERPRETER_JSON);
  }

  public String getInterpreterSettingPath() {
    return getRelativeDir(String.format("%s/interpreter.json", getConfDir()));
  }

  public String getHeliumConfPath() {
    return getRelativeDir(String.format("%s/helium.json", getConfDir()));
  }

  public String getHeliumRegistry() {
    return getRelativeDir(ConfVars.SMARTSUITES_HELIUM_REGISTRY);
  }

  public String getHeliumNodeInstallerUrl() {
    return getString(ConfVars.SMARTSUITES_HELIUM_NODE_INSTALLER_URL);
  }

  public String getHeliumNpmInstallerUrl() {
    return getString(ConfVars.SMARTSUITES_HELIUM_NPM_INSTALLER_URL);
  }

  public String getHeliumYarnInstallerUrl() {
    return getString(ConfVars.SMARTSUITES_HELIUM_YARNPKG_INSTALLER_URL);
  }

  public String getNotebookAuthorizationPath() {
    return getRelativeDir(String.format("%s/notebook-authorization.json", getConfDir()));
  }

  public Boolean credentialsPersist() {
    return getBoolean(ConfVars.SMARTSUITES_CREDENTIALS_PERSIST);
  }

  public String getCredentialsEncryptKey() {
    return getString(ConfVars.SMARTSUITES_CREDENTIALS_ENCRYPT_KEY);
  }

  public String getCredentialsPath() {
    return getRelativeDir(String.format("%s/credentials.json", getConfDir()));
  }

  public String getShiroPath() {
    String shiroPath = getRelativeDir(String.format("%s/shiro.ini", getConfDir()));
    return new File(shiroPath).exists() ? shiroPath : StringUtils.EMPTY;
  }

  public String getInterpreterRemoteRunnerPath() {
    return getRelativeDir(ConfVars.SMARTSUITES_INTERPRETER_REMOTE_RUNNER);
  }

  public String getInterpreterLocalRepoPath() {
    return getRelativeDir(ConfVars.SMARTSUITES_INTERPRETER_LOCALREPO);
  }

  public String getInterpreterMvnRepoPath() {
    return getString(ConfVars.SMARTSUITES_INTERPRETER_DEP_MVNREPO);
  }

  public String getRelativeDir(ConfVars c) {
    return getRelativeDir(getString(c));
  }

  public String getRelativeDir(String path) {
    if (path != null && path.startsWith("/") || isWindowsPath(path)) {
      return path;
    } else {
      return getString(ConfVars.SMARTSUITES_HOME) + "/" + path;
    }
  }

  public String getCallbackPortRange() {
    return getString(ConfVars.SMARTSUITES_INTERPRETER_CALLBACK_PORTRANGE);
  }

  public boolean isWindowsPath(String path){
    return path.matches("^[A-Za-z]:\\\\.*");
  }

  public boolean isAnonymousAllowed() {
    return getBoolean(ConfVars.SMARTSUITES_ANONYMOUS_ALLOWED);
  }

  public boolean isNotebokPublic() {
    return getBoolean(ConfVars.SMARTSUITES_NOTEBOOK_PUBLIC);
  }

  public String getConfDir() {
    return getRelativeDir(ConfVars.SMARTSUITES_CONF_DIR);
  }

  public List<String> getAllowedOrigins()
  {
    if (getString(ConfVars.SMARTSUITES_ALLOWED_ORIGINS).isEmpty()) {
      return Arrays.asList(new String[0]);
    }

    return Arrays.asList(getString(ConfVars.SMARTSUITES_ALLOWED_ORIGINS).toLowerCase().split(","));
  }

  public String getWebsocketMaxTextMessageSize() {
    return getString(ConfVars.SMARTSUITES_WEBSOCKET_MAX_TEXT_MESSAGE_SIZE);
  }

  public String getJettyName() {
    return getString(ConfVars.SMARTSUITES_SERVER_JETTY_NAME);
  }


  public String getXFrameOptions() {
    return getString(ConfVars.SMARTSUITES_SERVER_XFRAME_OPTIONS);
  }

  public String getXxssProtection() {
    return getString(ConfVars.SMARTSUITES_SERVER_X_XSS_PROTECTION);
  }

  public String getStrictTransport() {
    return getString(ConfVars.SMARTSUITES_SERVER_STRICT_TRANSPORT);
  }

  public String getLifecycleManagerClass() {
    return getString(ConfVars.SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_CLASS);
  }

  public Map<String, String> dumpConfigurations(SmartsuitesConfiguration conf,
                                                ConfigurationKeyPredicate predicate) {
    Map<String, String> configurations = new HashMap<>();

    for (ConfVars v : ConfVars.values()) {
      String key = v.getVarName();

      if (!predicate.apply(key)) {
        continue;
      }

      ConfVars.VarType type = v.getType();
      Object value = null;
      if (type == ConfVars.VarType.BOOLEAN) {
        value = conf.getBoolean(v);
      } else if (type == ConfVars.VarType.LONG) {
        value = conf.getLong(v);
      } else if (type == ConfVars.VarType.INT) {
        value = conf.getInt(v);
      } else if (type == ConfVars.VarType.FLOAT) {
        value = conf.getFloat(v);
      } else if (type == ConfVars.VarType.STRING) {
        value = conf.getString(v);
      }

      if (value != null) {
        configurations.put(key, value.toString());
      }
    }
    return configurations;
  }

  /**
   * Predication whether key/value pair should be included or not
   */
  public interface ConfigurationKeyPredicate {
    boolean apply(String key);
  }

  /**
   * Wrapper class.
   */
  public static enum ConfVars {
    SMARTSUITES_HOME("zeppelin.home", "./"),
    SMARTSUITES_ADDR("zeppelin.server.addr", "0.0.0.0"),
    SMARTSUITES_PORT("zeppelin.server.port", 8080),
    SMARTSUITES_SERVER_CONTEXT_PATH("zeppelin.server.context.path", "/"),
    SMARTSUITES_SSL("zeppelin.ssl", false),
    SMARTSUITES_SSL_PORT("zeppelin.server.ssl.port", 8443),
    SMARTSUITES_SSL_CLIENT_AUTH("zeppelin.ssl.client.auth", false),
    SMARTSUITES_SSL_KEYSTORE_PATH("zeppelin.ssl.keystore.path", "keystore"),
    SMARTSUITES_SSL_KEYSTORE_TYPE("zeppelin.ssl.keystore.type", "JKS"),
    SMARTSUITES_SSL_KEYSTORE_PASSWORD("zeppelin.ssl.keystore.password", ""),
    SMARTSUITES_SSL_KEY_MANAGER_PASSWORD("zeppelin.ssl.key.manager.password", null),
    SMARTSUITES_SSL_TRUSTSTORE_PATH("zeppelin.ssl.truststore.path", null),
    SMARTSUITES_SSL_TRUSTSTORE_TYPE("zeppelin.ssl.truststore.type", null),
    SMARTSUITES_SSL_TRUSTSTORE_PASSWORD("zeppelin.ssl.truststore.password", null),
    SMARTSUITES_WAR("zeppelin.war", "smartsuites-web/descriptor"),
    SMARTSUITES_WAR_TEMPDIR("zeppelin.war.tempdir", "webapps"),
    SMARTSUITES_INTERPRETERS("zeppelin.interpreters", "com.smartsuites.spark.SparkInterpreter,"
        + "com.smartsuites.spark.PySparkInterpreter,"
        + "com.smartsuites.rinterpreter.RRepl,"
        + "com.smartsuites.rinterpreter.KnitR,"
        + "com.smartsuites.spark.SparkRInterpreter,"
        + "com.smartsuites.spark.SparkSqlInterpreter,"
        + "com.smartsuites.spark.DepInterpreter,"
        + "com.smartsuites.markdown.Markdown,"
        + "com.smartsuites.angular.AngularInterpreter,"
        + "com.smartsuites.shell.ShellInterpreter,"
        + "com.smartsuites.livy.LivySparkInterpreter,"
        + "com.smartsuites.livy.LivySparkSQLInterpreter,"
        + "com.smartsuites.livy.LivyPySparkInterpreter,"
        + "com.smartsuites.livy.LivyPySpark3Interpreter,"
        + "com.smartsuites.livy.LivySparkRInterpreter,"
        + "com.smartsuites.alluxio.AlluxioInterpreter,"
        + "com.smartsuites.file.HDFSFileInterpreter,"
        + "com.smartsuites.pig.PigInterpreter,"
        + "com.smartsuites.pig.PigQueryInterpreter,"
        + "com.smartsuites.flink.FlinkInterpreter,"
        + "com.smartsuites.python.PythonInterpreter,"
        + "com.smartsuites.python.PythonInterpreterPandasSql,"
        + "com.smartsuites.python.PythonCondaInterpreter,"
        + "com.smartsuites.python.PythonDockerInterpreter,"
        + "com.smartsuites.ignite.IgniteInterpreter,"
        + "com.smartsuites.ignite.IgniteSqlInterpreter,"
        + "com.smartsuites.lens.LensInterpreter,"
        + "com.smartsuites.cassandra.CassandraInterpreter,"
        + "com.smartsuites.geode.GeodeOqlInterpreter,"
        + "com.smartsuites.kylin.KylinInterpreter,"
        + "com.smartsuites.elasticsearch.ElasticsearchInterpreter,"
        + "com.smartsuites.scalding.ScaldingInterpreter,"
        + "com.smartsuites.jdbc.JDBCInterpreter,"
        + "com.smartsuites.hbase.HbaseInterpreter,"
        + "com.smartsuites.bigquery.BigQueryInterpreter,"
        + "com.smartsuites.beam.BeamInterpreter,"
        + "com.smartsuites.scio.ScioInterpreter,"
        + "com.smartsuites.groovy.GroovyInterpreter,"
        + "com.smartsuites.neo4j.Neo4jCypherInterpreter"
        ),
    SMARTSUITES_INTERPRETER_JSON("zeppelin.interpreter.setting", "interpreter-setting.json"),
    SMARTSUITES_INTERPRETER_DIR("zeppelin.interpreter.dir", "interpreter"),
    SMARTSUITES_INTERPRETER_LOCALREPO("zeppelin.interpreter.localRepo", "local-repo"),
    SMARTSUITES_INTERPRETER_DEP_MVNREPO("zeppelin.interpreter.dep.mvnRepo",
        "http://repo1.maven.org/maven2/"),
    SMARTSUITES_INTERPRETER_CONNECT_TIMEOUT("zeppelin.interpreter.connect.timeout", 30000),
    SMARTSUITES_INTERPRETER_MAX_POOL_SIZE("zeppelin.interpreter.max.poolsize", 10),
    SMARTSUITES_INTERPRETER_GROUP_ORDER("zeppelin.interpreter.group.order", "spark,md,angular,sh,"
        + "livy,alluxio,file,psql,flink,python,ignite,lens,cassandra,geode,kylin,elasticsearch,"
        + "scalding,jdbc,hbase,bigquery,beam,pig,scio,groovy,neo4j"),
    SMARTSUITES_INTERPRETER_OUTPUT_LIMIT("zeppelin.interpreter.output.limit", 1024 * 100),
    SMARTSUITES_ENCODING("zeppelin.encoding", "UTF-8"),
    SMARTSUITES_NOTEBOOK_DIR("zeppelin.notebook.dir", "notebook"),
    // use specified notebook (id) as homescreen
    SMARTSUITES_NOTEBOOK_HOMESCREEN("zeppelin.notebook.homescreen", null),
    // whether homescreen notebook will be hidden from notebook list or not
    SMARTSUITES_NOTEBOOK_HOMESCREEN_HIDE("zeppelin.notebook.homescreen.hide", false),
    SMARTSUITES_NOTEBOOK_S3_BUCKET("zeppelin.notebook.s3.bucket", "zeppelin"),
    SMARTSUITES_NOTEBOOK_S3_ENDPOINT("zeppelin.notebook.s3.endpoint", "s3.amazonaws.com"),
    SMARTSUITES_NOTEBOOK_S3_USER("zeppelin.notebook.s3.user", "user"),
    SMARTSUITES_NOTEBOOK_S3_EMP("zeppelin.notebook.s3.encryptionMaterialsProvider", null),
    SMARTSUITES_NOTEBOOK_S3_KMS_KEY_ID("zeppelin.notebook.s3.kmsKeyID", null),
    SMARTSUITES_NOTEBOOK_S3_KMS_KEY_REGION("zeppelin.notebook.s3.kmsKeyRegion", null),
    SMARTSUITES_NOTEBOOK_S3_SSE("zeppelin.notebook.s3.sse", false),
    SMARTSUITES_NOTEBOOK_S3_SIGNEROVERRIDE("zeppelin.notebook.s3.signerOverride", null),
    SMARTSUITES_NOTEBOOK_AZURE_CONNECTION_STRING("zeppelin.notebook.azure.connectionString", null),
    SMARTSUITES_NOTEBOOK_AZURE_SHARE("zeppelin.notebook.azure.share", "zeppelin"),
    SMARTSUITES_NOTEBOOK_AZURE_USER("zeppelin.notebook.azure.user", "user"),
    SMARTSUITES_NOTEBOOK_MONGO_DATABASE("zeppelin.notebook.mongo.database", "zeppelin"),
    SMARTSUITES_NOTEBOOK_MONGO_COLLECTION("zeppelin.notebook.mongo.collection", "notes"),
    SMARTSUITES_NOTEBOOK_MONGO_URI("zeppelin.notebook.mongo.uri", "mongodb://localhost"),
    SMARTSUITES_NOTEBOOK_MONGO_AUTOIMPORT("zeppelin.notebook.mongo.autoimport", false),
    SMARTSUITES_NOTEBOOK_STORAGE("zeppelin.notebook.storage",
        "com.smartsuites.notebook.repo.GitNotebookRepo"),
    SMARTSUITES_NOTEBOOK_ONE_WAY_SYNC("zeppelin.notebook.one.way.sync", false),
    // whether by default note is public or private
    SMARTSUITES_NOTEBOOK_PUBLIC("zeppelin.notebook.public", true),
    SMARTSUITES_INTERPRETER_REMOTE_RUNNER("zeppelin.interpreter.remoterunner",
        System.getProperty("os.name")
                .startsWith("Windows") ? "bin/interpreter.cmd" : "bin/interpreter.sh"),
    // Decide when new note is created, interpreter settings will be binded automatically or not.
    SMARTSUITES_NOTEBOOK_AUTO_INTERPRETER_BINDING("zeppelin.notebook.autoInterpreterBinding", true),
    SMARTSUITES_CONF_DIR("zeppelin.conf.dir", "conf"),
    SMARTSUITES_DEP_LOCALREPO("zeppelin.dep.localrepo", "local-repo"),
    SMARTSUITES_HELIUM_REGISTRY("zeppelin.helium.registry", "helium," + HELIUM_PACKAGE_DEFAULT_URL),
    SMARTSUITES_HELIUM_NODE_INSTALLER_URL("zeppelin.helium.node.installer.url",
            "https://nodejs.org/dist/"),
    SMARTSUITES_HELIUM_NPM_INSTALLER_URL("zeppelin.helium.npm.installer.url",
            "http://registry.npmjs.org/"),
    SMARTSUITES_HELIUM_YARNPKG_INSTALLER_URL("zeppelin.helium.yarnpkg.installer.url",
            "https://github.com/yarnpkg/yarn/releases/download/"),
    // Allows a way to specify a ',' separated list of allowed origins for rest and websockets
    // i.e. http://localhost:8080
    SMARTSUITES_ALLOWED_ORIGINS("zeppelin.server.allowed.origins", "*"),
    SMARTSUITES_ANONYMOUS_ALLOWED("zeppelin.anonymous.allowed", true),
    SMARTSUITES_CREDENTIALS_PERSIST("zeppelin.credentials.persist", true),
    SMARTSUITES_CREDENTIALS_ENCRYPT_KEY("zeppelin.credentials.encryptKey", null),
    SMARTSUITES_WEBSOCKET_MAX_TEXT_MESSAGE_SIZE("zeppelin.websocket.max.text.message.size", "1024000"),
    SMARTSUITES_SERVER_DEFAULT_DIR_ALLOWED("zeppelin.server.default.dir.allowed", false),
    SMARTSUITES_SERVER_XFRAME_OPTIONS("zeppelin.server.xframe.options", "SAMEORIGIN"),
    SMARTSUITES_SERVER_JETTY_NAME("zeppelin.server.jetty.name", null),
    SMARTSUITES_SERVER_STRICT_TRANSPORT("zeppelin.server.strict.transport", "max-age=631138519"),
    SMARTSUITES_SERVER_X_XSS_PROTECTION("zeppelin.server.xxss.protection", "1"),

    SMARTSUITES_SERVER_KERBEROS_KEYTAB("zeppelin.server.kerberos.keytab", ""),
    SMARTSUITES_SERVER_KERBEROS_PRINCIPAL("zeppelin.server.kerberos.principal", ""),

    SMARTSUITES_INTERPRETER_CALLBACK_PORTRANGE("zeppelin.interpreter.callback.portRange", ":"),

    SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_CLASS("zeppelin.interpreter.lifecyclemanager.class",
        "com.smartsuites.interpreter.lifecycle.TimeoutLifecycleManager"),
    SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_TIMEOUT_CHECK_INTERVAL(
        "zeppelin.interpreter.lifecyclemanager.timeout.checkinterval", 6000L),
    SMARTSUITES_INTERPRETER_LIFECYCLE_MANAGER_TIMEOUT_THRESHOLD(
        "zeppelin.interpreter.lifecyclemanager.timeout.threshold", 3600000L);

    private String varName;
    @SuppressWarnings("rawtypes")
    private Class varClass;
    private String stringValue;
    private VarType type;
    private int intValue;
    private float floatValue;
    private boolean booleanValue;
    private long longValue;


    ConfVars(String varName, String varValue) {
      this.varName = varName;
      this.varClass = String.class;
      this.stringValue = varValue;
      this.intValue = -1;
      this.floatValue = -1;
      this.longValue = -1;
      this.booleanValue = false;
      this.type = VarType.STRING;
    }

    ConfVars(String varName, int intValue) {
      this.varName = varName;
      this.varClass = Integer.class;
      this.stringValue = null;
      this.intValue = intValue;
      this.floatValue = -1;
      this.longValue = -1;
      this.booleanValue = false;
      this.type = VarType.INT;
    }

    ConfVars(String varName, long longValue) {
      this.varName = varName;
      this.varClass = Integer.class;
      this.stringValue = null;
      this.intValue = -1;
      this.floatValue = -1;
      this.longValue = longValue;
      this.booleanValue = false;
      this.type = VarType.LONG;
    }

    ConfVars(String varName, float floatValue) {
      this.varName = varName;
      this.varClass = Float.class;
      this.stringValue = null;
      this.intValue = -1;
      this.longValue = -1;
      this.floatValue = floatValue;
      this.booleanValue = false;
      this.type = VarType.FLOAT;
    }

    ConfVars(String varName, boolean booleanValue) {
      this.varName = varName;
      this.varClass = Boolean.class;
      this.stringValue = null;
      this.intValue = -1;
      this.longValue = -1;
      this.floatValue = -1;
      this.booleanValue = booleanValue;
      this.type = VarType.BOOLEAN;
    }

    public String getVarName() {
      return varName;
    }

    @SuppressWarnings("rawtypes")
    public Class getVarClass() {
      return varClass;
    }

    public int getIntValue() {
      return intValue;
    }

    public long getLongValue() {
      return longValue;
    }

    public float getFloatValue() {
      return floatValue;
    }

    public String getStringValue() {
      return stringValue;
    }

    public boolean getBooleanValue() {
      return booleanValue;
    }

    public VarType getType() {
      return type;
    }

    enum VarType {
      STRING {
        @Override
        void checkType(String value) throws Exception {}
      },
      INT {
        @Override
        void checkType(String value) throws Exception {
          Integer.valueOf(value);
        }
      },
      LONG {
        @Override
        void checkType(String value) throws Exception {
          Long.valueOf(value);
        }
      },
      FLOAT {
        @Override
        void checkType(String value) throws Exception {
          Float.valueOf(value);
        }
      },
      BOOLEAN {
        @Override
        void checkType(String value) throws Exception {
          Boolean.valueOf(value);
        }
      };

      boolean isType(String value) {
        try {
          checkType(value);
        } catch (Exception e) {
          LOG.error("Exception in SmartsuitesConfiguration while isType", e);
          return false;
        }
        return true;
      }

      String typeString() {
        return name().toUpperCase();
      }

      abstract void checkType(String value) throws Exception;
    }
  }
}
