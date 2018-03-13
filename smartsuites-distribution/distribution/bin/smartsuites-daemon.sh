#!/bin/bash
#
# Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved.
#

USAGE="-e Usage: smartsuites-daemon.sh\n\t
        [--config <conf-dir>] {start|stop|upstart|restart|reload|status}\n\t
        [--version | -v]"

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

if [ -L ${BASH_SOURCE-$0} ]; then
  BIN=$(dirname $(readlink "${BASH_SOURCE-$0}"))
else
  BIN=$(dirname ${BASH_SOURCE-$0})
fi
BIN=$(cd "${BIN}">/dev/null; pwd)

. "${BIN}/common.sh"
. "${BIN}/functions.sh"

HOSTNAME=$(hostname)
SMARTSUITES_NAME="SmartSuites"
SMARTSUITES_LOGFILE="${SMARTSUITES_LOG_DIR}/smartsuites-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.log"
SMARTSUITES_OUTFILE="${SMARTSUITES_LOG_DIR}/smartsuites-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.out"
SMARTSUITES_PID="${SMARTSUITES_PID_DIR}/smartsuites-${SMARTSUITES_IDENT_STRING}-${HOSTNAME}.pid"
SMARTSUITES_MAIN=com.smartsuites.server.SmartsuitesServer
JAVA_OPTS+=" -Dzeppelin.log.file=${SMARTSUITES_LOGFILE}"

# construct classpath
if [[ -d "${SMARTSUITES_HOME}/smartsuites-interpreter/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-interpreter/target/classes"
fi

if [[ -d "${SMARTSUITES_HOME}/smartsuites-engine/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-engine/target/classes"
fi

if [[ -d "${SMARTSUITES_HOME}/smartsuites-server/target/classes" ]]; then
  SMARTSUITES_CLASSPATH+=":${SMARTSUITES_HOME}/smartsuites-server/target/classes"
fi

if [[ -n "${HADOOP_CONF_DIR}" ]] && [[ -d "${HADOOP_CONF_DIR}" ]]; then
  SMARTSUITES_CLASSPATH+=":${HADOOP_CONF_DIR}"
fi

# Add jdbc connector jar
# ZEPPELIN_CLASSPATH+=":${ZEPPELIN_HOME}/jdbc/jars/jdbc-connector-jar"

addJarInDir "${SMARTSUITES_HOME}"
addJarInDir "${SMARTSUITES_HOME}/lib"
addJarInDir "${SMARTSUITES_HOME}/lib/interpreter"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-interpreter/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-engine/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-server/target/lib"
addJarInDir "${SMARTSUITES_HOME}/smartsuites-web/target/lib"

CLASSPATH+=":${SMARTSUITES_CLASSPATH}"

if [[ "${SMARTSUITES_NICENESS}" = "" ]]; then
    export SMARTSUITES_NICENESS=0
fi

function initialize_default_directories() {
  if [[ ! -d "${SMARTSUITES_LOG_DIR}" ]]; then
    echo "Log dir doesn't exist, create ${SMARTSUITES_LOG_DIR}"
    $(mkdir -p "${SMARTSUITES_LOG_DIR}")
  fi

  if [[ ! -d "${SMARTSUITES_PID_DIR}" ]]; then
    echo "Pid dir doesn't exist, create ${SMARTSUITES_PID_DIR}"
    $(mkdir -p "${SMARTSUITES_PID_DIR}")
  fi
}

function wait_for_smartsuites_to_die() {
  local pid
  local count
  pid=$1
  timeout=$2
  count=0
  timeoutTime=$(date "+%s")
  let "timeoutTime+=$timeout"
  currentTime=$(date "+%s")
  forceKill=1

  while [[ $currentTime -lt $timeoutTime ]]; do
    $(kill ${pid} > /dev/null 2> /dev/null)
    if kill -0 ${pid} > /dev/null 2>&1; then
      sleep 3
    else
      forceKill=0
      break
    fi
    currentTime=$(date "+%s")
  done

  if [[ forceKill -ne 0 ]]; then
    $(kill -9 ${pid} > /dev/null 2> /dev/null)
  fi
}

function wait_smartsuites_is_up_for_ci() {
  if [[ "${CI}" == "true" ]]; then
    local count=0;
    while [[ "${count}" -lt 30 ]]; do
      curl -v localhost:8080 2>&1 | grep '200 OK'
      if [[ $? -ne 0 ]]; then
        sleep 1
        continue
      else
        break
      fi
        let "count+=1"
    done
  fi
}

function print_log_for_ci() {
  if [[ "${CI}" == "true" ]]; then
    tail -1000 "${SMARTSUITES_LOGFILE}" | sed 's/^/  /'
  fi
}

function check_if_process_is_alive() {
  local pid
  pid=$(cat ${SMARTSUITES_PID})
  if ! kill -0 ${pid} >/dev/null 2>&1; then
    action_msg "${SMARTSUITES_NAME} process died" "${SET_ERROR}"
    print_log_for_ci
    return 1
  fi
}

function upstart() {

  # upstart() allows zeppelin to be run and managed as a service
  # for example, this could be called from an upstart script in /etc/init
  # where the service manager starts and stops the process
  initialize_default_directories

  echo "SMARTSUITES_CLASSPATH: ${SMARTSUITES_CLASSPATH_OVERRIDES}:${CLASSPATH}" >> "${SMARTSUITES_OUTFILE}"

  $SMARTSUITES_RUNNER $JAVA_OPTS -cp $SMARTSUITES_CLASSPATH_OVERRIDES:$CLASSPATH $SMARTSUITES_MAIN >> "${SMARTSUITES_OUTFILE}"
}

function start() {
  local pid

  if [[ -f "${SMARTSUITES_PID}" ]]; then
    pid=$(cat ${SMARTSUITES_PID})
    if kill -0 ${pid} >/dev/null 2>&1; then
      echo "${SMARTSUITES_NAME} is already running"
      return 0;
    fi
  fi

  initialize_default_directories

  echo "SMARTSUITES_CLASSPATH: ${SMARTSUITES_CLASSPATH_OVERRIDES}:${CLASSPATH}" >> "${SMARTSUITES_OUTFILE}"

  nohup nice -n $SMARTSUITES_NICENESS $SMARTSUITES_RUNNER $JAVA_OPTS -cp $SMARTSUITES_CLASSPATH_OVERRIDES:$CLASSPATH $SMARTSUITES_MAIN >> "${SMARTSUITES_OUTFILE}" 2>&1 < /dev/null &
  pid=$!
  if [[ -z "${pid}" ]]; then
    action_msg "${SMARTSUITES_NAME} start" "${SET_ERROR}"
    return 1;
  else
    action_msg "${SMARTSUITES_NAME} start" "${SET_OK}"
    echo ${pid} > ${SMARTSUITES_PID}
  fi

  wait_smartsuites_is_up_for_ci
  sleep 2
  check_if_process_is_alive
}

function stop() {
  local pid

  # zeppelin daemon kill
  if [[ ! -f "${SMARTSUITES_PID}" ]]; then
    echo "${SMARTSUITES_NAME} is not running"
  else
    pid=$(cat ${SMARTSUITES_PID})
    if [[ -z "${pid}" ]]; then
      echo "${SMARTSUITES_NAME} is not running"
    else
      wait_for_smartsuites_to_die $pid 40
      $(rm -f ${SMARTSUITES_PID})
      action_msg "${SMARTSUITES_NAME} stop" "${SET_OK}"
    fi
  fi

  # list all pid that used in remote interpreter and kill them
  for f in ${SMARTSUITES_PID_DIR}/*.pid; do
    if [[ ! -f ${f} ]]; then
      continue;
    fi

    pid=$(cat ${f})
    wait_for_smartsuites_to_die $pid 20
    $(rm -f ${f})
  done

}

function find_smartsuites_process() {
  local pid

  if [[ -f "${SMARTSUITES_PID}" ]]; then
    pid=$(cat ${SMARTSUITES_PID})
    if ! kill -0 ${pid} > /dev/null 2>&1; then
      action_msg "${SMARTSUITES_NAME} running but process is dead" "${SET_ERROR}"
      return 1
    else
      action_msg "${SMARTSUITES_NAME} is running" "${SET_OK}"
    fi
  else
    action_msg "${SMARTSUITES_NAME} is not running" "${SET_ERROR}"
    return 1
  fi
}

case "${1}" in
  start)
    start
    ;;
  stop)
    stop
    ;;
  upstart)
    upstart
    ;;
  reload)
    stop
    start
    ;;
  restart)
    echo "${SMARTSUITES_NAME} is restarting" >> "${SMARTSUITES_OUTFILE}"
    stop
    start
    ;;
  status)
    find_smartsuites_process
    ;;
  -v | --version)
    getSmartsuitesVersion
    ;;
  *)
    echo ${USAGE}
esac
