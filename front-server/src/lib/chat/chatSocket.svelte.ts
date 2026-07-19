import { io, type Socket } from "socket.io-client";
import type {
  ChatConversations,
  ChatMessage,
  ClientToServerEvents,
  Conversation,
  ServerToClientEvents,
} from "./types";
import type { Profile } from "$lib/profile";

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
type ConversationCallback = ((conversations: Conversation[]) => void) | null;

const DEFAULT_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000";

export const chatSocket = $state({
  socket: null as ChatSocket | null,
  connected: false,
  currentRoom: null as string | null,
  messages: [] as ChatMessage[],
  error: null as string | null,
  conversationCallback: null as ConversationCallback,
});

function handleChatConversation(conversation: ChatConversations) {
  chatSocket.conversationCallback?.(conversation.conversations);
}

function bindConversationListener(sock: ChatSocket | null) {
  if (!sock) return;

  sock.off("chat:conversation", handleChatConversation);
  sock.on("chat:conversation", handleChatConversation);
}

export function setConversationCallback(callback: ConversationCallback) {
  chatSocket.conversationCallback = callback;
  bindConversationListener(chatSocket.socket);
}

function attachChatListeners(sock: ChatSocket) {
  sock.on("connect", () => {
    chatSocket.connected = true;
    chatSocket.error = null;
  });

  sock.on("disconnect", () => {
    chatSocket.connected = false;
  });

  sock.on("connect_error", (err) => {
    chatSocket.error = err.message;
  });

  sock.on("chat:message", (message) => {
    chatSocket.messages = [...chatSocket.messages, message];
  });

  bindConversationListener(sock);

  sock.on("chat:history", (history) => {
    chatSocket.messages = history;
  });

  sock.on("chat:user-joined", () => {
    // Room membership updates can be handled by pages when needed.
  });

  sock.on("chat:user-left", () => {
    // Room membership updates can be handled by pages when needed.
  });
}

export function connect(url: string = DEFAULT_SOCKET_URL): ChatSocket | null {
  if (chatSocket.socket?.connected) {
    return chatSocket.socket;
  }

  chatSocket.socket?.removeAllListeners();
  chatSocket.socket?.disconnect();

  const nextSocket = io(url, {
    autoConnect: true,
    transports: ["websocket"],
  });

  attachChatListeners(nextSocket);
  chatSocket.socket = nextSocket;

  return nextSocket;
}

export function disconnect() {
  if (!chatSocket.socket) return;

  chatSocket.socket.removeAllListeners();
  chatSocket.socket.disconnect();
  chatSocket.socket = null;
  chatSocket.connected = false;
  chatSocket.currentRoom = null;
  chatSocket.messages = [];
  chatSocket.error = null;
  chatSocket.conversationCallback = null;
}

export function joinRoom(roomName: string, profile: Profile) {
  if (!chatSocket.socket?.connected) {
    chatSocket.error = "Socket is not connected";
    return;
  }

  chatSocket.socket.emit("chat:join", {
    roomName,
    username: profile?.name || "unknown",
  });
  chatSocket.currentRoom = roomName;
  chatSocket.messages = [];
}

export function leaveRoom() {
  if (!chatSocket.socket?.connected || !chatSocket.currentRoom) return;

  chatSocket.socket.emit("chat:leave", { roomName: chatSocket.currentRoom });
  chatSocket.currentRoom = null;
  chatSocket.messages = [];
}

export function sendMessage(content: string) {
  const trimmed = content.trim();

  if (!trimmed) return;

  if (!chatSocket.socket?.connected || !chatSocket.currentRoom) {
    chatSocket.error = "Not connected to a room";
    return;
  }

  chatSocket.socket.emit("chat:send", {
    roomName: chatSocket.currentRoom,
    content: trimmed,
  });
}

export function clearMessages() {
  chatSocket.messages = [];
}

export function clearError() {
  chatSocket.error = null;
}
