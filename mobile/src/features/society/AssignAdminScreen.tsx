import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  HelperText,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { AppColors } from '../../config/theme';

interface AssignAdminScreenProps {
  onBack?: () => void;
}

interface SocietyOption {
  id: string;
  name: string;
  city: string;
  units: number;
}

const MOCK_SOCIETIES: SocietyOption[] = [
  { id: 'soc_1', name: 'Royal Heights Co-Op Housing Society', city: 'Mumbai', units: 120 },
  { id: 'soc_2', name: 'Palm Grove Residency', city: 'Pune', units: 240 },
  { id: 'soc_3', name: 'Greenfield Towers', city: 'Bangalore', units: 180 },
];

export const AssignAdminScreen: React.FC<AssignAdminScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  // Selected Society
  const [selectedSocietyId, setSelectedSocietyId] = React.useState<string>('');
  const [showSocietyDropdown, setShowSocietyDropdown] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Admin Info Form State
  const [adminName, setAdminName] = React.useState('');
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPhone, setAdminPhone] = React.useState('');
  const [adminBlock, setAdminBlock] = React.useState('');
  const [adminUnit, setAdminUnit] = React.useState('');

  // Execution states
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const selectedSociety = MOCK_SOCIETIES.find((s) => s.id === selectedSocietyId);

  const isFormValid =
    selectedSocietyId &&
    adminName.trim().length > 2 &&
    adminEmail.trim().includes('@') &&
    adminPhone.trim().length >= 10;

  const handleSubmit = () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const filteredSocieties = MOCK_SOCIETIES.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Success view
  if (isSuccess && selectedSociety) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Icon name="arrow-left" size={24} color="#0F172A" />
            <Text variant="titleMedium" style={styles.backText}>Back to Platform</Text>
          </TouchableOpacity>
        )}
        <AnimatedGlassCard delay={100} style={styles.successCard}>
          <View style={styles.successIconCircle}>
            <Icon name="shield-check" size={56} color="#8B5CF6" />
          </View>
          <Text variant="headlineSmall" style={styles.successTitle}>
            Admin Assigned Successfully!
          </Text>
          <Text variant="bodyMedium" style={styles.successSubtitle}>
            {adminName} is now configured as the Society Admin for {selectedSociety.name}.
          </Text>

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Icon name="domain" size={18} color="#8B5CF6" />
              <Text style={styles.summaryLabel}>Society</Text>
              <Text style={styles.summaryValue}>{selectedSociety.name}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="account" size={18} color="#2563EB" />
              <Text style={styles.summaryLabel}>Admin Name</Text>
              <Text style={styles.summaryValue}>{adminName}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="email" size={18} color="#EF4444" />
              <Text style={styles.summaryLabel}>Email</Text>
              <Text style={styles.summaryValue}>{adminEmail}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="phone" size={18} color="#10B981" />
              <Text style={styles.summaryLabel}>Phone</Text>
              <Text style={styles.summaryValue}>{adminPhone}</Text>
            </View>
            {(adminBlock || adminUnit) && (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Icon name="home-city" size={18} color="#F59E0B" />
                  <Text style={styles.summaryLabel}>Unit</Text>
                  <Text style={styles.summaryValue}>
                    {adminBlock ? `Block ${adminBlock}` : ''}
                    {adminBlock && adminUnit ? ' • ' : ''}
                    {adminUnit ? `Flat ${adminUnit}` : ''}
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.successActions}>
            {onBack && (
              <Button mode="outlined" onPress={onBack} style={{ flex: 1, borderRadius: 12 }}>
                Done
              </Button>
            )}
            <Button
              mode="contained"
              buttonColor="#8B5CF6"
              style={{ flex: 1, borderRadius: 12 }}
              onPress={() => {
                setIsSuccess(false);
                setSelectedSocietyId('');
                setAdminName('');
                setAdminEmail('');
                setAdminPhone('');
                setAdminBlock('');
                setAdminUnit('');
              }}
            >
              Assign Another
            </Button>
          </View>
        </AnimatedGlassCard>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
        {/* Back Button */}
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Icon name="arrow-left" size={24} color="#0F172A" />
            <Text variant="titleMedium" style={styles.backText}>Back to Platform</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIconCircle}>
              <Icon name="shield-account" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text variant="headlineSmall" style={styles.pageTitle}>
                Assign Society Admin
              </Text>
              <Text variant="bodySmall" style={{ color: AppColors.textSecondary }}>
                Configure administrative credentials for an onboarded housing society
              </Text>
            </View>
          </View>
        </View>

        <AnimatedGlassCard delay={150}>
          {/* Step 1: Select Society */}
          <Text style={styles.fieldLabel}>SELECT HOUSING SOCIETY</Text>
          <TouchableOpacity
            style={[styles.societySelector, selectedSociety && styles.societySelectorSelected]}
            onPress={() => setShowSocietyDropdown(!showSocietyDropdown)}
            activeOpacity={0.8}
          >
            <Icon name="domain" size={20} color={selectedSociety ? '#8B5CF6' : '#64748B'} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.selectorMainText, !selectedSociety && { color: '#94A3B8' }]}>
                {selectedSociety ? selectedSociety.name : 'Choose a society...'}
              </Text>
              {selectedSociety && (
                <Text style={styles.selectorSubText}>
                  {selectedSociety.city} • {selectedSociety.units} Units
                </Text>
              )}
            </View>
            <Icon name={showSocietyDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#64748B" />
          </TouchableOpacity>

          {showSocietyDropdown && (
            <View style={styles.dropdownContainer}>
              <TextInput
                mode="outlined"
                placeholder="Search society by name or city..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                dense
                style={styles.dropdownSearch}
                left={<TextInput.Icon icon="magnify" />}
              />
              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled>
                {filteredSocieties.map((soc) => (
                  <TouchableOpacity
                    key={soc.id}
                    style={[
                      styles.dropdownOption,
                      selectedSocietyId === soc.id && styles.dropdownOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedSocietyId(soc.id);
                      setShowSocietyDropdown(false);
                      setSearchQuery('');
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[
                        styles.optionMainText,
                        selectedSocietyId === soc.id && styles.optionTextActive,
                      ]}>
                        {soc.name}
                      </Text>
                      <Text style={styles.optionSubText}>
                        {soc.city} • {soc.units} Units
                      </Text>
                    </View>
                    {selectedSocietyId === soc.id && (
                      <Icon name="check-circle" size={18} color="#8B5CF6" />
                    )}
                  </TouchableOpacity>
                ))}
                {filteredSocieties.length === 0 && (
                  <View style={styles.emptySearch}>
                    <Icon name="domain-off" size={24} color="#94A3B8" />
                    <Text style={styles.emptySearchText}>No societies found</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* Divider */}
          <View style={styles.divider} />

          {/* Step 2: Admin Profile Details */}
          <Text style={styles.sectionHeader}>Admin Profile Credentials</Text>

          <TextInput
            mode="outlined"
            label="Admin Full Name *"
            placeholder="e.g., Rajesh Sharma"
            value={adminName}
            onChangeText={setAdminName}
            left={<TextInput.Icon icon="account" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Email Address *"
            placeholder="e.g., admin@society.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={adminEmail}
            onChangeText={adminEmail => setAdminEmail(adminEmail)}
            left={<TextInput.Icon icon="email-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Mobile Number *"
            placeholder="e.g., 9876543210"
            keyboardType="phone-pad"
            value={adminPhone}
            onChangeText={setAdminPhone}
            left={<TextInput.Icon icon="phone-outline" />}
            style={styles.input}
          />

          <View style={styles.fieldRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <TextInput
                mode="outlined"
                label="Block / Wing"
                placeholder="e.g., A"
                value={adminBlock}
                onChangeText={setAdminBlock}
                left={<TextInput.Icon icon="office-building" />}
                style={styles.input}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                label="Flat / Unit No."
                placeholder="e.g., 402"
                value={adminUnit}
                onChangeText={setAdminUnit}
                left={<TextInput.Icon icon="home-outline" />}
                style={styles.input}
              />
            </View>
          </View>

          {/* Submit Button */}
          <Button
            mode="contained"
            buttonColor="#8B5CF6"
            icon="shield-account"
            loading={isSubmitting}
            disabled={!isFormValid}
            onPress={handleSubmit}
            style={styles.submitBtn}
            contentStyle={{ paddingVertical: 4 }}
          >
            Assign Committee Admin
          </Button>
        </AnimatedGlassCard>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  pageTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },

  // Society Selector
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  societySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  societySelectorSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  selectorMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  selectorSubText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },

  // Dropdown list
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 10,
    marginTop: 6,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  dropdownSearch: {
    marginBottom: 8,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dropdownOptionActive: {
    backgroundColor: '#F5F3FF',
  },
  optionMainText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  optionTextActive: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  optionSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptySearch: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 6,
  },
  emptySearchText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: 8,
  },

  // Success view
  successCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  successTitle: {
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  successSubtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  summarySection: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    width: 90,
  },
  summaryValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  successActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
