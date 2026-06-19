import FlashToast from '@/Components/FlashToast';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Monitor } from 'lucide-react';
import { ToastProvider } from '@/Hooks/useToast';

export default function PosLayout({ children, title }) {
    return (
        <ToastProvider>
            <div className="flex flex-col h-screen w-full bg-[#000000] text-white font-sans overflow-hidden">
                <FlashToast />
                <Head title={title} />
                
                {/* Top Navigation Bar */}
                <header className="h-16 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
                    <div className="flex items-center space-x-4">
                        <Link href={route('dashboard')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center">
                                <Monitor className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">POS Terminal</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-green-400">Terminal Online</span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex overflow-hidden">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
