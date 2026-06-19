import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Truck, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm, router } from '@inertiajs/react';

export default function SuppliersIndex({ suppliers }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const addForm = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const editForm = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('suppliers.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('suppliers.update', selectedSupplier.id || selectedSupplier._id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedSupplier(null);
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('suppliers.destroy', selectedSupplier.id || selectedSupplier._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedSupplier(null);
            }
        });
    };

    const openEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        editForm.setData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || ''
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsDeleteModalOpen(true);
    };

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.contact_person && supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (supplier.phone && supplier.phone.includes(searchTerm))
    );

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
                        <input 
                            type="text" 
                            placeholder="Search suppliers..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                        />
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredSuppliers.length} supplier(s) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Company Name</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Contact Person</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Phone / Email</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Address</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <Truck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm ? 'No suppliers match your search.' : 'No suppliers found. Add a new vendor to get started.'}
                                </td>
                            </tr>
                        ) : (
                            filteredSuppliers.map((supplier) => (
                                <tr key={supplier._id || supplier.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-sm">
                                        {supplier.name}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {supplier.contact_person || '-'}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div>{supplier.phone || '-'}</div>
                                        <div className="text-xs text-white/40">{supplier.email || '-'}</div>
                                    </td>
                                    <td className="p-4 text-sm text-white/50">
                                        {supplier.address || '-'}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(supplier)}
                                                className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                title="Edit Supplier"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(supplier)}
                                                className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                title="Delete Supplier"
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
                            className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative"
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
                            
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Company Name</label>
                                    <input type="text" required value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {addForm.errors.name && <p className="text-red-400 text-xs mt-1">{addForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Contact Person</label>
                                    <input type="text" value={addForm.data.contact_person} onChange={e => addForm.setData('contact_person', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                        <input type="email" value={addForm.data.email} onChange={e => addForm.setData('email', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                                        <input type="text" value={addForm.data.phone} onChange={e => addForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
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
                                        {addForm.processing ? 'Saving...' : 'Save Supplier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Supplier Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedSupplier && (
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
                                onClick={() => { setIsEditModalOpen(false); setSelectedSupplier(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit Supplier</h2>
                                <p className="text-sm text-white/50 mt-1">Update supplier information</p>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Company Name</label>
                                    <input type="text" required value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {editForm.errors.name && <p className="text-red-400 text-xs mt-1">{editForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Contact Person</label>
                                    <input type="text" value={editForm.data.contact_person} onChange={e => editForm.setData('contact_person', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                        <input type="email" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                                        <input type="text" value={editForm.data.phone} onChange={e => editForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea value={editForm.data.address} onChange={e => editForm.setData('address', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setSelectedSupplier(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Supplier'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedSupplier && (
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
                                <h2 className="text-xl font-semibold mb-2">Delete Supplier</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedSupplier.name}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedSupplier(null); }}
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
