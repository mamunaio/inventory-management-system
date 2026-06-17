import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, MoreVertical } from "lucide-react";
import { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function CustomersIndex({ customers }) {
    const [isAdding, setIsAdding] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('customers.store'), {
            onSuccess: () => {
                reset();
                setIsAdding(false);
            }
        });
    };

    return (
        <EnterpriseLayout title="Customers">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Customer Directory</h1>
                    <p className="text-sm text-white/50">Manage your enterprise client list and contacts.</p>
                </div>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>{isAdding ? 'Cancel' : 'Add Customer'}</span>
                </button>
            </div>

            {/* Add Customer Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                    >
                        <h2 className="text-lg font-medium mb-4">Add New Customer</h2>
                    <form onSubmit={submit} className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-white/60 mb-1 block">Full Name</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] outline-none" />
                            {errors.name && <div className="text-red-400 text-xs mt-1">{errors.name}</div>}
                        </div>
                        <div>
                            <label className="text-xs text-white/60 mb-1 block">Email Address</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] outline-none" />
                            {errors.email && <div className="text-red-400 text-xs mt-1">{errors.email}</div>}
                        </div>
                        <div>
                            <label className="text-xs text-white/60 mb-1 block">Phone Number</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] outline-none" />
                            {errors.phone && <div className="text-red-400 text-xs mt-1">{errors.phone}</div>}
                        </div>
                        <div>
                            <label className="text-xs text-white/60 mb-1 block">Company / Organization</label>
                            <input type="text" value={data.company} onChange={e => setData('company', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] outline-none" />
                            {errors.company && <div className="text-red-400 text-xs mt-1">{errors.company}</div>}
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-white/60 mb-1 block">Full Address</label>
                            <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] outline-none h-20"></textarea>
                        </div>
                        <div className="col-span-2 flex justify-end">
                            <button disabled={processing} className="px-6 py-2 bg-white text-black rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50">
                                Save Customer
                            </button>
                        </div>
                    </form>
                </motion.div>
                )}
            </AnimatePresence>

            {/* Customers Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="Search customers..." className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Contact</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Company</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-white/40 text-sm">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No customers found. Add your first customer.
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-sm">{customer.name}</div>
                                        <div className="text-xs text-white/40 truncate w-48">{customer.address}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div>{customer.email}</div>
                                        <div className="text-xs text-white/40">{customer.phone}</div>
                                    </td>
                                    <td className="p-4 text-sm font-medium">{customer.company || '-'}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-white/40 hover:text-white transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
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
