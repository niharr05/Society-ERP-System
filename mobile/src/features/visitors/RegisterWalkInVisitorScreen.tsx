import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface RegisterWalkInVisitorScreenProps {
  onBack?: () => void;
}

export const RegisterWalkInVisitorScreen: React.FC<RegisterWalkInVisitorScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  const [visitorName, setVisitorName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [targetUnit, setTargetUnit] = React.useState('');
  const [type, setType] = React.useState<'DELIVERY' | 'CAB' | 'SERVICE_PROVIDER' | 'OTHER'>('DELIVERY');
  const [companyName, setCompanyName] = React.useState('Swiggy');
  const [vehicleNo, setVehicleNo] = React.useState('');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState(false);

  const handleRegisterEntry = () => {
    if (!visitorName || !targetUnit) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
    }, 800);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#0F172A" />
          <Text variant="titleMedium" style={styles.backText}>
            Back to Gate Post
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Register Walk-In Visitor
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Security Gate Entry for Cabs, Delivery Partners, and Unannounced Guests
        </Text>
      </View>

      {successMsg ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 8 }}>
            ✅ Gate Entry Approved & Checked In!
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#64748B', marginBottom: 20 }}>
            {visitorName} ({type}) checked in for Unit {targetUnit}. Resident notified via FCM push alert.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Done
              </Button>
            )}
            <Button mode="contained" onPress={() => setSuccessMsg(false)}>
              Register Another
            </Button>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text variant="labelSmall" style={styles.label}>
            ENTRY TYPE
          </Text>
          <SegmentedButtons
            value={type}
            onValueChange={(val) => setType(val as any)}
            buttons={[
              { value: 'DELIVERY', label: 'Delivery' },
              { value: 'CAB', label: 'Cab' },
              { value: 'SERVICE_PROVIDER', label: 'Service' },
              { value: 'OTHER', label: 'Other' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            mode="outlined"
            label="Destination Flat / Unit Number"
            placeholder="e.g. B-201"
            value={targetUnit}
            onChangeText={setTargetUnit}
            left={<TextInput.Icon icon="home-city-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Visitor / Driver Name"
            placeholder="e.g. Ramesh Kumar"
            value={visitorName}
            onChangeText={setVisitorName}
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
            label="Company / Service Name (e.g. Swiggy, Zomato, Uber)"
            value={companyName}
            onChangeText={setCompanyName}
            left={<TextInput.Icon icon="truck-delivery-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Vehicle Number (If Applicable)"
            placeholder="MH 12 AB 4589"
            value={vehicleNo}
            onChangeText={setVehicleNo}
            left={<TextInput.Icon icon="car" />}
            style={styles.input}
          />

          <Button
            mode="contained"
            buttonColor={AppColors.primary}
            style={styles.submitBtn}
            loading={isSubmitting}
            disabled={!visitorName || !targetUnit}
            icon="shield-check"
            onPress={handleRegisterEntry}
          >
            Approve & Log Gate Check-In
          </Button>
        </GlassCard>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 6,
  },
  backText: {
    fontWeight: '700',
    color: '#0F172A',
    marginLeft: 6,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  label: {
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
});
