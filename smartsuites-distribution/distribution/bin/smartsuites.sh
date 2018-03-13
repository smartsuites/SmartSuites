#!/bin/bash
#
# Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
#

USAGE="Usage: bin/smartsuites.sh [--config <conf-dir>]"

if [[ "$1" == "--config" ]]; then
  shift
  conf_dir="$1"
  if [[ ! -d "${conf_dir}" ]]; then
    echo "ERROR : ${conf_dir} is not a directory"
    echo ${USAGE}
    exit 1
  else
    export SMARTSUITES_CONF_DIR="${conf_dir}"
  fi
  shift
fi

bin=$(dirname "${BASH_SOURCE-$0}")
bin=$(cd "${bin}">/dev/null; pwd)

. "${bin}/common.sh"

if [ "$1" == "--version" ] || [ "$1" == "-v" ]; then
    getSmartsuitesVersion
fi

HOSTNAME=$(hostname)
SMARTSUITES_LOGFILE="${SMARTSUITES_LOG_DIR}/zeppelin-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.log"
LOG="${SMARTSUITES_LOG_DIR}/smartsuites-cli-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.out"
  
SMARTSUITES_SERVER=com.smartsuites.server.SmartsuitesServer
JAVA_OPTS+=" -Dzeppelin.log.file=${SMARTSUITES_LOGFILE}"

# construct classpath
if [[ -d "${SMARTSUITES_HOME}/smartsuites-interpreter/target/classes" ]]; then
  ZEPPELIN_CLASSPATH+=":${ZEPPELIN_HOME}/smartsuites-interpreter/target/classes"
fi

if [[ -d "${SMARTSUITES_HOME}/smartsuites-engine/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-engine/target/classes"
fi

if [[ -d "${SMARTSUITES_HOME}/smartsuites-server/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-server/target/classes"
fi

addJarInDir "${SMARTSUITES_HOME}"
addJarInDir "${SMARTSUITES_HOME}/lib"
addJarInDir "${SMARTSUITES_HOME}/lib/interpreter"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-interpreter/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-engine/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-server/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-web/target/lib"

SMARTSUITES_CLASSPATH="$CLASSPATH:$SMARTSUITES_CLASSPATH"

if [[ -n "${HADOOP_CONF_DIR}" ]] && [[ -d "${HADOOP_CONF_DIR}" ]]; then
  SMARTSUITES_CLASSPATH+=":${HADOOP_CONF_DIR}"
fi

if [[ ! -d "${SMARTSUITES_LOG_DIR}" ]]; then
  echo "Log dir doesn't exist, create ${SMARTSUITES_LOG_DIR}"
  $(mkdir -p "${SMARTSUITES_LOG_DIR}")
fi

if [[ ! -d "${SMARTSUITES_PID_DIR}" ]]; then
  echo "Pid dir doesn't exist, create ${SMARTSUITES_PID_DIR}"
  $(mkdir -p "${SMARTSUITES_PID_DIR}")
fi

exec $SMARTSUITES_RUNNER $JAVA_OPTS -cp $SMARTSUITES_CLASSPATH_OVERRIDES:${SMARTSUITES_CLASSPATH} $SMARTSUITES_SERVER "$@"
