import { toast } from 'sonner';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const baseClass =
    'rounded-xl px-4 py-3 text-sm font-medium shadow-md flex items-center gap-2 border';

export const notify = {
    success(message: string) {
        toast.success(message, {
            icon: <CheckCircle size={18} />,
            className: `toast-success ${baseClass}`,
        });
    },

    error(message: string) {
        toast.error(message, {
            icon: <XCircle size={18} />,
            className: `toast-error ${baseClass}`,
        });
    },

    warning(message: string) {
        toast(message, {
            icon: <AlertTriangle size={18} />,
            className: `toast-warning ${baseClass}`,
        });
    },
};
