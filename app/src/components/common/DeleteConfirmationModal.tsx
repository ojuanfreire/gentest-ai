import { AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
};

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title = "Excluir Item",
  message = "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
}: DeleteConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 transition-all"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md scale-100 rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/50 ring-1 ring-white/5"
          >
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)] ring-1 ring-red-500/20">
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

              <p className="text-sm leading-relaxed text-slate-400">
                {message}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <Button
                onClick={onClose}
                disabled={isDeleting}
                className="w-full rounded-lg border border-slate-700 bg-transparent py-2.5 font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </Button>

              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 py-2.5 font-semibold text-white shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-400 transition-all border-none"
              >
                {isDeleting ? (
                  "Excluindo..."
                ) : (
                  <>
                    <Trash2 size={18} /> Sim, Excluir
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
