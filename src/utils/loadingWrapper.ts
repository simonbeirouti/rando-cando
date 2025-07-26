export interface LoadingOptions {
  title?: string;
  message?: string;
  onComplete?: () => void;
}

export interface SuccessOptions {
  title?: string;
  message?: string;
  onClose?: () => void;
}

export interface ErrorOptions {
  title?: string;
  message?: string;
  onClose?: () => void;
}

export interface WrapperOptions {
  loading?: LoadingOptions;
  success?: (result: any) => SuccessOptions;
  error?: (error: any) => ErrorOptions;
}

// Global instance getter
export function getLoadingWrapper(wrapperId: string = "loading-wrapper") {
  if (typeof window === 'undefined') return null;
  
  const LoadingWrapperClass = (window as any).LoadingWrapper;
  if (!LoadingWrapperClass) {
    console.error('LoadingWrapper class not found. Make sure LoadingWrapper.astro is included in your page.');
    return null;
  }
  
  return new LoadingWrapperClass(wrapperId);
}

// Convenience functions for the default wrapper
export function showLoading(options?: LoadingOptions) {
  const wrapper = getLoadingWrapper();
  wrapper?.showLoading(options);
}

export function showSuccess(options?: SuccessOptions) {
  const wrapper = getLoadingWrapper();
  wrapper?.showSuccess(options);
}

export function showError(options?: ErrorOptions) {
  const wrapper = getLoadingWrapper();
  wrapper?.showError(options);
}

export function hideAll() {
  const wrapper = getLoadingWrapper();
  wrapper?.hideAll();
}

// Async operation wrapper
export async function wrapOperation<T>(
  operation: () => Promise<T>,
  options: WrapperOptions = {}
): Promise<T | null> {
  const wrapper = getLoadingWrapper();
  if (!wrapper) return null;
  
  return wrapper.wrap(operation, options);
}

// Transaction-specific helpers
export function showTransactionLoading(message: string = "Processing transaction...") {
  showLoading({
    title: "Transaction in Progress",
    message
  });
}

export function showTransactionSuccess(message?: string) {
  showSuccess({
    title: "Transaction Successful",
    message: message || "Your transaction has been completed successfully."
  });
}

export function showTransactionError(error: any) {
  const message = error instanceof Error ? error.message : 'Transaction failed. Please try again.';
  showError({
    title: "Transaction Failed",
    message
  });
}

// Set pending states that will be shown when loading is dismissed
export function setPendingSuccess(options?: SuccessOptions) {
  const wrapper = getLoadingWrapper();
  wrapper?.setPendingSuccess(options || { title: "Success!", message: "Operation completed successfully." });
}

export function setPendingError(options?: ErrorOptions) {
  const wrapper = getLoadingWrapper();
  wrapper?.setPendingError(options || { title: "Error", message: "An error occurred." });
}

export function setPendingTransactionSuccess(message?: string) {
  setPendingSuccess({
    title: "Transaction Successful",
    message: message || "Your transaction has been completed successfully."
  });
}

export function setPendingTransactionError(error: any) {
  const message = error instanceof Error ? error.message : 'Transaction failed. Please try again.';
  setPendingError({
    title: "Transaction Failed",
    message
  });
}
