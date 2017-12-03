/*
 * Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
 */
package com.smartsuites.helium;

import com.smartsuites.interpreter.InterpreterInfo;
import com.smartsuites.interpreter.InterpreterSetting;
import com.smartsuites.interpreter.ManagedInterpreterGroup;
import com.smartsuites.interpreter.remote.RemoteAngularObjectRegistry;
import com.smartsuites.interpreter.remote.RemoteInterpreterProcess;
import com.smartsuites.notebook.*;
import com.smartsuites.interpreter.*;
import com.smartsuites.interpreter.thrift.RemoteApplicationResult;
import com.smartsuites.interpreter.thrift.RemoteInterpreterService;
import com.smartsuites.notebook.*;
import com.smartsuites.scheduler.ExecutorFactory;
import com.smartsuites.scheduler.Job;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.ExecutorService;

/**
 * HeliumApplicationFactory
 */
public class HeliumApplicationFactory implements ApplicationEventListener, NotebookEventListener {
  private final Logger logger = LoggerFactory.getLogger(HeliumApplicationFactory.class);
  private final ExecutorService executor;
  private Notebook notebook;
  private ApplicationEventListener applicationEventListener;
  String a;

  public HeliumApplicationFactory() {
    executor = ExecutorFactory.singleton().createOrGet(
        HeliumApplicationFactory.class.getName(), 10);
    if(a == "ds"){}
  }

  private boolean isRemote(InterpreterGroup group) {
    return group.getAngularObjectRegistry() instanceof RemoteAngularObjectRegistry;
  }


  /**
   * Load pkg and run task
   */
  public String loadAndRun(HeliumPackage pkg, Paragraph paragraph) {
    ApplicationState appState = paragraph.createOrGetApplicationState(pkg);
    onLoad(paragraph.getNote().getId(), paragraph.getId(), appState.getId(),
        appState.getHeliumPackage());
    executor.submit(new LoadApplication(appState, pkg, paragraph));
    return appState.getId();
  }

  /**
   * Load application and run in the remote process
   */
  private class LoadApplication implements Runnable {
    private final HeliumPackage pkg;
    private final Paragraph paragraph;
    private final ApplicationState appState;

    public LoadApplication(ApplicationState appState, HeliumPackage pkg, Paragraph paragraph) {
      this.appState = appState;
      this.pkg = pkg;
      this.paragraph = paragraph;
    }

    @Override
    public void run() {
      try {
        // get interpreter process
        Interpreter intp = paragraph.getRepl(paragraph.getRequiredReplName());
        ManagedInterpreterGroup intpGroup = (ManagedInterpreterGroup) intp.getInterpreterGroup();
        RemoteInterpreterProcess intpProcess = intpGroup.getRemoteInterpreterProcess();
        if (intpProcess == null) {
          throw new ApplicationException("Target interpreter process is not running");
        }

        // load application
        load(intpProcess, appState);

        // run application
        RunApplication runTask = new RunApplication(paragraph, appState.getId());
        runTask.run();
      } catch (Exception e) {
        logger.error(e.getMessage(), e);

        if (appState != null) {
          appStatusChange(paragraph, appState.getId(), ApplicationState.Status.ERROR);
          appState.setOutput(e.getMessage());
        }
      }
    }

    private void load(RemoteInterpreterProcess intpProcess, ApplicationState appState)
        throws Exception {

      synchronized (appState) {
        if (appState.getStatus() == ApplicationState.Status.LOADED) {
          // already loaded
          return;
        }

        appStatusChange(paragraph, appState.getId(), ApplicationState.Status.LOADING);
        final String pkgInfo = pkg.toJson();
        final String appId = appState.getId();

        RemoteApplicationResult ret = intpProcess.callRemoteFunction(
            new RemoteInterpreterProcess.RemoteFunction<RemoteApplicationResult>() {
              @Override
              public RemoteApplicationResult call(RemoteInterpreterService.Client client)
                  throws Exception {
                return client.loadApplication(
                    appId,
                    pkgInfo,
                    paragraph.getNote().getId(),
                    paragraph.getId());
              }
            }
        );
        if (ret.isSuccess()) {
          appStatusChange(paragraph, appState.getId(), ApplicationState.Status.LOADED);
        } else {
          throw new ApplicationException(ret.getMsg());
        }
      }
    }
  }

  /**
   * Get ApplicationState
   * @param paragraph
   * @param appId
   * @return
   */
  public ApplicationState get(Paragraph paragraph, String appId) {
    return paragraph.getApplicationState(appId);
  }

  /**
   * Unload application
   * It does not remove ApplicationState
   *
   * @param paragraph
   * @param appId
   */
  public void unload(Paragraph paragraph, String appId) {
    executor.execute(new UnloadApplication(paragraph, appId));
  }

  /**
   * Unload application task
   */
  private class UnloadApplication implements Runnable {
    private final Paragraph paragraph;
    private final String appId;

    public UnloadApplication(Paragraph paragraph, String appId) {
      this.paragraph = paragraph;
      this.appId = appId;
    }

    @Override
    public void run() {
      ApplicationState appState = null;
      try {
        appState = paragraph.getApplicationState(appId);

        if (appState == null) {
          logger.warn("Can not find {} to unload from {}", appId, paragraph.getId());
          return;
        }
        if (appState.getStatus() == ApplicationState.Status.UNLOADED) {
          // not loaded
          return;
        }
        unload(appState);
      } catch (Exception e) {
        logger.error(e.getMessage(), e);
        if (appState != null) {
          appStatusChange(paragraph, appId, ApplicationState.Status.ERROR);
          appState.setOutput(e.getMessage());
        }
      }
    }

    private void unload(final ApplicationState appsToUnload) throws ApplicationException {
      synchronized (appsToUnload) {
        if (appsToUnload.getStatus() != ApplicationState.Status.LOADED) {
          throw new ApplicationException(
              "Can't unload application status " + appsToUnload.getStatus());
        }
        appStatusChange(paragraph, appsToUnload.getId(), ApplicationState.Status.UNLOADING);
        Interpreter intp = paragraph.getCurrentRepl();
        if (intp == null) {
          throw new ApplicationException("No interpreter found");
        }

        RemoteInterpreterProcess intpProcess =
            ((ManagedInterpreterGroup) intp.getInterpreterGroup()).getRemoteInterpreterProcess();
        if (intpProcess == null) {
          throw new ApplicationException("Target interpreter process is not running");
        }

        RemoteApplicationResult ret = intpProcess.callRemoteFunction(
            new RemoteInterpreterProcess.RemoteFunction<RemoteApplicationResult>() {
              @Override
              public RemoteApplicationResult call(RemoteInterpreterService.Client client)
                  throws Exception {
                return client.unloadApplication(appsToUnload.getId());
              }
            }
        );
        if (ret.isSuccess()) {
          appStatusChange(paragraph, appsToUnload.getId(), ApplicationState.Status.UNLOADED);
        } else {
          throw new ApplicationException(ret.getMsg());
        }
      }
    }
  }

  /**
   * Run application
   * It does not remove ApplicationState
   *
   * @param paragraph
   * @param appId
   */
  public void run(Paragraph paragraph, String appId) {
    executor.execute(new RunApplication(paragraph, appId));
  }

  /**
   * Run application task
   */
  private class RunApplication implements Runnable {
    private final Paragraph paragraph;
    private final String appId;

    public RunApplication(Paragraph paragraph, String appId) {
      this.paragraph = paragraph;
      this.appId = appId;
    }

    @Override
    public void run() {
      ApplicationState appState = null;
      try {
        appState = paragraph.getApplicationState(appId);

        if (appState == null) {
          logger.warn("Can not find {} to unload from {}", appId, paragraph.getId());
          return;
        }

        run(appState);
      } catch (Exception e) {
        logger.error(e.getMessage(), e);
        if (appState != null) {
          appStatusChange(paragraph, appId, ApplicationState.Status.UNLOADED);
          appState.setOutput(e.getMessage());
        }
      }
    }

    private void run(final ApplicationState app) throws ApplicationException {
      synchronized (app) {
        if (app.getStatus() != ApplicationState.Status.LOADED) {
          throw new ApplicationException(
              "Can't run application status " + app.getStatus());
        }

        Interpreter intp = paragraph.getCurrentRepl();
        if (intp == null) {
          throw new ApplicationException("No interpreter found");
        }

        RemoteInterpreterProcess intpProcess =
            ((ManagedInterpreterGroup) intp.getInterpreterGroup()).getRemoteInterpreterProcess();
        if (intpProcess == null) {
          throw new ApplicationException("Target interpreter process is not running");
        }
        RemoteApplicationResult ret = intpProcess.callRemoteFunction(
            new RemoteInterpreterProcess.RemoteFunction<RemoteApplicationResult>() {
              @Override
              public RemoteApplicationResult call(RemoteInterpreterService.Client client)
                  throws Exception {
                return client.runApplication(app.getId());
              }
            }
        );
        if (ret.isSuccess()) {
          // success
        } else {
          throw new ApplicationException(ret.getMsg());
        }
      }
    }
  }

  @Override
  public void onOutputAppend(
      String noteId, String paragraphId, int index, String appId, String output) {
    ApplicationState appToUpdate = getAppState(noteId, paragraphId, appId);

    if (appToUpdate != null) {
      appToUpdate.appendOutput(output);
    } else {
      logger.error("Can't find app {}", appId);
    }

    if (applicationEventListener != null) {
      applicationEventListener.onOutputAppend(noteId, paragraphId, index, appId, output);
    }
  }

  @Override
  public void onOutputUpdated(
      String noteId, String paragraphId, int index, String appId,
      InterpreterResult.Type type, String output) {
    ApplicationState appToUpdate = getAppState(noteId, paragraphId, appId);

    if (appToUpdate != null) {
      appToUpdate.setOutput(output);
    } else {
      logger.error("Can't find app {}", appId);
    }

    if (applicationEventListener != null) {
      applicationEventListener.onOutputUpdated(noteId, paragraphId, index, appId, type, output);
    }
  }

  @Override
  public void onLoad(String noteId, String paragraphId, String appId, HeliumPackage pkg) {
    if (applicationEventListener != null) {
      applicationEventListener.onLoad(noteId, paragraphId, appId, pkg);
    }
  }

  @Override
  public void onStatusChange(String noteId, String paragraphId, String appId, String status) {
    ApplicationState appToUpdate = getAppState(noteId, paragraphId, appId);
    if (appToUpdate != null) {
      appToUpdate.setStatus(ApplicationState.Status.valueOf(status));
    }

    if (applicationEventListener != null) {
      applicationEventListener.onStatusChange(noteId, paragraphId, appId, status);
    }
  }

  private void appStatusChange(Paragraph paragraph,
                               String appId,
                               ApplicationState.Status status) {
    ApplicationState app = paragraph.getApplicationState(appId);
    app.setStatus(status);
    onStatusChange(paragraph.getNote().getId(), paragraph.getId(), appId, status.toString());
  }

  private ApplicationState getAppState(String noteId, String paragraphId, String appId) {
    if (notebook == null) {
      return null;
    }

    Note note = notebook.getNote(noteId);
    if (note == null) {
      logger.error("Can't get note {}", noteId);
      return null;
    }
    Paragraph paragraph = note.getParagraph(paragraphId);
    if (paragraph == null) {
      logger.error("Can't get paragraph {}", paragraphId);
      return null;
    }

    ApplicationState appFound = paragraph.getApplicationState(appId);

    return appFound;
  }

  public Notebook getNotebook() {
    return notebook;
  }

  public void setNotebook(Notebook notebook) {
    this.notebook = notebook;
  }

  public ApplicationEventListener getApplicationEventListener() {
    return applicationEventListener;
  }

  public void setApplicationEventListener(ApplicationEventListener applicationEventListener) {
    this.applicationEventListener = applicationEventListener;
  }

  @Override
  public void onNoteRemove(Note note) {
  }

  @Override
  public void onNoteCreate(Note note) {

  }

  @Override
  public void onUnbindInterpreter(Note note, InterpreterSetting setting) {
    for (Paragraph p : note.getParagraphs()) {
      Interpreter currentInterpreter = p.getCurrentRepl();
      List<InterpreterInfo> infos = setting.getInterpreterInfos();
      for (InterpreterInfo info : infos) {
        if (currentInterpreter != null &&
            info.getClassName().equals(currentInterpreter.getClassName())) {
          onParagraphRemove(p);
          break;
        }
      }
    }
  }

  @Override
  public void onParagraphRemove(Paragraph paragraph) {
    List<ApplicationState> appStates = paragraph.getAllApplicationStates();
    for (ApplicationState app : appStates) {
      UnloadApplication unloadJob = new UnloadApplication(paragraph, app.getId());
      unloadJob.run();
    }
  }

  @Override
  public void onParagraphCreate(Paragraph p) {

  }

  @Override
  public void onParagraphStatusChange(Paragraph p, Job.Status status) {
    if (status == Job.Status.FINISHED) {
      // refresh application
      List<ApplicationState> appStates = p.getAllApplicationStates();

      for (ApplicationState app : appStates) {
        loadAndRun(app.getHeliumPackage(), p);
      }
    }
  }
}
