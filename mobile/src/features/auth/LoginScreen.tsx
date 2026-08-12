import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Card, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
          <Icon name="home-city" size={48} color="#FFFFFF" />
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

          {/* Persona selector */}
          <Text variant="labelSmall" style={styles.label}>
            SELECT YOUR ROLE
          </Text>
          <SegmentedButtons
            value={role}
            onValueChange={(val) => setRole(val as UserRole)}
            buttons={[
              { value: 'RESIDENT', label: 'Resident' },
              { value: 'SOCIETY_ADMIN', label: 'Admin' },
              { value: 'SECURITY', label: 'Security' },
            ]}
            style={styles.segmented}
          />

          {/* Login method switch */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'PHONE' && styles.activeTab]}
              onPress={() => {
                setLoginMethod('PHONE');
                setOtpSent(false);
              }}
            >
              <Text style={[styles.tabText, loginMethod === 'PHONE' && styles.activeTabText]}>
                Phone OTP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, loginMethod === 'EMAIL' && styles.activeTab]}
              onPress={() => setLoginMethod('EMAIL')}
            >
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
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: 6 }}>
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
    marginTop: 30,
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  cardTitle: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  label: {
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
  },
  segmented: {
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  input: {
    marginBottom: 12,
  },
  actionBtn: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
});
