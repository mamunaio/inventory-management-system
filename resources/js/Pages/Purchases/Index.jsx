import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { Plus, Search, PackagePlus } from "lucide-react";
import { Link } from '@inertiajs/react';

export default function PurchasesIndex({ purchases }) {
    return (
        <EnterpriseLayout title="Purchases">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Purchases & Restocking</h1>
                    <p className="text-sm text-white/50">Manage incoming stock from suppliers.</p>
                </div>
                <Link 
                    href={route('purchases.create')}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Receive Stock</span>
                </Link>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="Search PO number..." className="pl-10 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64 text-white" />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">PO Number</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Supplier</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Product</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Qty Received</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-white/40 text-sm">
                                    <PackagePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No purchase records found.
                                </td>
                            </tr>
                        ) : (
                            purchases.map((purchase) => (
                                <tr key={purchase._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-sm text-[#38BDF8]">{purchase.purchase_number}</td>
                                    <td className="p-4 text-sm text-white/70">
                                        {new Date(purchase.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {purchase.supplier?.name || 'Unknown Supplier'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {purchase.product?.name || 'Unknown Product'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${purchase.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                            {purchase.status || 'Received'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-medium text-sm text-white/80">
                                        {purchase.status === 'Draft' ? (
                                            <span className="text-yellow-400">Wait: {purchase.quantity}</span>
                                        ) : (
                                            <span className="text-green-400">+{purchase.quantity}</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right text-sm">
                                        ${parseFloat(purchase.total_cost).toFixed(2)}
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
