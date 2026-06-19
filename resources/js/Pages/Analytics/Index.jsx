import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain, DollarSign, Activity, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#FB923C'];

export default function AnalyticsIndex({ monthlyFinancials, categoryProfits, forecasts }) {
    
    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <EnterpriseLayout title="Advanced Analytics">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold tracking-tight mb-1">Advanced Analytics & Forecasting</h1>
                <p className="text-sm text-white/50">Profit margins and AI-driven sales predictions.</p>
            </div>

            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
                
                {/* Top Row: Financials Chart and Category Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Monthly Profit & Loss (Bar/Area) */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold">Gross vs Net Profit (Last 6 Months)</h3>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="gross_profit" name="Gross Profit" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="net_profit" name="Net Profit" fill="#34D399" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Profitability by Category */}
                    <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                                <PieChartIcon className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold">Profit by Category</h3>
                        </div>
                        {categoryProfits.length > 0 ? (
                            <div className="h-[250px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryProfits}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryProfits.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => `$${value}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-white/30 text-sm">
                                Not enough data yet.
                            </div>
                        )}
                        <div className="mt-4 space-y-2">
                            {categoryProfits.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-white/70">{cat.name}</span>
                                    </div>
                                    <span className="font-medium">${cat.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* AI Forecasting Table */}
                <motion.div variants={itemVariants} className="w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Brain className="w-16 h-16 text-[#F472B6]" />
                    </div>
                    <div className="p-6 border-b border-white/10 flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-[#F472B6]/10 text-[#F472B6]">
                            <Brain className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">AI Demand Forecast (Next 30 Days)</h3>
                            <p className="text-xs text-white/50">Linear regression predictions based on historical monthly sales data.</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Product Name</th>
                                    <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Current Stock</th>
                                    <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Hist. Monthly Avg</th>
                                    <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Predicted Demand</th>
                                    <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Trend</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forecasts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                            Not enough historical data to forecast.
                                        </td>
                                    </tr>
                                ) : (
                                    forecasts.map((fc, index) => (
                                        <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium text-sm">{fc.name}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${fc.current_stock < fc.predicted_demand ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                                    {fc.current_stock}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-white/70">{fc.historical_avg} units</td>
                                            <td className="p-4">
                                                <span className="font-bold text-[#F472B6]">{fc.predicted_demand} units</span>
                                                {fc.current_stock < fc.predicted_demand && (
                                                    <span className="ml-2 text-xs text-red-400 font-medium">Reorder needed!</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {fc.trend === 'Upward' ? (
                                                    <span className="inline-flex items-center space-x-1 text-green-400 bg-green-500/10 px-2 py-1 rounded text-xs font-medium">
                                                        <TrendingUp className="w-3 h-3" /> <span>Upward</span>
                                                    </span>
                                                ) : fc.trend === 'Downward' ? (
                                                    <span className="inline-flex items-center space-x-1 text-red-400 bg-red-500/10 px-2 py-1 rounded text-xs font-medium">
                                                        <TrendingDown className="w-3 h-3" /> <span>Downward</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1 text-white/50 bg-white/10 px-2 py-1 rounded text-xs font-medium">
                                                        <Minus className="w-3 h-3" /> <span>Stable</span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </motion.div>
        </EnterpriseLayout>
    );
}
