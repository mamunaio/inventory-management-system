import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Users, Edit, Trash2, X, AlertTriangle, DollarSign, Award } from "lucide-react";
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { useToast } from '@/Hooks/useToast';

export default function CustomersIndex({ customers }) {
    const { toast } = useToast();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPayDueModalOpen, setIsPayDueModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const addForm = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: ''
    });

    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: ''
    });

    const dueForm = useForm({
        amount: ''
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('customers.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
                toast('Customer added successfully', 'success');
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('customers.update', selectedCustomer.id || selectedCustomer._id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedCustomer(null);
                toast('Customer updated successfully', 'success');
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('customers.destroy', selectedCustomer.id || selectedCustomer._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedCustomer(null);
                toast('Customer deleted successfully', 'success');
            }
        });
    };

    const handlePayDueSubmit = (e) => {
        e.preventDefault();
        dueForm.post(route('customers.payDue', selectedCustomer.id || selectedCustomer._id), {
            onSuccess: () => {
                dueForm.reset();
                setIsPayDueModalOpen(false);
                setSelectedCustomer(null);
                toast('Due collected successfully', 'success');
            }
        });
    };

    const openEditModal = (customer) => {
        setSelectedCustomer(customer);
        editForm.setData({
            name: customer.name,
            email: customer.email,
            phone: customer.phone || '',
            company: customer.company || '',
            address: customer.address || ''
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setIsDeleteModalOpen(true);
    };

    const openPayDueModal = (customer) => {
        setSelectedCustomer(customer);
        dueForm.setData('amount', '');
        setIsPayDueModalOpen(true);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchTerm))
    );

    return (
        <EnterpriseLayout title="Customers">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Customer Directory</h1>
                    <p className="text-sm text-white/50">Manage your enterprise client list and contacts.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Customers Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                        />
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredCustomers.length} customer(s) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Customer</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Contact</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Financials</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-white/40 text-sm">
                                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm ? 'No customers match your search.' : 'No customers found. Add your first customer.'}
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr key={customer._id || customer.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-sm">{customer.name}</div>
                                        <div className="text-xs text-white/40 truncate w-48">{customer.company || 'No Company'}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div>{customer.email}</div>
                                        <div className="text-xs text-white/40">{customer.phone || 'No phone'}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-1 text-sm font-medium">
                                                <span className="text-white/50">Due:</span>
                                                <span className={customer.total_due > 0 ? "text-red-400" : "text-green-400"}>
                                                    ${(customer.total_due || 0).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs font-medium">
                                                <Award className="w-3 h-3 text-yellow-400" />
                                                <span className="text-yellow-400/80">{customer.reward_points || 0} pts</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            {customer.total_due > 0 && (
                                                <button 
                                                    onClick={() => openPayDueModal(customer)}
                                                    className="p-1.5 text-white/40 hover:text-green-400 transition-colors"
                                                    title="Collect Due"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => openEditModal(customer)}
                                                className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                title="Edit Customer"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(customer)}
                                                className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                title="Delete Customer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Add Customer Modal */}
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
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Add New Customer</h2>
                            </div>
                            
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                                        <input type="text" required value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {addForm.errors.name && <p className="text-red-400 text-xs mt-1">{addForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                                        <input type="email" required value={addForm.data.email} onChange={e => addForm.setData('email', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {addForm.errors.email && <p className="text-red-400 text-xs mt-1">{addForm.errors.email}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Phone Number</label>
                                        <input type="text" value={addForm.data.phone} onChange={e => addForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Company</label>
                                        <input type="text" value={addForm.data.company} onChange={e => addForm.setData('company', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea value={addForm.data.address} onChange={e => addForm.setData('address', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={addForm.processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {addForm.processing ? 'Saving...' : 'Save Customer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Customer Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedCustomer && (
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
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => { setIsEditModalOpen(false); setSelectedCustomer(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit Customer</h2>
                                <p className="text-sm text-white/50 mt-1">Update customer information</p>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                                        <input type="text" required value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {editForm.errors.name && <p className="text-red-400 text-xs mt-1">{editForm.errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
                                        <input type="email" required value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {editForm.errors.email && <p className="text-red-400 text-xs mt-1">{editForm.errors.email}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Phone Number</label>
                                        <input type="text" value={editForm.data.phone} onChange={e => editForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Company</label>
                                        <input type="text" value={editForm.data.company} onChange={e => editForm.setData('company', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea value={editForm.data.address} onChange={e => editForm.setData('address', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setSelectedCustomer(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Customer'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collect Due Modal */}
            <AnimatePresence>
                {isPayDueModalOpen && selectedCustomer && (
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
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative"
                        >
                            <button 
                                onClick={() => { setIsPayDueModalOpen(false); setSelectedCustomer(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Collect Due</h2>
                                <p className="text-sm text-white/50 mt-1">Record a payment from {selectedCustomer.name}</p>
                            </div>
                            
                            <form onSubmit={handlePayDueSubmit} className="p-6 space-y-4">
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
                                    <div className="text-sm text-red-400 mb-1">Total Outstanding Due</div>
                                    <div className="text-3xl font-bold text-red-500">${(selectedCustomer.total_due || 0).toFixed(2)}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Payment Amount ($)</label>
                                    <input 
                                        type="number" 
                                        step="0.01" 
                                        required 
                                        max={selectedCustomer.total_due || 0}
                                        value={dueForm.data.amount} 
                                        onChange={e => dueForm.setData('amount', e.target.value)} 
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-lg font-bold focus:outline-none focus:border-green-400" 
                                    />
                                    {dueForm.errors.amount && <p className="text-red-400 text-xs mt-1">{dueForm.errors.amount}</p>}
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsPayDueModalOpen(false); setSelectedCustomer(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={dueForm.processing || !dueForm.data.amount}
                                        className="flex-1 py-2.5 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                    >
                                        {dueForm.processing ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedCustomer && (
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
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-6 h-6 text-red-400" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">Delete Customer</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedCustomer.name}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedCustomer(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleDelete}
                                        className="flex-1 py-2.5 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </EnterpriseLayout>
    );
}
