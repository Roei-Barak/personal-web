import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PrivateLayout from './components/layout/PrivateLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import SkiDashboard from './pages/SkiDashboard';
import AdminPanel from './pages/AdminPanel';
import MusicalDashboard from './pages/MusicalDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/ski"
            element={
              <ProtectedRoute requiredRoles={['admin', 'approved_friend']}>
                <PrivateLayout>
                  <SkiDashboard />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/musical"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <PrivateLayout>
                  <MusicalDashboard />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <PrivateLayout>
                  <AdminPanel />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;