import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { AppColors } from '../../config/theme';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

const ROLE_OPTIONS: {
  role: UserRole;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', icon: 'shield-crown', color: '#8B5CF6', bgColor: '#F5F3FF' },
  { role: 'SOCIETY_ADMIN', label: 'Society Admin', icon: 'account-tie', color: '#2563EB', bgColor: '#EFF6FF' },
  { role: 'RESIDENT', label: 'Resident', icon: 'home-account', color: '#10B981', bgColor: '#ECFDF5' },
  { role: 'SECURITY', label: 'Security Guard', icon: 'shield-account', color: '#F59E0B', bgColor: '#FFFBEB' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister }) => {
  const theme = useTheme();
  const { login, isLoading } = useAuthStore();
  const [loginMethod, setLoginMethod] = React.useState<'PHONE' | 'EMAIL'>('PHONE');
  const [role, setRole] = React.useState<UserRole>('RESIDENT');

  // Form State
  const [identifier, setIdentifier] = React.useState('');
  const [passwordOrOtp, setPasswordOrOtp] = React.useState('');
  const [otpSent, setOtpSent] = React.useState(false);

  const handleSendOtp = () => {
    if (!identifier) return;
    setOtpSent(true);
  };

  const handleLogin = async () => {
    if (!identifier) return;
    await login(identifier, role);
  };

  const selectedRoleConfig = ROLE_OPTIONS.find((r) => r.role === role);

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Icon name="home-city" size={44} color="#FFFFFF" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>
          Society ERP
        </Text>
        <Text variant="bodyMedium" style={{ color: '#475569', textAlign: 'center' }}>
          Smart Housing Management & Gate Pass
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Sign In to your account
          </Text>

          {/* 2×2 Role Selector Grid */}
          <Text variant="labelSmall" style={styles.label}>
            SELECT YOUR ROLE
          </Text>
          <View style={styles.roleGrid}>
            {ROLE_OPTIONS.map((item) => {
              const isActive = role === item.role;
              return (
                <TouchableOpacity
                  key={item.role}
                  activeOpacity={0.7}
                  onPress={() => setRole(item.role)}
                  style={[
                    styles.roleCard,
                    isActive && {
                      backgroundColor: item.bgColor,
                      borderColor: item.color,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.roleIconCircle,
                      {
                        backgroundColor: isActive ? item.color + '20' : '#F1F5F9',
                      },
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={isActive ? item.color : '#94A3B8'}
                    />
                  </View>
                  <Text
                    style={[
                      styles.roleCardText,
                      isActive && { color: item.color, fontWeight: '800' },
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {isActive && (
                    <View style={[styles.roleCheckBadge, { backgroundColor: item.color }]}>
                      <Icon name="check" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Active role hint banner */}
          {selectedRoleConfig && (
            <View
              style={[
                styles.roleHintBanner,
                { backgroundColor: selectedRoleConfig.bgColor, borderColor: selectedRoleConfig.color + '40' },
              ]}
            >
              <Icon name={selectedRoleConfig.icon} size={16} color={selectedRoleConfig.color} />
              <Text style={[styles.roleHintText, { color: selectedRoleConfig.color }]}>
                Signing in as {selectedRoleConfig.label}
              </Text>
            </View>
          )}

          {/* Login method switch */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'PHONE' && styles.activeTab]}
              onPress={() => {
                setLoginMethod('PHONE');
                setOtpSent(false);
              }}
            >
              <Icon
                name="cellphone"
                size={16}
                color={loginMethod === 'PHONE' ? AppColors.primary : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabText, loginMethod === 'PHONE' && styles.activeTabText]}>
                Phone OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'EMAIL' && styles.activeTab]}
              onPress={() => setLoginMethod('EMAIL')}
            >
              <Icon
                name="email-outline"
                size={16}
                color={loginMethod === 'EMAIL' ? AppColors.primary : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.tabText, loginMethod === 'EMAIL' && styles.activeTabText]}>
                Email & Password
              </Text>
            </TouchableOpacity>
          </View>

          {loginMethod === 'PHONE' ? (
            <>
              <TextInput
                mode="outlined"
                label="Mobile Phone Number"
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                value={identifier}
                onChangeText={setIdentifier}
                left={<TextInput.Icon icon="phone" />}
                style={styles.input}
              />
              {otpSent && (
                <TextInput
                  mode="outlined"
                  label="Enter 6-digit OTP"
                  placeholder="123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={passwordOrOtp}
                  onChangeText={setPasswordOrOtp}
                  left={<TextInput.Icon icon="shield-key" />}
                  style={styles.input}
                />
              )}

              {!otpSent ? (
                <Button
                  mode="contained"
                  style={styles.actionBtn}
                  onPress={handleSendOtp}
                  disabled={!identifier}
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  mode="contained"
                  style={styles.actionBtn}
                  loading={isLoading}
                  onPress={handleLogin}
                >
                  Verify & Login
                </Button>
              )}
            </>
          ) : (
            <>
              <TextInput
                mode="outlined"
                label="Email Address"
                placeholder="resident@society.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
                left={<TextInput.Icon icon="email" />}
                style={styles.input}
              />
              <TextInput
                mode="outlined"
                label="Password"
                secureTextEntry
                value={passwordOrOtp}
                onChangeText={setPasswordOrOtp}
                left={<TextInput.Icon icon="lock" />}
                style={styles.input}
              />
              <Button
                mode="contained"
                style={styles.actionBtn}
                loading={isLoading}
                onPress={handleLogin}
              >
                Login
              </Button>
            </>
          )}

          <View style={styles.footerRow}>
            <Text variant="bodySmall" style={{ color: '#475569' }}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={onNavigateToRegister}>
              <Text variant="bodySmall" style={{ color: AppColors.primary, fontWeight: '700', marginLeft: 6 }}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 18,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  card: {
    borderRadius: 20,
    paddingVertical: 8,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  label: {
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  // 2×2 Role Grid
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginBottom: 12,
  },
  roleCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  roleIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  roleCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    flexShrink: 1,
  },
  roleCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Role hint banner
  roleHintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  roleHintText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Login method tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: AppColors.primary,
    fontWeight: '700',
  },
  input: {
    marginBottom: 12,
  },
  actionBtn: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
});

