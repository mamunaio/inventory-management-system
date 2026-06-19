import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Building2, Edit, Trash2, X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm, router } from '@inertiajs/react';
import { useToast } from '@/Hooks/useToast';

export default function BranchesIndex({ branches }) {
    const { toast } = useToast();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const addForm = useForm({
        name: '',
        address: '',
        phone: '',
        status: 'Active'
    });

    const editForm = useForm({
        name: '',
        address: '',
        phone: '',
        status: 'Active'
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('branches.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
                toast('Branch added successfully', 'success');
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('branches.update', selectedBranch.id || selectedBranch._id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedBranch(null);
                toast('Branch updated successfully', 'success');
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('branches.destroy', selectedBranch.id || selectedBranch._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedBranch(null);
                toast('Branch deleted successfully', 'success');
            }
        });
    };

    const openEditModal = (branch) => {
        setSelectedBranch(branch);
        editForm.setData({
            name: branch.name,
            address: branch.address || '',
            phone: branch.phone || '',
            status: branch.status || 'Active'
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (branch) => {
        setSelectedBranch(branch);
        setIsDeleteModalOpen(true);
    };

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.address && branch.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (branch.phone && branch.phone.includes(searchTerm))
    );

    return (
        <EnterpriseLayout title="Branches">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Branches</h1>
                    <p className="text-sm text-white/50">Manage your store locations.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Branch</span>
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
                            placeholder="Search branches..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                        />
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredBranches.length} branch(es) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Branch Name</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Address</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Phone</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBranches.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm ? 'No branches match your search.' : 'No branches found. Add a new branch to get started.'}
                                </td>
                            </tr>
                        ) : (
                            filteredBranches.map((branch) => (
                                <tr key={branch._id || branch.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-sm">
                                        {branch.name}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {branch.address || '-'}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {branch.phone || '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${branch.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {branch.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(branch)}
                                                className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                title="Edit Branch"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(branch)}
                                                className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                title="Delete Branch"
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

            {/* Add Branch Modal */}
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
                                <h2 className="text-xl font-semibold">Add New Branch</h2>
                            </div>
                            
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Branch Name</label>
                                    <input type="text" required value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {addForm.errors.name && <p className="text-red-400 text-xs mt-1">{addForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                                    <input type="text" value={addForm.data.phone} onChange={e => addForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                                    <select 
                                        value={addForm.data.status} 
                                        onChange={e => addForm.setData('status', e.target.value)} 
                                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea required value={addForm.data.address} onChange={e => addForm.setData('address', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={addForm.processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {addForm.processing ? 'Saving...' : 'Save Branch'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Branch Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedBranch && (
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
                                onClick={() => { setIsEditModalOpen(false); setSelectedBranch(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit Branch</h2>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Branch Name</label>
                                    <input type="text" required value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {editForm.errors.name && <p className="text-red-400 text-xs mt-1">{editForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Phone</label>
                                    <input type="text" value={editForm.data.phone} onChange={e => editForm.setData('phone', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Status</label>
                                    <select 
                                        value={editForm.data.status} 
                                        onChange={e => editForm.setData('status', e.target.value)} 
                                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Address</label>
                                    <textarea required value={editForm.data.address} onChange={e => editForm.setData('address', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setSelectedBranch(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Branch'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedBranch && (
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
                                <h2 className="text-xl font-semibold mb-2">Delete Branch</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedBranch.name}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedBranch(null); }}
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
