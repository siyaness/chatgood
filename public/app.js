const socket = io();

const state = {
  nickname: "",
  room: "",
  joined: false,
  manualLeave: false,
};

const joinPanel = document.getElementById("join-panel");
const chatPanel = document.getElementById("chat-panel");
const joinForm = document.getElementById("join-form");
const messageForm = document.getElementById("message-form");
const leaveButton = document.getElementById("leave-button");
const nicknameInput = document.getElementById("nickname");
const roomInput = document.getElementById("room");
const messageInput = document.getElementById("message-input");
const joinStatus = document.getElementById("join-status");
const messageStatus = document.getElementById("message-status");
const roomLabel = document.getElementById("room-label");
const roomMeta = document.getElementById("room-meta");
const messages = document.getElementById("messages");

function setJoinStatus(text) {
  joinStatus.textContent = text;
}

function setMessageStatus(text) {
  messageStatus.textContent = text;
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function appendSystemMessage(text, timestamp = new Date().toISOString()) {
  const item = document.createElement("div");
  item.className = "message system";
  item.textContent = `${text} (${formatTime(timestamp)})`;
  messages.appendChild(item);
  scrollToBottom();
}

function appendChatMessage(message) {
  const item = document.createElement("article");
  item.className = "message";

  if (message.senderId === socket.id) {
    item.classList.add("mine");
  }

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = `${message.nickname} · ${formatTime(message.timestamp)}`;

  const body = document.createElement("p");
  body.className = "message-body";
  body.textContent = message.text;

  item.append(meta, body);
  messages.appendChild(item);
  scrollToBottom();
}

function showChatPanel() {
  joinPanel.classList.add("hidden");
  chatPanel.classList.remove("hidden");
}

function showJoinPanel() {
  chatPanel.classList.add("hidden");
  joinPanel.classList.remove("hidden");
}

function resetChat() {
  state.joined = false;
  state.room = "";
  state.manualLeave = false;
  roomLabel.textContent = "";
  roomMeta.textContent = "";
  messages.innerHTML = "";
  messageInput.value = "";
  setMessageStatus("");
  showJoinPanel();
}

joinForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setJoinStatus("입장 중...");

  socket.emit(
    "join-room",
    {
      nickname: nicknameInput.value,
      room: roomInput.value,
    },
    (response) => {
      if (!response?.ok) {
        setJoinStatus(response?.error || "입장에 실패했습니다.");
        return;
      }

      state.nickname = response.nickname;
      state.room = response.room;
      state.joined = true;
      roomLabel.textContent = `방: ${state.room}`;
      roomMeta.textContent = `참여자 ${response.userCount}명`;
      setJoinStatus("");
      showChatPanel();
      messages.innerHTML = "";
      appendSystemMessage(`${state.nickname}님으로 입장했습니다.`);
      messageInput.focus();
    }
  );
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.joined) {
    setMessageStatus("먼저 채팅방에 입장해주세요.");
    return;
  }

  const text = messageInput.value.trim();

  if (!text) {
    return;
  }

  socket.emit("send-message", { text }, (response) => {
    if (!response?.ok) {
      setMessageStatus(response?.error || "메시지 전송에 실패했습니다.");
      return;
    }

    messageInput.value = "";
    setMessageStatus("");
    messageInput.focus();
  });
});

leaveButton.addEventListener("click", () => {
  state.manualLeave = true;
  socket.disconnect();
});

socket.on("room-data", (payload) => {
  if (payload?.room !== state.room) {
    return;
  }

  roomMeta.textContent = `참여자 ${payload.userCount}명`;
});

socket.on("system-message", (message) => {
  if (!state.joined) {
    return;
  }

  appendSystemMessage(message.text, message.timestamp);
});

socket.on("chat-message", (message) => {
  if (!state.joined) {
    return;
  }

  appendChatMessage(message);
});

socket.on("disconnect", () => {
  if (!state.joined) {
    return;
  }

  if (state.manualLeave) {
    resetChat();
    setJoinStatus("채팅방에서 나왔습니다.");
    socket.connect();
    return;
  }

  setMessageStatus("서버 연결이 끊어졌습니다. 새로 입장해주세요.");
  resetChat();
});
