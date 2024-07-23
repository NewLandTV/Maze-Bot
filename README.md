[오늘의 개발노트 p.208](https://www.youtube.com/watch?v=TfgDZx3xtdA)

# 사용 방법

## 리포지토리 복제하기

이 프로젝트를 원하는 위치에 복제하세요!

```sh
git clone https://github.com/NewLandTV/Maze-Bot.git
cd Maze-Bot
```

## 노드 패키지 설치

이 프로젝트는 자바스크립트로 만들었으므로, 노드를 사용해서 의존 모듈을 설치해 줍니다.

```sh
npm install
```

## 구성 파일 설정

프로젝트 루트 경로에 config.js란 파일을 만들고 아래와 같이 작성하세요.

```json
{
    "clientId": "디스코드 봇의 애플리케이션 아이디",
    "guildId": "당신이 속한 서버의 아이디",
    "token": "디스코드 봇의 토큰",
    "yourId": "당신의 디스코드 아이디"
}
```

## 애플리케이션 명령어 등록

최근 변경된 디스코드 봇의 슬래시 명령어를 사용하기 위해서는 명령어를 특정 서버에 미리 등록해야 합니다. 아래와 같은 명령 또는 deplot.bat 파일을 실행해서 명령어를 등록합니다.

```sh
node deploy-commands.js
```

## 봇 실행

이제 마지막 단계입니다. run.bat 파일을 실행하거나 아래와 같은 명령으로 봇을 구동합니다.

```sh
node .
```