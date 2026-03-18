import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireModista = false }) {
    const { currentUser, userRole } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (requireModista && userRole !== 'modista') {
        // If route is modista only and user is not modista, send them to their client dashboard
        return <Navigate to="/client" replace />;
    }

    return children;
}
