const crypto = require("node:crypto");
const http = require("node:http");
const path = require("node:path");

const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const activeUsers = new Map();

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_request, response) => {
  response.status(200).json({ ok: true });
});

function normalizeValue(value, maxLength) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function getRoomUserCount(room) {
  return io.sockets.adapter.rooms.get(room)?.size ?? 0;
}

function emitRoomData(room) {
  io.to(room).emit("room-data", {
    room,
    userCount: getRoomUserCount(room),
  });
}

function leaveRoom(socket) {
  const user = activeUsers.get(socket.id);

  if (!user) {
    return;
  }

  activeUsers.delete(socket.id);
  socket.leave(user.room);
  socket.to(user.room).emit("system-message", {
    id: crypto.randomUUID(),
    text: `${user.nickname}님이 퇴장했습니다.`,
    timestamp: new Date().toISOString(),
  });
  emitRoomData(user.room);
}

io.on("connection", (socket) => {
  socket.on("join-room", (payload, callback = () => {}) => {
    const nickname = normalizeValue(payload?.nickname, 20);
    const room = normalizeValue(payload?.room, 30);

    if (!nickname || !room) {
      callback({
        ok: false,
        error: "닉네임과 방 이름을 입력해주세요.",
      });
      return;
    }

    leaveRoom(socket);

    socket.join(room);
    activeUsers.set(socket.id, { nickname, room });

    callback({
      ok: true,
      room,
      nickname,
      userCount: getRoomUserCount(room),
    });

    socket.to(room).emit("system-message", {
      id: crypto.randomUUID(),
      text: `${nickname}님이 입장했습니다.`,
      timestamp: new Date().toISOString(),
    });
    emitRoomData(room);
  });

  socket.on("send-message", (payload, callback = () => {}) => {
    const user = activeUsers.get(socket.id);
    const text = normalizeValue(payload?.text, 500);

    if (!user) {
      callback({
        ok: false,
        error: "먼저 채팅방에 입장해주세요.",
      });
      return;
    }

    if (!text) {
      callback({
        ok: false,
        error: "메시지를 입력해주세요.",
      });
      return;
    }

    io.to(user.room).emit("chat-message", {
      id: crypto.randomUUID(),
      senderId: socket.id,
      nickname: user.nickname,
      text,
      timestamp: new Date().toISOString(),
    });

    callback({ ok: true });
  });

  socket.on("disconnect", () => {
    leaveRoom(socket);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`ChatGood server is running on http://0.0.0.0:${PORT}`);
});
