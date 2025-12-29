import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, isAuthenticated, user, isLoading } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('seller');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles: { value: UserRole; label: string; icon: string }[] = [
    { value: 'seller', label: 'Seller', icon: 'storefront' },
    { value: 'manufacturer', label: 'Manufacturer', icon: 'construct' },
    { value: 'logistics', label: 'Logistics', icon: 'car' },
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const roleRoutes: Record<UserRole, string> = {
        seller: '/slr',
        manufacturer: '/mfr',
        logistics: '/lgt',
      };
      router.replace(roleRoutes[user.role]);
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setIsSubmitting(true);
    const success = await login(username, password, selectedRole);
    setIsSubmitting(false);

    if (success) {
      // Router will redirect via useEffect
    } else {
      Alert.alert(
        'Login Failed',
        `Invalid credentials. Use username: ${selectedRole}1 and password: demo123`
      );
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const success = await loginWithGoogle(selectedRole);
    setIsSubmitting(false);

    if (!success) {
      Alert.alert('Error', 'Google login failed');
    }
  };

  const selectedRoleData = roles.find(r => r.value === selectedRole)!;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#4F46E5', '#7C3AED', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo and Title */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="battery-charging" size={48} color="#fff" />
          </View>
          <Text style={styles.title}>Battery Supply Chain</Text>
          <Text style={styles.subtitle}>
            Modern Platform for Manufacturers, Sellers & Logistics
          </Text>
        </View>

        {/* Login Box */}
        <View style={styles.loginBox}>
          <Text style={styles.loginTitle}>Welcome Back</Text>
          <Text style={styles.loginSubtitle}>Sign in to continue</Text>

          {/* Role Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Role</Text>
            <TouchableOpacity
              style={styles.roleSelector}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
            >
              <View style={styles.roleContent}>
                <Ionicons
                  name={selectedRoleData.icon as any}
                  size={20}
                  color="#4F46E5"
                />
                <Text style={styles.roleSelectorText}>{selectedRoleData.label}</Text>
              </View>
              <Ionicons
                name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {/* Dropdown */}
            {showRoleDropdown && (
              <View style={styles.dropdown}>
                {roles.map(role => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.dropdownItem,
                      selectedRole === role.value && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedRole(role.value);
                      setShowRoleDropdown(false);
                    }}
                  >
                    <Ionicons
                      name={role.icon as any}
                      size={20}
                      color={selectedRole === role.value ? '#4F46E5' : '#666'}
                    />
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedRole === role.value && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {role.label}
                    </Text>
                    {selectedRole === role.value && (
                      <Ionicons name="checkmark" size={20} color="#4F46E5" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder={`${selectedRole}1`}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="demo123"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isSubmitting}
          >
            <Ionicons name="logo-google" size={20} color="#666" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Demo Credentials */}
          <View style={styles.demoInfo}>
            <Ionicons name="information-circle-outline" size={16} color="#666" />
            <Text style={styles.demoInfoText}>
              Demo: Use {selectedRole}1 / demo123
            </Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          © 2025 Battery Supply Chain Platform
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  loginBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
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
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  loginSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleSelectorText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemSelected: {
    backgroundColor: '#EEF2FF',
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  dropdownItemTextSelected: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  loginButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  googleButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  demoInfoText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 24,
  },
});
