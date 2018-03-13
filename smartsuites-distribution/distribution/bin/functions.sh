#!/bin/bash
#
# Copyright (c) 2017. 联思智云（北京）科技有限公司. All rights reserved..
#

[ -z "${COLUMNS:-}" ] && COLUMNS=80

if [ -f /etc/sysconfig/i18n -a -z "${NOLOCALE:-}" -a -z "${LANGSH_SOURCED:-}" ]; then
  . /etc/profile.d/lang.sh 2>/dev/null
  unset LANGSH_SOURCED
fi

SET_OK=0
SET_ERROR=1
SET_WARNING=2
SET_PASSED=3

if [[ -z "${BOOTUP:-}" ]]; then
  if [[ -f /etc/sysconfig/init ]]; then
      . /etc/sysconfig/init
  else
    BOOTUP=color
    RES_COL=60
    MOVE_TO_COL="echo -en \\033[${RES_COL}G"
    SETCOLOR_SUCCESS="echo -en \\033[1;32m"
    SETCOLOR_FAILURE="echo -en \\033[1;31m"
    SETCOLOR_WARNING="echo -en \\033[1;33m"
    SETCOLOR_NORMAL="echo -en \\033[0;39m"
    SETCOLOR_INFO="echo -en \\033[0;34m"
    LOGLEVEL=1
  fi
  if [[ "$CONSOLETYPE" = "serial" ]]; then
      BOOTUP=serial
      MOVE_TO_COL=
      SETCOLOR_SUCCESS=
      SETCOLOR_FAILURE=
      SETCOLOR_WARNING=
      SETCOLOR_NORMAL=
  fi
fi


echo_success_msg() {
  [ "$BOOTUP" = "color" ] && $MOVE_TO_COL
  echo -n "["
  [ "$BOOTUP" = "color" ] && $SETCOLOR_SUCCESS
  echo -n $"  OK  "
  [ "$BOOTUP" = "color" ] && $SETCOLOR_NORMAL
  echo -n "]"
  echo -ne "\r"
  return 0
}

echo_failure_msg() {
  [ "$BOOTUP" = "color" ] && $MOVE_TO_COL
  echo -n "["
  [ "$BOOTUP" = "color" ] && $SETCOLOR_FAILURE
  echo -n $"FAILED"
  [ "$BOOTUP" = "color" ] && $SETCOLOR_NORMAL
  echo -n "]"
  echo -ne "\r"
  return 1
}

echo_passed_msg() {
  [ "$BOOTUP" = "color" ] && $MOVE_TO_COL
  echo -n "["
  [ "$BOOTUP" = "color" ] && $SETCOLOR_WARNING
  echo -n $"PASSED"
  [ "$BOOTUP" = "color" ] && $SETCOLOR_NORMAL
  echo -n "]"
  echo -ne "\r"
  return 1
}

echo_warning_msg() {
  [ "$BOOTUP" = "color" ] && $MOVE_TO_COL
  echo -n "["
  [ "$BOOTUP" = "color" ] && $SETCOLOR_WARNING
  echo -n $"WARNING"
  [ "$BOOTUP" = "color" ] && $SETCOLOR_NORMAL
  echo -n "]"
  echo -ne "\r"
  return 1
}

echo_info_msg() {
  [ "$BOOTUP" = "color" ] && $MOVE_TO_COL
  echo -n "["
  [ "$BOOTUP" = "color" ] && $SETCOLOR_INFO
  echo -n $"STARTED"
  [ "$BOOTUP" = "color" ] && $SETCOLOR_NORMAL
  echo -n "]"
  echo -ne "\r"
  return 1
}


# Log that something succeeded                                                                                                           
success_msg() {
  [ "$BOOTUP" != "verbose" -a -z "${LSB:-}" ] && echo_success_msg
  return 0
}

information_msg() {
  [ "$BOOTUP" != "verbose" -a -z "${LSB:-}" ] && echo_info_msg
  return 0
}

# Log that something failed                                                                                                              
failure_msg() {
  local rc=$?
  [ "$BOOTUP" != "verbose" -a -z "${LSB:-}" ] && echo_failure_msg
  [ -x /bin/plymouth ] && /bin/plymouth --details
  return $rc
}

passed_msg() {
  local rc=$?
  [ "$BOOTUP" != "verbose" -a -z "${LSB:-}" ] && echo_passed_msg
  return $rc
}

warning_msg() {
  local rc=$?
  [ "$BOOTUP" != "verbose" -a -z "${LSB:-}" ] && echo_warning_msg
  return $rc
}

action_msg() {
  local STRING rc ACT
  STRING=$1
  ACT=$2
  echo -n "$STRING "
  shift
  case $ACT in
      $SET_OK)
       success_msg $"$STRING"
      ;;
      $SET_ERROR)
      failure_msg $"$STRING" 
      ;;
      $SET_WARNING)
      warning_msg $"$STRING"
      ;;
      $SET_PASSED)
      passed_msg $"$STRING"
      ;;
      42)
      information_msg $"$STRING" 
      ;;
      *)
esac
  rc=$?
  echo
  return $rc
}
