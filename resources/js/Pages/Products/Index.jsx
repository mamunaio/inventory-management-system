import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Package, Edit, Trash2, X, Printer, AlertTriangle, Image, ArrowRightLeft, CalendarClock } from "lucide-react";
import { useState, useRef } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import Barcode from 'react-barcode';
import { useToast } from '@/Hooks/useToast';

export default function ProductsIndex({ products, branches }) {
    const { auth } = usePage().props;
    const { toast } = useToast();
    const isAdmin = (auth.user.role || 'admin') === 'admin';
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isBatchesModalOpen, setIsBatchesModalOpen] = useState(false);
    
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [addImagePreview, setAddImagePreview] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const addFileRef = useRef(null);
    const editFileRef = useRef(null);
    
    const addForm = useForm({
        name: '',
        sku: '',
        category: '',
        cost_price: '',
        price: '',
        stock: '',
        warehouse_stock: '',
        low_stock_threshold: '10',
        description: '',
        image: null
    });

    const editForm = useForm({
        name: '',
        sku: '',
        category: '',
        cost_price: '',
        price: '',
        stock: '',
        warehouse_stock: '',
        low_stock_threshold: '',
        description: '',
        image: null
    });

    const transferForm = useForm({
        quantity: 1,
        direction: 'warehouse_to_store',
        target_branch_id: ''
    });

    const batchesForm = useForm({
        batches: []
    });

    const handleAddImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            addForm.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setAddImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            editForm.setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setEditImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => {
                addForm.reset();
                setAddImagePreview(null);
                setIsAddModalOpen(false);
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('products.update', selectedProduct.id || selectedProduct._id), {
            forceFormData: true,
            onSuccess: () => {
                editForm.reset();
                setEditImagePreview(null);
                setIsEditModalOpen(false);
                setSelectedProduct(null);
            }
        });
    };

    const handleTransferSubmit = (e) => {
        e.preventDefault();
        transferForm.post(route('products.transferStock', selectedProduct.id || selectedProduct._id), {
            onSuccess: () => {
                transferForm.reset();
                setIsTransferModalOpen(false);
                setSelectedProduct(null);
                toast('Stock transferred successfully', 'success');
            }
        });
    };

    const handleBatchesSubmit = (e) => {
        e.preventDefault();
        batchesForm.post(route('products.batches', selectedProduct.id || selectedProduct._id), {
            onSuccess: () => {
                setIsBatchesModalOpen(false);
                setSelectedProduct(null);
                toast('Batches updated successfully', 'success');
            }
        });
    };

    const handleDelete = () => {
        router.delete(route('products.destroy', selectedProduct.id || selectedProduct._id), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
            }
        });
    };

    const openEditModal = (product) => {
        setSelectedProduct(product);
        editForm.setData({
            name: product.name,
            sku: product.sku,
            category: product.category || '',
            cost_price: product.cost_price,
            price: product.price,
            stock: product.stock,
            warehouse_stock: product.warehouse_stock || 0,
            low_stock_threshold: product.low_stock_threshold || 10,
            description: product.description || ''
        });
        setIsEditModalOpen(true);
    };

    const openTransferModal = (product) => {
        setSelectedProduct(product);
        setIsTransferModalOpen(true);
        transferForm.setData({
            quantity: 1,
            direction: 'warehouse_to_store',
            target_branch_id: ''
        });
    };

    const openBatchesModal = (product) => {
        setSelectedProduct(product);
        batchesForm.setData('batches', product.batches || []);
        setIsBatchesModalOpen(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <EnterpriseLayout title="Products">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Products Inventory</h1>
                    <p className="text-sm text-white/50">Manage your product catalog, warehouse transfers, and batches.</p>
                </div>
                {isAdmin && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Product</span>
                    </button>
                )}
            </div>

            {/* Products Table */}
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
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" 
                        />
                    </div>
                    <div className="text-sm text-white/50">
                        {filteredProducts.length} product(s) found
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Product</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">SKU</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Stock</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Price</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-white/40 text-sm">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    {searchTerm ? 'No products match your search.' : 'No products found. Click "Add Product" to create one.'}
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product, index) => {
                                const totalStock = (product.stock || 0) + (product.warehouse_stock || 0);
                                const threshold = product.low_stock_threshold || 10;
                                const isLowStock = totalStock <= threshold;

                                return (
                                <tr key={product.id || product._id || index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            {product.image ? (
                                                <img src={`/storage/${product.image}`} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                                    <Image className="w-5 h-5 text-white/30" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-sm flex items-center space-x-2">
                                                    <span>{product.name}</span>
                                                    {isLowStock && (
                                                        <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold" title={`Threshold: ${threshold}`}>Low</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-white/40">Barcode: {product.barcode}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white/70 font-mono">
                                        {product.sku}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.stock > (product.low_stock_threshold || 10) ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    HQ: {product.stock || 0}
                                                </span>
                                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs font-medium">
                                                    WH: {product.warehouse_stock || 0}
                                                </span>
                                            </div>
                                            {product.branch_stocks && product.branch_stocks.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {product.branch_stocks.map(bs => {
                                                        const b = branches?.find(branch => (branch._id || branch.id) === bs.branch_id);
                                                        return b ? (
                                                            <span key={bs.branch_id} className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-xs font-medium">
                                                                {b.name}: {bs.stock}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-[#38BDF8]">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            {isAdmin && (
                                                <>
                                                    <button 
                                                        onClick={() => openTransferModal(product)}
                                                        className="p-1.5 text-white/40 hover:text-green-400 transition-colors"
                                                        title="Transfer Stock"
                                                    >
                                                        <ArrowRightLeft className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => openBatchesModal(product)}
                                                        className="p-1.5 text-white/40 hover:text-yellow-400 transition-colors"
                                                        title="Manage Batches & Expiry"
                                                    >
                                                        <CalendarClock className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <a 
                                                href={route('products.barcode', product.id || product._id || '')} 
                                                target="_blank"
                                                className="p-1.5 text-white/40 hover:text-white transition-colors"
                                                title="Print Barcode Labels"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </a>
                                            {isAdmin && (
                                                <>
                                                    <button 
                                                        onClick={() => openEditModal(product)}
                                                        className="p-1.5 text-white/40 hover:text-[#38BDF8] transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => openDeleteModal(product)}
                                                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </motion.div>

            {/* Add Product Modal */}
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
                                <h2 className="text-xl font-semibold">Add New Product</h2>
                            </div>
                            
                            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Product Name</label>
                                        <input type="text" required value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">SKU</label>
                                        <input type="text" required value={addForm.data.sku} onChange={e => addForm.setData('sku', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                                        <input type="text" value={addForm.data.category} onChange={e => addForm.setData('category', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Low Stock Threshold</label>
                                        <input type="number" required value={addForm.data.low_stock_threshold} onChange={e => addForm.setData('low_stock_threshold', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Cost Price ($)</label>
                                        <input type="number" step="0.01" required value={addForm.data.cost_price} onChange={e => addForm.setData('cost_price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Selling Price ($)</label>
                                        <input type="number" step="0.01" required value={addForm.data.price} onChange={e => addForm.setData('price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Store Stock</label>
                                        <input type="number" required value={addForm.data.stock} onChange={e => addForm.setData('stock', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Warehouse Stock</label>
                                        <input type="number" value={addForm.data.warehouse_stock} onChange={e => addForm.setData('warehouse_stock', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                    <textarea value={addForm.data.description} onChange={e => addForm.setData('description', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-16"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Product Image</label>
                                    <div 
                                        onClick={() => addFileRef.current?.click()}
                                        className="w-full border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-[#38BDF8]/50 transition-colors"
                                    >
                                        {addImagePreview ? (
                                            <img src={addImagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover mx-auto" />
                                        ) : (
                                            <p className="text-xs text-white/50">Click to upload image</p>
                                        )}
                                    </div>
                                    <input ref={addFileRef} type="file" accept="image/*" onChange={handleAddImageChange} className="hidden" />
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit" disabled={addForm.processing} className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200">
                                        {addForm.processing ? 'Saving...' : 'Save Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {isEditModalOpen && selectedProduct && (
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
                            <button onClick={() => { setIsEditModalOpen(false); setSelectedProduct(null); }} className="absolute top-4 right-4 text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Edit Product</h2>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Product Name</label>
                                        <input type="text" required value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">SKU</label>
                                        <input type="text" required value={editForm.data.sku} onChange={e => editForm.setData('sku', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                                        <input type="text" value={editForm.data.category} onChange={e => editForm.setData('category', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Low Stock Threshold</label>
                                        <input type="number" required value={editForm.data.low_stock_threshold} onChange={e => editForm.setData('low_stock_threshold', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Cost Price ($)</label>
                                        <input type="number" step="0.01" required value={editForm.data.cost_price} onChange={e => editForm.setData('cost_price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Selling Price ($)</label>
                                        <input type="number" step="0.01" required value={editForm.data.price} onChange={e => editForm.setData('price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Store Stock</label>
                                        <input type="number" required value={editForm.data.stock} onChange={e => editForm.setData('stock', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Warehouse Stock</label>
                                        <input type="number" value={editForm.data.warehouse_stock} onChange={e => editForm.setData('warehouse_stock', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                    <textarea value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-16"></textarea>
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20">Cancel</button>
                                    <button type="submit" disabled={editForm.processing} className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200">Update Product</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Transfer Stock Modal */}
            <AnimatePresence>
                {isTransferModalOpen && selectedProduct && (
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
                            <button onClick={() => setIsTransferModalOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-semibold">Transfer Stock</h2>
                                <p className="text-sm text-white/50">{selectedProduct.name}</p>
                            </div>
                            
                            <form onSubmit={handleTransferSubmit} className="p-6 space-y-4">
                                <div className="flex justify-between text-sm bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="text-center">
                                        <div className="text-white/50 mb-1">Warehouse</div>
                                        <div className="text-xl font-bold">{selectedProduct.warehouse_stock || 0}</div>
                                    </div>
                                    <ArrowRightLeft className="w-5 h-5 text-white/30 self-center" />
                                    <div className="text-center">
                                        <div className="text-white/50 mb-1">Target Stock</div>
                                        <div className="text-xl font-bold">
                                            {transferForm.data.target_branch_id 
                                                ? (selectedProduct.branch_stocks?.find(b => b.branch_id === transferForm.data.target_branch_id)?.stock || 0)
                                                : (selectedProduct.stock || 0)}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Target Location</label>
                                    <select 
                                        value={transferForm.data.target_branch_id}
                                        onChange={e => transferForm.setData('target_branch_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]"
                                    >
                                        <option value="">HQ Store</option>
                                        {branches?.map(b => (
                                            <option key={b._id || b.id} value={b._id || b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Direction</label>
                                    <select 
                                        value={transferForm.data.direction}
                                        onChange={e => transferForm.setData('direction', e.target.value)}
                                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]"
                                    >
                                        <option value="warehouse_to_store">Warehouse → Selected Store</option>
                                        <option value="store_to_warehouse">Selected Store → Warehouse</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Quantity</label>
                                    <input 
                                        type="number" 
                                        required 
                                        min="1"
                                        value={transferForm.data.quantity} 
                                        onChange={e => transferForm.setData('quantity', e.target.value)} 
                                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    />
                                    {transferForm.errors.message && <p className="text-red-400 text-xs mt-1">{transferForm.errors.message}</p>}
                                </div>
                                
                                <div className="pt-4 flex space-x-3">
                                    <button type="button" onClick={() => setIsTransferModalOpen(false)} className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20">Cancel</button>
                                    <button type="submit" disabled={transferForm.processing} className="flex-1 py-2.5 bg-[#38BDF8] text-black font-semibold rounded-lg hover:bg-[#0EA5E9]">Transfer</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Manage Batches Modal */}
            <AnimatePresence>
                {isBatchesModalOpen && selectedProduct && (
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
                            <button onClick={() => setIsBatchesModalOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">Manage Batches</h2>
                                    <p className="text-sm text-white/50">{selectedProduct.name}</p>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => batchesForm.setData('batches', [...batchesForm.data.batches, { batch_number: '', quantity: '', expiry_date: '' }])}
                                    className="text-xs bg-white/10 px-3 py-1.5 rounded hover:bg-white/20 flex items-center space-x-1"
                                >
                                    <Plus className="w-3 h-3" /> <span>Add Batch</span>
                                </button>
                            </div>
                            
                            <form onSubmit={handleBatchesSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                {batchesForm.data.batches.length === 0 ? (
                                    <div className="text-center text-white/40 py-8 text-sm">No batches tracked. Add a batch to monitor expiry dates.</div>
                                ) : (
                                    batchesForm.data.batches.map((batch, index) => (
                                        <div key={index} className="flex space-x-2 items-end bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-white/50 uppercase mb-1">Batch No.</label>
                                                <input 
                                                    type="text" 
                                                    required 
                                                    value={batch.batch_number} 
                                                    onChange={e => {
                                                        const newBatches = [...batchesForm.data.batches];
                                                        newBatches[index].batch_number = e.target.value;
                                                        batchesForm.setData('batches', newBatches);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded text-sm focus:border-[#38BDF8]" 
                                                />
                                            </div>
                                            <div className="w-24">
                                                <label className="block text-[10px] text-white/50 uppercase mb-1">Qty</label>
                                                <input 
                                                    type="number" 
                                                    required 
                                                    value={batch.quantity} 
                                                    onChange={e => {
                                                        const newBatches = [...batchesForm.data.batches];
                                                        newBatches[index].quantity = e.target.value;
                                                        batchesForm.setData('batches', newBatches);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded text-sm focus:border-[#38BDF8]" 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] text-white/50 uppercase mb-1">Expiry Date</label>
                                                <input 
                                                    type="date" 
                                                    required 
                                                    value={batch.expiry_date} 
                                                    onChange={e => {
                                                        const newBatches = [...batchesForm.data.batches];
                                                        newBatches[index].expiry_date = e.target.value;
                                                        batchesForm.setData('batches', newBatches);
                                                    }}
                                                    className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded text-sm focus:border-[#38BDF8]" 
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const newBatches = batchesForm.data.batches.filter((_, i) => i !== index);
                                                    batchesForm.setData('batches', newBatches);
                                                }}
                                                className="p-1.5 text-white/30 hover:text-red-400 pb-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                                
                                <div className="pt-4 flex space-x-3 border-t border-white/10 mt-4">
                                    <button type="button" onClick={() => setIsBatchesModalOpen(false)} className="flex-1 py-2.5 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20">Cancel</button>
                                    <button type="submit" disabled={batchesForm.processing} className="flex-1 py-2.5 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400">Save Batches</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedProduct && (
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
                                <h2 className="text-xl font-semibold mb-2">Delete Product</h2>
                                <p className="text-white/50 text-sm mb-6">
                                    Are you sure you want to delete <span className="text-white font-medium">{selectedProduct.name}</span>? 
                                    This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => { setIsDeleteModalOpen(false); setSelectedProduct(null); }}
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
