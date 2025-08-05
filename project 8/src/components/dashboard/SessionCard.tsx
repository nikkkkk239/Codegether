import React from 'react';
import { Session } from '../../types';
import { Users, Calendar, Code } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  onJoin: (session: Session) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onJoin }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-100 text-yellow-800',
      typescript: 'bg-blue-100 text-blue-800',
      python: 'bg-green-100 text-green-800',
      java: 'bg-orange-100 text-orange-800',
      cpp: 'bg-purple-100 text-purple-800',
      go: 'bg-cyan-100 text-cyan-800',
      rust: 'bg-red-100 text-red-800',
    };
    return colors[language] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.name}</h3>
          <p className="text-sm text-gray-600">Hosted by {session.host_username}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(session.language)}`}>
            {session.language}
          </span>
          {session.is_active && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="ml-1 text-xs text-green-600 font-medium">Live</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{session.participant_count} participants</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(session.created_at)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onJoin(session)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Join Session
      </button>

      {/* Demo Password Display */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500">Demo Password: </span>
        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
          {session.password}
        </span>
      </div>
    </div>
  );
};