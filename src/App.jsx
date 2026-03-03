import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateDress from './pages/CreateDress';
import DressList from './pages/DressList';
import CalendarView from './pages/CalendarView';
import ClientDashboard from './pages/ClientDashboard';
import ClientSchedule from './pages/ClientSchedule';
import { useAuth } from './context/AuthContext';

// Helper component to redirect based on role
const RoleBasedRedirect = () => {
  const { userRole, currentUser } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;

  // Admins go to main dashboard, clients go to client dashboard
  return userRole === 'admin' ?
    <Navigate to="/dashboard" replace /> :
    <Navigate to="/client" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Root redirect handles where an authenticated user should go implicitly */}
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Protected Routes using Layout Wrapper */}
      <Route element={<Layout />}>

        {/* Admin Only Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dresses"
          element={
            <ProtectedRoute requireAdmin={true}>
              <DressList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dresses/new"
          element={
            <ProtectedRoute requireAdmin={true}>
              <CreateDress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute requireAdmin={true}>
              <CalendarView />
            </ProtectedRoute>
          }
        />

        {/* Client Oriented Routes */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/schedule"
          element={
            <ProtectedRoute>
              <ClientSchedule />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown internal routes based on role */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Route>
    </Routes>
  );
}

export default App;
