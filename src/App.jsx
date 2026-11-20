import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import LandingPage from './pages/LandingPage';
import MeetingPrep from './pages/MeetingPrep';
import Login from './pages/Auth/Login';
import GoogleConnect from './pages/Auth/GoogleConnect';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GoogleConnectRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <GoogleConnect />;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/google-connect" element={<GoogleConnectRoute />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MeetingProvider>
                <LandingPage />
              </MeetingProvider>
            </ProtectedRoute>
          } />
          <Route path="/prep/:clientId" element={
            <ProtectedRoute>
              <MeetingProvider>
                <MeetingPrep />
              </MeetingProvider>
            </ProtectedRoute>
          } />
          <Route path="/meeting-prep/:clientId" element={
            <ProtectedRoute>
              <MeetingProvider>
                <MeetingPrep />
              </MeetingProvider>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
