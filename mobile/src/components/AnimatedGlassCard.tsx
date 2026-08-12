import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { AppColors } from '../config/theme';

interface AnimatedGlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
}

export const AnimatedGlassCard: React.FC<AnimatedGlassCardProps> = ({
  children,
  style,
  delay = 0,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(24)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, fadeAnim, translateYAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: AppColors.glassCardBg,
          borderRadius: 20,
          padding: 18,
          borderWidth: 1,
          borderColor: AppColors.glassCardBorder,
          shadowColor: '#64748B',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 3,
          marginVertical: 6,
          opacity: fadeAnim,
          transform: [
            { translateY: translateYAnim },
            { scale: scaleAnim },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
