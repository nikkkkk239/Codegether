import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/auth/AuthForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { SessionPage } from './components/session/SessionPage';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  return <>{children}</>;
};

const AuthWrapper: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  return (
    <AuthForm
      isSignUp={isSignUp}
      onToggle={() => setIsSignUp(!isSignUp)}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={
            <AuthGuard>
              <Navigate to="/dashboard" replace />
            </AuthGuard>
          } />
          <Route path="/dashboard" element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } />
          <Route path="/session/:sessionId" element={
            <AuthGuard>
              <SessionPage />
            </AuthGuard>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;