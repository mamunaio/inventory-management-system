import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, PackagePlus } from 'lucide-react';
import { useEffect } from 'react';

export default function PurchasesCreate({ suppliers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        product_id: '',
        quantity: 1,
        unit_cost: '',
        total_cost: ''
    });

    useEffect(() => {
        if (data.quantity && data.unit_cost) {
            setData('total_cost', (parseFloat(data.quantity) * parseFloat(data.unit_cost)).toFixed(2));
        } else {
            setData('total_cost', '');
        }
    }, [data.quantity, data.unit_cost]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    return (
        <EnterpriseLayout title="Receive Stock">
            <div className="flex items-center space-x-4 mb-8">
                <Link href={route('purchases.index')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-white/70" />
                </Link>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Receive Stock</h1>
                    <p className="text-sm text-white/50">Log incoming shipments and auto-update inventory.</p>
                </div>
            </div>

            <div className="max-w-2xl bg-[#0A0A0A]/50 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Select Supplier</label>
                            <select 
                                required
                                value={data.supplier_id} 
                                onChange={e => setData('supplier_id', e.target.value)} 
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                            >
                                <option value="" className="bg-[#0A0A0A]">Choose a supplier...</option>
                                {suppliers.map(sup => (
                                    <option key={sup._id} value={sup._id} className="bg-[#0A0A0A]">{sup.name}</option>
                                ))}
                            </select>
                            {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Select Product</label>
                            <select 
                                required
                                value={data.product_id} 
                                onChange={e => setData('product_id', e.target.value)} 
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white"
                            >
                                <option value="" className="bg-[#0A0A0A]">Choose a product...</option>
                                {products.map(prod => (
                                    <option key={prod._id} value={prod._id} className="bg-[#0A0A0A]">{prod.name} (Current: {prod.stock})</option>
                                ))}
                            </select>
                            {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Quantity Received</label>
                            <input 
                                type="number" 
                                min="1" 
                                required
                                value={data.quantity} 
                                onChange={e => setData('quantity', e.target.value)} 
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white" 
                            />
                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Unit Cost ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                min="0" 
                                required
                                value={data.unit_cost} 
                                onChange={e => setData('unit_cost', e.target.value)} 
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] text-white" 
                            />
                            {errors.unit_cost && <p className="text-red-500 text-xs mt-1">{errors.unit_cost}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Total Cost ($)</label>
                            <input 
                                type="number" 
                                readOnly
                                value={data.total_cost} 
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#38BDF8] font-bold cursor-not-allowed" 
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                            <PackagePlus className="w-5 h-5" />
                            <span>Confirm Restock</span>
                        </button>
                    </div>
                </form>
            </div>
        </EnterpriseLayout>
    );
}
