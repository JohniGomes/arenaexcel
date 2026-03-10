import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar } from 'react-native-paper';

interface SnackbarContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'success' | 'error' | 'info'>('info');

  const showSnackbar = (msg: string, snackType: 'success' | 'error' | 'info') => {
    setMessage(msg);
    setType(snackType);
    setVisible(true);
  };

  const showSuccess = (msg: string) => showSnackbar(msg, 'success');
  const showError = (msg: string) => showSnackbar(msg, 'error');
  const showInfo = (msg: string) => showSnackbar(msg, 'info');

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#58CC02';
      case 'error':
        return '#FF4B4B';
      default:
        return '#3C3C3C';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{ backgroundColor: getBackgroundColor() }}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};
