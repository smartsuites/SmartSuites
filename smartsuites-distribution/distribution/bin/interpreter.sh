#!/bin/bash
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

bin=$(dirname "${BASH_SOURCE-$0}")
bin=$(cd "${bin}">/dev/null; pwd)

function usage() {
    echo "usage) $0 -p <port> -d <interpreter dir to load> -l <local interpreter repo dir to load> -g <interpreter group name>"
}

while getopts "hc:p:d:l:v:u:g:" o; do
    case ${o} in
        h)
            usage
            exit 0
            ;;
        d)
            INTERPRETER_DIR=${OPTARG}
            ;;
        c)
            CALLBACK_HOST=${OPTARG} # This will be used callback host
            ;;
        p)
            PORT=${OPTARG} # This will be used callback port
            ;;
        l)
            LOCAL_INTERPRETER_REPO=${OPTARG}
            ;;
        v)
            . "${bin}/common.sh"
            getSmartsuitesVersion
            ;;
        u)
            SMARTSUITES_IMPERSONATE_USER="${OPTARG}"
            if [[ -z "$SMARTSUITES_IMPERSONATE_CMD" ]]; then
              SMARTSUITES_IMPERSONATE_RUN_CMD=`echo "ssh ${SMARTSUITES_IMPERSONATE_USER}@localhost" `
            else
              SMARTSUITES_IMPERSONATE_RUN_CMD=$(eval "echo ${SMARTSUITES_IMPERSONATE_CMD} ")
            fi
            ;;
        g)
            INTERPRETER_GROUP_NAME=${OPTARG}
            ;;
        esac
done

if [ -z "${PORT}" ] || [ -z "${INTERPRETER_DIR}" ]; then
    usage
    exit 1
fi

. "${bin}/common.sh"

# 解析器JVM类路径
SMARTSUITES_INTP_CLASSPATH="${CLASSPATH}"

addJarInDirForIntp "${SMARTSUITES_HOME}/lib/interpreter"
addJarInDirForIntp "${INTERPRETER_DIR}"

HOSTNAME=$(hostname)
SMARTSUITES_SERVER=com.smartsuites.interpreter.remote.RemoteInterpreterServer

INTERPRETER_ID=$(basename "${INTERPRETER_DIR}")
SMARTSUITES_PID="${SMARTSUITES_PID_DIR}/smartsuites-interpreter-${INTERPRETER_ID}-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.pid"
SMARTSUITES_LOGFILE="${SMARTSUITES_LOG_DIR}/smartsuites-interpreter-"
if [[ ! -z "$INTERPRETER_GROUP_NAME" ]]; then
    SMARTSUITES_LOGFILE+="${INTERPRETER_GROUP_NAME}-"
fi
if [[ ! -z "$SMARTSUITES_IMPERSONATE_USER" ]]; then
    SMARTSUITES_LOGFILE+="${SMARTSUITES_IMPERSONATE_USER}-"
fi
SMARTSUITES_LOGFILE+="${INTERPRETER_ID}-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.log"

# 设置LOG
JAVA_INTP_OPTS+=" -Dzeppelin.log.file=${SMARTSUITES_LOGFILE}"

# 创建LOG目录
if [[ ! -d "${SMARTSUITES_LOG_DIR}" ]]; then
  echo "Log dir doesn't exist, create ${SMARTSUITES_LOG_DIR}"
  $(mkdir -p "${SMARTSUITES_LOG_DIR}")
fi

# set spark related env variables
if [[ "${INTERPRETER_ID}" == "spark" ]]; then
  if [[ -n "${SPARK_HOME}" ]]; then
    export SPARK_SUBMIT="${SPARK_HOME}/bin/spark-submit"
    SPARK_APP_JAR="$(ls ${SMARTSUITES_HOME}/interpreter/spark/zeppelin-spark*.jar)"
    # This will evantually passes SPARK_APP_JAR to classpath of SparkIMain
    SMARTSUITES_INTP_CLASSPATH+=":${SPARK_APP_JAR}"

    pattern="$SPARK_HOME/python/lib/py4j-*-src.zip"
    py4j=($pattern)
    # pick the first match py4j zip - there should only be one
    export PYTHONPATH="$SPARK_HOME/python/:$PYTHONPATH"
    export PYTHONPATH="${py4j[0]}:$PYTHONPATH"
  else
    # add Hadoop jars into classpath
    if [[ -n "${HADOOP_HOME}" ]]; then
      # Apache
      addEachJarInDirRecursiveForIntp "${HADOOP_HOME}/share"

      # CDH
      addJarInDirForIntp "${HADOOP_HOME}"
      addJarInDirForIntp "${HADOOP_HOME}/lib"
    fi

    addJarInDirForIntp "${INTERPRETER_DIR}/dep"

    pattern="${SMARTSUITES_HOME}/interpreter/spark/pyspark/py4j-*-src.zip"
    py4j=($pattern)
    # pick the first match py4j zip - there should only be one
    PYSPARKPATH="${SMARTSUITES_HOME}/interpreter/spark/pyspark/pyspark.zip:${py4j[0]}"

    if [[ -z "${PYTHONPATH}" ]]; then
      export PYTHONPATH="${PYSPARKPATH}"
    else
      export PYTHONPATH="${PYTHONPATH}:${PYSPARKPATH}"
    fi
    unset PYSPARKPATH
    export SPARK_CLASSPATH+=":${SMARTSUITES_INTP_CLASSPATH}"
  fi

  if [[ -n "${HADOOP_CONF_DIR}" ]] && [[ -d "${HADOOP_CONF_DIR}" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":${HADOOP_CONF_DIR}"
    export HADOOP_CONF_DIR=${HADOOP_CONF_DIR}
  else
    # autodetect HADOOP_CONF_HOME by heuristic
    if [[ -n "${HADOOP_HOME}" ]] && [[ -z "${HADOOP_CONF_DIR}" ]]; then
      if [[ -d "${HADOOP_HOME}/etc/hadoop" ]]; then
        export HADOOP_CONF_DIR="${HADOOP_HOME}/etc/hadoop"
      elif [[ -d "/etc/hadoop/conf" ]]; then
        export HADOOP_CONF_DIR="/etc/hadoop/conf"
      fi
    fi
  fi

elif [[ "${INTERPRETER_ID}" == "hbase" ]]; then
  if [[ -n "${HBASE_CONF_DIR}" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":${HBASE_CONF_DIR}"
  elif [[ -n "${HBASE_HOME}" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":${HBASE_HOME}/conf"
  else
    echo "HBASE_HOME and HBASE_CONF_DIR are not set, configuration might not be loaded"
  fi
elif [[ "${INTERPRETER_ID}" == "pig" ]]; then
   # autodetect HADOOP_CONF_HOME by heuristic
  if [[ -n "${HADOOP_HOME}" ]] && [[ -z "${HADOOP_CONF_DIR}" ]]; then
    if [[ -d "${HADOOP_HOME}/etc/hadoop" ]]; then
      export HADOOP_CONF_DIR="${HADOOP_HOME}/etc/hadoop"
    elif [[ -d "/etc/hadoop/conf" ]]; then
      export HADOOP_CONF_DIR="/etc/hadoop/conf"
    fi
  fi

  if [[ -n "${HADOOP_CONF_DIR}" ]] && [[ -d "${HADOOP_CONF_DIR}" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":${HADOOP_CONF_DIR}"
  fi

  # autodetect TEZ_CONF_DIR
  if [[ -n "${TEZ_CONF_DIR}" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":${TEZ_CONF_DIR}"
  elif [[ -d "/etc/tez/conf" ]]; then
    SMARTSUITES_INTP_CLASSPATH+=":/etc/tez/conf"
  else
    echo "TEZ_CONF_DIR is not set, configuration might not be loaded"
  fi
fi

addJarInDirForIntp "${LOCAL_INTERPRETER_REPO}"

if [[ ! -z "$SMARTSUITES_IMPERSONATE_USER" ]]; then
    suid="$(id -u ${SMARTSUITES_IMPERSONATE_USER})"
    if [[ -n  "${suid}" || -z "${SPARK_SUBMIT}" ]]; then
       INTERPRETER_RUN_COMMAND=${SMARTSUITES_IMPERSONATE_RUN_CMD}" '"
       if [[ -f "${SMARTSUITES_CONF_DIR}/smartsuites-env.sh" ]]; then
           INTERPRETER_RUN_COMMAND+=" source "${SMARTSUITES_CONF_DIR}'/smartsuites-env.sh;'
       fi
    fi
fi

if [[ -n "${SPARK_SUBMIT}" ]]; then
    if [[ -n "$SMARTSUITES_IMPERSONATE_USER" ]] && [[ "$SMARTSUITES_IMPERSONATE_SPARK_PROXY_USER" != "false" ]];  then
       INTERPRETER_RUN_COMMAND+=' '` echo ${SPARK_SUBMIT} --class ${SMARTSUITES_SERVER} --driver-class-path \"${SMARTSUITES_INTP_CLASSPATH_OVERRIDES}:${SMARTSUITES_INTP_CLASSPATH}\" --driver-java-options \"${JAVA_INTP_OPTS}\" ${SPARK_SUBMIT_OPTIONS} ${SMARTSUITES_SPARK_CONF} --proxy-user ${SMARTSUITES_IMPERSONATE_USER} ${SPARK_APP_JAR} ${CALLBACK_HOST} ${PORT}`
    else
       INTERPRETER_RUN_COMMAND+=' '` echo ${SPARK_SUBMIT} --class ${SMARTSUITES_SERVER} --driver-class-path \"${SMARTSUITES_INTP_CLASSPATH_OVERRIDES}:${SMARTSUITES_INTP_CLASSPATH}\" --driver-java-options \"${JAVA_INTP_OPTS}\" ${SPARK_SUBMIT_OPTIONS} ${SMARTSUITES_SPARK_CONF} ${SPARK_APP_JAR} ${CALLBACK_HOST} ${PORT}`
    fi
else
    INTERPRETER_RUN_COMMAND+=' '` echo ${SMARTSUITES_RUNNER} ${JAVA_INTP_OPTS} ${SMARTSUITES_INTP_MEM} -cp ${SMARTSUITES_INTP_CLASSPATH_OVERRIDES}:${SMARTSUITES_INTP_CLASSPATH} ${SMARTSUITES_SERVER} ${CALLBACK_HOST} ${PORT} `
fi

echo $INTERPRETER_RUN_COMMAND

if [[ ! -z "$SMARTSUITES_IMPERSONATE_USER" ]] && [[ -n "${suid}" || -z "${SPARK_SUBMIT}" ]]; then
    INTERPRETER_RUN_COMMAND+="'"
fi

eval $INTERPRETER_RUN_COMMAND &

pid=$!
if [[ -z "${pid}" ]]; then
  exit 1;
else
  echo ${pid} > ${SMARTSUITES_PID}
fi


trap 'shutdown_hook;' SIGTERM SIGINT SIGQUIT
function shutdown_hook() {
  local count
  count=0
  while [[ "${count}" -lt 10 ]]; do
    $(kill ${pid} > /dev/null 2> /dev/null)
    if kill -0 ${pid} > /dev/null 2>&1; then
      sleep 3
      let "count+=1"
    else
      rm -f "${SMARTSUITES_PID}"
      break
    fi
  if [[ "${count}" == "5" ]]; then
    $(kill -9 ${pid} > /dev/null 2> /dev/null)
    rm -f "${SMARTSUITES_PID}"
  fi
  done
}

wait
