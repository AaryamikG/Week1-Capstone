import { createContext } from "react";
import type { ToastKind } from "../components/Toast";

export interface ToastContextValue {
  showToast: (kind: ToastKind, message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);
