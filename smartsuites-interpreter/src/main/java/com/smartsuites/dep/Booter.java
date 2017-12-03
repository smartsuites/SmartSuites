/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.dep;

import org.apache.commons.lang.Validate;
import org.apache.maven.repository.internal.MavenRepositorySystemSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonatype.aether.RepositorySystem;
import org.sonatype.aether.RepositorySystemSession;
import org.sonatype.aether.repository.LocalRepository;
import org.sonatype.aether.repository.RemoteRepository;

import java.nio.file.Paths;

/**
 * Manage mvn repository.
 */
public class Booter {
  private static Logger logger = LoggerFactory.getLogger(Booter.class);

  public static RepositorySystem newRepositorySystem() {
    return RepositorySystemFactory.newRepositorySystem();
  }

  public static RepositorySystemSession newRepositorySystemSession(
      RepositorySystem system, String localRepoPath) {
    Validate.notNull(localRepoPath, "localRepoPath should have a value");

    MavenRepositorySystemSession session = new MavenRepositorySystemSession();

    LocalRepository localRepo = new LocalRepository(resolveLocalRepoPath(localRepoPath));
    session.setLocalRepositoryManager(system.newLocalRepositoryManager(localRepo));

    if (logger.isDebugEnabled()) {
      session.setTransferListener(new TransferListener());
      session.setRepositoryListener(new RepositoryListener());
    }
    // uncomment to generate dirty trees
    // session.setDependencyGraphTransformer( null );

    return session;
  }

  static String resolveLocalRepoPath(String localRepoPath) {
    // todo decouple home folder resolution
    // find homedir
    String home = System.getenv("ZEPPELIN_HOME");
    if (home == null) {
      home = System.getProperty("zeppelin.home");
    }
    if (home == null) {
      home = "..";
    }

    return Paths.get(home).resolve(localRepoPath).toAbsolutePath().toString();
  }

  public static RemoteRepository newCentralRepository() {
    String mvnRepo = System.getenv("ZEPPELIN_INTERPRETER_DEP_MVNREPO");
    if (mvnRepo == null) {
      mvnRepo = System.getProperty("zeppelin.interpreter.dep.mvnRepo");
    }
    if (mvnRepo == null) {
      mvnRepo = "http://repo1.maven.org/maven2/";
    }

    return new RemoteRepository("central", "default", mvnRepo);
  }

  public static RemoteRepository newLocalRepository() {
    return new RemoteRepository("local",
        "default", "file://" + System.getProperty("user.home") + "/.m2/repository");
  }
}
