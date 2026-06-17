import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { Link, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function OrdersCreate({ customers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        items: [],
        total_amount: 0
    });

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const addToCart = (product) => {
        const existingItem = data.items.find(item => item.product_id === product._id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                updateQuantity(product._id, existingItem.quantity + 1);
            }
        } else {
            const newItems = [...data.items, { product_id: product._id, name: product.name, price: product.price, quantity: 1, maxStock: product.stock }];
            setData(prev => ({
                ...prev,
                items: newItems,
                total_amount: calculateTotal(newItems)
            }));
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        const newItems = data.items.map(item => {
            if (item.product_id === productId) {
                return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.maxStock)) };
            }
            return item;
        });
        setData(prev => ({
            ...prev,
            items: newItems,
            total_amount: calculateTotal(newItems)
        }));
    };

    const removeFromCart = (productId) => {
        const newItems = data.items.filter(item => item.product_id !== productId);
        setData(prev => ({
            ...prev,
            items: newItems,
            total_amount: calculateTotal(newItems)
        }));
    };

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    const selectedCustomer = customers.find(c => c._id === data.customer_id);

    return (
        <EnterpriseLayout title="Create Order">
            <div className="flex items-center space-x-4 mb-8">
                <Link href={route('orders.index')} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Create New Sale</h1>
                    <p className="text-sm text-white/50">Point of Sale & Order generation.</p>
                </div>
            </div>

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Left Side: Product Selection */}
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                        <input 
                            type="text" 
                            placeholder="Search products by name or SKU..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full !pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] focus:bg-white/10 transition-all shadow-inner"
                        />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-3 gap-4 auto-rows-max">
                        {filteredProducts.map(product => (
                            <div 
                                key={product._id}
                                onClick={() => addToCart(product)}
                                className="p-4 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 hover:border-[#38BDF8]/50 cursor-pointer transition-all backdrop-blur-md flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="text-xs text-white/40 mb-1">{product.sku}</div>
                                    <div className="font-medium text-sm mb-2 group-hover:text-[#38BDF8] transition-colors">{product.name}</div>
                                </div>
                                <div className="flex items-end justify-between mt-4">
                                    <div className="text-lg font-semibold">${parseFloat(product.price).toFixed(2)}</div>
                                    <div className="text-xs text-green-400">{product.stock} in stock</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Cart & Checkout */}
                <div className="w-[400px] flex flex-col bg-[#0A0A0A]/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-lg font-medium flex items-center space-x-2">
                            <ShoppingCart className="w-5 h-5 text-[#38BDF8]" />
                            <span>Current Order</span>
                        </h2>
                    </div>
                    
                    <form onSubmit={submit} className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Customer Select (Custom Dropdown) */}
                        <div className="p-6 border-b border-white/10 bg-white/5 relative z-20">
                            <label className="text-xs text-white/60 mb-2 block">Select Customer</label>
                            
                            <div className="relative">
                                <div 
                                    onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                                    className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 text-sm cursor-pointer flex items-center justify-between hover:bg-white/10 hover:border-[#38BDF8]/50 transition-all shadow-inner"
                                >
                                    <span className={selectedCustomer ? "text-white" : "text-white/40"}>
                                        {selectedCustomer ? selectedCustomer.name : "Choose a customer..."}
                                    </span>
                                    <svg className={`w-4 h-4 text-white/50 transition-transform ${isCustomerDropdownOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>

                                <AnimatePresence>
                                    {isCustomerDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto"
                                        >
                                            {customers.length === 0 ? (
                                                <div className="p-3 text-sm text-white/40 text-center">No customers available.</div>
                                            ) : (
                                                customers.map(customer => (
                                                    <div 
                                                        key={customer._id}
                                                        onClick={() => {
                                                            setData('customer_id', customer._id);
                                                            setIsCustomerDropdownOpen(false);
                                                        }}
                                                        className="px-4 py-2.5 text-sm text-white/80 hover:bg-[#38BDF8]/20 hover:text-white cursor-pointer transition-colors"
                                                    >
                                                        {customer.name}
                                                    </div>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {errors.customer_id && <div className="text-red-400 text-xs mt-1">{errors.customer_id}</div>}
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <AnimatePresence>
                                {data.items.length === 0 && (
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center text-white/40 text-sm py-8">
                                        Cart is empty. Click on products to add them.
                                    </motion.div>
                                )}
                                {data.items.map(item => (
                                    <motion.div 
                                        key={item.product_id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
                                    >
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{item.name}</div>
                                            <div className="text-xs text-[#38BDF8]">${parseFloat(item.price).toFixed(2)}</div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center bg-black/50 rounded-lg p-1 border border-white/10">
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1 hover:text-[#38BDF8] transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1 hover:text-[#38BDF8] transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <button type="button" onClick={() => removeFromCart(item.product_id)} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Total & Checkout */}
                        <div className="p-6 bg-gradient-to-t from-black/80 to-transparent border-t border-white/10">
                            <div className="flex items-end justify-between mb-6">
                                <span className="text-white/60">Total Amount</span>
                                <span className="text-3xl font-bold text-[#38BDF8]">${data.total_amount.toFixed(2)}</span>
                            </div>
                            <button 
                                disabled={processing || data.items.length === 0 || !data.customer_id}
                                className="w-full py-3.5 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <span>Complete Order</span>
                            </button>
                            {errors.message && <div className="text-red-400 text-xs mt-2 text-center">{errors.message}</div>}
                        </div>
                    </form>
                </div>
            </div>
        </EnterpriseLayout>
    );
}
