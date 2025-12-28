import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

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
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setShowMenu(true)}
        >
          <Image
            source={{ uri: user?.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.onlineIndicator} />
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
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  profileButton: {
    position: 'relative',
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginLeft: 'auto',
    minWidth: 280,
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
