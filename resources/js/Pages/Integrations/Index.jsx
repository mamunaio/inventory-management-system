import EnterpriseLayout from '@/Layouts/EnterpriseLayout';
import { useForm } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Link2, Webhook, Key, ShoppingBag, Store, Power, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from '@/Hooks/useToast';

export default function IntegrationsIndex({ integrations }) {
    const { toast } = useToast();
    
    const shopifyIntegration = integrations.find(i => i.platform === 'Shopify');
    const wooIntegration = integrations.find(i => i.platform === 'WooCommerce');

    const form = useForm({
        platform: 'Shopify',
        api_key: '',
        store_url: '',
        auto_sync: true
    });

    const handleConnect = (platform) => {
        form.setData('platform', platform);
        form.post(route('integrations.storeOrUpdate'), {
            onSuccess: () => {
                toast({ title: 'Success', description: `${platform} connected successfully.` });
            }
        });
    };

    const handleDisconnect = (id) => {
        if(confirm('Are you sure you want to disconnect this integration?')) {
            form.delete(route('integrations.destroy', id), {
                onSuccess: () => toast({ title: 'Success', description: 'Integration disconnected.' })
            });
        }
    };

    const IntegrationCard = ({ platform, existingData, icon: Icon, colorClass, borderClass }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl bg-[#0A0A0A]/80 border ${existingData ? borderClass : 'border-white/10'} relative overflow-hidden group`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass} opacity-5 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none`}></div>
            
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${colorClass}`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{platform}</h3>
                        <p className="text-sm text-white/50">
                            {existingData ? 'Connected & syncing' : 'Not connected'}
                        </p>
                    </div>
                </div>
                {existingData && (
                    <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        <span>Active</span>
                    </div>
                )}
            </div>

            {existingData ? (
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white/50">Store URL:</span>
                            <span className="text-white font-medium">{existingData.store_url}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-white/50">Auto Sync:</span>
                            <span className="text-white font-medium">{existingData.auto_sync ? 'Enabled' : 'Disabled'}</span>
                        </div>
                    </div>
                    
                    <div className="flex space-x-3">
                        <button className="flex-1 py-2.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2">
                            <RefreshCw className="w-4 h-4" />
                            <span>Force Sync</span>
                        </button>
                        <button onClick={() => handleDisconnect(existingData._id || existingData.id)} className="px-4 py-2.5 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleConnect(platform); }} 
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Store URL</label>
                        <div className="relative">
                            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input 
                                type="url" 
                                required
                                placeholder="https://yourstore.myshopify.com"
                                value={form.data.platform === platform ? form.data.store_url : ''}
                                onChange={e => { form.setData('platform', platform); form.setData('store_url', e.target.value); }}
                                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8]"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">Admin API Access Token</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input 
                                type="password" 
                                required
                                placeholder="shpat_..."
                                value={form.data.platform === platform ? form.data.api_key : ''}
                                onChange={e => { form.setData('platform', platform); form.setData('api_key', e.target.value); }}
                                className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8]"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={form.processing}
                        className={`w-full py-2.5 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                            platform === 'Shopify' 
                                ? 'bg-[#95BF47] hover:bg-[#7fa33b]' 
                                : 'bg-[#96588a] hover:bg-[#7d4872]'
                        }`}
                    >
                        <Power className="w-4 h-4" />
                        <span>Connect {platform}</span>
                    </button>
                </form>
            )}
        </motion.div>
    );

    return (
        <EnterpriseLayout title="E-Commerce Integrations">
            <div className="mb-8 max-w-4xl">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">E-Commerce Integrations (Hub)</h1>
                <p className="text-sm text-white/50">
                    Connect your IG-Inventory Pro system to your online stores. When auto-sync is active, 
                    inventory levels will automatically update on your website whenever a local sale or restock occurs.
                </p>
                <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Webhook className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-blue-400 font-medium">Running in Simulation Mode</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <IntegrationCard 
                    platform="Shopify" 
                    icon={ShoppingBag} 
                    existingData={shopifyIntegration} 
                    colorClass="text-[#95BF47]"
                    borderClass="border-[#95BF47]/30"
                />

                <IntegrationCard 
                    platform="WooCommerce" 
                    icon={Store} 
                    existingData={wooIntegration} 
                    colorClass="text-[#96588a]"
                    borderClass="border-[#96588a]/30"
                />
            </div>
        </EnterpriseLayout>
    );
}
