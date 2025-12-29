import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { Sidebar, SidebarItem } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/mfr' },
  { id: 'inventory', label: 'Inventory', icon: 'cube', path: '/mfr/inv' },
  { id: 'orders', label: 'Orders', icon: 'receipt', path: '/mfr/orders' },
  { id: 'revenue', label: 'Revenue', icon: 'cash', path: '/mfr/revenue' },
];

export default function ManufacturerLayout() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show sidebar on profile page
  const showSidebar = pathname !== '/mfr/profile';

  const getPageTitle = () => {
    if (pathname === '/mfr') return 'Dashboard';
    if (pathname === '/mfr/inv') return 'Inventory Management';
    if (pathname === '/mfr/orders') return 'Orders';
    if (pathname === '/mfr/revenue') return 'Revenue & Analytics';
    if (pathname === '/mfr/profile') return 'Profile';
    return 'Dashboard';
  };

  return (
    <View style={styles.container}>
      {showSidebar && (
        <>
          <DashboardHeader title={getPageTitle()} />
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
        </>
      )}
      {!showSidebar && (
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
