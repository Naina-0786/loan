// import React, { useState, useEffect } from 'react';
// import { Users, DollarSign, FileText, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { getDashboardStats, DashboardStats } from '../../api/adminApi';
// import AdminLayout from '../../components/admin/AdminLayout';

// const AdminDashboard: React.FC = () => {
//     const [stats, setStats] = useState<DashboardStats>({
//         totalApplications: 0,
//         pendingApprovals: 0,
//         approvedApplications: 0,
//         rejectedApplications: 0,
//         totalAdmins: 0,
//         recentApplications: []
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchDashboardStats();
//     }, []);

//     const fetchDashboardStats = async () => {
//         try {
//             const response = await getDashboardStats();
//             setStats({
//                 totalApplications: response.data.totalApplications,
//                 pendingApprovals: response.data.pendingApprovals,
//                 approvedApplications: response.data.approvedApplications,
//                 rejectedApplications: response.data.rejectedApplications,
//                 totalAdmins: 5, // This would come from admin count API
//                 recentApplications: response.data.recentApplications
//             });
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching dashboard stats:', error);
//             setLoading(false);
//         }
//     };

//     const MetricsCard: React.FC<{
//         title: string;
//         value: number;
//         icon: React.ReactNode;
//         color: string;
//         link?: string;
//     }> = ({ title, value, icon, color, link }) => {
//         const content = (
//             <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm font-medium text-gray-600">{title}</p>
//                         <p className="text-3xl font-bold text-gray-900">{value}</p>
//                     </div>
//                     <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
//                         {icon}
//                     </div>
//                 </div>
//             </div>
//         );

//         return link ? <Link to={link}>{content}</Link> : content;
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//             </div>
//         );
//     }

//     return (
//         <AdminLayout>
//             <div className="min-h-screen bg-gray-50">
//                 {/* Header */}
//                 <div className="bg-white shadow-sm border-b">
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex justify-between items-center py-6">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//                                 <p className="text-gray-600">Welcome back! Here's what's happening with your loan applications.</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                     {/* Metrics Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                         <MetricsCard
//                             title="Total Applications"
//                             value={stats.totalApplications}
//                             icon={<FileText className="h-6 w-6 text-blue-600" />}
//                             color="border-l-blue-500"
//                             link="/admin/applications"
//                         />
//                         <MetricsCard
//                             title="Pending Approvals"
//                             value={stats.pendingApprovals}
//                             icon={<Clock className="h-6 w-6 text-yellow-600" />}
//                             color="border-l-yellow-500"
//                             link="/admin/applications?status=pending"
//                         />
//                         <MetricsCard
//                             title="Approved"
//                             value={stats.approvedApplications}
//                             icon={<CheckCircle className="h-6 w-6 text-green-600" />}
//                             color="border-l-green-500"
//                             link="/admin/applications?status=approved"
//                         />
//                         <MetricsCard
//                             title="Rejected"
//                             value={stats.rejectedApplications}
//                             icon={<XCircle className="h-6 w-6 text-red-600" />}
//                             color="border-l-red-500"
//                             link="/admin/applications?status=rejected"
//                         />
//                     </div>

//                     {/* Quick Actions */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                         <Link
//                             to="/admin/manage-admin"
//                             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//                         >
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-blue-100">
//                                     <Users className="h-8 w-8 text-blue-600" />
//                                 </div>
//                                 <div className="ml-4">
//                                     <h3 className="text-lg font-semibold text-gray-900">Manage Admins</h3>
//                                     <p className="text-gray-600">Add, edit, or remove admin accounts</p>
//                                     <p className="text-sm text-blue-600 mt-1">{stats.totalAdmins} active admins</p>
//                                 </div>
//                             </div>
//                         </Link>

//                         <Link
//                             to="/admin/manage-fees"
//                             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//                         >
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-green-100">
//                                     <DollarSign className="h-8 w-8 text-green-600" />
//                                 </div>
//                                 <div className="ml-4">
//                                     <h3 className="text-lg font-semibold text-gray-900">Manage Fees</h3>
//                                     <p className="text-gray-600">Configure payment fee structures</p>
//                                     <p className="text-sm text-green-600 mt-1">6 fee types configured</p>
//                                 </div>
//                             </div>
//                         </Link>

//                         <Link
//                             to="/admin/applications"
//                             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
//                         >
//                             <div className="flex items-center">
//                                 <div className="p-3 rounded-full bg-purple-100">
//                                     <FileText className="h-8 w-8 text-purple-600" />
//                                 </div>
//                                 <div className="ml-4">
//                                     <h3 className="text-lg font-semibold text-gray-900">Manage Applications</h3>
//                                     <p className="text-gray-600">Review and process loan applications</p>
//                                     <p className="text-sm text-purple-600 mt-1">{stats.pendingApprovals} pending review</p>
//                                 </div>
//                             </div>
//                         </Link>
//                     </div>

//                     {/* Recent Activity */}
//                     <div className="bg-white rounded-lg shadow-md">
//                         <div className="px-6 py-4 border-b border-gray-200">
//                             <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//                         </div>
//                         <div className="p-6">
//                             <div className="text-center text-gray-500 py-8">
//                                 <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                                 <p>No recent activity to display</p>
//                                 <p className="text-sm">Activity will appear here as applications are processed</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </AdminLayout>
//     );
// };

// export default AdminDashboard;