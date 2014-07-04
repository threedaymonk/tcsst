#!/bin/sh
RETURN=0

cd $(dirname $0)

check_result() {
  ./run-test.js "$1"
  actual=$?
  expected=$2
  if [ $expected -eq $actual ]; then
    echo "*** OK ***"
  else
    echo "*** Not OK: expected $expected, got $actual ***"
    RETURN=1
  fi
  echo
}

echo "*** This should pass: ***"
check_result pass.html 0

echo "*** This should fail: ***"
check_result fail.html 1

echo "*** This should have an error: ***"
check_result error.html 1

echo "*** This should fail to load: ***"
check_result does-not-exist.html 2

exit $RETURN
