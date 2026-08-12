import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button, FAB, Searchbar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBadge } from '../../components/Common';
import { GlassCard } from '../../components/GlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { IssueBillScreen } from './IssueBillScreen';
import { BillDetailModal, BillItem } from './BillDetailModal';
import { MaintenancePaymentModal } from './MaintenancePaymentModal';
import { AppColors } from '../../config/theme';

export const BillsListScreen = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const role = user?.role || 'RESIDENT';
  const userUnit = user?.unitNumber || 'B-201';
  const userName = user?.name || 'Priya Patel';

  const [searchQuery, setSearchQuery] = React.useState('');
  const [showIssueBillForm, setShowIssueBillForm] = React.useState(false);
  const [selectedBill, setSelectedBill] = React.useState<BillItem | null>(null);
  const [paymentBill, setPaymentBill] = React.useState<BillItem | null>(null);

  const [bills, setBills] = React.useState<BillItem[]>([
    {
      id: '102',
      month: 'August 2026',
      unit: userUnit,
      name: userName,
      amount: 3850,
      dueDate: '10 Aug 2026',
      status: 'UNPAID',
    },
    {
      id: '104',
      month: 'July 2026',
      unit: userUnit,
      name: userName,
      amount: 3850,
      dueDate: '10 Jul 2026',
      status: 'PAID',
      receiptNumber: 'TXN-773912',
      paidOn: '08 Jul 2026',
    },
    {
      id: '105',
      month: 'June 2026',
      unit: userUnit,
      name: userName,
      amount: 3850,
      dueDate: '10 Jun 2026',
      status: 'PAID',
      receiptNumber: 'TXN-664281',
      paidOn: '05 Jun 2026',
    },
    {
      id: '101',
      month: 'August 2026',
      unit: 'A-402',
      name: 'Rajesh Sharma',
      amount: 4500,
      dueDate: '10 Aug 2026',
      status: 'PAID',
      receiptNumber: 'TXN-994821',
      paidOn: '05 Aug 2026',
    },
    {
      id: '103',
      month: 'July 2026',
      unit: 'C-104',
      name: 'Amit Verma',
      amount: 4200,
      dueDate: '10 Jul 2026',
      status: 'OVERDUE',
    },
  ]);

  const handlePaymentSuccess = (billId: string, txnId: string) => {
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              status: 'PAID',
              receiptNumber: txnId,
              paidOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            }
          : b
      )
    );

    const updated = bills.find((b) => b.id === billId);
    if (updated) {
      setSelectedBill({
        ...updated,
        status: 'PAID',
        receiptNumber: txnId,
        paidOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      });
    }
  };

  // Strict Resident Unit Scope: RESIDENT can ONLY view bills matching their own flat unit!
  const residentScopedBills = role === 'RESIDENT'
    ? bills.filter((b) => b.unit.toLowerCase() === userUnit.toLowerCase())
    : bills;

  const filteredBills = residentScopedBills.filter(
    (b) =>
      b.unit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showIssueBillForm) {
    return <IssueBillScreen onBack={() => setShowIssueBillForm(false)} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Unit Scope Header Banner */}
      <View style={styles.scopeBanner}>
        <Icon
          name={role === 'RESIDENT' ? 'home-lock' : 'domain'}
          size={20}
          color={role === 'RESIDENT' ? '#059669' : '#2563EB'}
        />
        <Text style={styles.scopeBannerText}>
          {role === 'RESIDENT'
            ? `Private Ledger • Unit ${userUnit} (${userName})`
            : `Society Admin Ledger • All Units`}
        </Text>
      </View>

      <Searchbar
        placeholder="Search month, bill ID or details..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {filteredBills.map((bill) => (
          <TouchableOpacity key={bill.id} activeOpacity={0.85} onPress={() => setSelectedBill(bill)}>
            <GlassCard style={{ padding: 16, marginBottom: 14 }}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A' }}>
                    {bill.unit} • {bill.name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#64748B', marginTop: 1 }}>
                    Maintenance Bill - {bill.month}
                  </Text>
                  {bill.paidOn && (
                    <Text variant="labelSmall" style={{ color: '#059669', fontWeight: '700', marginTop: 2 }}>
                      ✓ Paid on {bill.paidOn}
                    </Text>
                  )}
                </View>
                <StatusBadge status={bill.status} />
              </View>

              <View style={[styles.row, { marginTop: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                <View>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Amount Due</Text>
                  <Text variant="titleLarge" style={{ fontWeight: '800', color: '#0F172A' }}>
                    ₹ {bill.amount.toLocaleString('en-IN')}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {bill.status === 'PAID' ? (
                    <>
                      <Button
                        mode="outlined"
                        compact
                        icon="eye-outline"
                        onPress={() => setSelectedBill(bill)}
                      >
                        Receipt
                      </Button>
                      <Button
                        mode="contained-tonal"
                        compact
                        icon="download-outline"
                        onPress={() => setSelectedBill(bill)}
                      >
                        Download PDF
                      </Button>
                    </>
                  ) : role === 'SOCIETY_ADMIN' ? (
                    <>
                      <Button
                        mode="outlined"
                        compact
                        icon="whatsapp"
                        textColor="#059669"
                        onPress={() => {
                          Alert.alert('📲 Payment Reminder Sent', `Reminder alert sent to ${bill.name} (${bill.unit}) via WhatsApp & SMS.`);
                        }}
                      >
                        Reminder
                      </Button>
                      <Button
                        mode="contained"
                        compact
                        icon="cash-check"
                        buttonColor="#10B981"
                        onPress={() => {
                          handlePaymentSuccess(bill.id, 'CASH-REC-' + Math.floor(100000 + Math.random() * 900000));
                          Alert.alert('✅ Payment Recorded', `Marked ₹${bill.amount} for Unit ${bill.unit} (${bill.name}) as PAID via Offline Cash/Cheque.`);
                        }}
                      >
                        Record Payment
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        mode="outlined"
                        compact
                        icon="eye-outline"
                        onPress={() => setSelectedBill(bill)}
                      >
                        View Bill
                      </Button>
                      <Button
                        mode="contained"
                        compact
                        icon="credit-card-outline"
                        buttonColor={AppColors.primary}
                        onPress={() => setPaymentBill(bill)}
                      >
                        Pay Now
                      </Button>
                    </>
                  )}
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bill Detail & Download Modal */}
      <BillDetailModal
        visible={!!selectedBill}
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onPayNow={(billToPay) => {
          setSelectedBill(null);
          setPaymentBill(billToPay);
        }}
      />

      {/* Interactive Maintenance Payment Modal */}
      <MaintenancePaymentModal
        visible={!!paymentBill}
        bill={paymentBill}
        onClose={() => setPaymentBill(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Show FAB only for Committee / Admin users */}
      {role === 'SOCIETY_ADMIN' && (
        <FAB
          icon="plus"
          style={styles.fab}
          label="Generate Bills"
          onPress={() => setShowIssueBillForm(true)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scopeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  scopeBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  search: {
    marginBottom: 14,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});
