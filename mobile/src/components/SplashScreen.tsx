import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppColors } from '../config/theme';

interface SplashScreenProps {
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  message = 'Initializing Society ERP...',
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in intro
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Continuous pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim]);

  return (
    <View style={[styles.container, { backgroundColor: AppColors.background }]}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Animated Brand Logo Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Icon name="home-city" size={54} color="#FFFFFF" />
        </Animated.View>

        <Text variant="headlineSmall" style={styles.appName}>
          Society ERP
        </Text>
        <Text variant="bodySmall" style={styles.tagline}>
          Smart Housing Management & Gate Pass
        </Text>

        {/* Loader Indicator */}
        <View style={styles.loaderBox}>
          <ActivityIndicator animating size="small" color={AppColors.primary} />
          <Text variant="labelMedium" style={styles.loadingText}>
            {message}
          </Text>
        </View>
      </Animated.View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text variant="labelSmall" style={styles.footerText}>
          Powered by Enterprise SaaS Protocol
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: AppColors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  appName: {
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  tagline: {
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  loadingText: {
    marginLeft: 10,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 11,
  },
});
