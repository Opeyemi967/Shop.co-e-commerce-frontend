// src/hooks/useConfirm.js
import { useState, useCallback } from "react";

/**
 * ✅ Professional confirmation hook
 * Replaces window.confirm with a custom modal
 * NOTE: This hook only manages state - the modal component is rendered separately
 */
export const useConfirm = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "warning",
    onConfirm: null,
    onCancel: null,
  });

  const showConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || "Confirm Action",
        message: options.message || "Are you sure you want to proceed?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        type: options.type || "warning",
        onConfirm: () => {
          resolve(true);
          setState((prev) => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          resolve(false);
          setState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const getConfirmProps = useCallback(() => {
    return {
      isOpen: state.isOpen,
      onClose: () => {
        if (state.onCancel) state.onCancel();
        closeConfirm();
      },
      onConfirm: () => {
        if (state.onConfirm) state.onConfirm();
        closeConfirm();
      },
      title: state.title,
      message: state.message,
      confirmText: state.confirmText,
      cancelText: state.cancelText,
      type: state.type,
    };
  }, [state, closeConfirm]);

  return {
    showConfirm,
    closeConfirm,
    getConfirmProps,
    isOpen: state.isOpen,
  };
};

export default useConfirm;
