# API Server for 사당행


## 디렉토리 및 파일 설명

```
lib/          ... API 서버 관련 실제 코드들
  model/      ... mongodb 관련 mongoose 모델
  route/      ... API 서버의 API 라우팅 관련 로직 
  server/     ... API 서버의 로직
test/         ... 테스트 코드가 들어갈 부분
util/         ... pre-commit-hook, pre-push-hook 등 유틸리티

.gitignore    ... git ignore list
.jscsrc       ... jscs 검사 규칙 
.jshintingore ... jshint ignore list
.jshintrc     ... jshint 검사 규칙
.travis.yml   ... travis 관련 yaml
gulpfile.js   ... gulp task들을 정의한 스크립트 
main.js       ... API 서버 켤 때 켜질 메인 스크립트  
package.json  ... 노드 프로젝트 설정 파일 
README.md     ... 현재 읽고 있는 파일
setup-dev.sh  ... npm module install 및 pre-commit-hook, pre-push-hook 설정
```

## 개발 환경 설정

해당 레포지토리 클론 하시고 (git clone git@github.com:cuponthetop/sadanghaeng_api.git)

cd sadanghaeng_api

*NIX 환경 터미널에서
./setup-dev.sh
실행시켜주세요

pre-commit-hook:
커밋하기 전에 실행되요.
jshint랑 jscs를 돌려서 간단한 코딩 규칙에 맞게 써졌는지 검사해요 

pre-push-hook:
master 브랜치에 force-push 하지 못하게 막아요


## 테스트 환경 설정
- 테스트 DB에 데이터 넣기
node test/init/test-init.js
- 테스트 데이터로 서버 띄우기
node lib/server/test-server.js
