// Updated AdminSidebar component: add hamburger menu for mobile and collapse sidebar
import {
    DollarSign,
    FileText,
    LogOut,
    Users,
    Menu,
    QrCode,
    Wallet,
    List,
    Contact
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

const AdminSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigation: SidebarItem[] = [
        {
            name: 'Manage Admins',
            href: '/admin/manage-admin',
            icon: <Users className="h-5 w-5" />
        },
        {
            name: 'Manage Fees',
            href: '/admin/manage-fees',
            icon: <DollarSign className="h-5 w-5" />
        },
        {
            name: 'Applications',
            href: '/admin/manage-applications',
            icon: <FileText className="h-5 w-5" />
        },
        {
            name: "Qr Code",
            href: "/admin/qr-code",
            icon: <QrCode className="h-5 w-5" />
        },
        {
            name: "Accounts",
            href: "/admin/account",
            icon: <Wallet className="h-5 w-5" />
        },
        {
            name: "Contact",
            href: "/admin/contact",
            icon: <Contact className="h-5 w-5" />
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem('dhani_admin');
        localStorage.removeItem('dhani_admin_token');
        navigate('/admin/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            {/* Hamburger Menu Button for Mobile */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg"
                onClick={toggleSidebar}
            >
                <Menu className="h-6 w-6" />
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 w-64 bg-gray-900 h-screen flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 z-40 md:w-64 md:min-h-screen`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
                    <h1 className="text-xl font-bold text-white">Dhani Finance</h1>
                    <button
                        className="md:hidden text-white"
                        onClick={toggleSidebar}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click in mobile
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-gray-800 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom section */}
                <div className="px-4 py-6 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default AdminSidebar;