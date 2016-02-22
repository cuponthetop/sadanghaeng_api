#!/bin/bash
set -e

is_auth_cloned=false
is_api_cloned=false

if test -d sadanghaeng_auth ; then
    is_auth_cloned=true
fi

if test -d sadanghaeng_auth ; then
    is_api_cloned=true
fi

run_cmd() {
    if $verbose ; then
        "$@"
    else
        "$@" 2> /dev/null
    fi
}

setup_repo() {
  if $is_auth_cloned ; then
    run_cmd rm -rf "$(pwd)"/sadanghaeng_auth
  fi
  
  run_cmd git clone https://github.com/cuponthetop/sadanghaeng_auth.git
    
  if $is_api_cloned ; then
    run_cmd rm -rf "$(pwd)"/sadanghaeng_api
  fi
  
  run_cmd git clone https://github.com/cuponthetop/sadanghaeng_api.git
  
}

setup_npm() {
  
  run_cmd cd sadanghaeng_auth
  run_cmd npm install
  run_cmd cd ..
  
  
  run_cmd cd sadanghaeng_api
  run_cmd npm install
  run_cmd cd ..
  
}

setup_data() {
  run_cmd node sadanghaeng_auth/test/init/test-init.js
  run_cmd node sadanghaeng_api/test/init/test-init.js
}

deploy_server() {
  run_cmd node sadanghaeng_auth/lib/server/server.js &
  run_cmd node sadanghaeng_api/lib/server/server.js &
}

setup_repo

setup_npm

deploy_server