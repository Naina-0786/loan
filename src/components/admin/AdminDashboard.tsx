// import React, { useState, useEffect } from 'react';
// import { dashboardAPI } from '../../utils/adminApi';
// import MetricsCard from './MetricsCard';
// import RecentActivity from './RecentActivity';

// interface DashboardStats {
//     totalApplications: number;
//     pendingApprovals: number;
//     approvedApplications: number;
//     rejectedApplications: number;
//     recentApplications: any[];
//     feeStatusBreakdown: {
//         [key: string]: {
//             pending: number;
//             approved: number;
//             rejected: number;
//         };
//     };
// }

// const AdminDashboard: React.FC = () => {
//     const [stats, setStats] = useState<DashboardStats | null>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         fetchDashboardStats();
//     }, []);

//     const fetchDashboardStats = async () => {
//         try {
//             setIsLoading(true);
//             const response = await dashboardAPI.getStats();
//             setStats(response.data);
//         } catch (error: any) {
//             setError(error.message || 'Failed to fetch dashboard statistics');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//             </div>
//         );
//     }

//     if (!stats) {
//         return (
//             <div className="text-center text-gray-500">
//                 No dashboard data available
//             </div>
//         );
//     }

//     const metricsData = [
//         {
//             title: 'Total Applications',
//             value: stats.totalApplications,
//             icon: '📄',
//             color: 'bg-blue-500',
//         },
//         {
//             title: 'Pending Approvals',
//             value: stats.pendingApprovals,
//             icon: '⏳',
//             color: 'bg-yellow-500',
//         },
//         {
//             title: 'Approved Applications',
//             value: stats.approvedApplications,
//             icon: '✅',
//             color: 'bg-green-500',
//         },
//         {
//             title: 'Rejected Applications',
//             value: stats.rejectedApplications,
//             icon: '❌',
//             color: 'bg-red-500',
//         },
//     ];

//     return (
//         <div className="space-y-6">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//                 <p className="text-gray-600">Overview of your loan application system</p>
//             </div>

//             {/* Metrics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {metricsData.map((metric, index) => (
//                     <MetricsCard key={index} {...metric} />
//                 ))}
//             </div>

//             {/* Fee Status Breakdown */}
//             <div className="bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Status Breakdown</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {Object.entries(stats.feeStatusBreakdown).map(([feeType, breakdown]) => (
//                         <div key={feeType} className="border rounded-lg p-4">
//                             <h3 className="font-medium text-gray-900 mb-2 capitalize">
//                                 {feeType.replace(/([A-Z])/g, ' $1').trim()}
//                             </h3>
//                             <div className="space-y-1 text-sm">
//                                 <div className="flex justify-between">
//                                     <span className="text-yellow-600">Pending:</span>
//                                     <span className="font-medium">{breakdown.pending}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-green-600">Approved:</span>
//                                     <span className="font-medium">{breakdown.approved}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-red-600">Rejected:</span>
//                                     <span className="font-medium">{breakdown.rejected}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Recent Activity */}
//             <RecentActivity applications={stats.recentApplications} />
//         </div>
//     );
// };

// export default AdminDashboard;