import type { Profile } from "$lib/profile";

export interface ChatMessage {
  id: string;
  roomName: string;
  sender: string;
  content: string;
  createdAt: string;
}

export interface ChatUserEvent {
  roomName: string;
  username: string;
}

export interface ChatJoinPayload {
  roomName: string;
  username: string;
}

export interface ChatLeavePayload {
  roomName: string;
}

export interface ChatSendPayload {
  roomName: string;
  content: string;
}

export interface Conversation {
  room: string;
  created_at: number;
  updated_at: number;
  caller: string;
  relative_start_time: number;
  relative_end_time: number;
  content: string;
}

export interface ChatConversations {
  room: string;
  conversations: Conversation[];
}

export interface ServerToClientEvents {
  "chat:message": (message: ChatMessage) => void;
  "chat:history": (messages: ChatMessage[]) => void;
  "chat:user-joined": (payload: ChatUserEvent) => void;
  "chat:user-left": (payload: ChatUserEvent) => void;
  "chat:conversation": (payload: ChatConversations) => void;
}

export interface ClientToServerEvents {
  "chat:join": (payload: ChatJoinPayload) => void;
  "chat:leave": (payload: ChatLeavePayload) => void;
  "chat:send": (payload: ChatSendPayload) => void;
}
