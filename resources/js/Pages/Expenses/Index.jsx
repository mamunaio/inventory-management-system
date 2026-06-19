import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Receipt, Edit, Trash2, X, AlertTriangle, DollarSign, Calendar, Tag } from "lucide-react";
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

const EXPENSE_CATEGORIES = [
    'Rent', 'Utilities', 'Salaries', 'Marketing', 'Office Supplies',
    'Travel', 'Maintenance', 'Insurance', 'Taxes', 'Other'
];

export default function ExpensesIndex({ expenses }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const addForm = useForm({
        title: '',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const editForm = useForm({
        title: '',
        category: '',
        amount: '',
        date: '',
        description: ''
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('expenses.store'), {
            onSuccess: () => {
                addForm.reset();
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('expenses.update', selectedExpense.id || selectedExpense._id), {
            onSuccess: () => {
                editForm.reset();
                setIsEditModalOpen(false);
                setSelectedExpense(null);
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('expenses.destroy', selectedExpense.id || selectedExpense._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedExpense(null);
            }
        });
    };

    const openEditModal = (expense) => {
        setSelectedExpense(expense);
        editForm.setData({
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
            date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
            description: expense.description || ''
        });
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (expense) => {
        setSelectedExpense(expense);
        setIsDeleteModalOpen(true);
    };

    const filteredExpenses = expenses.filter(expense => {
        const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !categoryFilter || expense.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);

    const getCategoryColor = (category) => {
        const colors = {
            'Rent': 'bg-red-500/10 text-red-400 border-red-500/20',
            'Utilities': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            'Salaries': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            'Marketing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'Office Supplies': 'bg-green-500/10 text-green-400 border-green-500/20',
            'Travel': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            'Maintenance': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            'Insurance': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            'Taxes': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
            'Other': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        };
        return colors[category] || colors['Other'];
    };

    return (
        <EnterpriseLayout title="Expenses">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Expense Management</h1>
                    <p className="text-sm text-white/50">Track and manage your business expenses.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Expense</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/50 mb-1">Total Expenses</p>
                            <p className="text-2xl font-bold text-red-400">${totalExpenses.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-red-400" />
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/50 mb-1">Total Records</p>
                            <p className="text-2xl font-bold text-white">{filteredExpenses.length}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Receipt className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white/50 mb-1">Average Expense</p>
                            <p className="text-2xl font-bold text-[#38BDF8]">
                                ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 flex items-center justify-center">
                            <Tag className="w-6 h-6 text-[#38BDF8]" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Expenses Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full rounded-2xl bg-[#0A0A0A]/50 border border-white/10 overflow-hidden backdrop-blur-md"
            >
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                            <input 
                                type="text" 
                                placeholder="Search expenses..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                            />
                        </div>
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                        >
                            <option value="">All Categories</option>
                            {EXPENSE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredExpenses.length} expense(s) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Expense</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Category</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Amount</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Date</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm || categoryFilter ? 'No expenses match your filters.' : 'No expenses found. Record your first expense.'}
                                </td>
                            </tr>
                        ) : (
                            filteredExpenses.map((expense) => (
                                <tr key={expense._id || expense.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-sm">{expense.title}</div>
                                        <div className="text-xs text-white/40 truncate w-48">{expense.description || 'No description'}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-red-400">
                                        -${parseFloat(expense.amount).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-sm text-white/50">
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => openEditModal(expense)}
                                                className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                title="Edit Expense"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => openDeleteModal(expense)}
                                                className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                title="Delete Expense"
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

            {/* Add Expense Modal */}
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
                                <h2 className="text-xl font-semibold">Record New Expense</h2>
                                <p className="text-sm text-white/50 mt-1">Track a business expense</p>
                            </div>
                            
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Expense Title</label>
                                    <input type="text" required placeholder="e.g. Office Rent" value={addForm.data.title} onChange={e => addForm.setData('title', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {addForm.errors.title && <p className="text-red-400 text-xs mt-1">{addForm.errors.title}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                                        <select required value={addForm.data.category} onChange={e => addForm.setData('category', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                            <option value="">Select category</option>
                                            {EXPENSE_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        {addForm.errors.category && <p className="text-red-400 text-xs mt-1">{addForm.errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Amount ($)</label>
                                        <input type="number" step="0.01" required placeholder="0.00" value={addForm.data.amount} onChange={e => addForm.setData('amount', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {addForm.errors.amount && <p className="text-red-400 text-xs mt-1">{addForm.errors.amount}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                                    <input type="date" required value={addForm.data.date} onChange={e => addForm.setData('date', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {addForm.errors.date && <p className="text-red-400 text-xs mt-1">{addForm.errors.date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Description (Optional)</label>
                                    <textarea value={addForm.data.description} onChange={e => addForm.setData('description', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20" placeholder="Additional notes..."></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={addForm.processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {addForm.processing ? 'Saving...' : 'Record Expense'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Expense Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedExpense && (
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
                                onClick={() => { setIsEditModalOpen(false); setSelectedExpense(null); }}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit Expense</h2>
                                <p className="text-sm text-white/50 mt-1">Update expense record</p>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Expense Title</label>
                                    <input type="text" required value={editForm.data.title} onChange={e => editForm.setData('title', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {editForm.errors.title && <p className="text-red-400 text-xs mt-1">{editForm.errors.title}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                                        <select required value={editForm.data.category} onChange={e => editForm.setData('category', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]">
                                            <option value="">Select category</option>
                                            {EXPENSE_CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        {editForm.errors.category && <p className="text-red-400 text-xs mt-1">{editForm.errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Amount ($)</label>
                                        <input type="number" step="0.01" required value={editForm.data.amount} onChange={e => editForm.setData('amount', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                        {editForm.errors.amount && <p className="text-red-400 text-xs mt-1">{editForm.errors.amount}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Date</label>
                                    <input type="date" required value={editForm.data.date} onChange={e => editForm.setData('date', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    {editForm.errors.date && <p className="text-red-400 text-xs mt-1">{editForm.errors.date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                    <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-20"></textarea>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button 
                                        type="button"
                                        onClick={() => { setIsEditModalOpen(false); setSelectedExpense(null); }}
                                        className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {editForm.processing ? 'Updating...' : 'Update Expense'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedExpense && (
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
                                <h2 className="text-xl font-semibold mb-2">Delete Expense</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedExpense.title}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedExpense(null); }}
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
