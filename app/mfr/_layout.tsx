import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { Sidebar, SidebarItem } from '@/components/Sidebar';

const sidebarItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    path: '/mfr',
    description: 'Dashboard overview'
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: 'cube',
    path: '/mfr/inv',
    description: 'Manage stock levels'
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'receipt',
    path: '/mfr/orders',
    description: 'Track order status'
  },
  {
    id: 'revenue',
    label: 'Revenue',
    icon: 'cash',
    path: '/mfr/revenue',
    description: 'View analytics'
  },
];

export default function ManufacturerLayout() {
  const pathname = usePathname();

  // Don't show sidebar on profile page
  const showSidebar = pathname !== '/mfr/profile';

  return (
    <View style={styles.container}>
      {showSidebar ? (
        <View style={styles.content}>
          <Sidebar items={sidebarItems} role="manufacturer" />
          <View style={styles.main}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="inv" />
              <Stack.Screen name="orders" />
              <Stack.Screen name="revenue" />
              <Stack.Screen name="profile" />
            </Stack>
          </View>
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="inv" />
          <Stack.Screen name="orders" />
          <Stack.Screen name="revenue" />
          <Stack.Screen name="profile" />
        </Stack>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    ...Platform.select({
      web: {
        overflowY: 'auto' as any,
      },
    }),
  },
});
