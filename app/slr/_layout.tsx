import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { Sidebar, SidebarItem } from '@/components/Sidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems: SidebarItem[] = [
  { id: 'home', label: 'Home', icon: 'home', path: '/slr' },
  { id: 'inventory', label: 'Inventory', icon: 'cube', path: '/slr/inv' },
  { id: 'orders', label: 'Orders', icon: 'receipt', path: '/slr/orders' },
  { id: 'revenue', label: 'Revenue', icon: 'cash', path: '/slr/revenue' },
];

export default function SellerLayout() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show sidebar on profile page
  const showSidebar = pathname !== '/slr/profile';

  const getPageTitle = () => {
    if (pathname === '/slr') return 'Seller Dashboard';
    if (pathname === '/slr/inv') return 'Inventory Management';
    if (pathname === '/slr/orders') return 'Orders';
    if (pathname === '/slr/revenue') return 'Revenue & Analytics';
    if (pathname === '/slr/profile') return 'Profile';
    return 'Seller Dashboard';
  };

  return (
    <View style={styles.container}>
      {showSidebar && (
        <>
          <DashboardHeader
            title={getPageTitle()}
            subtitle={user ? `Welcome, ${user.name}` : ''}
          />
          <View style={styles.content}>
            <Sidebar items={sidebarItems} role="seller" />
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
