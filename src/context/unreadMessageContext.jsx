
import React, { createContext, useContext, useState, useMemo } from "react";

const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({ children }) {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  const value = useMemo(() => ({ totalUnreadCount, setTotalUnreadCount }), [totalUnreadCount]);

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  return useContext(UnreadMessagesContext);
}