import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ChatMessage } from '../../types';
import { Send, Users } from 'lucide-react';

interface ChatProps {
  sessionId: string;
  participants: any[];
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
}

export const Chat: React.FC<ChatProps> = ({
  sessionId,
  participants,
  messages,
  onSendMessage,
}) => {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isParticipantsVisible, setIsParticipantsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Participants */}
      <div className="border-b border-gray-200">
        {/* Mobile participants toggle */}
        <div className="lg:hidden p-3 border-b border-gray-100">
          <button
            onClick={() => setIsParticipantsVisible(!isParticipantsVisible)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Participants ({participants.length})</span>
            </div>
            <div className={`transform transition-transform ${isParticipantsVisible ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>
        
        {/* Desktop participants header */}
        <div className="hidden lg:flex items-center space-x-2 p-4 pb-3">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Participants ({participants.length})</span>
        </div>
        
        {/* Participants list */}
        <div className={`px-3 lg:px-4 pb-3 ${isParticipantsVisible || 'hidden lg:block'}`}>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full text-xs"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  {participant.username}
                  {participant.is_host && ' (Host)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg ${
                message.user_id === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.user_id !== user?.id && (
                <div className="text-xs font-medium mb-1 opacity-70">
                  {message.username}
                </div>
              )}
              <div className="text-sm">{message.message}</div>
              <div className={`text-xs mt-1 ${
                message.user_id === user?.id ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {formatTime(message.created_at)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="p-3 lg:p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};