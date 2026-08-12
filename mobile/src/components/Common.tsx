import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../config/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  iconColor?: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} disabled={!onPress}>
      <View style={styles.glassCard}>
        <View style={styles.header}>
          <Text variant="labelMedium" style={styles.title}>
            {title}
          </Text>
          <View style={[styles.iconBox, { backgroundColor: (iconColor || AppColors.primary) + '18' }]}>
            <Icon name={icon} size={20} color={iconColor || AppColors.primary} />
          </View>
        </View>
        <Text variant="headlineMedium" style={styles.value}>
          {value}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  let bgColor = '#F1F5F9';
  let textColor = '#334155';

  switch (status.toUpperCase()) {
    case 'PAID':
    case 'RESOLVED':
    case 'APPROVED':
    case 'CHECKED_IN':
      bgColor = '#ECFDF5';
      textColor = '#047857';
      break;
    case 'UNPAID':
    case 'OPEN':
    case 'PENDING':
    case 'EXPECTED':
      bgColor = '#FFFBEB';
      textColor = '#B45309';
      break;
    case 'OVERDUE':
    case 'REJECTED':
    case 'DENIED':
    case 'CANCELLED':
      bgColor = '#FEF2F2';
      textColor = '#B91C1C';
      break;
    case 'IN_PROGRESS':
      bgColor = '#EFF6FF';
      textColor = '#1D4ED8';
      break;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <Text style={[styles.badgeText, { color: textColor }]}>
        {label || status.replace('_', ' ')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 12,
  },
  value: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
