#!/bin/bash
# Prevents force-pushing to master

if $ALLOW_FORCE_PUSH; then
    exit 0
fi

BRANCH=`git rev-parse --abbrev-ref HEAD`
PUSH_COMMAND=`ps -ocommand= -p $PPID`
PROTECTED_BRANCHES="^(master)"
FORCE_PUSH="force|delete|-f"

# change to gh-pages branch
`git checkout gh-pages`

apidoc="./node_modules/.bin/apidoc"

out=$($apidoc -i lib/route/v1/ -o apidoc/ 2>&1)
status=$?
if [ "$status" != "0" ]; then
    `git checkout $BRANCH`
    echo "$out"
    exit $status
fi

`git add apidoc`

`git commit -m "api doc update"`

`git push origin gh-pages`

# change to original branch
`git checkout $BRANCH`
echo "test"

if [[ "$BRANCH" =~ $PROTECTED_BRANCHES && "$PUSH_COMMAND" =~ $FORCE_PUSH ]]; then
  echo "Prevented force-push to protected branch \"$BRANCH\" by pre-push hook"
  exit 1
fi

exit 0