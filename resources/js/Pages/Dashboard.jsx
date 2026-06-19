import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Activity, DollarSign, Package, Users, AlertTriangle, TrendingUp, ShoppingCart, Receipt, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const statusColors = {
    Completed: 'bg-green-400',
    Pending: 'bg-yellow-400',
    Processing: 'bg-blue-400',
    Cancelled: 'bg-red-400',
    Refunded: 'bg-purple-400',
};

const categoryColors = [
    '#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#FB923C',
    '#34D399', '#FBBF24', '#F87171', '#2DD4BF', '#C084FC',
];

export default function Dashboard({
    metrics, lowStockProducts, recentOrders,
    chartData, chartLabels,
    monthlyRevenue, monthlyExpenses, monthlyLabels,
    topProducts, expenseCategories, statusBreakdown, expiringBatches, hr
}) {
    const { auth } = usePage().props;
    const maxData = Math.max(...chartData, 1);
    const maxMonthly = Math.max(...monthlyRevenue, ...monthlyExpenses, 1);
    const maxProductQty = Math.max(...(topProducts?.map(p => p.quantity) || [1]), 1);
    const maxCategoryTotal = Math.max(...(expenseCategories?.map(c => c.total) || [1]), 1);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
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

            {/* Today's Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
            >
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-sm text-white/60 font-medium">Today:</span>
                <span className="text-sm text-white">{metrics.todayOrders ?? 0} orders</span>
                <span className="text-sm text-green-400 font-semibold">${metrics.todayRevenue ?? 0}</span>
                <span className="text-sm text-red-400">-${metrics.todayExpenses ?? 0}</span>
            </motion.div>

            {/* HR Widget */}
            {auth.user.role !== 'admin' && hr && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-2.5 rounded-xl bg-[#6D28D9]/10 text-[#6D28D9]">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white/70">My Shift</h3>
                            <div className="text-lg font-bold">
                                {hr.isClockedIn ? (
                                    <span className="text-green-400">Clocked In</span>
                                ) : (
                                    <span className="text-white/50">Clocked Out</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <h3 className="text-sm font-medium text-white/70">My Commissions (This Month)</h3>
                            <div className="text-xl font-bold text-[#38BDF8]">${hr.myCommissions || '0.00'}</div>
                        </div>
                        
                        <button
                            onClick={() => router.post(hr.isClockedIn ? route('hr.clock-out') : route('hr.clock-in'))}
                            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                hr.isClockedIn 
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'
                            }`}
                        >
                            {hr.isClockedIn ? 'Clock Out' : 'Clock In'}
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Metrics Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-[#38BDF8]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign className="w-16 h-16 text-[#38BDF8]" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]"><DollarSign className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Revenue</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">${parseFloat(metrics.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-[#818CF8]/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCart className="w-16 h-16 text-[#818CF8]" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#818CF8]/10 text-[#818CF8]"><ShoppingCart className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Orders</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">{metrics.totalOrders}</div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-red-400/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Receipt className="w-16 h-16 text-red-400" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-red-400/10 text-red-400"><Receipt className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Expenses</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-red-400">${parseFloat(metrics.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group hover:border-green-400/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-green-400" />
                    </div>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-green-400/10 text-green-400"><TrendingUp className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Net Profit</h3>
                    </div>
                    <div className={`text-3xl font-bold tracking-tight ${(metrics.netProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${parseFloat(metrics.netProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </motion.div>
            </motion.div>

            {/* Row 2: Weekly Sales Chart + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Weekly Sales */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-medium">Sales Overview</h3>
                            <p className="text-sm text-white/40">Last 7 days performance</p>
                        </div>
                        <Activity className="w-5 h-5 text-white/40" />
                    </div>
                    <div className="h-56 flex items-end justify-between gap-2 px-2">
                        {chartData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxData) * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                                    className="w-full bg-gradient-to-t from-[#38BDF8]/20 to-[#38BDF8] rounded-t-sm opacity-70 group-hover:opacity-100 transition-opacity relative"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold py-1 px-2 rounded whitespace-nowrap">
                                        ${val}
                                    </div>
                                </motion.div>
                                <div className="text-xs text-white/30 mt-3 font-medium uppercase">{chartLabels[i]}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
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
                            <div className="space-y-3">
                                {recentOrders.map((order, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.1) }}
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
                                            <div className={`text-xs ${order.status === 'Completed' ? 'text-green-400' : order.status === 'Cancelled' ? 'text-red-400' : 'text-yellow-400'}`}>{order.status}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Row 3: Monthly Comparison + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Monthly Revenue vs Expenses */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-medium">Revenue vs Expenses</h3>
                            <p className="text-sm text-white/40">Last 6 months comparison</p>
                        </div>
                        <BarChart3 className="w-5 h-5 text-white/40" />
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#38BDF8]" /><span className="text-xs text-white/60">Revenue</span></div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-xs text-white/60">Expenses</span></div>
                    </div>
                    <div className="h-56 flex items-end justify-between gap-3 px-2">
                        {monthlyLabels.map((label, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end justify-center gap-1 h-48">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(monthlyRevenue[i] / maxMonthly) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                        className="w-1/2 bg-gradient-to-t from-[#38BDF8]/30 to-[#38BDF8] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold py-1 px-2 rounded whitespace-nowrap">${monthlyRevenue[i]}</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(monthlyExpenses[i] / maxMonthly) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                                        className="w-1/2 bg-gradient-to-t from-red-400/30 to-red-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group"
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-xs font-bold py-1 px-2 rounded whitespace-nowrap">${monthlyExpenses[i]}</div>
                                    </motion.div>
                                </div>
                                <div className="text-xs text-white/30 mt-2 font-medium text-center leading-tight">{label.split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Selling Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-medium">Top Selling Products</h3>
                            <p className="text-sm text-white/40">By quantity sold</p>
                        </div>
                        <Package className="w-5 h-5 text-white/40" />
                    </div>
                    {!topProducts || topProducts.length === 0 ? (
                        <div className="h-56 flex flex-col items-center justify-center text-white/40">
                            <Package className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">No sales data yet</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {topProducts.map((product, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <span className="text-sm text-white/40 w-4 text-right">{i + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium truncate max-w-[150px]">{product.name}</span>
                                            <span className="text-xs text-white/50">{product.quantity} sold</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(product.quantity / maxProductQty) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.7 + (i * 0.1) }}
                                                className="h-full rounded-full bg-gradient-to-r from-[#818CF8] to-[#A78BFA]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Row 4: Expense Categories + Order Status + Low Stock + Expiring Batches */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Expense by Category */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Expenses</h3>
                            <p className="text-sm text-white/40">Spending breakdown</p>
                        </div>
                        <PieChart className="w-5 h-5 text-white/40" />
                    </div>
                    {!expenseCategories || expenseCategories.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-white/40">
                            <Receipt className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">No expenses recorded</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenseCategories.map((cat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[i % categoryColors.length] }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm truncate">{cat.category}</span>
                                            <span className="text-sm font-semibold text-red-400">${cat.total.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(cat.total / maxCategoryTotal) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: categoryColors[i % categoryColors.length] }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Order Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Order Status</h3>
                            <p className="text-sm text-white/40">All time breakdown</p>
                        </div>
                        <ShoppingCart className="w-5 h-5 text-white/40" />
                    </div>
                    {!statusBreakdown || statusBreakdown.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-white/40">
                            <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">No orders yet</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {statusBreakdown.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${statusColors[item.status] || 'bg-white/40'}`} />
                                        <div>
                                            <div className="text-sm font-medium">{item.status}</div>
                                            <div className="text-xs text-white/40">${item.total.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold">{item.count}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Low Stock */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Low Stock</h3>
                            <p className="text-sm text-white/40">Needs attention</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                    {lowStockProducts.length === 0 ? (
                        <div className="h-48 flex flex-col items-center justify-center text-white/40">
                            <Package className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">All stocked up</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                            {lowStockProducts.map((product, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + (i * 0.05) }}
                                    key={product._id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-red-400/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center flex-shrink-0">
                                            <Package className="w-4 h-4 text-red-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium truncate">{product.name}</div>
                                            <div className="text-xs text-white/40">${product.price}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold px-2 py-1 rounded-lg ${product.stock === 0 ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                                        {product.stock} left
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Expiring Batches */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium">Expiring Soon</h3>
                            <p className="text-sm text-white/40">Within 30 days</p>
                        </div>
                        <Calendar className="w-5 h-5 text-yellow-400" />
                    </div>
                    {(!expiringBatches || expiringBatches.length === 0) ? (
                        <div className="h-48 flex flex-col items-center justify-center text-white/40">
                            <Calendar className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm">No upcoming expirations</span>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                            {expiringBatches.map((batch, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.1 + (i * 0.05) }}
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-yellow-400/30 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium truncate">{batch.product_name}</div>
                                            <div className="text-xs text-white/40">Batch: {batch.batch_number} • Qty: {batch.quantity}</div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-bold px-2 py-1 rounded-lg ${batch.days_left <= 0 ? 'bg-red-400/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'}`}>
                                        {batch.days_left <= 0 ? 'Expired' : `${batch.days_left}d`}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </EnterpriseLayout>
    );
}
