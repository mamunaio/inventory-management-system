import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { Users, DollarSign, Calendar, Clock, Download, Briefcase, Activity } from "lucide-react";

export default function Payroll({ payroll, month }) {
    const totalBase = payroll.reduce((acc, user) => acc + (user.base_salary || 0), 0);
    const totalCommissions = payroll.reduce((acc, user) => acc + (user.commissions || 0), 0);
    const totalPayout = payroll.reduce((acc, user) => acc + (user.total_pay || 0), 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <EnterpriseLayout title="HR & Payroll">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">HR & Payroll</h1>
                    <p className="text-sm text-white/50">Payroll summary for {month}.</p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Export Payroll</span>
                </button>
            </div>

            {/* Quick Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400"><Users className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Total Base Salaries</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">${totalBase.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8]"><Activity className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Total Commissions</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight">${totalCommissions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </motion.div>

                <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400"><DollarSign className="w-5 h-5" /></div>
                        <h3 className="text-sm font-medium text-white/70">Total Monthly Payout</h3>
                    </div>
                    <div className="text-3xl font-bold tracking-tight text-green-400">${totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </motion.div>
            </motion.div>

            {/* Payroll Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="font-semibold flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-white/40" />
                        <span>Staff Payroll Breakdown</span>
                    </h2>
                    <div className="text-sm text-white/50">
                        {payroll.length} staff members
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Staff Name</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-center">Attendance</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Base Salary</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Commissions</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Total Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payroll.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No staff members found.
                                </td>
                            </tr>
                        ) : (
                            payroll.map((user) => (
                                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-sm">{user.name}</div>
                                        <div className="text-xs text-white/40 uppercase tracking-wide">{user.role}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col items-center justify-center space-y-1">
                                            <div className="flex items-center space-x-1 text-xs text-white/70">
                                                <Calendar className="w-3 h-3 text-white/40" />
                                                <span>{user.days_present} days</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-white/70">
                                                <Clock className="w-3 h-3 text-white/40" />
                                                <span>{user.total_hours} hrs</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right text-sm text-white/70">
                                        ${(user.base_salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-right text-sm text-[#38BDF8]">
                                        +${(user.commissions || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-right text-sm font-bold text-green-400">
                                        ${(user.total_pay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
