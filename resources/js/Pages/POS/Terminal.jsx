import PosLayout from '@/Layouts/PosLayout';
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ScanBarcode, PauseCircle, Clock, CreditCard, Tag, Award } from "lucide-react";
import { useForm, usePage } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useToast } from '@/Hooks/useToast';
import axios from 'axios';

export default function Terminal({ customers, products }) {
    const { toast } = useToast();
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: '',
        items: [],
        total_amount: 0,
        paid_amount: 0,
        discount_amount: 0,
        reward_points_used: 0
    });

    useEffect(() => {
        if (flash?.new_order_id) {
            const printWindow = window.open(route('orders.receipt', flash.new_order_id), '_blank', 'width=400,height=600');
            if (printWindow) {
                printWindow.focus();
            }
        }
    }, [flash]);

    const [searchTerm, setSearchTerm] = useState('');
    const [barcodeBuffer, setBarcodeBuffer] = useState('');
    const [lastKeystrokeTime, setLastKeystrokeTime] = useState(0);
    const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
    
    // Modals
    const [isHeldSalesModalOpen, setIsHeldSalesModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [heldSales, setHeldSales] = useState([]);
    const [loadingHeldSales, setLoadingHeldSales] = useState(false);

    // Payment States
    const [localDiscount, setLocalDiscount] = useState(0);
    const [localPoints, setLocalPoints] = useState(0);
    const [localPaid, setLocalPaid] = useState(0);

    // Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const addToCart = (product) => {
        const existingItem = data.items.find(item => item.product_id === product._id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                updateQuantity(product._id, existingItem.quantity + 1);
            } else {
                toast('Not enough stock!', 'error');
            }
        } else {
            if (product.stock < 1) {
                toast('Out of stock!', 'error');
                return;
            }
            const newItems = [...data.items, { 
                product_id: product._id, 
                name: product.name, 
                price: product.price, 
                quantity: 1, 
                maxStock: product.stock 
            }];
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

    // --- Barcode Scanner Logic ---
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isPaymentModalOpen || isHeldSalesModalOpen) return;

            if (e.key === 'F9') {
                e.preventDefault();
                openPaymentModal();
                return;
            }
            if (e.key === 'F4') {
                e.preventDefault();
                holdSale();
                return;
            }

            const currentTime = new Date().getTime();
            
            if (e.key === 'Enter') {
                if (barcodeBuffer.length > 2 && currentTime - lastKeystrokeTime < 100) {
                    e.preventDefault();
                    processBarcode(barcodeBuffer);
                    setBarcodeBuffer('');
                } else if (e.target.tagName !== 'INPUT' && barcodeBuffer.length > 0) {
                    processBarcode(barcodeBuffer);
                    setBarcodeBuffer('');
                }
            } else if (e.key.length === 1) { 
                if (currentTime - lastKeystrokeTime > 100) {
                    setBarcodeBuffer(e.key);
                } else {
                    setBarcodeBuffer(prev => prev + e.key);
                }
                setLastKeystrokeTime(currentTime);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [barcodeBuffer, lastKeystrokeTime, products, data.items, isPaymentModalOpen, isHeldSalesModalOpen]);

    const processBarcode = (sku) => {
        const product = products.find(p => p.sku === sku);
        if (product) {
            addToCart(product);
            toast(`Added ${product.name}`, 'success');
        } else {
            toast('Product not found', 'error');
        }
    };

    // --- Actions ---
    const selectedCustomer = customers.find(c => c._id === data.customer_id);

    const openPaymentModal = () => {
        if (data.items.length === 0) return;
        setLocalDiscount(0);
        setLocalPoints(0);
        setLocalPaid(data.total_amount); // Default full payment
        setIsPaymentModalOpen(true);
    };

    const calculateFinalTotal = () => {
        const pointDiscount = localPoints / 10; // 10 points = $1
        return Math.max(0, data.total_amount - localDiscount - pointDiscount);
    };

    const confirmPayment = () => {
        if (processing) return;

        const payload = {
            ...data,
            discount_amount: parseFloat(localDiscount) || 0,
            reward_points_used: parseInt(localPoints) || 0,
            paid_amount: parseFloat(localPaid) || 0,
        };

        post(route('pos.store'), {
            data: payload,
            onSuccess: (page) => {
                toast('Order completed successfully', 'success');
                setIsPaymentModalOpen(false);
                reset();
                setLocalDiscount(0);
                setLocalPoints(0);
                setLocalPaid(0);
            }
        });
    };

    const holdSale = () => {
        if (data.items.length === 0 || processing) return;
        
        post(route('pos.hold'), {
            onSuccess: () => {
                toast('Sale held successfully', 'success');
                reset();
            }
        });
    };

    const fetchHeldSales = async () => {
        setIsHeldSalesModalOpen(true);
        setLoadingHeldSales(true);
        try {
            const res = await axios.get(route('pos.held'));
            setHeldSales(res.data);
        } catch (err) {
            toast('Failed to load held sales', 'error');
        }
        setLoadingHeldSales(false);
    };

    const resumeSale = async (id) => {
        try {
            const res = await axios.post(route('pos.resume', id));
            if (res.data.success) {
                const heldData = res.data.data;
                setData({
                    ...data,
                    customer_id: heldData.customer_id || '',
                    items: heldData.items,
                    total_amount: heldData.total_amount
                });
                toast('Sale resumed', 'success');
                setIsHeldSalesModalOpen(false);
            }
        } catch (err) {
            toast('Failed to resume sale', 'error');
        }
    };

    return (
        <PosLayout title="POS Terminal">
            <div className="flex w-full h-full p-4 gap-4 bg-[#050505]">
                {/* Left Side: Product Grid */}
                <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex space-x-4">
                        <div className="relative flex-1">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                            <input 
                                type="text" 
                                placeholder="Search products or scan barcode..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full !pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] focus:bg-white/10 transition-all shadow-inner"
                            />
                        </div>
                        <button onClick={fetchHeldSales} className="px-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all flex items-center space-x-2 text-white/70 hover:text-white">
                            <Clock className="w-5 h-5" />
                            <span className="font-medium text-sm">Held Sales</span>
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 auto-rows-max custom-scrollbar">
                        {filteredProducts.map(product => (
                            <div 
                                key={product._id}
                                onClick={() => addToCart(product)}
                                className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-[#38BDF8]/50 cursor-pointer transition-all flex flex-col justify-between group h-[120px]"
                            >
                                <div>
                                    <div className="text-xs text-white/40 mb-1 truncate">{product.sku}</div>
                                    <div className="font-medium text-sm mb-2 group-hover:text-[#38BDF8] transition-colors line-clamp-2 leading-tight">{product.name}</div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="text-lg font-bold text-white/90">${parseFloat(product.price).toFixed(2)}</div>
                                    <div className="text-[10px] text-green-400/80 bg-green-400/10 px-2 py-0.5 rounded-full">{product.stock} left</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Cart */}
                <div className="w-[420px] flex flex-col bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                    <div className="p-5 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-lg font-medium flex items-center space-x-2">
                            <ShoppingCart className="w-5 h-5 text-[#38BDF8]" />
                            <span>Cart</span>
                            <span className="bg-white/10 text-white text-xs px-2 py-0.5 rounded-full">{data.items.length}</span>
                        </h2>
                        <button onClick={() => reset()} className="text-xs text-red-400 hover:text-red-300">Clear</button>
                    </div>
                    
                    {/* Customer Select */}
                    <div className="p-5 border-b border-white/5 bg-white/[0.02] relative z-20">
                        <div className="relative">
                            <div 
                                onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                                className="w-full bg-black/50 text-white border border-white/10 rounded-xl px-4 py-3 text-sm cursor-pointer flex items-center justify-between hover:border-[#38BDF8]/50 transition-all"
                            >
                                <div className="flex flex-col">
                                    <span className={selectedCustomer ? "text-white font-medium" : "text-white/40"}>
                                        {selectedCustomer ? selectedCustomer.name : "Walk-in Customer"}
                                    </span>
                                    {selectedCustomer && (
                                        <span className="text-xs text-white/50 mt-1">
                                            Points: {selectedCustomer.reward_points || 0} | Due: ${(selectedCustomer.total_due || 0).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {selectedCustomer && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setData('customer_id', ''); }}
                                        className="text-white/40 hover:text-white"
                                    >✕</button>
                                )}
                            </div>

                            <AnimatePresence>
                                {isCustomerDropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto"
                                    >
                                        <div 
                                            onClick={() => { setData('customer_id', ''); setIsCustomerDropdownOpen(false); }}
                                            className="px-4 py-3 text-sm text-white/60 hover:bg-[#38BDF8]/20 hover:text-white cursor-pointer border-b border-white/5"
                                        >
                                            Walk-in Customer
                                        </div>
                                        {customers.map(customer => (
                                            <div 
                                                key={customer._id}
                                                onClick={() => { setData('customer_id', customer._id); setIsCustomerDropdownOpen(false); }}
                                                className="px-4 py-2.5 text-sm text-white/80 hover:bg-[#38BDF8]/20 hover:text-white cursor-pointer"
                                            >
                                                {customer.name}
                                                <div className="text-xs text-white/40">{customer.phone}</div>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        <AnimatePresence>
                            {data.items.length === 0 && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-white/30 space-y-3">
                                    <ScanBarcode className="w-12 h-12" />
                                    <p className="text-sm">Scan barcode or select product</p>
                                </motion.div>
                            )}
                            {data.items.map(item => (
                                <motion.div 
                                    key={item.product_id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group"
                                >
                                    <div className="flex-1 pr-3">
                                        <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                                        <div className="text-xs text-[#38BDF8] font-medium">${parseFloat(item.price).toFixed(2)}</div>
                                    </div>
                                    <div className="flex items-center space-x-3 shrink-0">
                                        <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-white/10">
                                            <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="p-1.5 hover:text-[#38BDF8] transition-colors"><Minus className="w-3 h-3" /></button>
                                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="p-1.5 hover:text-[#38BDF8] transition-colors"><Plus className="w-3 h-3" /></button>
                                        </div>
                                        <button type="button" onClick={() => removeFromCart(item.product_id)} className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 bg-[#050505] border-t border-white/10">
                        <div className="flex justify-between items-end mb-5">
                            <span className="text-white/50 text-sm">Subtotal</span>
                            <span className="text-4xl font-bold tracking-tighter text-white">${data.total_amount.toFixed(2)}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button"
                                onClick={holdSale}
                                disabled={processing || data.items.length === 0}
                                className="py-3.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                <PauseCircle className="w-5 h-5" />
                                <span>Hold [F4]</span>
                            </button>
                            <button 
                                type="button"
                                onClick={openPaymentModal}
                                disabled={processing || data.items.length === 0}
                                className="py-3.5 bg-[#38BDF8] text-black rounded-xl font-bold hover:bg-[#0EA5E9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Pay [F9]</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0A0A0A] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center space-x-2">
                                    <CreditCard className="w-6 h-6 text-[#38BDF8]" />
                                    <span>Checkout Details</span>
                                </h3>
                                <button onClick={() => setIsPaymentModalOpen(false)} className="text-white/50 hover:text-white text-2xl">&times;</button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-white/60">
                                        <span>Cart Total:</span>
                                        <span>${data.total_amount.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-2 text-white/60">
                                            <Tag className="w-4 h-4" />
                                            <span>Discount Amount ($):</span>
                                        </div>
                                        <input 
                                            type="number"
                                            value={localDiscount}
                                            onChange={(e) => {
                                                setLocalDiscount(e.target.value);
                                                setLocalPaid(Math.max(0, data.total_amount - e.target.value - (localPoints/10)).toFixed(2));
                                            }}
                                            className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right focus:outline-none focus:border-[#38BDF8]"
                                        />
                                    </div>

                                    {selectedCustomer && (
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center space-x-2 text-white/60">
                                                <Award className="w-4 h-4 text-yellow-400" />
                                                <span>Use Points (Max {selectedCustomer.reward_points || 0}):</span>
                                            </div>
                                            <input 
                                                type="number"
                                                max={selectedCustomer.reward_points || 0}
                                                value={localPoints}
                                                onChange={(e) => {
                                                    const pts = Math.min(e.target.value, selectedCustomer.reward_points || 0);
                                                    setLocalPoints(pts);
                                                    setLocalPaid(Math.max(0, data.total_amount - localDiscount - (pts/10)).toFixed(2));
                                                }}
                                                className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right focus:outline-none focus:border-[#38BDF8]"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-white/10 pt-4">
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-white/80 font-medium">Final Total:</span>
                                        <span className="text-3xl font-bold text-[#38BDF8]">${calculateFinalTotal().toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-white/60 text-sm">Amount Paid by Customer ($):</label>
                                        <input 
                                            type="number"
                                            value={localPaid}
                                            onChange={(e) => setLocalPaid(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-[#38BDF8]"
                                        />
                                    </div>
                                    
                                    {calculateFinalTotal() - parseFloat(localPaid || 0) > 0 ? (
                                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex justify-between">
                                            <span>Remaining Due:</span>
                                            <span className="font-bold">${(calculateFinalTotal() - parseFloat(localPaid || 0)).toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex justify-between">
                                            <span>Change to Return:</span>
                                            <span className="font-bold">${(parseFloat(localPaid || 0) - calculateFinalTotal()).toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={confirmPayment}
                                    disabled={processing}
                                    className="w-full py-4 bg-[#38BDF8] text-black rounded-xl font-bold hover:bg-[#0EA5E9] transition-colors disabled:opacity-50 text-lg shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                                >
                                    {processing ? 'Processing...' : 'Confirm Payment'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Held Sales Modal */}
            <AnimatePresence>
                {isHeldSalesModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
                        >
                            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="text-lg font-medium flex items-center space-x-2">
                                    <Clock className="w-5 h-5 text-[#38BDF8]" />
                                    <span>Held Sales</span>
                                </h3>
                                <button onClick={() => setIsHeldSalesModalOpen(false)} className="text-white/50 hover:text-white text-xl">&times;</button>
                            </div>
                            
                            <div className="p-5 overflow-y-auto flex-1">
                                {loadingHeldSales ? (
                                    <div className="text-center text-white/50 py-10">Loading...</div>
                                ) : heldSales.length === 0 ? (
                                    <div className="text-center text-white/50 py-10">No held sales found.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {heldSales.map(order => (
                                            <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                                <div>
                                                    <div className="font-medium text-[#38BDF8]">{order.order_number}</div>
                                                    <div className="text-xs text-white/50 mt-1 flex space-x-3">
                                                        <span>{new Date(order.created_at).toLocaleString()}</span>
                                                        <span>•</span>
                                                        <span>{order.customer ? order.customer.name : 'Walk-in'}</span>
                                                        <span>•</span>
                                                        <span>{order.items.length} items</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <div className="font-bold">${order.total_amount.toFixed(2)}</div>
                                                    <button onClick={() => resumeSale(order._id)} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200">
                                                        Resume
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </PosLayout>
    );
}
