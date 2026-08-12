import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface IssueBillScreenProps {
  onBack?: () => void;
}

export const IssueBillScreen: React.FC<IssueBillScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  // Form State
  const [billType, setBillType] = React.useState<'ALL' | 'SPECIFIC'>('ALL');
  const [month, setMonth] = React.useState('August 2026');
  const [dueDate, setDueDate] = React.useState('2026-08-15');
  const [selectedUnit, setSelectedUnit] = React.useState('');

  // Charges Breakdown
  const [maintCharge, setMaintCharge] = React.useState('3500');
  const [sinkingFund, setSinkingFund] = React.useState('350');
  const [parkingFee, setParkingFee] = React.useState('250');
  const [otherCharge, setOtherCharge] = React.useState('0');

  const totalAmount =
    (parseFloat(maintCharge) || 0) +
    (parseFloat(sinkingFund) || 0) +
    (parseFloat(parkingFee) || 0) +
    (parseFloat(otherCharge) || 0);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
    }, 1000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#0F172A" />
          <Text variant="titleMedium" style={styles.backText}>
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Issue Maintenance Bill
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Generate society maintenance invoices for residents
        </Text>
      </View>

      {successMsg ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 8 }}>
            🎉 Bills Generated Successfully!
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#64748B', marginBottom: 20 }}>
            Invoices issued to residents of Royal Heights Society. Notifications sent via FCM.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Done
              </Button>
            )}
            <Button mode="contained" onPress={() => setSuccessMsg(false)}>
              Issue Another
            </Button>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text variant="labelSmall" style={styles.label}>
            TARGET AUDIENCE
          </Text>
          <SegmentedButtons
            value={billType}
            onValueChange={(val) => setBillType(val as 'ALL' | 'SPECIFIC')}
            buttons={[
              { value: 'ALL', label: 'All Units (120)' },
              { value: 'SPECIFIC', label: 'Specific Flat' },
            ]}
            style={styles.segmented}
          />

          {billType === 'SPECIFIC' && (
            <TextInput
              mode="outlined"
              label="Flat / Unit Number (e.g. A-402)"
              value={selectedUnit}
              onChangeText={setSelectedUnit}
              left={<TextInput.Icon icon="home" />}
              style={styles.input}
            />
          )}

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Billing Cycle"
              value={month}
              onChangeText={setMonth}
              style={[styles.input, { flex: 1, marginRight: 6 }]}
            />
            <TextInput
              mode="outlined"
              label="Due Date"
              value={dueDate}
              onChangeText={setDueDate}
              style={[styles.input, { flex: 1, marginLeft: 6 }]}
            />
          </View>

          <View style={styles.divider} />
          <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>
            Charges Breakdown (₹)
          </Text>

          <TextInput
            mode="outlined"
            label="Maintenance Charge"
            keyboardType="numeric"
            value={maintCharge}
            onChangeText={setMaintCharge}
            left={<TextInput.Icon icon="currency-inr" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Sinking Fund"
            keyboardType="numeric"
            value={sinkingFund}
            onChangeText={setSinkingFund}
            left={<TextInput.Icon icon="currency-inr" />}
            style={styles.input}
          />

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Parking Fee"
              keyboardType="numeric"
              value={parkingFee}
              onChangeText={setParkingFee}
              style={[styles.input, { flex: 1, marginRight: 6 }]}
            />
            <TextInput
              mode="outlined"
              label="Other / Event Charge"
              keyboardType="numeric"
              value={otherCharge}
              onChangeText={setOtherCharge}
              style={[styles.input, { flex: 1, marginLeft: 6 }]}
            />
          </View>

          {/* Total Box */}
          <View style={styles.totalBox}>
            <Text variant="titleMedium" style={{ fontWeight: '700', color: '#334155' }}>
              Total Invoice Amount:
            </Text>
            <Text variant="headlineSmall" style={{ fontWeight: '800', color: AppColors.primary }}>
              ₹ {totalAmount.toLocaleString()}
            </Text>
          </View>

          <Button
            mode="contained"
            style={styles.submitBtn}
            loading={isSubmitting}
            icon="send"
            onPress={handleSubmit}
          >
            Generate & Send Invoice
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
  row: {
    flexDirection: 'row',
  },
  divider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 10,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    marginVertical: 12,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
