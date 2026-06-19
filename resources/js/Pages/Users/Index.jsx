import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, UserCog, Edit, Trash2, X, AlertTriangle, Shield, ShieldOff } from "lucide-react";
import { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';

export default function UsersIndex({ users, branches }) {
    const { auth } = usePage().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const addForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
        branch_id: '',
        base_salary: '',
        commission_rate: ''
    });

    const editForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
        branch_id: '',
        base_salary: '',
        commission_rate: ''
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('users.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('users.update', selectedUser.id || selectedUser._id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('users.destroy', selectedUser.id || selectedUser._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedUser(null);
            }
        });
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role || 'cashier',
            branch_id: user.branch_id || '',
            base_salary: user.base_salary || '',
            commission_rate: user.commission_rate || ''
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ShieldOff className="w-3 h-3 mr-1" />
                Cashier
            </span>
        );
    };

    return (
        <EnterpriseLayout title="User Management">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">User Management</h1>
                    <p className="text-sm text-white/50">Manage admin and cashier user accounts.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            {/* Users Table */}
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
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                        />
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredUsers.length} user(s) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">User</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Role</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Branch</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Salary/Comm.</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Joined</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <UserCog className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm ? 'No users match your search.' : 'No users found. Add your first user.'}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id || user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-white/40">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {user.branch_id ? branches.find(b => (b._id || b.id) === user.branch_id)?.name || 'Unknown' : 'HQ / None'}
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        <div>${user.base_salary || 0}</div>
                                        <div className="text-xs text-white/40">{user.commission_rate || 0}% Comm.</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.email_verified_at ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-white/50">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(user)}
                                                className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                title="Edit User"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            {(user._id || user.id) !== (auth.user._id || auth.user.id) && (
                                                <button 
                                                    onClick={() => openDeleteModal(user)}
                                                    className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Add User Modal */}
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
                                <h2 className="text-xl font-semibold">Add New User</h2>
                                <p className="text-sm text-white/50 mt-1">Create a new admin or cashier account</p>
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
                                        <label className="block text-sm font-medium text-white/70 mb-1">Password</label>
                                        <input type="password" required value={addForm.data.password} onChange={e => addForm.setData('password', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {addForm.errors.password && <p className="text-red-400 text-xs mt-1">{addForm.errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Confirm Password</label>
                                        <input type="password" required value={addForm.data.password_confirmation} onChange={e => addForm.setData('password_confirmation', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                                    <select value={addForm.data.role} onChange={e => addForm.setData('role', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                        <option value="cashier">Cashier</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {addForm.errors.role && <p className="text-red-400 text-xs mt-1">{addForm.errors.role}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Branch (Optional)</label>
                                    <select value={addForm.data.branch_id} onChange={e => addForm.setData('branch_id', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                        <option value="">Headquarters / No Branch</option>
                                        {branches && branches.map(b => (
                                            <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                    {addForm.errors.branch_id && <p className="text-red-400 text-xs mt-1">{addForm.errors.branch_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Base Salary</label>
                                        <input type="number" step="0.01" value={addForm.data.base_salary} onChange={e => addForm.setData('base_salary', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" placeholder="0.00" />
                                        {addForm.errors.base_salary && <p className="text-red-400 text-xs mt-1">{addForm.errors.base_salary}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Commission Rate (%)</label>
                                        <input type="number" step="0.01" value={addForm.data.commission_rate} onChange={e => addForm.setData('commission_rate', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" placeholder="e.g. 5.0" />
                                        {addForm.errors.commission_rate && <p className="text-red-400 text-xs mt-1">{addForm.errors.commission_rate}</p>}
                                    </div>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={addForm.processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {addForm.processing ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedUser && (
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
                                onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit User</h2>
                                <p className="text-sm text-white/50 mt-1">Update user account information</p>
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
                                        <label className="block text-sm font-medium text-white/70 mb-1">New Password (leave blank to keep current)</label>
                                        <input type="password" value={editForm.data.password} onChange={e => editForm.setData('password', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {editForm.errors.password && <p className="text-red-400 text-xs mt-1">{editForm.errors.password}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Confirm New Password</label>
                                        <input type="password" value={editForm.data.password_confirmation} onChange={e => editForm.setData('password_confirmation', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Role</label>
                                    <select value={editForm.data.role} onChange={e => editForm.setData('role', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                        <option value="cashier">Cashier</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {editForm.errors.role && <p className="text-red-400 text-xs mt-1">{editForm.errors.role}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Branch (Optional)</label>
                                    <select value={editForm.data.branch_id} onChange={e => editForm.setData('branch_id', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                        <option value="">Headquarters / No Branch</option>
                                        {branches && branches.map(b => (
                                            <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                    {editForm.errors.branch_id && <p className="text-red-400 text-xs mt-1">{editForm.errors.branch_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Base Salary</label>
                                        <input type="number" step="0.01" value={editForm.data.base_salary} onChange={e => editForm.setData('base_salary', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" placeholder="0.00" />
                                        {editForm.errors.base_salary && <p className="text-red-400 text-xs mt-1">{editForm.errors.base_salary}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Commission Rate (%)</label>
                                        <input type="number" step="0.01" value={editForm.data.commission_rate} onChange={e => editForm.setData('commission_rate', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" placeholder="e.g. 5.0" />
                                        {editForm.errors.commission_rate && <p className="text-red-400 text-xs mt-1">{editForm.errors.commission_rate}</p>}
                                    </div>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedUser && (
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
                                <h2 className="text-xl font-semibold mb-2">Delete User</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedUser.name}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
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
