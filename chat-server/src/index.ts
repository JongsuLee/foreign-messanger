import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { Server, type Socket } from "socket.io";
import type {
  ChatMessage,
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./types.js";

const PORT = Number(process.env.PORT ?? 3000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

const roomMessages = new Map<string, ChatMessage[]>();

function getRoomHistory(roomName: string): ChatMessage[] {
  return roomMessages.get(roomName) ?? [];
}

function addMessage(message: ChatMessage): void {
  const history = roomMessages.get(message.roomName) ?? [];
  history.push(message);
  roomMessages.set(message.roomName, history);
}

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("chat-server is running");
});

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

function leaveCurrentRoom(socket: ChatSocket) {
  const { roomName, username } = socket.data;

  if (!roomName || !username) return;

  socket.leave(roomName);
  socket.to(roomName).emit("chat:user-left", { roomName, username });
  socket.data.roomName = null;
}

io.on("connection", (socket) => {
  socket.data.username = null;
  socket.data.roomName = null;

  socket.on("chat:join", ({ roomName, username }) => {
    const trimmedRoom = roomName.trim();
    const trimmedUser = username.trim();

    if (!trimmedRoom || !trimmedUser) return;

    if (
      socket.data.roomName === trimmedRoom &&
      socket.data.username === trimmedUser
    ) {
      socket.emit("chat:history", getRoomHistory(trimmedRoom));
      return;
    }

    leaveCurrentRoom(socket);

    socket.data.username = trimmedUser;
    socket.data.roomName = trimmedRoom;
    socket.join(trimmedRoom);

    socket.emit("chat:history", getRoomHistory(trimmedRoom));
    socket.to(trimmedRoom).emit("chat:user-joined", {
      roomName: trimmedRoom,
      username: trimmedUser,
    });
  });

  socket.on("chat:leave", ({ roomName }) => {
    if (socket.data.roomName !== roomName.trim()) return;

    leaveCurrentRoom(socket);
  });

  socket.on("chat:send", ({ roomName, content }) => {
    const trimmedRoom = roomName.trim();
    const trimmedContent = content.trim();
    const { username } = socket.data;

    if (!trimmedRoom || !trimmedContent || !username) return;
    if (socket.data.roomName !== trimmedRoom) return;

    const message: ChatMessage = {
      id: randomUUID(),
      roomName: trimmedRoom,
      sender: username,
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    addMessage(message);
    io.to(trimmedRoom).emit("chat:message", message);
  });

  socket.on("disconnect", () => {
    leaveCurrentRoom(socket);
  });
});

httpServer.listen(PORT, () => {
  console.log(`chat-server listening on http://localhost:${PORT}`);
});
