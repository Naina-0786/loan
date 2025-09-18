// Updated AdminLayout to accommodate responsive sidebar
import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main content */}
            <main className="flex-1 ml-0 md:ml-64 bg-gray-50 min-h-screen">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;