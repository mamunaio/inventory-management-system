import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { Download, TrendingUp, DollarSign, Activity, FileSpreadsheet, Receipt, History } from "lucide-react";
import { useForm } from '@inertiajs/react';

export default function ReportsIndex({ metrics, filters }) {
    const { data, setData, get, processing } = useForm({
        start_date: filters.start_date,
        end_date: filters.end_date
    });

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('reports.index'));
    };

    const handleExportSales = () => {
        window.location.href = route('reports.export-sales', { start_date: data.start_date, end_date: data.end_date });
    };

    const handleExportInventory = () => {
        window.location.href = route('reports.export-inventory');
    };

    const handleExportActivityLog = () => {
        window.location.href = route('reports.export-activity-log', { start_date: data.start_date, end_date: data.end_date });
    };

    const handleExportExpenses = () => {
        window.location.href = route('reports.export-expenses', { start_date: data.start_date, end_date: data.end_date });
    };

    return (
        <EnterpriseLayout title="Reports & Analytics">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Reports & Analytics</h1>
                    <p className="text-sm text-white/50">Analyze your business performance and export data.</p>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md mb-8 p-6"
            >
                <form onSubmit={handleFilter} className="flex items-end space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Start Date</label>
                        <input 
                            type="date" 
                            required
                            value={data.start_date} 
                            onChange={e => setData('start_date', e.target.value)} 
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">End Date</label>
                        <input 
                            type="date" 
                            required
                            value={data.end_date} 
                            onChange={e => setData('end_date', e.target.value)} 
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-xl text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all disabled:opacity-50"
                    >
                        Apply Filter
                    </button>
                </form>
            </motion.div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                        <DollarSign className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-white/50 text-sm font-medium mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold">${parseFloat(metrics.totalRevenue).toFixed(2)}</div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                        <Activity className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="text-white/50 text-sm font-medium mb-1">Total COGS (Cost)</div>
                    <div className="text-3xl font-bold">${parseFloat(metrics.totalCogs).toFixed(2)}</div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-[#111111] to-[#0a1913] border border-green-500/20 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-green-400/80 text-sm font-medium mb-1">Net Profit</div>
                    <div className="text-3xl font-bold text-green-400">${parseFloat(metrics.netProfit).toFixed(2)}</div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md relative overflow-hidden"
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                        <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-white/50 text-sm font-medium mb-1">Completed Orders</div>
                    <div className="text-3xl font-bold">{metrics.totalOrders}</div>
                </motion.div>
            </div>

            {/* Export Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="p-8 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
                        <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Export Sales Report</h2>
                    <p className="text-white/50 text-sm mb-6 max-w-sm">
                        Download a CSV file containing all completed orders within the selected date range.
                    </p>
                    <button 
                        onClick={handleExportSales}
                        className="px-6 py-3 w-full bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Sales CSV</span>
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="p-8 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
                        <FileSpreadsheet className="w-8 h-8 text-purple-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Export Inventory Status</h2>
                    <p className="text-white/50 text-sm mb-6 max-w-sm">
                        Download a CSV snapshot of your current inventory levels, costs, and stock valuation.
                    </p>
                    <button 
                        onClick={handleExportInventory}
                        className="px-6 py-3 w-full bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Inventory CSV</span>
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                    className="p-8 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4 border border-green-500/20">
                        <History className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Export Activity Log</h2>
                    <p className="text-white/50 text-sm mb-6 max-w-sm">
                        Download a CSV of all user actions and system events within the selected date range.
                    </p>
                    <button 
                        onClick={handleExportActivityLog}
                        className="px-6 py-3 w-full bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Activity CSV</span>
                    </button>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="p-8 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 border border-orange-500/20">
                        <Receipt className="w-8 h-8 text-orange-400" />
                    </div>
                    <h2 className="text-lg font-semibold mb-2">Export Expenses Report</h2>
                    <p className="text-white/50 text-sm mb-6 max-w-sm">
                        Download a CSV of all recorded expenses with categories, amounts, and descriptions.
                    </p>
                    <button 
                        onClick={handleExportExpenses}
                        className="px-6 py-3 w-full bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Expenses CSV</span>
                    </button>
                </motion.div>
            </div>
        </EnterpriseLayout>
    );
}
