import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Card, HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin }) => {
  const theme = useTheme();
  const { login, isLoading } = useAuthStore();

  const [role, setRole] = React.useState<UserRole>('RESIDENT');
  const [fullName, setFullName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  // Flat / Society Info
  const [societyCode, setSocietyCode] = React.useState('ROYAL_MUM_402');
  const [unitNumber, setUnitNumber] = React.useState('');
  const [occupancy, setOccupancy] = React.useState<'OWNER' | 'TENANT'>('OWNER');

  const handleRegister = async () => {
    if (!fullName || !phone) return;
    await login(phone || email, role);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Create Account
        </Text>
        <Text variant="bodyMedium" style={{ color: '#475569' }}>
          Join your Housing Society Digital ERP Portal
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="labelSmall" style={styles.label}>
            ACCOUNT TYPE
          </Text>
          <SegmentedButtons
            value={role}
            onValueChange={(val) => setRole(val as UserRole)}
            buttons={[
              { value: 'RESIDENT', label: 'Resident' },
              { value: 'SOCIETY_ADMIN', label: 'Committee' },
              { value: 'SECURITY', label: 'Security Staff' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            mode="outlined"
            label="Full Name"
            placeholder="Priya Patel"
            value={fullName}
            onChangeText={setFullName}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Mobile Phone Number"
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            left={<TextInput.Icon icon="phone" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Email Address (Optional)"
            placeholder="priya@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Create Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            left={<TextInput.Icon icon="lock" />}
            style={styles.input}
          />

          {role === 'RESIDENT' && (
            <>
              <View style={styles.divider} />
              <Text variant="titleSmall" style={{ fontWeight: '700', marginBottom: 8, color: '#0F172A' }}>
                Unit & Society Information
              </Text>

              <TextInput
                mode="outlined"
                label="Society Invite / Registration Code"
                value={societyCode}
                onChangeText={setSocietyCode}
                left={<TextInput.Icon icon="domain" />}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Flat / Unit Number (e.g. B-201)"
                placeholder="B-201"
                value={unitNumber}
                onChangeText={setUnitNumber}
                left={<TextInput.Icon icon="home" />}
                style={styles.input}
              />

              <Text variant="labelSmall" style={styles.label}>
                OCCUPANCY TYPE
              </Text>
              <SegmentedButtons
                value={occupancy}
                onValueChange={(val) => setOccupancy(val as 'OWNER' | 'TENANT')}
                buttons={[
                  { value: 'OWNER', label: 'Flat Owner' },
                  { value: 'TENANT', label: 'Tenant' },
                ]}
                style={styles.segmented}
              />
            </>
          )}

          <Button
            mode="contained"
            style={styles.actionBtn}
            loading={isLoading}
            onPress={handleRegister}
          >
            Submit Registration
          </Button>

          <View style={styles.footerRow}>
            <Text variant="bodySmall" style={{ color: '#475569' }}>
              Already registered?
            </Text>
            <TouchableOpacity onPress={onNavigateToLogin}>
              <Text variant="bodySmall" style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: 6 }}>
                Sign In
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
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  card: {
    borderRadius: 16,
    paddingVertical: 8,
  },
  label: {
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    marginTop: 4,
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  actionBtn: {
    marginTop: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
});
