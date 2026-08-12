import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, Avatar, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatCard, StatusBadge } from '../../components/Common';
import { GlassCard } from '../../components/GlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { RegisterWalkInVisitorScreen } from '../visitors/RegisterWalkInVisitorScreen';
import { AppColors } from '../../config/theme';

export const SecurityDashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [passcode, setPasscode] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);

  const [showWalkInForm, setShowWalkInForm] = React.useState(false);
  const [verifyStatus, setVerifyStatus] = React.useState<string | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleVerifyPasscode = () => {
    if (!passcode) return;
    if (passcode === '492810' || passcode === '104928') {
      setVerifyStatus('APPROVED');
    } else {
      setVerifyStatus('INVALID');
    }
  };

  if (showWalkInForm) {
    return <RegisterWalkInVisitorScreen onBack={() => setShowWalkInForm(false)} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: AppColors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text variant="bodyMedium" style={{ color: AppColors.textSecondary, fontWeight: '600' }}>
            Main Gate • Security Post
          </Text>
          <Text variant="titleLarge" style={styles.userName}>
            {user?.name || 'Ramesh Singh'}
          </Text>
          <Text variant="labelSmall" style={{ color: '#D97706', fontWeight: '800' }}>
            GATE SECURITY STAFF
          </Text>
        </View>
        <Avatar.Text size={44} label={user?.name?.[0] || 'S'} style={{ backgroundColor: '#D97706' }} />
      </View>

      {/* Verification Box */}
      <GlassCard style={styles.verifyCard}>
        <Text variant="titleMedium" style={{ fontWeight: '800', marginBottom: 8, color: '#0F172A' }}>
          Verify Visitor Passcode / QR
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            mode="outlined"
            placeholder="Enter 6-digit Passcode"
            keyboardType="number-pad"
            maxLength={6}
            value={passcode}
            onChangeText={(text) => {
              setPasscode(text);
              setVerifyStatus(null);
            }}
            style={{ flex: 1 }}
          />
          <Button mode="contained" style={styles.verifyBtn} onPress={handleVerifyPasscode}>
            Verify
          </Button>
        </View>

        {verifyStatus === 'APPROVED' && (
          <View style={styles.verifyResultSuccess}>
            <Icon name="check-circle" size={20} color="#059669" />
            <Text style={styles.verifyResultTextSuccess}>
              PASSCODE VERIFIED! Guest Rahul Verma (Unit B-201)
            </Text>
          </View>
        )}

        {verifyStatus === 'INVALID' && (
          <View style={styles.verifyResultError}>
            <Icon name="close-circle" size={20} color="#DC2626" />
            <Text style={styles.verifyResultTextError}>
              INVALID PASSCODE! Please check code or register walk-in.
            </Text>
          </View>
        )}

        <Button
          mode="outlined"
          icon="qrcode-scan"
          style={{ marginTop: 10, borderRadius: 10 }}
          onPress={() => {}}
        >
          Scan QR Code
        </Button>
      </GlassCard>

      {/* Quick Walk-in Entry Action */}
      <Button
        mode="contained"
        buttonColor={AppColors.primary}
        icon="account-plus"
        contentStyle={{ paddingVertical: 6 }}
        style={{ marginBottom: 20, borderRadius: 12 }}
        onPress={() => setShowWalkInForm(true)}
      >
        Register Walk-in Visitor (Cab / Delivery)
      </Button>

      {/* Today's Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <StatCard title="Checked In" value="14" icon="account-arrow-right" iconColor="#10B981" />
        </View>
        <View style={styles.gridItem}>
          <StatCard title="Expected" value="8" icon="clock-outline" iconColor="#F59E0B" />
        </View>
      </View>

      {/* Recent Gate Logs */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Recent Gate Activity
      </Text>

      <GlassCard style={{ padding: 14 }}>
        <View style={styles.logRow}>
          <Icon name="truck-delivery-outline" size={26} color={AppColors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0F172A' }}>
              Amazon Delivery
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B' }}>
              Unit A-102 • Checked in at 10:15 AM
            </Text>
          </View>
          <StatusBadge status="CHECKED_IN" />
        </View>
      </GlassCard>

      <GlassCard style={{ padding: 14 }}>
        <View style={styles.logRow}>
          <Icon name="car" size={26} color={AppColors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0F172A' }}>
              Uber Cab (MH 12 AB 4589)
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B' }}>
              Unit B-201 • Checked out at 09:40 AM
            </Text>
          </View>
          <StatusBadge status="RESOLVED" label="CHECKED OUT" />
        </View>
      </GlassCard>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontWeight: '800',
    color: '#0F172A',
  },
  verifyCard: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  verifyBtn: {
    height: 50,
    justifyContent: 'center',
    borderRadius: 10,
  },
  verifyResultSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  verifyResultTextSuccess: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
    marginLeft: 6,
  },
  verifyResultError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  verifyResultTextError: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B91C1C',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 10,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
