import { Session, User, ChatMessage, Participant } from '../types';

// Mock current user
export const mockUser: User = {
  id: 'user-1',
  email: 'john@example.com',
  username: 'john_doe',
  created_at: new Date().toISOString(),
};

// Mock sessions data
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    name: 'React Components Workshop',
    language: 'javascript',
    host_id: 'user-2',
    host_username: 'alice_dev',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    is_active: true,
    participant_count: 3,
    password: 'react123',
  },
  {
    id: 'session-2',
    name: 'Python Data Analysis',
    language: 'python',
    host_id: 'user-3',
    host_username: 'data_scientist',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    is_active: true,
    participant_count: 2,
    password: 'python456',
  },
  {
    id: 'session-3',
    name: 'TypeScript Best Practices',
    language: 'typescript',
    host_id: 'user-4',
    host_username: 'ts_expert',
    created_at: new Date(Date.now() - 1800000).toISOString(),
    is_active: true,
    participant_count: 5,
    password: 'typescript789',
  },
  {
    id: 'session-4',
    name: 'Java Spring Boot API',
    language: 'java',
    host_id: 'user-5',
    host_username: 'backend_dev',
    created_at: new Date(Date.now() - 5400000).toISOString(),
    is_active: true,
    participant_count: 1,
    password: 'java2024',
  },
];

// Mock chat messages
export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    session_id: 'session-1',
    user_id: 'user-2',
    username: 'alice_dev',
    message: 'Welcome everyone! Let\'s start with creating a basic React component.',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'msg-2',
    session_id: 'session-1',
    user_id: 'user-1',
    username: 'john_doe',
    message: 'Thanks for hosting! I\'m excited to learn.',
    created_at: new Date(Date.now() - 1700000).toISOString(),
  },
  {
    id: 'msg-3',
    session_id: 'session-1',
    user_id: 'user-6',
    username: 'react_newbie',
    message: 'Should we start with functional or class components?',
    created_at: new Date(Date.now() - 1600000).toISOString(),
  },
];

// Mock participants
export const mockParticipants: Participant[] = [
  {
    id: 'part-1',
    session_id: 'session-1',
    user_id: 'user-2',
    username: 'alice_dev',
    joined_at: new Date(Date.now() - 1800000).toISOString(),
    is_host: true,
  },
  {
    id: 'part-2',
    session_id: 'session-1',
    user_id: 'user-1',
    username: 'john_doe',
    joined_at: new Date(Date.now() - 1700000).toISOString(),
    is_host: false,
  },
  {
    id: 'part-3',
    session_id: 'session-1',
    user_id: 'user-6',
    username: 'react_newbie',
    joined_at: new Date(Date.now() - 1600000).toISOString(),
    is_host: false,
  },
];

// Generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
}