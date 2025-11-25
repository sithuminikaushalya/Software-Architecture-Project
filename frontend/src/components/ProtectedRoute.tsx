import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'VENDOR' | 'EMPLOYEE' | 'ADMIN';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const token = sessionStorage.getItem('authToken');
    const userRole = sessionStorage.getItem('userRole') as 'VENDOR' | 'EMPLOYEE' | 'ADMIN' | null;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        switch (userRole) {
        case 'VENDOR':
            return <Navigate to="/vendor/dashboard" replace />;
        case 'EMPLOYEE':
            return <Navigate to="/employee/dashboard" replace />;
        case 'ADMIN':
            return <Navigate to="/admin/dashboard" replace />;
        default:
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
}