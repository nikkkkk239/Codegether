import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Session } from '../../types';
import { mockSessions, generateId } from '../../lib/mockData';
import { Header } from './Header';
import { SessionCard } from './SessionCard';
import { CreateSessionModal } from './CreateSessionModal';
import { JoinSessionModal } from './JoinSessionModal';
import { Plus, Search } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateSession = async (name: string, password: string, language: string) => {
    if (!user) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newSession: Session = {
      id: generateId(),
      name,
      language,
      host_id: user.id,
      host_username: user.username,
      created_at: new Date().toISOString(),
      is_active: true,
      participant_count: 1,
      password,
    };

    setSessions(prev => [newSession, ...prev]);
    
    // Navigate to the session
    navigate(`/session/${newSession.id}`);
  };

  const handleJoinSession = async (sessionId: string, password: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.password !== password) {
      throw new Error('Invalid password');
    }

    // Navigate to the session
    navigate(`/session/${sessionId}`);
  };

  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.host_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinClick = (session: Session) => {
    setSelectedSession(session);
    setIsJoinModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Sessions</h2>
            <p className="text-gray-600">Join a collaborative coding session or create your own</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Create Session</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sessions by name, language, or host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {searchTerm ? 'No sessions found matching your search.' : 'No active sessions available.'}
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Create the First Session
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleJoinClick}
              />
            ))}
          </div>
        )}
      </main>

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSession={handleCreateSession}
      />

      <JoinSessionModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        session={selectedSession}
        onJoinSession={handleJoinSession}
      />
    </div>
  );
};