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

## ngrok으로 외부 공개하기

다른 네트워크의 PC와 채팅하려면 이 앱을 실행한 뒤 `ngrok`으로 `3000`번 포트를 공개하면 됩니다.

### 1. 채팅 서버 실행

```bash
npm start
```

### 2. ngrok 설치

Windows용 `ngrok`를 설치합니다.

### 3. authtoken 등록

ngrok 계정에서 받은 `authtoken`을 한 번만 등록합니다.

```bash
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```

### 4. 외부 주소 열기

새 PowerShell 창에서 아래 명령을 실행합니다.

```bash
ngrok http 3000
```

그러면 `https://xxxx.ngrok.app` 같은 주소가 표시됩니다.

### 5. 채팅 사용

상대방도 같은 `ngrok` 주소로 접속한 뒤 같은 방 이름을 입력하면 채팅할 수 있습니다.

## 종료 방법

아래 두 창에서 각각 `Ctrl + C`를 누르면 됩니다.

- `npm start` 실행 창
- `ngrok http 3000` 실행 창

## 주의사항

- 내 컴퓨터가 켜져 있어야 합니다.
- `npm start`와 `ngrok http 3000`이 둘 다 실행 중이어야 합니다.
- 메시지는 메모리에만 저장되므로 서버를 끄면 대화 내역이 사라집니다.
- ngrok 주소는 다시 실행할 때 바뀔 수 있습니다.
