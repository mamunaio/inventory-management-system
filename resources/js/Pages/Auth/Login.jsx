import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight, Activity, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: 'admin@injaazh.com',
        password: 'password123',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#000000] relative overflow-hidden font-sans">
            <Head title="Log in" />

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            {/* Elegant Purple/Blue Spotlight Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#6D28D9] to-[#38BDF8] opacity-20 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // Smooth Apple-like easing
                className="z-10 w-full max-w-[420px] p-6"
            >
                <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(109,40,217,0.15)] relative overflow-hidden">
                    
                    <div className="flex flex-col items-center mb-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#6D28D9] to-[#38BDF8] border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(109,40,217,0.3)]"
                        >
                            <Activity className="text-white w-6 h-6" strokeWidth={1.5} />
                        </motion.div>
                        
                        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1.5">
                            Welcome back
                        </h1>
                        <p className="text-white/60 text-sm text-center font-medium">
                            Log in to IG-Inventory Pro
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        {(errors.email || errors.password || status) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: "auto" }} 
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col space-y-1"
                            >
                                {status && <div className="text-sm text-green-400 flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>{status}</span></div>}
                                {errors.email && <div className="text-sm text-red-200 flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>{errors.email}</span></div>}
                                {errors.password && <div className="text-sm text-red-200 flex items-center space-x-2"><AlertCircle className="w-4 h-4" /><span>{errors.password}</span></div>}
                            </motion.div>
                        )}

                        <div className="space-y-3.5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/60 ml-1">Work Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#38BDF8] transition-colors duration-300">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@injaazh.com"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:bg-black/40 focus:border-[#6D28D9] text-white placeholder-white/30 text-sm transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-medium text-white/60">Password</label>
                                    {canResetPassword && (
                                        <Link href={route('password.request')} className="text-xs text-[#38BDF8] hover:text-white transition-colors">
                                            Forgot?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40 group-focus-within:text-[#38BDF8] transition-colors duration-300">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#6D28D9] focus:bg-black/40 focus:border-[#6D28D9] text-white placeholder-white/30 text-sm transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm pb-2">
                            <label className="flex items-center space-x-2 cursor-pointer ml-1">
                                <input 
                                    type="checkbox" 
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/10 bg-black/20 text-[#6D28D9] focus:ring-[#6D28D9]" 
                                />
                                <span className="text-white/60 hover:text-white transition-colors">Remember device</span>
                            </label>
                        </div>

                        <button
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            disabled={processing}
                            className="w-full mt-2 py-2.5 bg-gradient-to-r from-[#6D28D9] to-indigo-600 hover:from-[#6D28D9] hover:to-[#38BDF8] text-white rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_4px_14px_0_rgba(109,40,217,0.39)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.5)]"
                        >
                            <span>{processing ? "Authenticating..." : "Authenticate System"}</span>
                            {!processing && (
                                <ChevronRight 
                                    className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : "translate-x-0"}`} 
                                />
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <span className="text-xs font-medium text-white/40">
                            Injaazh Global Enterprise Systems
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
