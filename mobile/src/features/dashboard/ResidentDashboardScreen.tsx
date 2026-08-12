import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { StatCard, StatusBadge } from '../../components/Common';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { AppColors } from '../../config/theme';
import { PreApproveVisitorScreen } from '../visitors/PreApproveVisitorScreen';
import { BookAmenityScreen } from '../amenities/BookAmenityScreen';
import { SocietyNoticeBoardScreen } from '../notices/SocietyNoticeBoardScreen';
import { RaiseTicketScreen } from '../complaints/RaiseTicketScreen';
import { BillDetailModal, BillItem } from '../billing/BillDetailModal';

const screenWidth = Dimensions.get('window').width - 32;

import { MaintenancePaymentModal } from '../billing/MaintenancePaymentModal';

export const ResidentDashboardScreen = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedBillModal, setSelectedBillModal] = React.useState<BillItem | null>(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);

  const [residentBill, setResidentBill] = React.useState<BillItem>({
    id: '102',
    month: 'August 2026',
    unit: user?.unitNumber || 'B-201',
    name: user?.name || 'Priya Patel',
    amount: 3850,
    dueDate: '10 Aug 2026',
    status: 'UNPAID',
  });

  const handlePaymentSuccess = (billId: string, txnId: string) => {
    const updated: BillItem = {
      ...residentBill,
      status: 'PAID',
      receiptNumber: txnId,
      paidOn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setResidentBill(updated);
    setSelectedBillModal(updated);
  };

  // Sub-screen navigation states for Resident
  const [activeSubScreen, setActiveSubScreen] = React.useState<
    'DASHBOARD' | 'PRE_APPROVE' | 'BOOK_AMENITY' | 'NOTICES' | 'RAISE_TICKET'
  >('DASHBOARD');

  // Time Range Filter State: ALL (12M) | 6M | 3M | Single Month Selection
  const [timeFilter, setTimeFilter] = React.useState<'ALL' | '3M' | '6M' | string>('6M');

  // Chart View Mode Filter: Compare (Income vs Spend) | Expense Breakdown
  const [viewMode, setViewMode] = React.useState<'COMPARE' | 'EXPENSES'>('COMPARE');

  // Interactive Data Point Selection State
  const [selectedPoint, setSelectedPoint] = React.useState<{
    month: string;
    income: number;
    spend: number;
  } | null>({
    month: 'Aug 2026',
    income: 4.85,
    spend: 3.2,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const MONTHS_LIST = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // 12-Month Master Financial Dataset
  const fullYearData = {
    months: [
      'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
      'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    income: [3.4, 3.6, 3.8, 4.1, 4.5, 4.2, 4.7, 4.85, 4.6, 4.9, 5.1, 5.2],
    spend: [2.5, 2.7, 2.9, 3.0, 3.6, 3.1, 3.4, 3.20, 3.3, 3.5, 3.6, 3.7],
  };

  const getActiveData = () => {
    if (timeFilter === '3M') {
      return {
        labels: ['Jun', 'Jul', 'Aug'],
        income: [4.2, 4.7, 4.85],
        spend: [3.1, 3.4, 3.2],
        months: ['Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (timeFilter === '6M') {
      return {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        income: [3.8, 4.1, 4.5, 4.2, 4.7, 4.85],
        spend: [2.9, 3.0, 3.6, 3.1, 3.4, 3.2],
        months: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (MONTHS_LIST.includes(timeFilter)) {
      const idx = MONTHS_LIST.indexOf(timeFilter);
      const startIdx = Math.max(0, idx - 1);
      const endIdx = Math.min(11, idx + 1);
      return {
        labels: fullYearData.labels.slice(startIdx, endIdx + 1),
        income: fullYearData.income.slice(startIdx, endIdx + 1),
        spend: fullYearData.spend.slice(startIdx, endIdx + 1),
        months: fullYearData.months.slice(startIdx, endIdx + 1),
      };
    }
    return {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      income: [3.4, 3.8, 4.5, 4.7, 4.6, 5.1],
      spend: [2.5, 2.9, 3.6, 3.4, 3.3, 3.6],
      months: fullYearData.months,
    };
  };

  const currentData = getActiveData();

  // Expense Category Breakdown Data (in ₹ Thousands)
  const expenseCategoryData = {
    labels: ['Security', 'Lift/Gen', 'Power', 'Garden', 'Repairs'],
    datasets: [
      {
        data: [110, 85, 65, 25, 35],
      },
    ],
  };

  if (activeSubScreen === 'PRE_APPROVE') {
    return <PreApproveVisitorScreen onBack={() => setActiveSubScreen('DASHBOARD')} />;
  }
  if (activeSubScreen === 'BOOK_AMENITY') {
    return <BookAmenityScreen onBack={() => setActiveSubScreen('DASHBOARD')} />;
  }
  if (activeSubScreen === 'NOTICES') {
    return <SocietyNoticeBoardScreen onBack={() => setActiveSubScreen('DASHBOARD')} />;
  }
  if (activeSubScreen === 'RAISE_TICKET') {
    return <RaiseTicketScreen onBack={() => setActiveSubScreen('DASHBOARD')} />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: AppColors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* User Header */}
      <View style={styles.header}>
        <View>
          <Text variant="bodyMedium" style={{ color: AppColors.textSecondary, fontWeight: '600' }}>
            Unit {user?.unitNumber || 'B-201'}
          </Text>
          <Text variant="titleLarge" style={styles.userName}>
            {user?.name || 'Priya Patel'}
          </Text>
          <Text variant="labelSmall" style={{ color: AppColors.secondary, fontWeight: '800' }}>
            RESIDENT (OWNER)
          </Text>
        </View>
        <Avatar.Text size={44} label={user?.name?.[0] || 'R'} style={{ backgroundColor: AppColors.primary }} />
      </View>

      {/* Featured Personal Maintenance Bill Card */}
      <AnimatedGlassCard delay={100} style={styles.billCard}>
        <View style={styles.billHeader}>
          <Text variant="labelLarge" style={{ color: '#64748B', fontWeight: '700' }}>
            Maintenance Bill • {residentBill.month}
          </Text>
          <StatusBadge status={residentBill.status} />
        </View>

        <Text variant="displaySmall" style={styles.billAmount}>
          ₹ {residentBill.amount.toLocaleString('en-IN')}
        </Text>

        {residentBill.status === 'PAID' ? (
          <Text variant="bodySmall" style={{ color: '#059669', fontWeight: '700', marginBottom: 16 }}>
            ✓ Paid on {residentBill.paidOn || '10 Aug 2026'} • Ref: {residentBill.receiptNumber || 'TXN-884920'}
          </Text>
        ) : (
          <Text variant="bodySmall" style={{ color: '#64748B', marginBottom: 16 }}>
            Due Date: {residentBill.dueDate}
          </Text>
        )}

        <View style={{ flexDirection: 'row', gap: 8 }}>
          {residentBill.status === 'PAID' ? (
            <>
              <Button
                mode="outlined"
                icon="file-document-outline"
                style={{ flex: 1, borderRadius: 12 }}
                onPress={() => setSelectedBillModal(residentBill)}
              >
                View Receipt
              </Button>
              <Button
                mode="contained-tonal"
                icon="download-outline"
                style={{ flex: 1, borderRadius: 12 }}
                onPress={() => setSelectedBillModal(residentBill)}
              >
                Download PDF
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                buttonColor={AppColors.primary}
                textColor="#FFFFFF"
                icon="credit-card-outline"
                style={[styles.payBtn, { flex: 1 }]}
                onPress={() => setShowPaymentModal(true)}
              >
                Pay Now
              </Button>
              <Button
                mode="outlined"
                icon="file-document-outline"
                style={{ borderRadius: 12 }}
                onPress={() => setSelectedBillModal(residentBill)}
              >
                View Bill
              </Button>
            </>
          )}
        </View>
      </AnimatedGlassCard>

      {/* Bill Detail & Download Modal */}
      <BillDetailModal
        visible={!!selectedBillModal}
        bill={selectedBillModal}
        onClose={() => setSelectedBillModal(null)}
        onPayNow={() => {
          setSelectedBillModal(null);
          setShowPaymentModal(true);
        }}
      />

      {/* Interactive Maintenance Payment Modal */}
      <MaintenancePaymentModal
        visible={showPaymentModal}
        bill={residentBill}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Quick Services Grid */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Quick Actions
      </Text>
      <View style={styles.servicesGrid}>
        <AnimatedGlassCard delay={180} style={styles.serviceCard}>
          <Button
            mode="text"
            onPress={() => setActiveSubScreen('PRE_APPROVE')}
            contentStyle={styles.serviceContent}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="account-plus-outline" size={28} color={AppColors.primary} />
              <Text variant="labelMedium" style={styles.serviceText}>
                Pre-approve Visitor
              </Text>
            </View>
          </Button>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={240} style={styles.serviceCard}>
          <Button
            mode="text"
            onPress={() => setActiveSubScreen('RAISE_TICKET')}
            contentStyle={styles.serviceContent}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="wrench-outline" size={28} color={AppColors.primary} />
              <Text variant="labelMedium" style={styles.serviceText}>
                Raise Ticket
              </Text>
            </View>
          </Button>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={300} style={styles.serviceCard}>
          <Button
            mode="text"
            onPress={() => setActiveSubScreen('BOOK_AMENITY')}
            contentStyle={styles.serviceContent}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="pool" size={28} color={AppColors.primary} />
              <Text variant="labelMedium" style={styles.serviceText}>
                Book Amenity
              </Text>
            </View>
          </Button>
        </AnimatedGlassCard>

        <AnimatedGlassCard delay={360} style={styles.serviceCard}>
          <Button
            mode="text"
            onPress={() => setActiveSubScreen('NOTICES')}
            contentStyle={styles.serviceContent}
          >
            <View style={{ alignItems: 'center' }}>
              <Icon name="bullhorn-outline" size={28} color={AppColors.primary} />
              <Text variant="labelMedium" style={styles.serviceText}>
                Society Notices
              </Text>
            </View>
          </Button>
        </AnimatedGlassCard>
      </View>

      {/* Society Financial Transparency Section */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
        Society Financial Transparency
      </Text>

      {/* Society High-level Stat Metrics */}
      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <StatCard
            title="Total Collection (Aug)"
            value="₹ 4.85 L"
            subtitle="Income"
            icon="cash-plus"
            iconColor="#10B981"
          />
        </View>
        <View style={styles.gridItem}>
          <StatCard
            title="Total Spend (Aug)"
            value="₹ 3.20 L"
            subtitle="Expenses"
            icon="cash-minus"
            iconColor="#EF4444"
          />
        </View>
      </View>

      <AnimatedGlassCard delay={400} style={styles.professionalChartCard}>
        {/* Card Header & Toggles */}
        <View style={styles.chartHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A' }}>
              {viewMode === 'COMPARE' ? 'Income vs. Spending' : 'Expense Breakdown'}
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B' }}>
              Public financial ledger for residents
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Chip
              selected={viewMode === 'COMPARE'}
              onPress={() => setViewMode('COMPARE')}
              compact
              style={[styles.viewModeChip, viewMode === 'COMPARE' && styles.activeViewModeChip]}
              textStyle={[styles.chipText, viewMode === 'COMPARE' && styles.activeChipText]}
            >
              Trend
            </Chip>
            <Chip
              selected={viewMode === 'EXPENSES'}
              onPress={() => setViewMode('EXPENSES')}
              compact
              style={[styles.viewModeChip, viewMode === 'EXPENSES' && styles.activeViewModeChip]}
              textStyle={[styles.chipText, viewMode === 'EXPENSES' && styles.activeChipText]}
            >
              Breakdown
            </Chip>
          </View>
        </View>

        {/* Range Preset Row */}
        {viewMode === 'COMPARE' && (
          <View style={styles.presetRow}>
            {(['3M', '6M', 'ALL'] as const).map((range) => (
              <Chip
                key={range}
                selected={timeFilter === range}
                onPress={() => {
                  setTimeFilter(range);
                  const ds = getActiveData();
                  setSelectedPoint({
                    month: ds.months[ds.months.length - 1],
                    income: ds.income[ds.income.length - 1],
                    spend: ds.spend[ds.spend.length - 1],
                  });
                }}
                compact
                style={[styles.filterChip, timeFilter === range && styles.activeChip]}
                textStyle={[styles.chipText, timeFilter === range && styles.activeChipText]}
              >
                {range === '3M' ? '3 Months' : range === '6M' ? '6 Months' : '12 Months'}
              </Chip>
            ))}
          </View>
        )}

        {/* Tooltip Banner */}
        {viewMode === 'COMPARE' && selectedPoint && (
          <View style={styles.tooltipBadge}>
            <View style={styles.tooltipRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tooltipTitle}>{selectedPoint.month} Summary</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
                  <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700' }}>
                    🟢 Income: ₹ {selectedPoint.income} L
                  </Text>
                  <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '700' }}>
                    🔴 Spend: ₹ {selectedPoint.spend} L
                  </Text>
                </View>
              </View>
              <View style={styles.savingsBox}>
                <Text style={{ fontSize: 10, color: '#0F172A', fontWeight: '600' }}>Surplus</Text>
                <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '800' }}>
                  +₹ {(selectedPoint.income - selectedPoint.spend).toFixed(2)} L
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Custom Clean JSX Legend Row (No SVG Text Overlaps) */}
        {viewMode === 'COMPARE' && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8, marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>Total Income (₹ L)</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>Total Spend (₹ L)</Text>
            </View>
          </View>
        )}

        {/* Isolated Chart SVG Container */}
        <View style={styles.chartSvgWrapper}>
          {viewMode === 'COMPARE' ? (
            <LineChart
              data={{
                labels: currentData.labels,
                datasets: [
                  {
                    data: currentData.income,
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green: Income
                    strokeWidth: 3,
                    withScrollableDot: false,
                  },
                  {
                    data: currentData.spend,
                    color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red: Spend
                    strokeWidth: 3,
                    withScrollableDot: false,
                  },
                ],
              }}
              width={screenWidth - 44}
              height={200}
              yAxisSuffix="L"
              yLabelsOffset={8}
              withScrollableDot={false}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#FFFFFF',
                },
                propsForBackgroundLines: {
                  strokeDasharray: '4 4',
                  stroke: '#E2E8F0',
                },
                propsForLabels: {
                  fontSize: 10,
                  fontWeight: '600',
                },
              }}
              bezier
              onDataPointClick={(data: any) => {
                const idx = data.index;
                setSelectedPoint({
                  month: currentData.months[idx],
                  income: currentData.income[idx],
                  spend: currentData.spend[idx],
                });
              }}
              style={{ borderRadius: 16, marginVertical: 4 }}
            />
          ) : (
            <BarChart
              data={expenseCategoryData}
              width={screenWidth - 44}
              height={190}
              yAxisLabel="₹"
              yAxisSuffix="k"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                style: { borderRadius: 16 },
                propsForBackgroundLines: {
                  strokeDasharray: '4 4',
                  stroke: '#E2E8F0',
                },
                propsForLabels: {
                  fontSize: 10,
                  fontWeight: '600',
                },
              }}
              style={{ borderRadius: 16, marginVertical: 4 }}
            />
          )}
        </View>

        {/* Scrollable Month Pills Footer */}
        {viewMode === 'COMPARE' && (
          <View style={styles.monthSelectorFooter}>
            <Text variant="labelSmall" style={{ color: '#64748B', fontWeight: '700', marginBottom: 6 }}>
              Select Specific Month:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {MONTHS_LIST.map((m) => (
                <TouchableOpacity
                  key={m}
                  activeOpacity={0.7}
                  onPress={() => {
                    setTimeFilter(m);
                    const idx = MONTHS_LIST.indexOf(m);
                    setSelectedPoint({
                      month: fullYearData.months[idx],
                      income: fullYearData.income[idx],
                      spend: fullYearData.spend[idx],
                    });
                  }}
                  style={[
                    styles.monthPill,
                    timeFilter === m && styles.activeMonthPill,
                  ]}
                >
                  <Text style={[styles.monthPillText, timeFilter === m && styles.activeMonthPillText]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </AnimatedGlassCard>

      {/* Expected Visitors */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Expected Visitors
      </Text>
      <AnimatedGlassCard delay={520} style={{ padding: 14 }}>
        <View style={styles.visitorRow}>
          <Icon name="account-group" size={26} color={AppColors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0F172A' }}>
              Rahul Verma (Guest)
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B' }}>
              Expected Today • Passcode: 492810
            </Text>
          </View>
          <StatusBadge status="EXPECTED" />
        </View>
      </AnimatedGlassCard>

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
  billCard: {
    padding: 20,
    marginBottom: 16,
  },
  billHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billAmount: {
    color: '#0F172A',
    fontWeight: '800',
    marginVertical: 6,
  },
  payBtn: {
    borderRadius: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 10,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  serviceCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 8,
    padding: 2,
  },
  serviceContent: {
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  serviceText: {
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '700',
    color: '#334155',
  },
  financeHeaderRow: {
    marginTop: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginTop: 8,
  },
  gridItem: {
    flex: 1,
    paddingHorizontal: 4,
  },
  professionalChartCard: {
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  chartSvgWrapper: {
    overflow: 'hidden',
    alignItems: 'center',
    marginVertical: 4,
  },
  monthSelectorFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 10,
  },
  monthPill: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeMonthPill: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  monthPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeMonthPillText: {
    color: '#FFFFFF',
  },
  viewModeChip: {
    backgroundColor: '#F1F5F9',
  },
  activeViewModeChip: {
    backgroundColor: '#0F172A',
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: '#2563EB',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  tooltipBadge: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 8,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  savingsBox: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
