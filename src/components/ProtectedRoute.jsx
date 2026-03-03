import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { currentUser, userRole } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && userRole !== 'admin') {
        // If route is admin only and user is not admin, send them to their client dashboard
        return <Navigate to="/client" replace />;
    }

    return children;
}
