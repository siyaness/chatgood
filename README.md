# ChatGood

서로 다른 네트워크에 있는 사용자끼리 텍스트 채팅만 할 수 있는 아주 단순한 웹 채팅입니다.

## 실행

```bash
npm install
npm start
```

브라우저에서 `http://localhost:3000` 으로 접속하면 됩니다.

## 사용 방식

1. 닉네임 입력
2. 같은 방 이름 입력
3. 같은 서버 주소로 접속한 사용자끼리 채팅

## 특징

- 회원가입 없음
- 데이터베이스 없음
- 메시지 저장 없음
- 텍스트 채팅만 지원

## Render 배포

1. 이 폴더를 GitHub 저장소로 올립니다.
2. Render에서 `New > Web Service` 또는 `New > Blueprint`를 선택합니다.
3. GitHub 저장소를 연결합니다.
4. `startCommand`는 `npm start`를 사용합니다.
5. 배포가 끝나면 Render가 발급한 URL로 접속합니다.

이 프로젝트는 `render.yaml`과 `/health` 엔드포인트를 포함하고 있어서 Render에 바로 올릴 수 있습니다.
