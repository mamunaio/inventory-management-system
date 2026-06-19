import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, X, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_TYPES = {
    success: {
        icon: CheckCircle,
        bg: 'bg-green-500/10 border-green-500/30',
        iconColor: 'text-green-400',
        progressColor: 'bg-green-400',
    },
    error: {
        icon: XCircle,
        bg: 'bg-red-500/10 border-red-500/30',
        iconColor: 'text-red-400',
        progressColor: 'bg-red-400',
    },
    warning: {
        icon: AlertTriangle,
        bg: 'bg-yellow-500/10 border-yellow-500/30',
        iconColor: 'text-yellow-400',
        progressColor: 'bg-yellow-400',
    },
    info: {
        icon: Info,
        bg: 'bg-blue-500/10 border-blue-500/30',
        iconColor: 'text-blue-400',
        progressColor: 'bg-blue-400',
    },
};

let toastId = 0;

function Toast({ toast, onRemove }) {
    const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${config.bg} min-w-[320px] max-w-[420px]`}
        >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
            <div className="flex-1 min-w-0">
                {toast.title && (
                    <p className="text-sm font-semibold text-white mb-0.5">{toast.title}</p>
                )}
                <p className="text-sm text-white/70">{toast.message}</p>
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
                <X className="w-4 h-4" />
            </button>
            <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl origin-left ${config.progressColor}`}
            />
        </motion.div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', options = {}) => {
        const id = ++toastId;
        const duration = options.duration || 4000;
        setToasts(prev => [...prev, { id, message, type, title: options.title, duration }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg, opts) => addToast(msg, 'success', opts),
        error: (msg, opts) => addToast(msg, 'error', opts),
        warning: (msg, opts) => addToast(msg, 'warning', opts),
        info: (msg, opts) => addToast(msg, 'info', opts),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <div key={t.id} className="pointer-events-auto relative">
                            <Toast toast={t} onRemove={removeToast} />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
