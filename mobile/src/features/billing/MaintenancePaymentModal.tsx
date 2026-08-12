import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Surface, TextInput, Divider, IconButton, ActivityIndicator, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../../config/theme';
import { BillItem } from './BillDetailModal';

interface MaintenancePaymentModalProps {
  visible: boolean;
  bill: BillItem | null;
  onClose: () => void;
  onPaymentSuccess: (billId: string, txnId: string) => void;
}

type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING';

export const MaintenancePaymentModal: React.FC<MaintenancePaymentModalProps> = ({
  visible,
  bill,
  onClose,
  onPaymentSuccess,
}) => {
  const theme = useTheme();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [upiId, setUpiId] = useState('');
  
  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Selected Bank state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Processing & Success UI states
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');

  if (!bill) return null;

  const handleProcessPayment = () => {
    setIsProcessing(true);

    // Simulate 1.8s secure bank processing
    setTimeout(() => {
      const generatedTxn = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
      setTxnId(generatedTxn);
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onPaymentSuccess(bill.id, txnId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Surface style={styles.modalContainer} elevation={5}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="shield-check" size={24} color="#10B981" />
              <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0F172A' }}>
                Secure Bill Payment
              </Text>
            </View>
            {!isProcessing && !isSuccess && <IconButton icon="close" size={22} onPress={onClose} />}
          </View>

          {isSuccess ? (
            /* Success Celebration View */
            <View style={styles.successContainer}>
              <View style={styles.successCheckCircle}>
                <Icon name="check-bold" size={48} color="#FFFFFF" />
              </View>

              <Text variant="headlineSmall" style={styles.successTitle}>
                Payment Successful!
              </Text>

              <Text variant="bodyMedium" style={styles.successSubtitle}>
                ₹ {bill.amount.toLocaleString('en-IN')} paid for {bill.month} Maintenance
              </Text>

              <View style={styles.txnCard}>
                <View style={styles.txnRow}>
                  <Text style={styles.txnLabel}>Transaction Ref:</Text>
                  <Text style={styles.txnValue}>{txnId}</Text>
                </View>
                <View style={styles.txnRow}>
                  <Text style={styles.txnLabel}>Flat / Unit:</Text>
                  <Text style={styles.txnValue}>{bill.unit}</Text>
                </View>
                <View style={styles.txnRow}>
                  <Text style={styles.txnLabel}>Paid Date:</Text>
                  <Text style={styles.txnValue}>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                </View>
                <View style={styles.txnRow}>
                  <Text style={styles.txnLabel}>Status:</Text>
                  <Text style={[styles.txnValue, { color: '#10B981', fontWeight: '800' }]}>PAID ✓</Text>
                </View>
              </View>

              <View style={{ width: '100%', gap: 10, marginTop: 20 }}>
                <Button
                  mode="contained"
                  buttonColor={AppColors.primary}
                  icon="file-download-outline"
                  onPress={handleFinish}
                  style={{ borderRadius: 14, paddingVertical: 4 }}
                >
                  View & Download Receipt
                </Button>
              </View>
            </View>
          ) : isProcessing ? (
            /* Processing State */
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={AppColors.primary} />
              <Text variant="titleMedium" style={{ fontWeight: '700', color: '#0F172A', marginTop: 16 }}>
                Processing Secure Payment...
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748B', marginTop: 4 }}>
                Contacting Bank Gateway & Verifying UPI VPA. Please do not close or press back.
              </Text>
            </View>
          ) : (
            /* Main Payment Form View */
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Bill Details Summary Card */}
              <View style={styles.billSummaryBox}>
                <View style={{ flex: 1 }}>
                  <Text variant="labelSmall" style={{ color: '#64748B', fontWeight: '700' }}>
                    RECALL BILL #{bill.id} • {bill.month}
                  </Text>
                  <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0F172A', marginTop: 2 }}>
                    Unit {bill.unit} ({bill.name})
                  </Text>
                  <Text variant="bodySmall" style={{ color: '#059669', fontWeight: '700', marginTop: 2 }}>
                    Royal Heights Maintenance Due
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>Total Due</Text>
                  <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A' }}>
                    ₹ {bill.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>

              {/* Payment Method Selector Tabs */}
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Select Payment Mode
              </Text>

              <View style={styles.paymentTabsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPaymentMethod('UPI')}
                  style={[styles.paymentTab, paymentMethod === 'UPI' && styles.activePaymentTab]}
                >
                  <Icon
                    name="lightning-bolt"
                    size={20}
                    color={paymentMethod === 'UPI' ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.paymentTabText,
                      paymentMethod === 'UPI' && styles.activePaymentTabText,
                    ]}
                  >
                    UPI / Apps
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPaymentMethod('CARD')}
                  style={[styles.paymentTab, paymentMethod === 'CARD' && styles.activePaymentTab]}
                >
                  <Icon
                    name="credit-card-outline"
                    size={20}
                    color={paymentMethod === 'CARD' ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.paymentTabText,
                      paymentMethod === 'CARD' && styles.activePaymentTabText,
                    ]}
                  >
                    Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setPaymentMethod('NETBANKING')}
                  style={[styles.paymentTab, paymentMethod === 'NETBANKING' && styles.activePaymentTab]}
                >
                  <Icon
                    name="bank"
                    size={20}
                    color={paymentMethod === 'NETBANKING' ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.paymentTabText,
                      paymentMethod === 'NETBANKING' && styles.activePaymentTabText,
                    ]}
                  >
                    NetBanking
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Tab Content: UPI */}
              {paymentMethod === 'UPI' && (
                <View style={styles.tabContentContainer}>
                  <Text variant="labelSmall" style={{ color: '#475569', fontWeight: '700', marginBottom: 8 }}>
                    Fast Pay via Installed Apps:
                  </Text>

                  <View style={styles.upiAppsGrid}>
                    {(['GPay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((app) => (
                      <TouchableOpacity
                        key={app}
                        activeOpacity={0.7}
                        onPress={() => setSelectedUpiApp(app)}
                        style={[
                          styles.upiAppTile,
                          selectedUpiApp === app && styles.activeUpiAppTile,
                        ]}
                      >
                        <Icon
                          name={app === 'GPay' ? 'google' : app === 'PhonePe' ? 'cellphone-lock' : app === 'Paytm' ? 'wallet' : 'cash'}
                          size={24}
                          color={selectedUpiApp === app ? '#2563EB' : '#475569'}
                        />
                        <Text style={[styles.upiAppText, selectedUpiApp === app && styles.activeUpiAppText]}>
                          {app}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Divider style={{ marginVertical: 12 }} />

                  <Text variant="labelSmall" style={{ color: '#475569', fontWeight: '700', marginBottom: 6 }}>
                    Or Enter VPA UPI ID:
                  </Text>
                  <TextInput
                    mode="outlined"
                    placeholder="e.g. mobile@upi or name@okicici"
                    value={upiId}
                    onChangeText={setUpiId}
                    dense
                    outlineStyle={{ borderRadius: 10 }}
                    left={<TextInput.Icon icon="at" color="#64748B" />}
                  />
                </View>
              )}

              {/* Tab Content: Credit/Debit Card */}
              {paymentMethod === 'CARD' && (
                <View style={styles.tabContentContainer}>
                  <TextInput
                    mode="outlined"
                    label="Card Number"
                    placeholder="4532 •••• •••• 8849"
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="number-pad"
                    dense
                    style={{ marginBottom: 10 }}
                    outlineStyle={{ borderRadius: 10 }}
                    left={<TextInput.Icon icon="credit-card" color="#64748B" />}
                  />

                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                    <TextInput
                      mode="outlined"
                      label="Expiry (MM/YY)"
                      placeholder="08/28"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      dense
                      style={{ flex: 1 }}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                    <TextInput
                      mode="outlined"
                      label="CVV Code"
                      placeholder="•••"
                      value={cardCvv}
                      onChangeText={setCardCvv}
                      keyboardType="number-pad"
                      secureTextEntry
                      dense
                      style={{ flex: 1 }}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                  </View>

                  <TextInput
                    mode="outlined"
                    label="Cardholder Name"
                    placeholder="Name as on Card"
                    value={cardHolder}
                    onChangeText={setCardHolder}
                    dense
                    outlineStyle={{ borderRadius: 10 }}
                  />
                </View>
              )}

              {/* Tab Content: NetBanking */}
              {paymentMethod === 'NETBANKING' && (
                <View style={styles.tabContentContainer}>
                  <Text variant="labelSmall" style={{ color: '#475569', fontWeight: '700', marginBottom: 8 }}>
                    Select Popular Bank:
                  </Text>
                  <View style={styles.banksGrid}>
                    {['HDFC', 'ICICI', 'SBI', 'Axis', 'Kotak'].map((bank) => (
                      <TouchableOpacity
                        key={bank}
                        activeOpacity={0.7}
                        onPress={() => setSelectedBank(bank)}
                        style={[
                          styles.bankTile,
                          selectedBank === bank && styles.activeBankTile,
                        ]}
                      >
                        <Icon name="bank-outline" size={20} color={selectedBank === bank ? '#2563EB' : '#64748B'} />
                        <Text style={[styles.bankTileText, selectedBank === bank && styles.activeBankTileText]}>
                          {bank}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Security Shield Guarantee */}
              <View style={styles.securityBadge}>
                <Icon name="lock-outline" size={16} color="#059669" />
                <Text style={{ fontSize: 11, color: '#047857', fontWeight: '600' }}>
                  256-Bit SSL Encrypted Payment via Razorpay / Firebase Gateway
                </Text>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          )}

          {/* Action Button Footer */}
          {!isProcessing && !isSuccess && (
            <View style={styles.modalFooter}>
              <Button
                mode="contained"
                buttonColor={AppColors.primary}
                onPress={handleProcessPayment}
                style={styles.payNowBtn}
                contentStyle={{ paddingVertical: 4 }}
                icon="lock-check"
              >
                Pay ₹ {bill.amount.toLocaleString('en-IN')} Now
              </Button>
            </View>
          )}
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBody: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  billSummaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  paymentTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  paymentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activePaymentTab: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  paymentTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activePaymentTabText: {
    color: '#2563EB',
  },
  tabContentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 14,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  upiAppTile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  activeUpiAppTile: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  upiAppText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeUpiAppText: {
    color: '#2563EB',
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankTile: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeBankTile: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  bankTileText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  activeBankTileText: {
    color: '#2563EB',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  modalFooter: {
    paddingHorizontal: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  payNowBtn: {
    borderRadius: 14,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  successSubtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  txnCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginTop: 16,
    gap: 8,
  },
  txnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txnLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  txnValue: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '700',
  },
});
