import { AlertTriangle } from "lucide-react";
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-500/10 p-3 text-red-500">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-2 text-sm text-slate-400">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={onClose}
            disabled={isDeleting}
            className="w-full rounded-md bg-slate-700 text-white hover:bg-slate-600 transition-colors font-semibold py-2"
          >
            Cancelar
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-semibold py-2"
          >
            {isDeleting ? "Excluindo..." : "Sim, Excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
};
