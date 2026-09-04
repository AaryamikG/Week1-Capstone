import "./Toast.css";

export type ToastKind = "success" | "error";

export interface ToastData {
  id: number;
  kind: ToastKind;
  message: string;
}

export default function Toast({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.kind}`}>
          <span>{toast.message}</span>
          <button
            className="toast-dismiss"
            aria-label="Dismiss"
            onClick={() => onDismiss(toast.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
