
// Remove this file as it's causing conflicts with the main toast system
// The main toast functionality is handled by sonner
export const useToast = () => {
  console.warn("This useToast hook is deprecated. Use 'toast' from 'sonner' instead.");
  return { toast: () => {} };
};

export const toast = () => {
  console.warn("This toast function is deprecated. Use 'toast' from 'sonner' instead.");
};
