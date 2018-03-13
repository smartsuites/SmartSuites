#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Run Zeppelin 
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
