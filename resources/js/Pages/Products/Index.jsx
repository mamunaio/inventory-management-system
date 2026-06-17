import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Package, Edit, Trash2, X } from "lucide-react";
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import Barcode from 'react-barcode';

export default function ProductsIndex({ products }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        sku: '',
        category: '',
        cost_price: '',
        price: '',
        stock: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('products.store'), {
            onSuccess: () => {
                reset();
                setIsAddModalOpen(false);
            }
        });
    };

    return (
        <EnterpriseLayout title="Products">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Products Inventory</h1>
                    <p className="text-sm text-white/50">Manage your product catalog and stock levels.</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </button>
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
                        <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-1.5 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] w-64" />
                    </div>
                </div>
                
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Product</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Barcode</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Category</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Price</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Stock</th>
                            <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-white/40 text-sm">
                                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    No products found. Click "Add Product" to create one.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-sm">{product.name}</div>
                                        <div className="text-xs text-white/40">SKU: {product.sku}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="bg-white p-1 rounded inline-block">
                                            {product.barcode ? (
                                                <Barcode value={product.barcode} width={1} height={20} fontSize={10} background="#ffffff" displayValue={false} margin={0} />
                                            ) : (
                                                <span className="text-xs text-black">No Barcode</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white/70">
                                        {product.category || 'Uncategorized'}
                                    </td>
                                    <td className="p-4 text-sm font-medium text-[#38BDF8]">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button className="p-1.5 text-white/40 hover:text-white transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 text-white/40 hover:text-red-400 transition-colors">
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
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Product Name</label>
                                        <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">SKU</label>
                                        <input type="text" required value={data.sku} onChange={e => setData('sku', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
                                    <input type="text" placeholder="e.g. Electronics, Clothing" value={data.category} onChange={e => setData('category', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Cost Price ($)</label>
                                        <input type="number" step="0.01" required value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Selling Price ($)</label>
                                        <input type="number" step="0.01" required value={data.price} onChange={e => setData('price', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-1">Initial Stock</label>
                                        <input type="number" required value={data.stock} onChange={e => setData('stock', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8]" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
                                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#38BDF8] h-24"></textarea>
                                </div>
                                
                                <div className="pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Product'}
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
