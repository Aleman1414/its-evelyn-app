import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

// Lazy load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateDress = lazy(() => import('./pages/CreateDress'));
const DressList = lazy(() => import('./pages/DressList'));
const CalendarView = lazy(() => import('./pages/CalendarView'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const ClientSchedule = lazy(() => import('./pages/ClientSchedule'));

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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
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
    </Suspense>
  );
}

export default App;
