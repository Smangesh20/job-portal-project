import React, { createContext, useContext, useState, useCallback } from 'react';
import { translateError, createSuccessNotification, createInfoNotification, createWarningNotification } from './notificationService';

/**
 * Notification Context
 * 
 * Provides centralized notification management across the application
 * Integrates with error translation service
 * 
 * Validates: Requirements 4.1, 4.2
 */

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    details: null,
    correlationId: null,
  });

  /**
   * Show notification
   */
  const showNotification = useCallback((message, severity = 'info', details = null) => {
    setNotification({
      open: true,
      message,
      severity,
      details,
      correlationId: null,
    });
  }, []);

  /**
   * Show error notification from API error
   */
  const showError = useCallback((error) => {
    const translated = translateError(error);
    setNotification({
      open: true,
      message: translated.message,
      severity: translated.severity,
      details: translated.details,
      correlationId: translated.correlationId,
    });
  }, []);

  /**
   * Show success notification
   */
  const showSuccess = useCallback((message) => {
    const notification = createSuccessNotification(message);
    setNotification({
      open: true,
      message: notification.message,
      severity: notification.severity,
      details: null,
      correlationId: null,
    });
  }, []);

  /**
   * Show info notification
   */
  const showInfo = useCallback((message) => {
    const notification = createInfoNotification(message);
    setNotification({
      open: true,
      message: notification.message,
      severity: notification.severity,
      details: null,
      correlationId: null,
    });
  }, []);

  /**
   * Show warning notification
   */
  const showWarning = useCallback((message) => {
    const notification = createWarningNotification(message);
    setNotification({
      open: true,
      message: notification.message,
      severity: notification.severity,
      details: null,
      correlationId: null,
    });
  }, []);

  /**
   * Close notification
   */
  const closeNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false,
    }));
  }, []);

  const value = {
    notification,
    showNotification,
    showError,
    showSuccess,
    showInfo,
    showWarning,
    closeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
