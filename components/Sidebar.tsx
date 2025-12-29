import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path as any);
  };

  const isActive = (path: string) => {
    if (path === '/mfr' || path === '/slr' || path === '/lgt') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleProfilePress = () => {
    setShowMenu(false);
    if (user) {
      const roleRoutes = {
        seller: '/slr/profile',
        manufacturer: '/mfr/profile',
        logistics: '/lgt/profile',
      };
      router.push(roleRoutes[user.role]);
    }
  };

  const handleLogout = () => {
    setShowMenu(false);
    logout();
    router.replace('/');
  };

  return (
    <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
      {/* White Label / Logo */}
      {!isCollapsed && (
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="battery-charging" size={28} color="#4F46E5" />
          </View>
          <View style={styles.logoText}>
            <Text style={styles.logoTitle}>Battery Supply</Text>
            <Text style={styles.logoSubtitle}>Chain Platform</Text>
          </View>
        </View>
      )}

      {isCollapsed && (
        <View style={styles.logoContainerCollapsed}>
          <View style={styles.logoIconCollapsed}>
            <Ionicons name="battery-charging" size={24} color="#4F46E5" />
          </View>
        </View>
      )}

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

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Profile Section at Bottom */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={[styles.profileButton, isCollapsed && styles.profileButtonCollapsed]}
          onPress={() => setShowMenu(true)}
        >
          <Image
            source={{ uri: user?.profilePicture }}
            style={styles.profileImage}
          />
          {!isCollapsed && (
            <View style={styles.profileInfo}>
              <Text style={styles.profileName} numberOfLines={1}>{user?.name}</Text>
              <Text style={styles.profileRole} numberOfLines={1}>
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </Text>
            </View>
          )}
          {!isCollapsed && (
            <Ionicons name="ellipsis-horizontal" size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </View>

      {/* Profile Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Image
                source={{ uri: user?.profilePicture }}
                style={styles.menuProfileImage}
              />
              <View style={styles.menuUserInfo}>
                <Text style={styles.menuUserName}>{user?.name}</Text>
                <Text style={styles.menuUserEmail}>{user?.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>
                    {user?.role.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleProfilePress}
            >
              <Ionicons name="person-outline" size={20} color="#374151" />
              <Text style={styles.menuItemText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        height: '100vh',
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
  },
  sidebarCollapsed: {
    width: 72,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    flex: 1,
  },
  logoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 18,
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    lineHeight: 14,
  },
  logoContainerCollapsed: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoIconCollapsed: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapseButton: {
    alignSelf: 'flex-end',
    padding: 12,
    marginRight: 12,
    marginTop: 8,
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
  spacer: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  profileButtonCollapsed: {
    justifyContent: 'center',
    padding: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 11,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 80,
    paddingLeft: 20,
    ...Platform.select({
      web: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingBottom: 80,
        paddingLeft: 20,
      },
    }),
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 280,
    maxWidth: 320,
    marginLeft: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  menuProfileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  menuUserInfo: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuUserEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4F46E5',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderRadius: 8,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  menuItemTextDanger: {
    color: '#EF4444',
  },
});
