import { useEffect, useRef } from 'react';
import subscriptionManager from '../utils/subscriptionManager';

/**
 * Custom hook for managing Firebase subscriptions
 * 
 * This hook properly manages Firebase subscriptions outside of Redux state
 * to avoid non-serializable value warnings.
 * 
 * @param {string} key - Unique identifier for the subscription
 * @param {function} subscriptionFunction - Function that returns an unsubscribe function
 * @param {array} dependencies - Dependencies array for useEffect
 * @param {boolean} enabled - Whether the subscription should be active
 */
export const useFirebaseSubscription = (
  key, 
  subscriptionFunction, 
  dependencies = [], 
  enabled = true
) => {
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !subscriptionFunction || !key) {
      return;
    }

    // Clean up any existing subscription with this key
    subscriptionManager.remove(key);

    try {
      // Create new subscription
      const unsubscribe = subscriptionFunction();
      
      if (typeof unsubscribe === 'function') {
        subscriptionManager.add(key, unsubscribe);
        isSubscribedRef.current = true;
      } else {
        console.warn(`Subscription function for key "${key}" did not return a valid unsubscribe function`);
      }
    } catch (error) {
      console.error(`Error setting up subscription for key "${key}":`, error);
    }

    // Cleanup function
    return () => {
      subscriptionManager.remove(key);
      isSubscribedRef.current = false;
    };
  }, [key, enabled, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSubscribedRef.current) {
        subscriptionManager.remove(key);
      }
    };
  }, [key]);

  return {
    isSubscribed: isSubscribedRef.current,
    unsubscribe: () => subscriptionManager.remove(key),
  };
};

/**
 * Hook for managing multiple Firebase subscriptions
 * 
 * @param {object} subscriptions - Object with subscription configurations
 * @param {boolean} enabled - Whether subscriptions should be active
 */
export const useMultipleFirebaseSubscriptions = (subscriptions, enabled = true) => {
  const subscriptionKeys = useRef(new Set());

  useEffect(() => {
    if (!enabled || !subscriptions) {
      return;
    }

    // Set up all subscriptions
    Object.entries(subscriptions).forEach(([key, config]) => {
      if (config.subscriptionFunction) {
        try {
          const unsubscribe = config.subscriptionFunction();
          if (typeof unsubscribe === 'function') {
            subscriptionManager.add(key, unsubscribe);
            subscriptionKeys.current.add(key);
          }
        } catch (error) {
          console.error(`Error setting up subscription for key "${key}":`, error);
        }
      }
    });

    // Cleanup function
    return () => {
      subscriptionKeys.current.forEach(key => {
        subscriptionManager.remove(key);
      });
      subscriptionKeys.current.clear();
    };
  }, [enabled, JSON.stringify(Object.keys(subscriptions))]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscriptionKeys.current.forEach(key => {
        subscriptionManager.remove(key);
      });
      subscriptionKeys.current.clear();
    };
  }, []);

  return {
    unsubscribeAll: () => {
      subscriptionKeys.current.forEach(key => {
        subscriptionManager.remove(key);
      });
      subscriptionKeys.current.clear();
    },
  };
};

export default useFirebaseSubscription;
