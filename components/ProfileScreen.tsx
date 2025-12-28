import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const handleBack = () => {
    const roleRoutes = {
      seller: '/slr',
      manufacturer: '/mfr',
      logistics: '/lgt',
    };
    router.back();
  };

  const profileSections = [
    {
      title: 'Account Information',
      items: [
        { icon: 'person-outline', label: 'Full Name', value: user.name },
        { icon: 'mail-outline', label: 'Email', value: user.email },
        { icon: 'at-outline', label: 'Username', value: user.username },
        { icon: 'briefcase-outline', label: 'Role', value: user.role.charAt(0).toUpperCase() + user.role.slice(1) },
      ],
    },
    {
      title: 'Company Details',
      items: [
        { icon: 'business-outline', label: 'Company', value: user.company || 'N/A' },
        { icon: 'call-outline', label: 'Phone', value: user.phone || 'N/A' },
      ],
    },
  ];

  const settingsOptions = [
    { icon: 'notifications-outline', label: 'Notifications', color: '#4F46E5' },
    { icon: 'lock-closed-outline', label: 'Security', color: '#10B981' },
    { icon: 'settings-outline', label: 'Preferences', color: '#F59E0B' },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.profilePicture }} style={styles.avatar} />
            <View style={styles.onlineBadge}>
              <View style={styles.onlineDot} />
            </View>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Sections */}
        {profileSections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, itemIndex) => (
                <View
                  key={itemIndex}
                  style={[
                    styles.infoItem,
                    itemIndex !== section.items.length - 1 && styles.infoItemBorder,
                  ]}
                >
                  <View style={styles.infoItemLeft}>
                    <View style={styles.iconContainer}>
                      <Ionicons name={item.icon as any} size={20} color="#6B7280" />
                    </View>
                    <Text style={styles.infoLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {settingsOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.settingItem,
                  index !== settingsOptions.length - 1 && styles.settingItemBorder,
                ]}
              >
                <View style={styles.settingItemLeft}>
                  <View style={[styles.settingIconContainer, { backgroundColor: `${option.color}15` }]}>
                    <Ionicons name={option.icon as any} size={20} color={option.color} />
                  </View>
                  <Text style={styles.settingLabel}>{option.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 32,
  },
});
