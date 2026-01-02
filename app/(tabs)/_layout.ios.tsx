
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - 6 tabs (removed AI Style)
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'wardrobe',
      route: '/(tabs)/wardrobe',
      icon: 'shopping-bag',
      label: 'Wardrobe',
    },
    {
      name: 'wishlist',
      route: '/(tabs)/wishlist',
      icon: 'favorite',
      label: 'Wishlist',
    },
    {
      name: 'social',
      route: '/(tabs)/social',
      icon: 'group',
      label: 'Social',
    },
    {
      name: 'size-guide',
      route: '/(tabs)/size-guide',
      icon: 'straighten',
      label: 'Sizes',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  // For iOS, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="wardrobe" name="wardrobe" />
        <Stack.Screen key="wishlist" name="wishlist" />
        <Stack.Screen key="social" name="social" />
        <Stack.Screen key="size-guide" name="size-guide" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} containerWidth={294} />
    </>
  );
}
