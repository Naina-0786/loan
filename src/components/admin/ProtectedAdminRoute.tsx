// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAdminAuth } from '../../contexts/AdminAuthContext';

// interface ProtectedAdminRouteProps {
//     children: React.ReactNode;
// }

// const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
//     const [isLoading, setIsLoading] = useState(true);

    
    
//     const location = useLocation();


//     if (isLoading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
//             </div>
//         );
//     }

//     if (!token || !admin) {
//         // Redirect to admin login page with return url
//         return <Navigate to="/admin/login" state={{ from: location }} replace />;
//     }

//     return <>{children}</>;
// };

// export default ProtectedAdminRoute;