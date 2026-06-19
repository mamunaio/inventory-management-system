import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { Search, Activity, User, ShoppingCart, Package, Users, Truck, Settings, Receipt, UserCog, Edit, Trash2, Plus, LogIn, Download } from "lucide-react";
import { useState } from 'react';

const ACTION_CONFIG = {
    'product_created': { icon: Package, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Product Created' },
    'product_updated': { icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Product Updated' },
    'product_deleted': { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Product Deleted' },
    'order_created': { icon: ShoppingCart, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Order Created' },
    'order_completed': { icon: ShoppingCart, color: 'text-green-400', bg: 'bg-green-500/10', label: 'Order Completed' },
    'order_cancelled': { icon: ShoppingCart, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Order Cancelled' },
    'customer_created': { icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', label: 'Customer Added' },
    'customer_updated': { icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Customer Updated' },
    'customer_deleted': { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Customer Deleted' },
    'supplier_created': { icon: Truck, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Supplier Added' },
    'supplier_updated': { icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Supplier Updated' },
    'supplier_deleted': { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Supplier Deleted' },
    'expense_created': { icon: Receipt, color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Expense Recorded' },
    'expense_updated': { icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Expense Updated' },
    'expense_deleted': { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', label: 'Expense Deleted' },
    'user_created': { icon: UserCog, color: 'text-pink-400', bg: 'bg-pink-500/10', label: 'User Created' },
    'user_updated': { icon: Edit, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'User Updated' },
    'user_deleted': { icon: Trash2, color: 'text-red-400', bg: 'bg-red-500/10', label: 'User Deleted' },
    'settings_updated': { icon: Settings, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Settings Updated' },
    'login': { icon: LogIn, color: 'text-green-400', bg: 'bg-green-500/10', label: 'User Login' },
    'purchase_created': { icon: Truck, color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Purchase Created' },
};

export default function ActivitiesIndex({ activities }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    const getActionConfig = (action) => {
        return ACTION_CONFIG[action] || { icon: Activity, color: 'text-gray-400', bg: 'bg-gray-500/10', label: action };
    };

    const uniqueActions = [...new Set(activities.map(a => a.action))].sort();

    const filteredActivities = activities.filter(activity => {
        const matchesSearch = (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (activity.user && activity.user.name && activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesAction = !actionFilter || activity.action === actionFilter;
        return matchesSearch && matchesAction;
    });

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <EnterpriseLayout title="Activity Log">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Activity Log</h1>
                    <p className="text-sm text-white/50">Track all user actions and system events.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm text-white/50">{filteredActivities.length} activity(s)</span>
                    <button
                        onClick={() => window.location.href = route('reports.export-activity-log')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex items-center space-x-4"
            >
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                        type="text" 
                        placeholder="Search activities..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-full" 
                    />
                </div>
                <select 
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white min-w-[180px]"
                >
                    <option value="">All Actions</option>
                    {uniqueActions.map(action => (
                        <option key={action} value={action}>{ACTION_CONFIG[action]?.label || action}</option>
                    ))}
                </select>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                {filteredActivities.length === 0 ? (
                    <div className="p-8 text-center text-white/40 text-sm">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        {searchTerm || actionFilter ? 'No activities match your filters.' : 'No activities recorded yet.'}
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredActivities.map((activity, index) => {
                            const config = getActionConfig(activity.action);
                            const Icon = config.icon;
                            return (
                                <motion.div 
                                    key={activity._id || activity.id || index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="p-4 hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
                                            <Icon className={`w-4 h-4 ${config.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-sm">{activity.user?.name || 'System'}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            {activity.description && (
                                                <p className="text-sm text-white/60 mt-1">{activity.description}</p>
                                            )}
                                            {activity.ip_address && (
                                                <p className="text-xs text-white/30 mt-1">IP: {activity.ip_address}</p>
                                            )}
                                        </div>
                                        <div className="text-xs text-white/40 flex-shrink-0">
                                            {formatTimeAgo(activity.created_at)}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </EnterpriseLayout>
    );
}
