
import { toast as sonnerToast } from "sonner"

// Unified toast system using Sonner
export const toast = sonnerToast;

export const useToast = () => {
  return {
    toast: sonnerToast,
    dismiss: sonnerToast.dismiss,
  };
};

// Export individual toast methods for convenience
export const toastSuccess = (message: string, description?: string) => {
  sonnerToast.success(message, { description });
};

export const toastError = (message: string, description?: string) => {
  sonnerToast.error(message, { description });
};

export const toastInfo = (message: string, description?: string) => {
  sonnerToast.info(message, { description });
};

export const toastWarning = (message: string, description?: string) => {
  sonnerToast.warning(message, { description });
};
