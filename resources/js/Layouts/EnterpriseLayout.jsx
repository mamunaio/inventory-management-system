import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Package, ShoppingCart, Settings, LogOut, Menu, X, Bell, Search, Truck, Briefcase, Activity, BarChart, BarChart3, PieChart, TrendingUp, Monitor, UserCog, Receipt, Webhook, Store } from "lucide-react";

import FlashToast from '@/Components/FlashToast';

export default function EnterpriseLayout({ children, title }) {
    const { auth, settings } = usePage().props;
    const storeName = settings?.store_name || "Antigravity POS";

    return (
        <div className="flex h-screen w-full bg-[#000000] overflow-hidden font-sans text-white relative">
            <Head title={title ? `${title} - ${storeName}` : storeName} />
            <FlashToast />
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Sidebar */}
            <motion.aside 
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-64 h-full border-r border-white/10 bg-[#0A0A0A]/50 backdrop-blur-2xl flex flex-col z-10"
            >
                <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#38BDF8] flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold tracking-tight truncate">{storeName}</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard, route: 'dashboard', roles: ['admin', 'cashier'] },
                        { name: 'Reports & Analytics', icon: BarChart, route: 'reports.index', roles: ['admin'] },
                        { name: 'Products', icon: Package, route: 'products.index', roles: ['admin', 'cashier'] },
                        { name: 'Branches', icon: Store, route: 'branches.index', roles: ['admin'] },
                        { name: 'Customers', icon: Users, route: 'customers.index', roles: ['admin', 'cashier'] },
                        { name: 'POS Terminal', icon: Monitor, route: 'pos.index', roles: ['admin', 'cashier'] },
                        { name: 'Orders History', icon: ShoppingCart, route: 'orders.index', roles: ['admin', 'cashier'] },
                        { name: 'Purchases (Restock)', icon: Truck, route: 'purchases.index', roles: ['admin'] },
                        { name: 'Suppliers', icon: Briefcase, route: 'suppliers.index', roles: ['admin'] },
                        { name: 'Expense Management', icon: Receipt, route: 'expenses.index', roles: ['admin'] },
                        { name: 'Advanced Analytics', icon: BarChart3, route: 'analytics.index', roles: ['admin'] },
                        { name: 'E-Commerce Integrations', icon: Webhook, route: 'integrations.index', roles: ['admin'] },
                        { name: 'HR & Payroll', icon: Users, route: 'hr.payroll', roles: ['admin'] },
                        { name: 'User Management', icon: UserCog, route: 'users.index', roles: ['admin'] },
                        { name: 'Activity Log', icon: Activity, route: 'activities.index', roles: ['admin'] },
                        { name: 'Settings', icon: Settings, route: 'settings.index', roles: ['admin'] },
                    ].filter(item => {
                        const userRole = auth.user.role || 'admin'; // fallback to admin if not set
                        return item.roles.includes(userRole);
                    }).map((item) => (
                        <Link
                            key={item.name}
                            href={route(item.route)}
                            className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                                route().current(item.route) 
                                ? 'bg-gradient-to-r from-[#6D28D9]/20 to-[#38BDF8]/20 text-white border border-[#38BDF8]/30 shadow-[inset_0_0_20px_rgba(56,189,248,0.1)]' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                route().current(item.route) ? 'text-[#38BDF8]' : 'text-white/40 group-hover:text-white/70'
                            }`} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Sign Out</span>
                    </Link>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full z-10 relative">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/30 backdrop-blur-xl flex items-center justify-between px-8">
                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input 
                                type="text" 
                                placeholder="Search inventory, customers..." 
                                className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-full text-sm focus:outline-none focus:border-[#38BDF8] focus:bg-white/5 transition-all w-[300px]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="relative text-white/60 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute 0 right-0 w-2 h-2 bg-[#38BDF8] rounded-full border border-black"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-6 border-l border-white/10">
                            <div className="text-right">
                                <div className="text-sm font-medium">{auth.user.name}</div>
                                <div className="text-xs text-[#38BDF8]">Admin</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 border border-white/20"></div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
