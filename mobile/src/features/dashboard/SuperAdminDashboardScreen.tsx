import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar, Chip, useTheme } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { StatCard, StatusBadge } from '../../components/Common';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { AppColors } from '../../config/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const screenWidth = Dimensions.get('window').width - 32;

const MONTHS_LIST = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const SuperAdminDashboardScreen: React.FC<{
  onNavigateToOnboard?: () => void;
  onNavigateToAssignAdmin?: () => void;
}> = ({ onNavigateToOnboard, onNavigateToAssignAdmin }) => {
  const theme = useTheme();
  const { user, switchSociety } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // Time Range Filter State: ALL (12M) | 6M | 3M | Single Month Selection
  const [timeFilter, setTimeFilter] = React.useState<'ALL' | '3M' | '6M' | string>('6M');

  // Interactive Chart Tooltip State
  const [selectedPoint, setSelectedPoint] = React.useState<{
    month: string;
    revenue: number;
    societies: number;
  } | null>({
    month: 'Aug 2026',
    revenue: 18.5,
    societies: 14,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const masterData = {
    months: [
      'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026',
      'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026'
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [12.0, 13.2, 14.5, 15.0, 16.2, 17.1, 17.8, 18.5, 19.2, 20.4, 21.8, 23.0],
    societies: [8, 9, 10, 11, 12, 13, 13, 14, 15, 16, 17, 18],
  };

  const getActiveChartData = () => {
    if (timeFilter === '3M') {
      return {
        labels: ['Jun', 'Jul', 'Aug'],
        revenue: [17.1, 17.8, 18.5],
        societies: [13, 13, 14],
        months: ['Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (timeFilter === '6M') {
      return {
        labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        revenue: [14.5, 15.0, 16.2, 17.1, 17.8, 18.5],
        societies: [10, 11, 12, 13, 13, 14],
        months: ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'],
      };
    }
    if (MONTHS_LIST.includes(timeFilter)) {
      const idx = MONTHS_LIST.indexOf(timeFilter);
      const startIdx = Math.max(0, idx - 1);
      const endIdx = Math.min(11, idx + 1);
      return {
        labels: masterData.labels.slice(startIdx, endIdx + 1),
        revenue: masterData.revenue.slice(startIdx, endIdx + 1),
        societies: masterData.societies.slice(startIdx, endIdx + 1),
        months: masterData.months.slice(startIdx, endIdx + 1),
      };
    }
    return {
      labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'],
      revenue: [12.0, 14.5, 16.2, 17.8, 19.2, 21.8],
      societies: [8, 10, 12, 13, 15, 17],
      months: masterData.months,
    };
  };

  const activeDataset = getActiveChartData();

  const societies = [
    { id: '1', name: 'Royal Heights Co-op Society', city: 'Mumbai', units: 120, status: 'ACTIVE', revenue: '₹ 4.85 L' },
    { id: '2', name: 'Palm Grove Residency', city: 'Pune', units: 240, status: 'ACTIVE', revenue: '₹ 9.20 L' },
    { id: '3', name: 'Greenfield Towers', city: 'Bangalore', units: 180, status: 'PENDING_ONBOARDING', revenue: '₹ 0.00' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: AppColors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text variant="bodyMedium" style={{ color: AppColors.textSecondary, fontWeight: '600' }}>
            SaaS Platform Manager
          </Text>
          <Text variant="titleLarge" style={styles.userName}>
            {user?.name || 'Super Admin'}
          </Text>
          <Text variant="labelSmall" style={{ color: '#8B5CF6', fontWeight: '800' }}>
            SUPER ADMIN (PLATFORM OWNER)
          </Text>
        </View>
        <Avatar.Text size={44} label="SA" style={{ backgroundColor: '#8B5CF6' }} />
      </View>

      {/* Switched Society Active Context Banner */}
      <View style={{
        backgroundColor: '#F5F3FF',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#DDD6FE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <Icon name="office-building" size={20} color="#8B5CF6" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, color: '#64748B', fontWeight: '700' }}>ACTIVE SOCIETY CONTEXT</Text>
            <Text style={{ fontSize: 13, color: '#0F172A', fontWeight: '800' }} numberOfLines={1}>
              {user?.societyName || 'Royal Heights Co-op Society'}
            </Text>
          </View>
        </View>
        <Chip style={{ backgroundColor: '#E0E7FF' }} textStyle={{ color: '#4F46E5', fontWeight: '800', fontSize: 9 }}>
          {user?.societyId === 'soc_2' ? 'PUNE' : user?.societyId === 'soc_3' ? 'BANGALORE' : 'MUMBAI'}
        </Chip>
      </View>

      {/* Global SaaS Platform Metrics */}
      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <StatCard
            title="Total Onboarded Societies"
            value="14"
            subtitle="2 Pending Setup"
            icon="domain"
            iconColor="#8B5CF6"
          />
        </View>
        <View style={styles.gridItem}>
          <StatCard
            title="Total Active Units"
            value="2,450"
            subtitle="Across 4 Cities"
            icon="home-group"
            iconColor="#2563EB"
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.gridItem}>
          <StatCard
            title="Monthly Platform ARR"
            value="₹ 18.5 L"
            subtitle="+14% this month"
            icon="chart-line"
            iconColor="#10B981"
          />
        </View>
        <View style={styles.gridItem}>
          <StatCard
            title="Total System Users"
            value="8,920"
            subtitle="Residents & Admins"
            icon="account-group"
            iconColor="#F59E0B"
          />
        </View>
      </View>

      {/* SaaS Revenue & Onboarding Analytics */}
      <Text variant="titleMedium" style={[styles.sectionTitle, { marginTop: 16 }]}>
        SaaS Revenue & Growth Analytics
      </Text>

      <AnimatedGlassCard delay={150} style={styles.professionalChartCard}>
        {/* Card Header & Preset Chips */}
        <View style={styles.chartHeaderRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A' }} numberOfLines={1}>
              Platform ARR & Expansion
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B' }} numberOfLines={1}>
              Tap nodes to inspect monthly MRR
            </Text>
          </View>
          <View style={styles.chipRow}>
            {(['3M', '6M', 'ALL'] as const).map((preset) => (
              <Chip
                key={preset}
                selected={timeFilter === preset}
                showSelectedCheck={false}
                onPress={() => {
                  setTimeFilter(preset);
                  const ds = getActiveChartData();
                  setSelectedPoint({
                    month: ds.months[ds.months.length - 1],
                    revenue: ds.revenue[ds.revenue.length - 1],
                    societies: ds.societies[ds.societies.length - 1],
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

        {/* Selected Point Tooltip */}
        {selectedPoint && (
          <View style={styles.tooltipBadge}>
            <View style={styles.tooltipRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tooltipTitle}>{selectedPoint.month} Growth Report</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 2, flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 12, color: '#8B5CF6', fontWeight: '700' }}>
                    🟣 ARR: ₹ {selectedPoint.revenue} L
                  </Text>
                  <Text style={{ fontSize: 12, color: '#2563EB', fontWeight: '700' }}>
                    🏢 Societies: {selectedPoint.societies} Active
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Custom Clean JSX Legend Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#8B5CF6' }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#475569' }}>Monthly Platform ARR (₹ Lakhs)</Text>
          </View>
        </View>

        {/* Isolated SVG Chart Container */}
        <View style={styles.chartSvgWrapper}>
          <LineChart
            data={{
              labels: activeDataset.labels,
              datasets: [
                {
                  data: activeDataset.revenue,
                  color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Purple: Platform ARR
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
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
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
                revenue: activeDataset.revenue[idx],
                societies: activeDataset.societies[idx],
              });
            }}
            style={{ borderRadius: 16, marginVertical: 4 }}
          />
        </View>

        {/* Scrollable Month Pills Footer */}
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
                    month: masterData.months[idx],
                    revenue: masterData.revenue[idx],
                    societies: masterData.societies[idx],
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

      {/* Quick Platform Actions */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Platform Controls
      </Text>
      <View style={styles.actionsRow}>
        <Button mode="contained" icon="plus" buttonColor="#8B5CF6" style={styles.actionBtn} onPress={onNavigateToOnboard}>
          Onboard Society
        </Button>
        <Button mode="contained-tonal" icon="shield-account" style={styles.actionBtn} onPress={onNavigateToAssignAdmin}>
          Assign Admin
        </Button>
      </View>

      {/* Managed Societies List */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Registered Housing Societies
      </Text>
      {societies.map((soc, idx) => {
        const isCurrent = user?.societyId === soc.id || user?.societyId === ('soc_' + soc.id) || 
          (soc.id === '1' && (user?.societyId === 'platform' || !user?.societyId));
        return (
          <AnimatedGlassCard key={soc.id} delay={idx * 100} style={{ padding: 16, marginBottom: 8 }}>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text variant="titleSmall" style={{ fontWeight: '800', color: '#0F172A' }}>
                  {soc.name}
                </Text>
                <Text variant="bodySmall" style={{ color: '#64748B', fontWeight: '600' }}>
                  {soc.city} • {soc.units} Units • Monthly Rev: {soc.revenue}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <StatusBadge status={soc.status} />
                {isCurrent ? (
                  <Chip
                    compact
                    style={{ backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0' }}
                    textStyle={{ color: '#059669', fontSize: 10, fontWeight: '800' }}
                  >
                    Active
                  </Chip>
                ) : (
                  <TouchableOpacity
                    onPress={() => switchSociety('soc_' + soc.id, soc.name)}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderWidth: 1,
                      borderColor: '#8B5CF6',
                      borderRadius: 12,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                    }}
                  >
                    <Text style={{ color: '#8B5CF6', fontSize: 10, fontWeight: '800' }}>Switch</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </AnimatedGlassCard>
        );
      })}

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
    marginTop: 20,
    marginBottom: 10,
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
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
  },
  activeChip: {
    backgroundColor: '#8B5CF6',
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
    backgroundColor: '#F5F3FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
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
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
