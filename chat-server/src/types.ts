export interface ChatMessage {
  id: string;
  roomName: string;
  sender: string;
  content: string;
  createdAt: string;
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

export interface ChatConversationPayload {
  room: string;
  conversations: Conversation[];
}

export interface ServerToClientEvents {
  "chat:message": (message: ChatMessage) => void;
  "chat:conversation": (conversation: ChatConversations) => void;
  "chat:history": (messages: ChatMessage[]) => void;
  "chat:user-joined": (payload: ChatUserEvent) => void;
  "chat:user-left": (payload: ChatUserEvent) => void;
}

export interface ClientToServerEvents {
  "chat:join": (payload: ChatJoinPayload) => void;
  "chat:leave": (payload: ChatLeavePayload) => void;
  "chat:send": (payload: ChatSendPayload) => void;
  "chat:conversation": (payload: ChatConversationPayload) => void;
}

export interface SocketData {
  username: string | null;
  roomName: string | null;
}
