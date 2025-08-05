import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Square, MessageSquare, X, ChevronDown, ChevronUp, Users, LogOut } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { Chat } from './Chat';
import { useAuth } from '../../contexts/AuthContext';
import { mockSessions, mockMessages, mockParticipants } from '../../lib/mockData';
import type { Session, ChatMessage, Participant } from '../../types';

export const SessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [code, setCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isOutputVisible, setIsOutputVisible] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    if (!sessionId || !user) return;

    // Find session
    const foundSession = mockSessions.find(s => s.id === sessionId);
    if (!foundSession) {
      navigate('/dashboard');
      return;
    }

    setSession(foundSession);
    setMessages(mockMessages.filter(m => m.session_id === sessionId));
    setParticipants(mockParticipants.filter(p => p.session_id === sessionId));

    // Set initial code based on language
    const getInitialCode = (language: string) => {
      switch (language) {
        case 'javascript':
          return `// Fibonacci sequence in JavaScript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`;
        case 'python':
          return `# Fibonacci sequence in Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci sequence:")
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`;
        case 'typescript':
          return `// Fibonacci sequence in TypeScript
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci sequence:");
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`;
        case 'java':
          return `// Fibonacci sequence in Java
public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 10; i++) {
            System.out.println("F(" + i + ") = " + fibonacci(i));
        }
    }
}`;
        default:
          return '// Start coding here...';
      }
    };

    setCode(getInitialCode(foundSession.language));
  }, [sessionId, user, navigate]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      const mockOutput = `Fibonacci sequence:
F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34

Execution completed successfully.`;
      
      setOutput(mockOutput);
      setIsRunning(false);
    }, 2000);
  };

  const handleStopExecution = () => {
    setIsRunning(false);
    setOutput(prev => prev + '\n\nExecution stopped by user.');
  };

  const handleLeaveSession = () => {
    navigate('/dashboard');
  };

  const handleEndSession = () => {
    // Only host can end session
    if (session?.host_id === user?.id) {
      navigate('/dashboard');
    }
  };

  const sendMessage = (message: string) => {
    if (!user || !session) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: session.id,
      user_id: user.id,
      username: user.username,
      message,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading session...</div>
      </div>
    );
  }

  const isHost = session.host_id === user.id;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg sm:text-xl font-semibold truncate max-w-[200px] sm:max-w-none">
              {session.name}
            </h1>
            <span className="text-xs sm:text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {session.language}
            </span>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors sm:hidden"
            >
              <Users className="w-4 h-4" />
              <span>{participants.length}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Participants - Desktop */}
            <div className="hidden sm:flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{participants.length} participants</span>
            </div>

            {/* Session Controls */}
            {isHost ? (
              <button
                onClick={handleEndSession}
                className="flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">End Session</span>
              </button>
            ) : (
              <button
                onClick={handleLeaveSession}
                className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 hover:bg-gray-700 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Leave Session</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Participants */}
        {showParticipants && (
          <div className="mt-3 sm:hidden">
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <span
                  key={participant.id}
                  className="text-xs bg-gray-700 px-2 py-1 rounded"
                >
                  {participant.username}
                  {participant.is_host && ' (Host)'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Code Editor Section */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          isChatVisible ? 'lg:mr-80' : ''
        }`}>
          {/* Editor Controls */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isRunning ? (
                <button
                  onClick={handleRunCode}
                  className="flex items-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
                >
                  <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Run</span>
                </button>
              ) : (
                <button
                  onClick={handleStopExecution}
                  className="flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm transition-colors"
                >
                  <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Stop</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOutputVisible(!isOutputVisible)}
                className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
              >
                {isOutputVisible ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span className="hidden sm:inline">Hide Output</span>
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span className="hidden sm:inline">Show Output</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors lg:inline-flex"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isChatVisible ? 'Hide Chat' : 'Show Chat'}
                </span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className={`flex-1 ${isOutputVisible ? 'min-h-0' : ''}`}>
            <CodeEditor
              language={session.language}
              value={code}
              onChange={setCode}
            />
          </div>

          {/* Output Window */}
          {isOutputVisible && (
            <div className="h-32 sm:h-40 bg-gray-900 border-t border-gray-700 flex flex-col">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-300">Output</h3>
                <button
                  onClick={() => setIsOutputVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap font-mono">
                  {output || 'Click "Run" to execute your code...'}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Chat Section */}
        {isChatVisible && (
          <div className="w-full lg:w-80 lg:absolute lg:right-0 lg:top-[73px] lg:bottom-0 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-300">Chat</h3>
              <button
                onClick={() => setIsChatVisible(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <Chat
              sessionId={sessionId!}
              participants={participants}
              messages={messages}
              onSendMessage={sendMessage}
            />
          </div>
        )}
      </div>
    </div>
  );
};