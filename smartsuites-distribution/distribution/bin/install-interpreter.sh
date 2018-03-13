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

bin=$(dirname "${BASH_SOURCE-$0}")
bin=$(cd "${bin}">/dev/null; pwd)

. "${bin}/common.sh"

# 安装解析器的主入口
SMARTSUITES_INSTALL_INTERPRETER_MAIN=com.smartsuites.interpreter.install.InstallInterpreter
SMARTSUITES_LOGFILE="${SMARTSUITES_LOG_DIR}/install-interpreter.log"
JAVA_OPTS+=" -Dzeppelin.log.file=${SMARTSUITES_LOGFILE}"

if [[ -d "${SMARTSUITES_HOME}/smartsuites-engine/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-engine/target/classes"
fi
addJarInDir "${SMARTSUITES_HOME}/smartsuites-server/target/lib"

if [[ -d "${SMARTSUITES_HOME}/smartsuites-interpreter/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-interpreter/target/classes"
fi
addJarInDir "${SMARTSUITES_HOME}/smartsuites-interpreter/target/lib"

addJarInDir "${SMARTSUITES_HOME}/lib"
addJarInDir "${SMARTSUITES_HOME}/lib/interpreter"

CLASSPATH+=":${SMARTSUITES_CLASSPATH}"
$SMARTSUITES_RUNNER $JAVA_OPTS -cp $CLASSPATH $SMARTSUITES_INSTALL_INTERPRETER_MAIN ${@}
