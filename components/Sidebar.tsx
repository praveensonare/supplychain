import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export interface SidebarItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
  description?: string;
}

interface SidebarProps {
  items: SidebarItem[];
  role: 'manufacturer' | 'seller' | 'logistics';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_MOBILE = SCREEN_WIDTH < 768;

export function Sidebar({ items, role }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(!IS_MOBILE);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path as any);
    if (IS_MOBILE) {
      setIsOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/mfr' || path === '/slr' || path === '/lgt') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleProfilePress = () => {
    setShowProfileMenu(false);
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
    setShowProfileMenu(false);
    logout();
    router.replace('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Hamburger Menu Button (for mobile)
  const HamburgerButton = () => (
    <TouchableOpacity
      style={styles.hamburgerButton}
      onPress={toggleSidebar}
    >
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </TouchableOpacity>
  );

  const SidebarContent = () => (
    <View style={styles.sidebarContent}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        {!isCollapsed ? (
          <View style={styles.logoContainer}>
            <View style={styles.logoImageContainer}>
              <Ionicons name="business" size={24} color="#fff" />
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={styles.companyName}>{user?.company}</Text>
              <Text style={styles.companyTagline}>Supply Chain</Text>
            </View>
          </View>
        ) : (
          <View style={styles.logoContainerCollapsed}>
            <View style={styles.logoImageContainerSmall}>
              <Ionicons name="business" size={20} color="#fff" />
            </View>
          </View>
        )}
        {IS_MOBILE && !isCollapsed && (
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtnMobile}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Collapse Toggle Button - Desktop Only - Fixed on right edge */}
      {!IS_MOBILE && (
        <TouchableOpacity
          style={styles.collapseToggle}
          onPress={() => setIsCollapsed(!isCollapsed)}
        >
          <View style={styles.collapseToggleCircle}>
            <Ionicons
              name={isCollapsed ? 'chevron-forward' : 'chevron-back'}
              size={16}
              color="#4F46E5"
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Navigation Items */}
      <View style={styles.navigationSection}>
        <View style={styles.navItems}>
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  active && styles.navItemActive,
                  isCollapsed && styles.navItemCollapsed
                ]}
                onPress={() => handleNavigation(item.path)}
                activeOpacity={0.7}
              >
                <View style={[styles.navItemIconContainer, active && styles.navItemIconActive]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={active ? '#4F46E5' : '#6B7280'}
                  />
                </View>
                {!isCollapsed && (
                  <View style={styles.navItemContent}>
                    <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text style={styles.navItemDescription}>{item.description}</Text>
                    )}
                  </View>
                )}
                {active && <View style={styles.navItemActiveIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Spacer to push profile to bottom */}
      <View style={styles.spacer} />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity
          style={[styles.profileButton, isCollapsed && styles.profileButtonCollapsed]}
          onPress={() => setShowProfileMenu(true)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: user?.profilePicture }}
            style={styles.profileImage as any}
          />
          {!isCollapsed && (
            <>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName} numberOfLines={1}>
                  {user?.name}
                </Text>
                <Text style={styles.profileEmail} numberOfLines={1}>
                  {user?.email}
                </Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      {/* Hamburger Menu Button - Only on Mobile */}
      {IS_MOBILE && !isOpen && <HamburgerButton />}

      {/* Sidebar - Desktop always visible, Mobile as Modal */}
      {IS_MOBILE ? (
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent
          onRequestClose={toggleSidebar}
        >
          <View style={styles.mobileOverlay}>
            <TouchableOpacity
              style={styles.mobileBackdrop}
              activeOpacity={1}
              onPress={toggleSidebar}
            />
            <View style={styles.mobileSidebar}>
              <SidebarContent />
            </View>
          </View>
        </Modal>
      ) : (
        <View style={[styles.desktopSidebar, isCollapsed && styles.desktopSidebarCollapsed]}>
          <SidebarContent />
        </View>
      )}

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity
          style={styles.profileMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenuContainer}>
            <View style={styles.profileMenuHeader}>
              <Image
                source={{ uri: user?.profilePicture }}
                style={styles.profileMenuImage as any}
              />
              <View style={styles.profileMenuInfo}>
                <Text style={styles.profileMenuName}>{user?.name}</Text>
                <Text style={styles.profileMenuEmail}>{user?.email}</Text>
                <View style={styles.profileMenuRoleBadge}>
                  <Text style={styles.profileMenuRoleText}>
                    {user?.role.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.profileMenuDivider} />

            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={handleProfilePress}
            >
              <View style={styles.profileMenuItemIconContainer}>
                <Ionicons name="person-outline" size={20} color="#374151" />
              </View>
              <Text style={styles.profileMenuItemText}>View Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={handleLogout}
            >
              <View style={[styles.profileMenuItemIconContainer, styles.profileMenuItemDanger]}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.profileMenuItemText, styles.profileMenuItemTextDanger]}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Hamburger Button
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1000,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#374151',
    marginVertical: 2,
    borderRadius: 2,
  },

  // Mobile Sidebar
  mobileOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  mobileBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mobileSidebar: {
    width: 280,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  closeBtnMobile: {
    padding: 8,
  },

  // Desktop Sidebar
  desktopSidebar: {
    width: 280,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    ...Platform.select({
      web: {
        position: 'sticky' as any,
        top: 0,
        height: '100vh' as any,
        display: 'flex' as any,
        flexDirection: 'column' as any,
        transition: 'width 0.3s ease' as any,
      },
    }),
  },
  desktopSidebarCollapsed: {
    width: 80,
  },

  // Sidebar Content
  sidebarContent: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },

  // Logo Section
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
      },
    }),
  },
  logoImageContainerSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)',
      },
    }),
  },
  logoTextContainer: {
    flex: 1,
  },
  logoContainerCollapsed: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Company Name
  companyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.3,
  },
  companyTagline: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  // Collapse Toggle Button
  collapseToggle: {
    position: 'absolute',
    top: 20,
    right: -16,
    zIndex: 100,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  collapseToggleCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease',
      },
    }),
  },

  // Navigation Section
  navigationSection: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  navigationLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 12,
    marginBottom: 8,
  },
  navItems: {
    gap: 2,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 10,
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  navItemActive: {
    backgroundColor: '#F5F3FF',
  },
  navItemCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  navItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemIconActive: {
    backgroundColor: '#EEF2FF',
  },
  navItemContent: {
    flex: 1,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  navItemTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  navItemDescription: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  navItemActiveIndicator: {
    width: 3,
    height: 20,
    backgroundColor: '#4F46E5',
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },

  // Spacer
  spacer: {
    flex: 1,
  },

  // Profile Section
  profileSection: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  profileButtonCollapsed: {
    justifyContent: 'center',
    padding: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
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
  profileEmail: {
    fontSize: 11,
    color: '#6B7280',
  },

  // Profile Menu Modal
  profileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 100,
    paddingLeft: 24,
    ...Platform.select({
      web: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
    }),
  },
  profileMenuContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    minWidth: 300,
    maxWidth: 340,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  profileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  profileMenuImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#F3F4F6',
  },
  profileMenuInfo: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileMenuEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  profileMenuRoleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  profileMenuRoleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    borderRadius: 10,
    marginBottom: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
      },
    }),
  },
  profileMenuItemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMenuItemDanger: {
    backgroundColor: '#FEE2E2',
  },
  profileMenuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  profileMenuItemTextDanger: {
    color: '#EF4444',
    fontWeight: '600',
  },
});
