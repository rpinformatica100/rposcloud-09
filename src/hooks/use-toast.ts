
import { toast as sonnerToast } from "sonner"

// Unified toast system using Sonner with backward compatibility
export const toast = (options: string | { title: string; description?: string; variant?: string }) => {
  if (typeof options === 'string') {
    return sonnerToast(options);
  }
  
  const { title, description, variant } = options;
  
  if (variant === 'destructive') {
    return sonnerToast.error(title, { description });
  }
  
  return sonnerToast.success(title, { description });
};

export const useToast = () => {
  return {
    toast,
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
