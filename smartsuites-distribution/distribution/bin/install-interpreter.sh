#!/bin/bash
#
# Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
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
