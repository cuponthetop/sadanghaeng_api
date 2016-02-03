#!/bin/sh
set +e
echo "Linting..."
gulp="./node_modules/.bin/gulp"
out=$($gulp lint 2>&1)
status=$?
if [ "$status" != "0" ]; then
    echo "$out"
    exit $status
fi
echo "Running unit tests..."
mocha="./node_modules/.bin/mocha"
out=$($mocha --recursive test/unit/ 2>&1)
status=$?
if [ "$status" != "0" ]; then
    echo "$out"
    exit $status
fi
