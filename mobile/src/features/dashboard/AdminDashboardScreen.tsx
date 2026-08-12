import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Chip, useTheme } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { StatCard } from '../../components/Common';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { AppColors } from '../../config/theme';

const screenWidth = Dimensions.get('window').width - 32;

interface AdminDashboardProps {
  onNavigateToIssueBill?: () => void;
  onNavigateToNotice?: () => void;
}

const MONTHS_LIST = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const AdminDashboardScreen: React.FC<AdminDashboardProps> = ({
  onNavigateToIssueBill,
  onNavigateToNotice,
}) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Time Range Filter State: ALL (12M) | 6M | 3M | Single Month Selection
  const [timeFilter, setTimeFilter] = React.useState<'ALL' | '6M' | '3M' | string>('6M');

  // Interactive Chart Tooltip State
  const [selectedPoint, setSelectedPoint] = React.useState<{
    month: string;
    collection: number;
    dues: number;
  } | null>({
    month: 'Aug 2026',
    collection: 4.85,
    dues: 0.64,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // 12-Month Financial Collection & Dues Master Dataset (in Lakhs ₹)
  const fullYearData = {
    months: [
      'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
      'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    collection: [3.4, 3.6, 3.8, 4.1, 4.5, 4.2, 4.7, 4.85, 4.6, 4.9, 5.1, 5.2],
    dues: [0.95, 0.88, 0.82, 0.75, 0.68, 0.72, 0.60, 0.64, 0.58, 0.52, 0.48, 0.45],
  };

  // Get active dataset based on selected filter
  const getActiveChartData = () => {
    if (timeFilter === '3M') {
      return {
        labels: ['Jun', 'Jul', 'Aug'],
        collection: [4.2, 4.7, 4.85],
        dues: [0.72, 0.60, 0.64],
        months: ['Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (timeFilter === '6M') {
      return {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        collection: [3.8, 4.1, 4.5, 4.2, 4.7, 4.85],
        dues: [0.82, 0.75, 0.68, 0.72, 0.60, 0.64],
        months: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (MONTHS_LIST.includes(timeFilter)) {
      const idx = MONTHS_LIST.indexOf(timeFilter);
      // Show 3-month window centered around selected month
      const startIdx = Math.max(0, idx - 1);
      const endIdx = Math.min(11, idx + 1);
      return {
        labels: fullYearData.labels.slice(startIdx, endIdx + 1),
        collection: fullYearData.collection.slice(startIdx, endIdx + 1),
        dues: fullYearData.dues.slice(startIdx, endIdx + 1),
        months: fullYearData.months.slice(startIdx, endIdx + 1),
      };
    }
    // Default 'ALL' 12 Months
    return {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      collection: [3.4, 3.8, 4.5, 4.7, 4.6, 5.1],
      dues: [0.95, 0.82, 0.68, 0.60, 0.58, 0.48],
      months: fullYearData.months,
    };
  };

  const activeDataset = getActiveChartData();

  const complaintData = {
    labels: ['Plumbing', 'Electric', 'Security', 'Hygiene', 'Parking'],
    datasets: [
      {
        data: [8, 5, 2, 4, 3],
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: AppColors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text variant="bodyMedium" style={{ color: AppColors.textSecondary, fontWeight: '600' }}>
            Welcome Back,
          </Text>
          <Text variant="titleLarge" style={styles.userName}>
            {user?.name || 'Society Admin'}
          </Text>
          <Text variant="labelSmall" style={{ color: AppColors.primary, fontWeight: '800' }}>
            SOCIETY COMMITTEE / SECRETARY
          </Text>
        </View>
        <Avatar.Text size={44} label={user?.name?.[0] || 'A'} style={{ backgroundColor: AppColors.primary }} />
      </View>

      {/* High-level Metrics */}
      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <StatCard
            title="Monthly Collection"
            value="₹ 4.85 L"
            subtitle="88% collected (Aug)"
            icon="cash-multiple"
            iconColor="#10B981"
          />
        </View>
        <View style={styles.gridItem}>
          <StatCard
            title="Outstanding Dues"
            value="₹ 64,200"
            subtitle="12 Units pending"
            icon="alert-circle-outline"
            iconColor="#EF4444"
          />
        </View>
      </View>

      {/* Professional Financial Analytics Section */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
        Financial Analytics & Dues
      </Text>

      <AnimatedGlassCard delay={150} style={styles.professionalChartCard}>
        {/* Card Header with Title and Range Presets */}
        <View style={styles.chartHeaderRow}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A' }}>
              Collection vs. Pending Dues
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B', marginTop: 1 }}>
              Tap nodes to inspect monthly details
            </Text>
          </View>
          <View style={styles.chipRow}>
            {(['3M', '6M', 'ALL'] as const).map((preset) => (
              <Chip
                key={preset}
                selected={timeFilter === preset}
                onPress={() => {
                  setTimeFilter(preset);
                  const ds = getActiveChartData();
                  setSelectedPoint({
                    month: ds.months[ds.months.length - 1],
                    collection: ds.collection[ds.collection.length - 1],
                    dues: ds.dues[ds.dues.length - 1],
                  });
                }}
                compact
                style={[styles.filterChip, timeFilter === preset && styles.activeChip]}
                textStyle={[styles.chipText, timeFilter === preset && styles.activeChipText]}
              >
                {preset === '3M' ? '3M' : preset === '6M' ? '6M' : '12M'}
              </Chip>
            ))}
          </View>
        </View>

        {/* Selected Month Interactive Tooltip Banner */}
        {selectedPoint && (
          <View style={styles.tooltipBadge}>
            <View style={styles.tooltipRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tooltipTitle}>{selectedPoint.month} Summary</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 2 }}>
                  <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700' }}>
                    🟢 Collection: ₹ {selectedPoint.collection} L
                  </Text>
                  <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '700' }}>
                    🔴 Dues: ₹ {selectedPoint.dues} L
                  </Text>
                </View>
              </View>
              <View style={styles.efficiencyBadge}>
                <Text style={{ fontSize: 10, color: '#475569', fontWeight: '700' }}>Collection</Text>
                <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '800' }}>
                  {Math.round((selectedPoint.collection / (selectedPoint.collection + selectedPoint.dues)) * 100)}%
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Custom Clean JSX Legend Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 8, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#10B981' }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>Collection (₹ L)</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>Dues (₹ L)</Text>
          </View>
        </View>

        {/* Isolated LineChart Container with overflow hidden and withScrollableDot={false} */}
        <View style={styles.chartSvgWrapper}>
          <LineChart
            data={{
              labels: activeDataset.labels,
              datasets: [
                {
                  data: activeDataset.collection,
                  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Emerald Green
                  strokeWidth: 3,
                  withScrollableDot: false,
                },
                {
                  data: activeDataset.dues,
                  color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Rose Red
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
                month: activeDataset.months[idx],
                collection: activeDataset.collection[idx],
                dues: activeDataset.dues[idx],
              });
            }}
            style={{ borderRadius: 16, marginVertical: 6 }}
          />
        </View>

        {/* Scrollable Month Selector Bar at Bottom of Card */}
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
                    collection: fullYearData.collection[idx],
                    dues: fullYearData.dues[idx],
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
      </AnimatedGlassCard>

      {/* Complaint Category Distribution Bar Chart */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 18, marginBottom: 8 }]}>
        Complaints Distribution by Category
      </Text>

      <AnimatedGlassCard delay={250} style={styles.professionalChartCard}>
        <View style={styles.chartSvgWrapper}>
          <BarChart
            data={complaintData}
            width={screenWidth - 44}
            height={190}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
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
        </View>
      </AnimatedGlassCard>

      {/* Management Actions */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Management Actions
      </Text>
      <View style={styles.actionsRow}>
        <Button
          mode="contained"
          icon="plus"
          style={styles.actionBtn}
          onPress={onNavigateToIssueBill}
        >
          Issue Bill
        </Button>
        <Button
          mode="contained-tonal"
          icon="bullhorn"
          style={styles.actionBtn}
          onPress={onNavigateToNotice}
        >
          New Notice
        </Button>
      </View>

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
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
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
  professionalChartCard: {
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  efficiencyBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
  },
});
