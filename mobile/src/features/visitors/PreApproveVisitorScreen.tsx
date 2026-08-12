import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QRCode from 'react-native-qrcode-svg';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface PreApproveVisitorScreenProps {
  onBack?: () => void;
}

export const PreApproveVisitorScreen: React.FC<PreApproveVisitorScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  const [visitorName, setVisitorName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [type, setType] = React.useState<'GUEST' | 'DELIVERY' | 'CAB' | 'SERVICE_PROVIDER'>('GUEST');
  const [vehicleNo, setVehicleNo] = React.useState('');
  const [expectedDate, setExpectedDate] = React.useState('Today');

  const [passcode, setPasscode] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleGeneratePass = () => {
    if (!visitorName) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Generate random 6-digit passcode
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setPasscode(code);
    }, 800);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#0F172A" />
          <Text variant="titleMedium" style={styles.backText}>
            Back to Visitors
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Pre-approve Visitor Pass
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Generate a 6-digit entry passcode & QR code for gate entry
        </Text>
      </View>

      {passcode ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 4 }}>
            🎉 Visitor Gate Pass Created!
          </Text>
          <Text variant="bodySmall" style={{ color: '#64748B', marginBottom: 16 }}>
            Share this 6-digit Passcode or QR Code with {visitorName}
          </Text>

          <View style={styles.passBox}>
            <Text variant="labelMedium" style={{ color: '#64748B', fontWeight: '700' }}>
              6-DIGIT GATE PASSCODE
            </Text>
            <Text variant="displaySmall" style={{ fontWeight: '800', color: AppColors.primary, letterSpacing: 4 }}>
              {passcode}
            </Text>
          </View>

          <View style={{ marginVertical: 16, padding: 12, backgroundColor: '#FFFFFF', borderRadius: 12 }}>
            <QRCode value={`SOCIETY_PASS_${passcode}`} size={140} />
          </View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Done
              </Button>
            )}
            <Button mode="contained" icon="share-variant" onPress={() => {}}>
              Share Passcode
            </Button>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text variant="labelSmall" style={styles.label}>
            VISITOR CATEGORY
          </Text>
          <SegmentedButtons
            value={type}
            onValueChange={(val) => setType(val as any)}
            buttons={[
              { value: 'GUEST', label: 'Guest' },
              { value: 'DELIVERY', label: 'Delivery' },
              { value: 'CAB', label: 'Cab' },
              { value: 'SERVICE_PROVIDER', label: 'Service' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            mode="outlined"
            label="Visitor Name"
            placeholder="e.g. Rahul Verma"
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
            label="Vehicle Number (Optional)"
            placeholder="MH 12 AB 4589"
            value={vehicleNo}
            onChangeText={setVehicleNo}
            left={<TextInput.Icon icon="car" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Expected Date & Time"
            value={expectedDate}
            onChangeText={setExpectedDate}
            left={<TextInput.Icon icon="clock-outline" />}
            style={styles.input}
          />

          <Button
            mode="contained"
            style={styles.submitBtn}
            loading={isSubmitting}
            disabled={!visitorName}
            icon="qrcode-plus"
            onPress={handleGeneratePass}
          >
            Generate Gate Passcode
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
  passBox: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
});
