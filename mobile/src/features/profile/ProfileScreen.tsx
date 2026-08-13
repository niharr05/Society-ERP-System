import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';
import { AppColors } from '../../config/theme';

const PERSONA_ROLES: { role: UserRole; label: string; icon: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', icon: 'shield-crown' },
  { role: 'SOCIETY_ADMIN', label: 'Society Admin', icon: 'account-tie' },
  { role: 'RESIDENT', label: 'Resident', icon: 'home-account' },
  { role: 'SECURITY', label: 'Security Guard', icon: 'shield-account' },
];

export const ProfileScreen = () => {
  const theme = useTheme();
  const { user, login, logout } = useAuthStore();
  const [selectedRole, setSelectedRole] = React.useState<UserRole>(user?.role || 'SOCIETY_ADMIN');

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    login(user?.email || 'admin@society.com', role);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={80}
          label={user?.name?.[0] || 'U'}
          style={{ backgroundColor: AppColors.primary, marginBottom: 14 }}
        />
        <Text variant="headlineSmall" style={styles.userName}>
          {user?.name}
        </Text>
        <Text variant="titleSmall" style={styles.userSub}>
          {user?.email} • {user?.phone}
        </Text>
      </View>

      {/* 4 Core Roles Persona Switcher */}
      <View style={styles.multiCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
            <Icon name="account-switch" size={22} color="#4F46E5" />
          </View>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Core Role Persona Switcher
          </Text>
        </View>
        
        <Text variant="bodyMedium" style={styles.cardSubtitle}>
          Select a role to test role-based access control and dashboards:
        </Text>
        
        <View style={styles.roleGrid}>
          {PERSONA_ROLES.map((item) => {
            const isActive = selectedRole === item.role;
            return (
              <TouchableOpacity
                key={item.role}
                style={[
                  styles.roleCard,
                  isActive && styles.roleCardActive,
                ]}
                onPress={() => handleRoleSwitch(item.role)}
                activeOpacity={0.7}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={isActive ? '#4F46E5' : '#64748B'}
                />
                <Text
                  style={[
                    styles.roleCardText,
                    isActive && styles.roleCardTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Multi-Color Accent Card: Society Details */}
      <View style={styles.multiCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
            <Icon name="domain" size={22} color="#059669" />
          </View>
          <Text variant="titleMedium" style={styles.cardTitle}>
            Society & Role Access Matrix
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="account-tie" size={18} color="#8B5CF6" />
          <Text style={styles.infoText}>
            Current Role: <Text style={[styles.infoHighlight, { color: '#8B5CF6' }]}>{user?.role}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="office-building" size={18} color="#2563EB" />
          <Text style={styles.infoText}>
            Society: <Text style={styles.infoHighlight}>{user?.societyName || 'Royal Heights Co-op Society'}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="home" size={18} color="#8B5CF6" />
          <Text style={styles.infoText}>
            Unit Number: <Text style={styles.infoHighlight}>{user?.unitNumber || 'Management Office'}</Text>
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="check-decagram" size={18} color="#059669" />
          <Text style={styles.infoText}>
            Account Status: <Text style={{ color: '#059669', fontWeight: '800' }}>{user?.status}</Text>
          </Text>
        </View>
      </View>

      <Button
        mode="contained"
        buttonColor="#EF4444"
        textColor="#FFFFFF"
        icon="logout"
        style={styles.signOutBtn}
        onPress={logout}
      >
        Sign Out
      </Button>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontWeight: '800',
    color: '#0F172A',
  },
  userSub: {
    color: '#334155',
    fontWeight: '700',
    marginTop: 4,
  },
  multiCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    color: '#475569',
    fontWeight: '600',
    marginBottom: 14,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
    marginTop: 4,
  },
  roleCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  roleCardActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  roleCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 8,
    flexShrink: 1,
  },
  roleCardTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    marginLeft: 10,
    fontWeight: '600',
  },
  infoHighlight: {
    fontWeight: '800',
    color: '#0F172A',
  },
  signOutBtn: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 4,
  },
});
