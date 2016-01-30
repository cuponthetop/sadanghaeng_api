#!/bin/bash
set -e

setup_successful=false
verbose=false

if test -d .git ; then
    is_git_checkout=true
else
    is_git_checkout=false
fi

while test $# != 0
do
    case "$1" in
        "-v") verbose=true;;
        "--verbose") verbose=true;;
    esac

    if [[ -n "$2" ]] && [[ "$2" != --* ]]; then
        shift
        shift
    else
        shift
    fi
done

run_cmd_output() {
    if $verbose ; then
        "$@"
    else
        "$@" 2> /dev/null
    fi
}

echo "* Determining platform"
if [ $(run_cmd_output uname -s) == "Darwin" ]; then
    platform="mac"
else
    platform="linux"
fi
echo "* Platform is $platform"

run_cmd() {
    if $verbose ; then
        "$@"
    else
        "$@" >/dev/null 2>&1
    fi
}

setup_npm() {
    echo "* Installing new or updated NPM modules (including devDeps)"
    run_cmd npm install .
    run_cmd npm install --dev
}

setup_general() {
    echo "SETTING GENERAL"
    
    if $is_git_checkout ; then
        echo "* Linking git hooks"
        run_cmd rm -rf "$(pwd)"/.git/hooks/pre-commit
        run_cmd rm -rf "$(pwd)"/.git/hooks/pre-push

        run_cmd ln -sf "$(pwd)"/util/pre-commit-hook.sh "$(pwd)"/.git/hooks/pre-commit
        run_cmd ln -sf "$(pwd)"/util/pre-push-hook.sh "$(pwd)"/.git/hooks/pre-push
    else
        echo "* Nothing to do, not a git repo"
    fi
}

main() {
    echo "---- setting up / Initializing ----"

    setup_npm
    setup_general

    setup_successful=true
}

on_exit() {
    if $setup_successful ; then
        echo "---- setup.sh completed successfully ----"
    else
        echo "---- FAILURE: setup.sh exited with status $? ----"
        if ! $verbose ; then
            echo "---- Retry with --verbose to see errors ----"
        fi
    fi
}

trap on_exit EXIT
main