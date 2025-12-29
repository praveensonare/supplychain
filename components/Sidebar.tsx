import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  role: 'manufacturer' | 'seller' | 'logistics';
}

export function Sidebar({ items, role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  const isActive = (path: string) => {
    if (path === '/mfr' || path === '/slr' || path === '/lgt') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
      {/* Collapse Toggle Button */}
      <TouchableOpacity
        style={styles.collapseButton}
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Ionicons
          name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {/* Navigation Items */}
      <View style={styles.navItems}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.navItem,
              isActive(item.path) && styles.navItemActive,
              isCollapsed && styles.navItemCollapsed,
            ]}
            onPress={() => handleNavigation(item.path)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={isActive(item.path) ? '#4F46E5' : '#6B7280'}
            />
            {!isCollapsed && (
              <Text
                style={[
                  styles.navItemText,
                  isActive(item.path) && styles.navItemTextActive,
                ]}
              >
                {item.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    paddingTop: 20,
    paddingBottom: 20,
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        height: '100vh',
        transition: 'width 0.3s ease',
      },
    }),
  },
  sidebarCollapsed: {
    width: 72,
  },
  collapseButton: {
    alignSelf: 'flex-end',
    padding: 12,
    marginRight: 12,
    marginBottom: 8,
  },
  navItems: {
    gap: 4,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navItemActive: {
    backgroundColor: '#EEF2FF',
  },
  navItemText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  navItemTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});
