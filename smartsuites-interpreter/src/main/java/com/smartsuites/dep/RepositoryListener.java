/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */

package com.smartsuites.dep;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sonatype.aether.AbstractRepositoryListener;
import org.sonatype.aether.RepositoryEvent;

/**
 * Simple listener that print log.
 */
public class RepositoryListener extends AbstractRepositoryListener {
  Logger logger = LoggerFactory.getLogger(RepositoryListener.class);

  public RepositoryListener() {}

  @Override
  public void artifactDeployed(RepositoryEvent event) {
    logger.info("Deployed " + event.getArtifact() + " to " + event.getRepository());
  }

  @Override
  public void artifactDeploying(RepositoryEvent event) {
    logger.info("Deploying " + event.getArtifact() + " to " + event.getRepository());
  }

  @Override
  public void artifactDescriptorInvalid(RepositoryEvent event) {
    logger.info("Invalid artifact descriptor for " + event.getArtifact() + ": "
                                                   + event.getException().getMessage());
  }

  @Override
  public void artifactDescriptorMissing(RepositoryEvent event) {
    logger.info("Missing artifact descriptor for " + event.getArtifact());
  }

  @Override
  public void artifactInstalled(RepositoryEvent event) {
    logger.info("Installed " + event.getArtifact() + " to " + event.getFile());
  }

  @Override
  public void artifactInstalling(RepositoryEvent event) {
    logger.info("Installing " + event.getArtifact() + " to " + event.getFile());
  }

  @Override
  public void artifactResolved(RepositoryEvent event) {
    logger.info("Resolved artifact " + event.getArtifact() + " from " + event.getRepository());
  }

  @Override
  public void artifactDownloading(RepositoryEvent event) {
    logger.info("Downloading artifact " + event.getArtifact() + " from " + event.getRepository());
  }

  @Override
  public void artifactDownloaded(RepositoryEvent event) {
    logger.info("Downloaded artifact " + event.getArtifact() + " from " + event.getRepository());
  }

  @Override
  public void artifactResolving(RepositoryEvent event) {
    logger.info("Resolving artifact " + event.getArtifact());
  }

  @Override
  public void metadataDeployed(RepositoryEvent event) {
    logger.info("Deployed " + event.getMetadata() + " to " + event.getRepository());
  }

  @Override
  public void metadataDeploying(RepositoryEvent event) {
    logger.info("Deploying " + event.getMetadata() + " to " + event.getRepository());
  }

  @Override
  public void metadataInstalled(RepositoryEvent event) {
    logger.info("Installed " + event.getMetadata() + " to " + event.getFile());
  }

  @Override
  public void metadataInstalling(RepositoryEvent event) {
    logger.info("Installing " + event.getMetadata() + " to " + event.getFile());
  }

  @Override
  public void metadataInvalid(RepositoryEvent event) {
    logger.info("Invalid metadata " + event.getMetadata());
  }

  @Override
  public void metadataResolved(RepositoryEvent event) {
    logger.info("Resolved metadata " + event.getMetadata() + " from " + event.getRepository());
  }

  @Override
  public void metadataResolving(RepositoryEvent event) {
    logger.info("Resolving metadata " + event.getMetadata() + " from " + event.getRepository());
  }
}
