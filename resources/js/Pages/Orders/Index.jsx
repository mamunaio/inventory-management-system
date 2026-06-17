import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, ShoppingCart, Download, ChevronDown } from "lucide-react";
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function OrdersIndex({ orders }) {
    const [openStatusDropdown, setOpenStatusDropdown] = useState(null);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'Refunded': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            default: return 'bg-white/10 text-white/70 border-white/20';
        }
    };

    const updateStatus = (orderId, newStatus) => {
        router.post(route('orders.status', orderId), { status: newStatus }, {
            preserveScroll: true,
            onSuccess: () => setOpenStatusDropdown(null)
        });
    };

    return (
        <EnterpriseLayout title="Orders">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Orders & Sales</h1>
                    <p className="text-sm text-white/50">Manage your sales orders and transactions.</p>
                </div>
                <Link 
                    href={route('orders.create')}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Order</span>
                </Link>
            </div>

            {/* Orders Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md pb-24"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="Search orders by ID..." className="pl-10 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64 text-white" />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Order ID</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Total</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-white/40 text-sm">
                                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No orders found. Create your first sale.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-sm text-[#38BDF8]">{order.order_number}</td>
                                    <td className="p-4 text-sm">
                                        <div className="font-medium">{order.customer?.name || 'Unknown'}</div>
                                        <div className="text-xs text-white/40">{order.customer?.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 relative">
                                        <button 
                                            onClick={() => setOpenStatusDropdown(openStatusDropdown === order._id ? null : order._id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1 hover:opacity-80 transition-opacity ${getStatusColor(order.status)}`}
                                        >
                                            <span>{order.status}</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </button>

                                        <AnimatePresence>
                                            {openStatusDropdown === order._id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -5 }}
                                                    className="absolute top-full mt-1 left-4 w-32 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1"
                                                >
                                                    {['Completed', 'Pending', 'Cancelled', 'Refunded'].map(status => (
                                                        <button
                                                            key={status}
                                                            disabled={order.status === status}
                                                            onClick={() => updateStatus(order._id, status)}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${order.status === status ? 'text-[#38BDF8] font-medium bg-white/5' : 'text-white/70'}`}
                                                        >
                                                            {status}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                    <td className="p-4 text-right font-medium text-sm">
                                        ${parseFloat(order.total_amount).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <a 
                                            href={route('orders.invoice', order._id)} 
                                            target="_blank"
                                            className="inline-flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white transition-all shadow-sm group"
                                            title="Download Invoice"
                                        >
                                            <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>
        </EnterpriseLayout>
    );
}
