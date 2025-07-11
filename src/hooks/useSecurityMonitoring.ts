
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    if (!user) return;

    try {
      await supabase.rpc('log_security_event', {
        p_action: event.action,
        p_resource_type: event.resource_type,
        p_resource_id: event.resource_id || null,
        p_details: event.details || null
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const logFailedLogin = (email: string) => {
    logSecurityEvent({
      action: 'LOGIN_FAILED',
      resource_type: 'auth',
      details: { email }
    });
  };

  const logSuccessfulLogin = () => {
    logSecurityEvent({
      action: 'LOGIN_SUCCESS',
      resource_type: 'auth'
    });
  };

  const logItemCreated = (itemId: string) => {
    logSecurityEvent({
      action: 'ITEM_CREATED',
      resource_type: 'item',
      resource_id: itemId
    });
  };

  const logItemDeleted = (itemId: string) => {
    logSecurityEvent({
      action: 'ITEM_DELETED',
      resource_type: 'item',
      resource_id: itemId
    });
  };

  const logProfileUpdated = () => {
    logSecurityEvent({
      action: 'PROFILE_UPDATED',
      resource_type: 'profile'
    });
  };

  const logSuspiciousActivity = (activity: string, details?: Record<string, any>) => {
    logSecurityEvent({
      action: 'SUSPICIOUS_ACTIVITY',
      resource_type: 'security',
      details: { activity, ...details }
    });
  };

  // Monitor for suspicious patterns
  useEffect(() => {
    if (!user) return;

    // Monitor for rapid-fire requests
    let requestCount = 0;
    const requestWindow = 60000; // 1 minute
    const maxRequestsPerMinute = 100;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      requestCount++;
      
      if (requestCount > maxRequestsPerMinute) {
        logSuspiciousActivity('EXCESSIVE_API_REQUESTS', {
          count: requestCount,
          window: requestWindow
        });
      }

      return originalFetch(...args);
    };

    // Reset counter every minute
    const interval = setInterval(() => {
      requestCount = 0;
    }, requestWindow);

    return () => {
      window.fetch = originalFetch;
      clearInterval(interval);
    };
  }, [user]);

  return {
    logSecurityEvent,
    logFailedLogin,
    logSuccessfulLogin,
    logItemCreated,
    logItemDeleted,
    logProfileUpdated,
    logSuspiciousActivity
  };
};
