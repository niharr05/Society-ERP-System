import React from 'react';
import { View, StyleSheet, Modal, ScrollView, Alert, Share } from 'react-native';
import { Text, Button, Divider, IconButton, Surface, ActivityIndicator, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StatusBadge } from '../../components/Common';
import { AppColors } from '../../config/theme';

export interface BillItem {
  id: string;
  month: string;
  unit: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  breakdown?: { name: string; amount: number }[];
  receiptNumber?: string;
  paidOn?: string;
}

interface BillDetailModalProps {
  visible: boolean;
  bill: BillItem | null;
  onClose: () => void;
  onPayNow?: (bill: BillItem) => void;
}

export const BillDetailModal: React.FC<BillDetailModalProps> = ({
  visible,
  bill,
  onClose,
  onPayNow,
}) => {
  const theme = useTheme();
  const [downloading, setDownloading] = React.useState(false);

  if (!bill) return null;

  const defaultBreakdown = bill.breakdown || [
    { name: 'Maintenance Charges (1,000 sq.ft @ ₹3.5)', amount: 3500 },
    { name: 'Sinking Fund Reserve', amount: 350 },
    { name: 'Common Lighting & Water Supply', amount: 450 },
    { name: 'Security & Gatekeeper Fund', amount: 200 },
  ];

  const subtotal = defaultBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const lateFee = bill.status === 'OVERDUE' ? 250 : 0;
  const grandTotal = subtotal + lateFee;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    // Simulate PDF generation & download
    setTimeout(() => {
      setDownloading(false);
      Alert.alert(
        '📄 PDF Receipt Downloaded',
        `Maintenance bill receipt for ${bill.unit} (${bill.month}) has been saved to your device Downloads folder.`,
        [
          {
            text: 'Share PDF',
            onPress: () => {
              Share.share({
                message: `Royal Heights Maintenance Bill (${bill.month}) - Unit ${bill.unit}: Total ₹${grandTotal}. Status: ${bill.status}`,
              });
            },
          },
          { text: 'OK' },
        ]
      );
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Surface style={styles.modalContainer} elevation={5}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="file-document-outline" size={26} color={AppColors.primary} />
              <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0F172A' }}>
                Maintenance Bill Receipt
              </Text>
            </View>
            <IconButton icon="close" size={22} onPress={onClose} />
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Letterhead */}
            <View style={styles.letterhead}>
              <Text variant="titleMedium" style={styles.societyName}>
                🏢 Royal Heights Co-Op Housing Society
              </Text>
              <Text variant="bodySmall" style={styles.societyAddress}>
                Plot 42, Sector 18, Palm Beach Road, Navi Mumbai • Reg No: HSG/MUM/2021/8849
              </Text>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            {/* Bill Meta Row */}
            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>BILL NO.</Text>
                <Text style={styles.metaValue}>INV-2026-{bill.id.padStart(4, '0')}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>BILL PERIOD</Text>
                <Text style={styles.metaValue}>{bill.month}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>UNIT / FLAT</Text>
                <Text style={styles.metaValue}>{bill.unit}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>RESIDENT</Text>
                <Text style={styles.metaValue}>{bill.name}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.metaLabel}>PAYMENT STATUS</Text>
              <StatusBadge status={bill.status} />
            </View>

            {/* Itemized Breakdown Table */}
            <Text variant="titleSmall" style={styles.sectionHeader}>
              Itemized Charge Breakdown
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCol, { flex: 2, fontWeight: '700' }]}>Particulars</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'right', fontWeight: '700' }]}>
                  Amount (₹)
                </Text>
              </View>

              {defaultBreakdown.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCol, { flex: 2, color: '#334155' }]}>{item.name}</Text>
                  <Text style={[styles.tableCol, { flex: 1, textAlign: 'right', fontWeight: '600' }]}>
                    ₹ {item.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              {lateFee > 0 && (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCol, { flex: 2, color: '#EF4444' }]}>Late Fee Surcharge</Text>
                  <Text style={[styles.tableCol, { flex: 1, textAlign: 'right', color: '#EF4444', fontWeight: '600' }]}>
                    ₹ {lateFee}
                  </Text>
                </View>
              )}

              <Divider style={{ marginVertical: 8 }} />

              <View style={styles.tableRow}>
                <Text style={[styles.tableCol, { flex: 2, fontWeight: '800', color: '#0F172A' }]}>
                  Total Amount Payable
                </Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'right', fontWeight: '800', fontSize: 16, color: '#0F172A' }]}>
                  ₹ {grandTotal.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Important Notes */}
            <View style={styles.noteCard}>
              <Text variant="labelSmall" style={{ color: '#475569', fontWeight: '700' }}>
                📌 Payment Terms & Guidelines:
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748B', marginTop: 2 }}>
                Please clear maintenance dues by {bill.dueDate || '10th of every month'} to avoid 5% monthly late fee penalty. Receipts are computer generated.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons Footer */}
          <View style={styles.modalFooter}>
            <Button
              mode="outlined"
              icon="download-outline"
              loading={downloading}
              disabled={downloading}
              onPress={handleDownloadPDF}
              style={styles.downloadBtn}
              textColor={AppColors.primary}
            >
              {downloading ? 'Generating PDF...' : 'Download PDF Receipt'}
            </Button>

            {bill.status === 'UNPAID' && onPayNow && (
              <Button
                mode="contained"
                icon="credit-card-outline"
                buttonColor={AppColors.primary}
                onPress={() => {
                  onClose();
                  onPayNow(bill);
                }}
                style={styles.payBtn}
              >
                Pay ₹ {grandTotal}
              </Button>
            )}
          </View>
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
    maxHeight: '90%',
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalBody: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  letterhead: {
    alignItems: 'center',
    marginVertical: 4,
  },
  societyName: {
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  societyAddress: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    fontSize: 11,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  metaItem: {
    width: '46%',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  sectionHeader: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tableCol: {
    fontSize: 12,
  },
  noteCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  downloadBtn: {
    flex: 1,
    borderRadius: 12,
  },
  payBtn: {
    flex: 1,
    borderRadius: 12,
  },
});
