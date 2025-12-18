export interface Participant {
  id: string;
  name: string;
  role: number;
}

export interface Room {
  name: string;
  id: number;
  type: "group" | "single";
  image_url: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participant: Participant[];
}

export interface MediaData {
  url: string;
  thumbnail: string;
  filename: string;
  size: number;
  duration?: number;
  pages?: number;
}

export interface Comment {
  id: number;
  type: "text" | "image" | "video" | "pdf";
  message: string;
  sender: string;
  timestamp: string;
  media?: MediaData;
}

export interface ChatData {
  room: Room;
  comments: Comment[];
}

export interface ChatResponse {
  results: ChatData[];
}
