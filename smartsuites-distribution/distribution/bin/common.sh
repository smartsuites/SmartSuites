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

if [ -L ${BASH_SOURCE-$0} ]; then
  FWDIR=$(dirname $(readlink "${BASH_SOURCE-$0}"))
else
  FWDIR=$(dirname "${BASH_SOURCE-$0}")
fi

# 设置HOME地址
if [[ -z "${SMARTSUITES_HOME}" ]]; then
  # Make SMARTSUITES_HOME look cleaner in logs by getting rid of the
  # extra ../
  export SMARTSUITES_HOME="$(cd "${FWDIR}/.."; pwd)"
fi

# 设置conf目录
if [[ -z "${SMARTSUITES_CONF_DIR}" ]]; then
  export SMARTSUITES_CONF_DIR="${SMARTSUITES_HOME}/conf"
fi

# 设置logs目录
if [[ -z "${SMARTSUITES_LOG_DIR}" ]]; then
  export SMARTSUITES_LOG_DIR="${SMARTSUITES_HOME}/logs"
fi

# 设置pid存放目录
if [[ -z "$SMARTSUITES_PID_DIR" ]]; then
  export SMARTSUITES_PID_DIR="${SMARTSUITES_HOME}/run"
fi

# 查找war包路径
if [[ -z "${SMARTSUITES_WAR}" ]]; then
  if [[ -d "${SMARTSUITES_HOME}/smartsuites-web/dist" ]]; then
    export SMARTSUITES_WAR="${SMARTSUITES_HOME}/smartsuites-web/dist"
  else
    export SMARTSUITES_WAR=$(find -L "${SMARTSUITES_HOME}" -name "smartsuites-web*.war")
  fi
fi

# 查找 smartsuites-env.sh 并加载
if [[ -f "${SMARTSUITES_CONF_DIR}/smartsuites-env.sh" ]]; then
  . "${SMARTSUITES_CONF_DIR}/smartsuites-env.sh"
fi

# 将conf目录加入到类路径
SMARTSUITES_CLASSPATH+=":${SMARTSUITES_CONF_DIR}"

# 将文件夹下的所有jar包加入类路径
function addEachJarInDir(){
  if [[ -d "${1}" ]]; then
    for jar in $(find -L "${1}" -maxdepth 1 -name '*jar'); do
      SMARTSUITES_CLASSPATH="$jar:$SMARTSUITES_CLASSPATH"
    done
  fi
}

# 递归将文件夹下的所有jar包加入类路径
function addEachJarInDirRecursive(){
  if [[ -d "${1}" ]]; then
    for jar in $(find -L "${1}" -type f -name '*jar'); do
      SMARTSUITES_CLASSPATH="$jar:$SMARTSUITES_CLASSPATH"
    done
  fi
}

# 递归将文件夹下的所有jar包加入解析器的类路径
function addEachJarInDirRecursiveForIntp(){
  if [[ -d "${1}" ]]; then
    for jar in $(find -L "${1}" -type f -name '*jar'); do
      SMARTSUITES_INTP_CLASSPATH="$jar:$SMARTSUITES_INTP_CLASSPATH"
    done
  fi
}

# 将单个jar包加入类路径
function addJarInDir(){
  if [[ -d "${1}" ]]; then
    SMARTSUITES_CLASSPATH="${1}/*:${SMARTSUITES_CLASSPATH}"
  fi
}

# 将单个jar包加入解析器的类路径
function addJarInDirForIntp() {
  if [[ -d "${1}" ]]; then
    SMARTSUITES_INTP_CLASSPATH="${1}/*:${SMARTSUITES_INTP_CLASSPATH}"
  fi
}

# 平台命令行主类
SMARTSUITES_COMMANDLINE_MAIN=com.smartsuites.utils.CommandLineUtils

# 获取平台的版本信息
function getSmartsuitesVersion(){
    if [[ -d "${SMARTSUITES_HOME}/smartsuites-server/target/classes" ]]; then
      SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-server/target/classes"
    fi
    addJarInDir "${SMARTSUITES_HOME}/smartsuites-server/target/lib"
    CLASSPATH+=":${SMARTSUITES_CLASSPATH}"
    $SMARTSUITES_RUNNER -cp $CLASSPATH $SMARTSUITES_COMMANDLINE_MAIN -v
    exit 0
}

# Text encoding for 
# read/write job into files,
# receiving/displaying query/result.
if [[ -z "${SMARTSUITES_ENCODING}" ]]; then
  export SMARTSUITES_ENCODING="UTF-8"
fi

# 平台JVM的内存大小
if [[ -z "${SMARTSUITES_MEM}" ]]; then
  export SMARTSUITES_MEM="-Xms1024m -Xmx1024m -XX:MaxPermSize=512m"
fi

# 每个解析器JVM的内存大小
if [[ -z "${SMARTSUITES_INTP_MEM}" ]]; then
  export SMARTSUITES_INTP_MEM="-Xms1024m -Xmx1024m -XX:MaxPermSize=512m"
fi

# 设置JVM OPS
JAVA_OPTS+=" ${SMARTSUITES_JAVA_OPTS} -Dfile.encoding=${SMARTSUITES_ENCODING} ${SMARTSUITES_MEM}"
JAVA_OPTS+=" -Dlog4j.configuration=file://${SMARTSUITES_CONF_DIR}/log4j.properties"
export JAVA_OPTS

# 设置解析器JVM的OPS
JAVA_INTP_OPTS="${SMARTSUITES_INTP_JAVA_OPTS} -Dfile.encoding=${SMARTSUITES_ENCODING}"
if [[ -z "${SMARTSUITES_SPARK_YARN_CLUSTER}" ]]; then
    JAVA_INTP_OPTS+=" -Dlog4j.configuration=file://${SMARTSUITES_CONF_DIR}/log4j.properties"
else
    JAVA_INTP_OPTS+=" -Dlog4j.configuration=log4j_yarn_cluster.properties"
fi
export JAVA_INTP_OPTS

# 设置java地址
if [[ -n "${JAVA_HOME}" ]]; then
  SMARTSUITES_RUNNER="${JAVA_HOME}/bin/java"
else
  SMARTSUITES_RUNNER=java
fi
export SMARTSUITES_RUNNER

if [[ -z "$SMARTSUITES_IDENT_STRING" ]]; then
  export SMARTSUITES_IDENT_STRING="${USER}"
fi

# 启动解析器JVM的脚本
if [[ -z "$SMARTSUITES_INTERPRETER_REMOTE_RUNNER" ]]; then
  export SMARTSUITES_INTERPRETER_REMOTE_RUNNER="bin/interpreter.sh"
fi