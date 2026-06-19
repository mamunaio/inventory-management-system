import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { motion } from "framer-motion";
import { Store, MapPin, Phone, Mail, DollarSign, Percent, Save, CheckCircle } from "lucide-react";
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function SettingsIndex({ settings }) {
    const { flash } = usePage().props;
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        store_name: settings.store_name || '',
        store_address: settings.store_address || '',
        store_phone: settings.store_phone || '',
        store_email: settings.store_email || '',
        currency_symbol: settings.currency_symbol || '$',
        tax_rate: settings.tax_rate || '0'
    });

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        post(route('settings.update'));
    };

    return (
        <EnterpriseLayout title="Store Settings">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight mb-1">Store Settings</h1>
                    <p className="text-sm text-white/50">Manage your store's global configuration and details.</p>
                </div>
            </div>

            {showSuccess && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-center space-x-3"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>{flash.success}</span>
                </motion.div>
            )}

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* General Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md space-y-6"
                    >
                        <h2 className="text-lg font-medium border-b border-white/10 pb-4 flex items-center space-x-2">
                            <Store className="w-5 h-5 text-[#38BDF8]" />
                            <span>General Information</span>
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Store Name</label>
                            <div className="relative">
                                <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input 
                                    type="text" 
                                    value={data.store_name} 
                                    onChange={e => setData('store_name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    placeholder="e.g. My Super Shop"
                                />
                            </div>
                            {errors.store_name && <p className="text-red-400 text-xs mt-1">{errors.store_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Store Address</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 absolute left-3 top-3 text-white/40" />
                                <textarea 
                                    value={data.store_address} 
                                    onChange={e => setData('store_address', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8] h-24" 
                                    placeholder="Full store address..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Phone Number</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input 
                                        type="text" 
                                        value={data.store_phone} 
                                        onChange={e => setData('store_phone', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input 
                                        type="email" 
                                        value={data.store_email} 
                                        onChange={e => setData('store_email', e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Financial Settings */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl bg-[#0A0A0A]/50 border border-white/10 backdrop-blur-md space-y-6"
                    >
                        <h2 className="text-lg font-medium border-b border-white/10 pb-4 flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-green-400" />
                            <span>Financial Settings</span>
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Currency Symbol</label>
                            <div className="relative">
                                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input 
                                    type="text" 
                                    value={data.currency_symbol} 
                                    onChange={e => setData('currency_symbol', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    placeholder="e.g. $, ৳, €"
                                />
                            </div>
                            <p className="text-xs text-white/40 mt-2">This symbol will be used across the POS and invoices.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Default Tax Rate (%)</label>
                            <div className="relative">
                                <Percent className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={data.tax_rate} 
                                    onChange={e => setData('tax_rate', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#38BDF8]" 
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-xs text-white/40 mt-2">Will be applied to new orders if tax is enabled.</p>
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full px-6 py-3 bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] text-white rounded-xl text-sm font-medium hover:shadow-[0_0_20px_rgba(109,40,217,0.4)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                <span>{processing ? 'Saving...' : 'Save Settings'}</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </form>
        </EnterpriseLayout>
    );
}
