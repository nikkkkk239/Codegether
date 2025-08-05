export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

export interface Session {
  id: string;
  name: string;
  language: string;
  host_id: string;
  host_username: string;
  created_at: string;
  is_active: boolean;
  participant_count: number;
  password: string;
}

export interface Participant {
  id: string;
  session_id: string;
  user_id: string;
  username: string;
  joined_at: string;
  is_host: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export interface CodeChange {
  id: string;
  session_id: string;
  content: string;
  updated_at: string;
}