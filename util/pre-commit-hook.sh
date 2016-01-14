#!/bin/sh
set +e
echo "Linting..."
out=$($gulp lint 2>&1)
status=$?
if [ "$status" != "0" ]; then
    echo "$out"
    exit $status
fi
echo "Running unit tests..."
mocha=mocha
out=$($mocha --recursive test/unit/ 2>&1)
status=$?
if [ "$status" != "0" ]; then
    echo "$out"
    exit $status
fi