import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AppColors } from '../config/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return <View style={[styles.glassCard, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  glassCard: {
    backgroundColor: AppColors.glassCardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: AppColors.glassCardBorder,
    // Soft subtle ambient shadow for sleek modern look
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    marginVertical: 6,
  },
});
