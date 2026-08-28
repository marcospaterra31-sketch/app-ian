import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon = toast.type === 'heart' ? (
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 shrink-0" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : toast.type === 'warning' ? (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
          );

          const borderBg = toast.type === 'heart' ? 'bg-pink-50 border-pink-200 text-pink-950' :
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-950' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-950' :
            'bg-blue-50 border-blue-200 text-blue-950';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-lg border ${borderBg}`}
            >
              <div className="flex items-center gap-2.5">
                {icon}
                <p className="text-xs md:text-sm font-semibold leading-tight">{toast.message}</p>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-black/5 transition-colors shrink-0"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
