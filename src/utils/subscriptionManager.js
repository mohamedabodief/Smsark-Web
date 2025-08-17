/**
 * Subscription Manager for Firebase real-time subscriptions
 * 
 * This utility manages Firebase subscription functions outside of Redux state
 * to avoid non-serializable value warnings.
 */

class SubscriptionManager {
  constructor() {
    this.subscriptions = new Map();
  }

  /**
   * Add a subscription with a unique key
   * @param {string} key - Unique identifier for the subscription
   * @param {function} unsubscribe - Firebase unsubscribe function
   */
  add(key, unsubscribe) {
    // Clean up existing subscription if it exists
    this.remove(key);
    
    if (typeof unsubscribe === 'function') {
      this.subscriptions.set(key, unsubscribe);
      console.log(`Subscription added: ${key}`);
    } else {
      console.warn(`Invalid unsubscribe function for key: ${key}`);
    }
  }

  /**
   * Remove and unsubscribe a specific subscription
   * @param {string} key - Unique identifier for the subscription
   */
  remove(key) {
    const unsubscribe = this.subscriptions.get(key);
    if (unsubscribe) {
      try {
        unsubscribe();
        this.subscriptions.delete(key);
        console.log(`Subscription removed: ${key}`);
      } catch (error) {
        console.error(`Error removing subscription ${key}:`, error);
      }
    }
  }

  /**
   * Remove all subscriptions
   */
  removeAll() {
    for (const [key, unsubscribe] of this.subscriptions) {
      try {
        unsubscribe();
        console.log(`Subscription removed: ${key}`);
      } catch (error) {
        console.error(`Error removing subscription ${key}:`, error);
      }
    }
    this.subscriptions.clear();
  }

  /**
   * Check if a subscription exists
   * @param {string} key - Unique identifier for the subscription
   * @returns {boolean}
   */
  has(key) {
    return this.subscriptions.has(key);
  }

  /**
   * Get the number of active subscriptions
   * @returns {number}
   */
  size() {
    return this.subscriptions.size;
  }

  /**
   * Get all subscription keys
   * @returns {string[]}
   */
  getKeys() {
    return Array.from(this.subscriptions.keys());
  }
}

// Create a singleton instance
const subscriptionManager = new SubscriptionManager();

export default subscriptionManager;

// Export the class for testing or creating additional instances
export { SubscriptionManager };
