import { create } from 'zustand';

export type AlertType = 'success' | 'error' | 'info';

interface AlertState {
  isOpen: boolean;
  title: string;
  message: string;
  type: AlertType;
  showCancel: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  showAlert: (title: string, message: string, type?: AlertType, onConfirm?: () => void, showCancel?: boolean, onCancel?: () => void) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  type: 'info',
  showCancel: false,
  onConfirm: undefined,
  onCancel: undefined,
  showAlert: (title, message, type = 'info', onConfirm = undefined, showCancel = false, onCancel = undefined) => 
    set({ isOpen: true, title, message, type, onConfirm, showCancel, onCancel }),
  hideAlert: () => 
    set({ isOpen: false, onConfirm: undefined, onCancel: undefined })
}));
