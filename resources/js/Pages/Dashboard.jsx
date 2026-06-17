import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { Head } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Activity, DollarSign, Package, Users, AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";

export default function Dashboard({ metrics, lowStockProducts, recentOrders }) {
    // Dummy chart data for animation effect
    const chartData = [40, 60, 45, 80, 55, 90, 75];
    const maxData = Math.max(...chartData);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <EnterpriseLayout title="Dashboard">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight mb-1">Overview</h1>
                <p className="text-sm text-white/50">Your business at a glance.</p>
            </div>

            {/* Metrics Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                {/* Revenue Card */}
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-[#38BDF8]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 h-16 text-[#38BDF8]" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-white/70">Total Revenue</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight mb-1">
                        ${parseFloat(metrics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>All time sales</span>
                    </div>
                </motion.div>

                {/* Orders Card */}
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-[#818CF8]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCart className="w-16 h-16 text-[#818CF8]" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#818CF8]/10 text-[#818CF8]">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-white/70">Total Orders</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight mb-1">{metrics.totalOrders}</div>
                    <div className="text-xs text-white/40">Processed transactions</div>
                </motion.div>

                {/* Customers Card */}
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-[#A78BFA]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-[#A78BFA]" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#A78BFA]/10 text-[#A78BFA]">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-white/70">Total Customers</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight mb-1">{metrics.totalCustomers}</div>
                    <div className="text-xs text-white/40">Registered clients</div>
                </motion.div>

                {/* Low Stock Card */}
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-red-400/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <AlertTriangle className="w-16 h-16 text-red-400" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-red-400/10 text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-white/70">Low Stock Alerts</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight mb-1 text-red-400">{lowStockProducts.length}</div>
                    <div className="text-xs text-red-400/70">Items need restocking</div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart Area */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-medium">Sales Overview</h3>
                            <p className="text-sm text-white/40">Weekly performance</p>
                        </div>
                        <Activity className="w-5 h-5 text-white/40" />
                    </div>
                    
                    {/* Custom Animated Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2 mt-auto">
                        {chartData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxData) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-[#38BDF8]/20 to-[#38BDF8] rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold py-1 px-2 rounded">
                                        {val}k
                                    </div>
                                </motion.div>
                                <div className="text-xs text-white/30 mt-3 font-medium uppercase">
                                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Orders List */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex flex-col"
                >
                    <h3 className="text-lg font-medium mb-6">Recent Orders</h3>
                    <div className="flex-1 overflow-hidden">
                        {recentOrders.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-white/40">
                                <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
                                <span className="text-sm">No recent orders</span>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 + (i * 0.1) }}
                                        key={order._id} 
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                                <span className="text-sm font-semibold text-indigo-300">
                                                    {order.customer?.name?.charAt(0) || '?'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{order.customer?.name || 'Unknown'}</div>
                                                <div className="text-xs text-white/40">{order.order_number}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-[#38BDF8]">${parseFloat(order.total_amount).toFixed(2)}</div>
                                            <div className="text-xs text-green-400">{order.status}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </EnterpriseLayout>
    );
}
