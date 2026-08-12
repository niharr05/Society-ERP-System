import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Chip, Searchbar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { AppColors } from '../../config/theme';

interface SocietyNoticeBoardScreenProps {
  onBack?: () => void;
}

export const SocietyNoticeBoardScreen: React.FC<SocietyNoticeBoardScreenProps> = ({ onBack }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedFilter, setSelectedFilter] = React.useState<'ALL' | 'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY'>('ALL');

  const notices = [
    {
      id: '1',
      title: 'Annual General Body Meeting (AGM 2026)',
      category: 'GENERAL',
      date: '04 Aug 2026',
      content: 'All residents and flat owners are requested to attend the Annual General Body Meeting scheduled for Sunday, August 16th at 10:00 AM in the Clubhouse.',
      isImportant: true,
      author: 'Secretary (Rajesh Sharma)',
    },
    {
      id: '2',
      title: 'Water Supply Maintenance Shutdown',
      category: 'MAINTENANCE',
      date: '02 Aug 2026',
      content: 'Please note that main overhead tank cleaning will occur on Wednesday between 10:00 AM and 02:00 PM. Water supply will remain temporarily suspended.',
      isImportant: true,
      author: 'Maintenance Manager',
    },
    {
      id: '3',
      title: 'Independence Day Cultural Celebration',
      category: 'EVENT',
      date: '28 Jul 2026',
      content: 'Join us for Flag Hoisting followed by cultural programs and sweets distribution on August 15th at 08:30 AM at the Society Main Lawn.',
      isImportant: false,
      author: 'Cultural Committee',
    },
  ];

  const filteredNotices = notices.filter(
    (item) =>
      (selectedFilter === 'ALL' || item.category === selectedFilter) &&
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
          Society Notice Board
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Official circulars, maintenance alerts, and society announcements
        </Text>
      </View>

      <Searchbar
        placeholder="Search notices..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
      />

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {(['ALL', 'GENERAL', 'MAINTENANCE', 'EVENT', 'EMERGENCY'] as const).map((cat) => (
          <Chip
            key={cat}
            selected={selectedFilter === cat}
            onPress={() => setSelectedFilter(cat)}
            compact
            style={[styles.filterChip, selectedFilter === cat && styles.activeChip]}
            textStyle={[styles.chipText, selectedFilter === cat && styles.activeChipText]}
          >
            {cat}
          </Chip>
        ))}
      </ScrollView>

      {/* Notices List */}
      {filteredNotices.map((notice, idx) => (
        <AnimatedGlassCard key={notice.id} delay={idx * 120} style={styles.noticeCard}>
          <View style={styles.cardHeader}>
            <Chip
              compact
              style={{ backgroundColor: notice.isImportant ? '#FEE2E2' : '#EEF2FF' }}
              textStyle={{ color: notice.isImportant ? '#DC2626' : '#2563EB', fontSize: 10, fontWeight: '800' }}
            >
              {notice.category}
            </Chip>
            <Text variant="labelSmall" style={{ color: '#64748B', fontWeight: '700' }}>
              {notice.date}
            </Text>
          </View>

          <Text variant="titleMedium" style={styles.noticeTitle}>
            {notice.title}
          </Text>
          <Text variant="bodyMedium" style={styles.noticeContent}>
            {notice.content}
          </Text>

          <View style={styles.cardFooter}>
            <Icon name="account-circle-outline" size={18} color="#64748B" />
            <Text variant="labelSmall" style={{ color: '#64748B', fontWeight: '700', marginLeft: 6 }}>
              Published by: {notice.author}
            </Text>
          </View>
        </AnimatedGlassCard>
      ))}

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
    marginBottom: 14,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  search: {
    marginBottom: 12,
    borderRadius: 12,
  },
  filterChip: {
    backgroundColor: '#F1F5F9',
    marginRight: 6,
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
  noticeCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeTitle: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 6,
  },
  noticeContent: {
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
});
