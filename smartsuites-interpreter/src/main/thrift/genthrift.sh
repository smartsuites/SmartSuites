#!/bin/sh

rm -rf gen-java
rm -rf ../java/com/smartsuites/interpreter/thrift
thrift --gen java RemoteInterpreterService.thrift
for file in gen-java/com/smartsuites/interpreter/thrift/* ; do
  cat java_license_header.txt ${file} > ${file}.tmp
  mv -f ${file}.tmp ${file}
done
mv gen-java/com/smartsuites/interpreter/thrift ../java/com/smartsuites/interpreter/thrift
rm -rf gen-java
