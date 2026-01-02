
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, usePlacement } from 'expo-superwall';

interface SubscriptionContextType {
  isSubscribed: boolean;
  isTrialActive: boolean;
  loading: boolean;
  showPaywall: () => Promise<void>;
  subscriptionStatus: string;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { subscriptionStatus, user } = useUser();
  const { registerPlacement } = usePlacement({
    onPresent: (info) => console.log('Paywall presented:', info),
    onDismiss: (info, result) => console.log('Paywall dismissed:', result),
    onError: (error) => console.error('Paywall error:', error),
  });

  const isSubscribed = subscriptionStatus?.status === 'ACTIVE';
  const isTrialActive = false; // Superwall manages trial state internally
  const loading = false;

  const showPaywall = async () => {
    await registerPlacement({
      placement: 'premium_features',
      feature: () => {
        console.log('User has access to premium features');
      },
    });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed,
        isTrialActive,
        loading,
        showPaywall,
        subscriptionStatus: subscriptionStatus?.status || 'UNKNOWN',
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
