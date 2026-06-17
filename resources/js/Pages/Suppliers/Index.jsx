import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Truck, X } from "lucide-react";
import { useState } from "react";
import { useForm } from '@inertiajs/react';

export default function SuppliersIndex({ suppliers }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            }
        });
    };

    return (
        <EnterpriseLayout title="Suppliers">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Suppliers</h1>
                    <p className="text-sm text-white/50">Manage your product vendors.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Supplier</span>
                </button>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="Search suppliers..." className="pl-10 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64 text-white" />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Company Name</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Contact Person</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Phone / Email</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-white/40 text-sm">
                                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No suppliers found. Add a new vendor to get started.
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier) => (
                                <tr key={supplier._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-sm">
                                        {supplier.name}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {supplier.contact_person || '-'}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div>{supplier.phone || '-'}</div>
                                        <div className="text-xs text-white/40">{supplier.email}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/50">
                                        {supplier.address || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Add Supplier Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Add New Supplier</h2>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Company Name</label>
                                    <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Contact Person</label>
                                    <input type="text" value={data.contact_person} onChange={e => setData('contact_person', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                                        <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea value={data.address} onChange={e => setData('address', e.target.value)} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white h-24"></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Supplier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </EnterpriseLayout>
    );
}
