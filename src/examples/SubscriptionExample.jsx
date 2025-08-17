import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { subscribeToUserHomepageAds, setUserHomepageAds } from '../feature/ads/homepageAdsSlice';
import subscriptionManager from '../utils/subscriptionManager';
import useFirebaseSubscription from '../hooks/useFirebaseSubscription';
import HomepageAdvertisement from '../FireBase/modelsWithOperations/HomepageAdvertisement';

/**
 * Example component showing how to properly manage Firebase subscriptions
 * without storing non-serializable values in Redux state
 */

// Method 1: Using the subscription manager directly
const ExampleWithSubscriptionManager = ({ userId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const setupSubscription = async () => {
      try {
        // Dispatch the async thunk and get the unsubscribe function
        const result = await dispatch(subscribeToUserHomepageAds(userId)).unwrap();
        
        // Store the unsubscribe function in the subscription manager
        if (typeof result === 'function') {
          subscriptionManager.add(`user-ads-${userId}`, result);
        }
      } catch (error) {
        console.error('Error setting up subscription:', error);
      }
    };

    setupSubscription();

    // Cleanup on unmount or userId change
    return () => {
      subscriptionManager.remove(`user-ads-${userId}`);
    };
  }, [dispatch, userId]);

  return <div>Component content here...</div>;
};

// Method 2: Using the custom hook (recommended)
const ExampleWithCustomHook = ({ userId }) => {
  const dispatch = useDispatch();

  const { isSubscribed } = useFirebaseSubscription(
    `user-ads-${userId}`, // unique key
    () => {
      // Subscription function
      return HomepageAdvertisement.subscribeByUserId(userId, (ads) => {
        dispatch(setUserHomepageAds(ads));
      });
    },
    [userId], // dependencies
    !!userId // enabled when userId exists
  );

  return (
    <div>
      <p>Subscription status: {isSubscribed ? 'Active' : 'Inactive'}</p>
      {/* Component content here... */}
    </div>
  );
};

// Method 3: Direct subscription management (for simple cases)
const ExampleWithDirectSubscription = ({ userId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    // Create subscription directly
    const unsubscribe = HomepageAdvertisement.subscribeByUserId(userId, (ads) => {
      dispatch(setUserHomepageAds(ads));
    });

    // Store in subscription manager for centralized cleanup
    subscriptionManager.add(`direct-user-ads-${userId}`, unsubscribe);

    // Cleanup
    return () => {
      subscriptionManager.remove(`direct-user-ads-${userId}`);
    };
  }, [dispatch, userId]);

  return <div>Component content here...</div>;
};

// Method 4: Multiple subscriptions example
const ExampleWithMultipleSubscriptions = ({ userId, status }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    // Set up multiple subscriptions
    const subscriptions = [];

    // User ads subscription
    const userAdsUnsubscribe = HomepageAdvertisement.subscribeByUserId(userId, (ads) => {
      dispatch(setUserHomepageAds(ads));
    });
    subscriptions.push(['user-ads', userAdsUnsubscribe]);

    // Status-based ads subscription
    if (status) {
      const statusAdsUnsubscribe = HomepageAdvertisement.subscribeByStatus(status, (ads) => {
        // Handle status-based ads
        console.log('Status ads:', ads);
      });
      subscriptions.push(['status-ads', statusAdsUnsubscribe]);
    }

    // Add all subscriptions to manager
    subscriptions.forEach(([key, unsubscribe]) => {
      subscriptionManager.add(`multi-${key}-${userId}`, unsubscribe);
    });

    // Cleanup
    return () => {
      subscriptions.forEach(([key]) => {
        subscriptionManager.remove(`multi-${key}-${userId}`);
      });
    };
  }, [dispatch, userId, status]);

  return <div>Component with multiple subscriptions...</div>;
};

export {
  ExampleWithSubscriptionManager,
  ExampleWithCustomHook,
  ExampleWithDirectSubscription,
  ExampleWithMultipleSubscriptions
};
