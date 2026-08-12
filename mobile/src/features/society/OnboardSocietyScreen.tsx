import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  ProgressBar,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AnimatedGlassCard } from '../../components/AnimatedGlassCard';
import { AppColors } from '../../config/theme';

interface OnboardSocietyScreenProps {
  onBack?: () => void;
}

type OnboardStep = 1 | 2 | 3 | 4;

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh',
];

const STEP_CONFIG = [
  { step: 1, title: 'Society Details', icon: 'domain', description: 'Basic society information' },
  { step: 2, title: 'Location', icon: 'map-marker', description: 'Address & pin code' },
  { step: 3, title: 'Structure', icon: 'home-group', description: 'Blocks, units & setup' },
  { step: 4, title: 'Billing Config', icon: 'cash-register', description: 'Maintenance & billing' },
];

export const OnboardSocietyScreen: React.FC<OnboardSocietyScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  // Multi-step form state
  const [currentStep, setCurrentStep] = React.useState<OnboardStep>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  // Step 1: Society Basic Info
  const [societyName, setSocietyName] = React.useState('');
  const [registrationNumber, setRegistrationNumber] = React.useState('');
  const [societyType, setSocietyType] = React.useState<'COOPERATIVE' | 'APARTMENT' | 'GATED_COMMUNITY'>('COOPERATIVE');

  // Step 2: Location Details
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('Maharashtra');
  const [pincode, setPincode] = React.useState('');
  const [showStatePicker, setShowStatePicker] = React.useState(false);
  const [stateSearch, setStateSearch] = React.useState('');

  // Step 3: Structure & Setup
  const [totalBlocks, setTotalBlocks] = React.useState('');
  const [totalUnits, setTotalUnits] = React.useState('');
  const [totalFloors, setTotalFloors] = React.useState('');
  const [parkingSlots, setParkingSlots] = React.useState('');

  // Step 4: Billing Configuration
  const [maintenanceMode, setMaintenanceMode] = React.useState<'PER_SQFT' | 'FIXED'>('PER_SQFT');
  const [maintenancePerSqFt, setMaintenancePerSqFt] = React.useState('3.5');
  const [fixedMonthlyFee, setFixedMonthlyFee] = React.useState('');
  const [dueDayOfMonth, setDueDayOfMonth] = React.useState('10');
  const [lateFeePercentage, setLateFeePercentage] = React.useState('5');
  const [gracePeriodDays, setGracePeriodDays] = React.useState('5');

  // Admin assignment
  const [adminName, setAdminName] = React.useState('');
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPhone, setAdminPhone] = React.useState('');

  // Animation refs
  const stepAnim = React.useRef(new Animated.Value(0)).current;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const animateStepTransition = (nextStep: OnboardStep) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => setCurrentStep(nextStep), 150);
  };

  const isStep1Valid = societyName.trim().length > 2 && registrationNumber.trim().length > 3;
  const isStep2Valid = address.trim().length > 5 && city.trim().length > 1 && pincode.trim().length === 6;
  const isStep3Valid = parseInt(totalBlocks) > 0 && parseInt(totalUnits) > 0;
  const isStep4Valid =
    (maintenanceMode === 'PER_SQFT' ? parseFloat(maintenancePerSqFt) > 0 : parseFloat(fixedMonthlyFee) > 0) &&
    parseInt(dueDayOfMonth) >= 1 &&
    parseInt(dueDayOfMonth) <= 28;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      case 4: return isStep4Valid;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      animateStepTransition((currentStep + 1) as OnboardStep);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      animateStepTransition((currentStep - 1) as OnboardStep);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  const progress = currentStep / 4;

  // ────────────────────────────────────────────────────────
  // Success Screen
  // ────────────────────────────────────────────────────────
  if (isSuccess) {
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
            <Icon name="check-decagram" size={56} color="#10B981" />
          </View>
          <Text variant="headlineSmall" style={styles.successTitle}>
            Society Onboarded! 🎉
          </Text>
          <Text variant="bodyMedium" style={styles.successSubtitle}>
            {societyName} has been successfully registered on the platform.
          </Text>

          <View style={styles.summarySection}>
            <View style={styles.summaryRow}>
              <Icon name="domain" size={18} color="#8B5CF6" />
              <Text style={styles.summaryLabel}>Society</Text>
              <Text style={styles.summaryValue}>{societyName}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="file-certificate-outline" size={18} color="#2563EB" />
              <Text style={styles.summaryLabel}>Reg. No.</Text>
              <Text style={styles.summaryValue}>{registrationNumber}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="map-marker" size={18} color="#EF4444" />
              <Text style={styles.summaryLabel}>Location</Text>
              <Text style={styles.summaryValue}>{city}, {state}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="home-group" size={18} color="#10B981" />
              <Text style={styles.summaryLabel}>Setup</Text>
              <Text style={styles.summaryValue}>{totalBlocks} Blocks • {totalUnits} Units</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Icon name="cash" size={18} color="#F59E0B" />
              <Text style={styles.summaryLabel}>Billing</Text>
              <Text style={styles.summaryValue}>
                {maintenanceMode === 'PER_SQFT' ? `₹${maintenancePerSqFt}/sq.ft` : `₹${fixedMonthlyFee}/month`}
              </Text>
            </View>
            {adminName ? (
              <>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                  <Icon name="shield-account" size={18} color="#8B5CF6" />
                  <Text style={styles.summaryLabel}>Admin</Text>
                  <Text style={styles.summaryValue}>{adminName}</Text>
                </View>
              </>
            ) : null}
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
                setCurrentStep(1);
                setSocietyName('');
                setRegistrationNumber('');
                setAddress('');
                setCity('');
                setPincode('');
                setTotalBlocks('');
                setTotalUnits('');
                setTotalFloors('');
                setParkingSlots('');
                setAdminName('');
                setAdminEmail('');
                setAdminPhone('');
              }}
            >
              Onboard Another
            </Button>
          </View>
        </AnimatedGlassCard>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  // ────────────────────────────────────────────────────────
  // Main Form
  // ────────────────────────────────────────────────────────
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
              <Icon name="domain-plus" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text variant="headlineSmall" style={styles.pageTitle}>
                Onboard New Society
              </Text>
              <Text variant="bodySmall" style={{ color: AppColors.textSecondary }}>
                Register a housing society on the platform
              </Text>
            </View>
          </View>
        </View>

        {/* Step Progress Indicator */}
        <GlassCard style={styles.progressCard}>
          <View style={styles.stepsRow}>
            {STEP_CONFIG.map((stepInfo, idx) => {
              const isActive = currentStep === stepInfo.step;
              const isCompleted = currentStep > stepInfo.step;
              return (
                <TouchableOpacity
                  key={stepInfo.step}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (isCompleted) animateStepTransition(stepInfo.step as OnboardStep);
                  }}
                  style={styles.stepItem}
                >
                  <View
                    style={[
                      styles.stepCircle,
                      isActive && styles.stepCircleActive,
                      isCompleted && styles.stepCircleCompleted,
                    ]}
                  >
                    {isCompleted ? (
                      <Icon name="check" size={14} color="#FFFFFF" />
                    ) : (
                      <Icon
                        name={stepInfo.icon}
                        size={14}
                        color={isActive ? '#FFFFFF' : '#94A3B8'}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isActive && styles.stepLabelActive,
                      isCompleted && styles.stepLabelCompleted,
                    ]}
                  >
                    {stepInfo.title}
                  </Text>
                  {/* Connector line */}
                  {idx < STEP_CONFIG.length - 1 && (
                    <View
                      style={[
                        styles.stepConnector,
                        isCompleted && styles.stepConnectorCompleted,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <ProgressBar progress={progress} color="#8B5CF6" style={styles.progressBar} />
          <Text style={styles.progressText}>
            Step {currentStep} of 4 — {STEP_CONFIG[currentStep - 1].description}
          </Text>
        </GlassCard>

        {/* Animated Step Content */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 1: Society Details                        */}
          {/* ═══════════════════════════════════════════════ */}
          {currentStep === 1 && (
            <AnimatedGlassCard delay={100}>
              <View style={styles.stepHeader}>
                <Icon name="domain" size={22} color="#8B5CF6" />
                <Text variant="titleMedium" style={styles.stepTitle}>
                  Society Information
                </Text>
              </View>

              <Text style={styles.fieldLabel}>SOCIETY TYPE</Text>
              <SegmentedButtons
                value={societyType}
                onValueChange={(val) => setSocietyType(val as any)}
                buttons={[
                  { value: 'COOPERATIVE', label: 'Co-op' },
                  { value: 'APARTMENT', label: 'Apartment' },
                  { value: 'GATED_COMMUNITY', label: 'Gated' },
                ]}
                style={styles.segmented}
              />

              <TextInput
                mode="outlined"
                label="Society / Community Name *"
                placeholder="e.g., Royal Heights Co-Op Housing Society"
                value={societyName}
                onChangeText={setSocietyName}
                left={<TextInput.Icon icon="office-building-outline" />}
                style={styles.input}
              />

              <TextInput
                mode="outlined"
                label="Registration Number *"
                placeholder="e.g., HSG/MUM/2021/8849"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                left={<TextInput.Icon icon="file-certificate-outline" />}
                style={styles.input}
              />

              {/* Validation hint */}
              {societyName.length > 0 && societyName.length <= 2 && (
                <View style={styles.hintRow}>
                  <Icon name="alert-circle-outline" size={14} color="#F59E0B" />
                  <Text style={styles.hintText}>Society name must be at least 3 characters</Text>
                </View>
              )}
            </AnimatedGlassCard>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 2: Location & Address                     */}
          {/* ═══════════════════════════════════════════════ */}
          {currentStep === 2 && (
            <AnimatedGlassCard delay={100}>
              <View style={styles.stepHeader}>
                <Icon name="map-marker" size={22} color="#EF4444" />
                <Text variant="titleMedium" style={styles.stepTitle}>
                  Location & Address
                </Text>
              </View>

              <TextInput
                mode="outlined"
                label="Full Address *"
                placeholder="Plot No., Road, Sector, Landmark"
                value={address}
                onChangeText={setAddress}
                left={<TextInput.Icon icon="map-marker-outline" />}
                multiline
                numberOfLines={2}
                style={styles.input}
              />

              <View style={styles.fieldRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="City *"
                    placeholder="e.g., Mumbai"
                    value={city}
                    onChangeText={setCity}
                    left={<TextInput.Icon icon="city-variant-outline" />}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label="PIN Code *"
                    placeholder="400706"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={pincode}
                    onChangeText={setPincode}
                    left={<TextInput.Icon icon="pound" />}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* State Selector */}
              <Text style={styles.fieldLabel}>STATE</Text>
              <TouchableOpacity
                style={styles.stateSelector}
                onPress={() => setShowStatePicker(!showStatePicker)}
              >
                <Icon name="map-outline" size={20} color="#64748B" />
                <Text style={styles.stateSelectorText}>{state || 'Select State'}</Text>
                <Icon name={showStatePicker ? 'chevron-up' : 'chevron-down'} size={20} color="#64748B" />
              </TouchableOpacity>

              {showStatePicker && (
                <View style={styles.statePickerContainer}>
                  <TextInput
                    mode="outlined"
                    placeholder="Search state..."
                    value={stateSearch}
                    onChangeText={setStateSearch}
                    dense
                    style={{ marginBottom: 6 }}
                    left={<TextInput.Icon icon="magnify" />}
                  />
                  <ScrollView style={{ maxHeight: 160 }} nestedScrollEnabled>
                    {INDIAN_STATES
                      .filter((s) => s.toLowerCase().includes(stateSearch.toLowerCase()))
                      .map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.stateOption,
                            state === s && styles.stateOptionActive,
                          ]}
                          onPress={() => {
                            setState(s);
                            setShowStatePicker(false);
                            setStateSearch('');
                          }}
                        >
                          <Text
                            style={[
                              styles.stateOptionText,
                              state === s && styles.stateOptionTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                          {state === s && <Icon name="check" size={16} color="#8B5CF6" />}
                        </TouchableOpacity>
                      ))}
                  </ScrollView>
                </View>
              )}

              {/* Pin Code validation */}
              {pincode.length > 0 && pincode.length < 6 && (
                <View style={styles.hintRow}>
                  <Icon name="alert-circle-outline" size={14} color="#F59E0B" />
                  <Text style={styles.hintText}>PIN code must be exactly 6 digits</Text>
                </View>
              )}
            </AnimatedGlassCard>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 3: Structure & Setup                      */}
          {/* ═══════════════════════════════════════════════ */}
          {currentStep === 3 && (
            <AnimatedGlassCard delay={100}>
              <View style={styles.stepHeader}>
                <Icon name="home-group" size={22} color="#10B981" />
                <Text variant="titleMedium" style={styles.stepTitle}>
                  Building Structure
                </Text>
              </View>

              <View style={styles.fieldRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="Total Blocks / Wings *"
                    placeholder="e.g., 3"
                    keyboardType="number-pad"
                    value={totalBlocks}
                    onChangeText={setTotalBlocks}
                    left={<TextInput.Icon icon="office-building" />}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label="Total Units / Flats *"
                    placeholder="e.g., 120"
                    keyboardType="number-pad"
                    value={totalUnits}
                    onChangeText={setTotalUnits}
                    left={<TextInput.Icon icon="door" />}
                    style={styles.input}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="Floors per Block"
                    placeholder="e.g., 14"
                    keyboardType="number-pad"
                    value={totalFloors}
                    onChangeText={setTotalFloors}
                    left={<TextInput.Icon icon="stairs" />}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label="Parking Slots"
                    placeholder="e.g., 200"
                    keyboardType="number-pad"
                    value={parkingSlots}
                    onChangeText={setParkingSlots}
                    left={<TextInput.Icon icon="car-outline" />}
                    style={styles.input}
                  />
                </View>
              </View>

              {/* Quick Stats Preview */}
              {parseInt(totalBlocks) > 0 && parseInt(totalUnits) > 0 && (
                <View style={styles.previewBanner}>
                  <Icon name="information-outline" size={18} color="#2563EB" />
                  <Text style={styles.previewText}>
                    ~{Math.ceil(parseInt(totalUnits) / parseInt(totalBlocks))} units per block
                    {totalFloors ? ` • ~${Math.ceil(parseInt(totalUnits) / parseInt(totalBlocks) / parseInt(totalFloors))} units/floor` : ''}
                  </Text>
                </View>
              )}

              {/* Admin Assignment (Optional in this step) */}
              <View style={styles.sectionDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ASSIGN SOCIETY ADMIN (Optional)</Text>
                <View style={styles.dividerLine} />
              </View>

              <TextInput
                mode="outlined"
                label="Admin Full Name"
                placeholder="e.g., Rajesh Sharma"
                value={adminName}
                onChangeText={setAdminName}
                left={<TextInput.Icon icon="shield-account" />}
                style={styles.input}
              />

              <View style={styles.fieldRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="Admin Email"
                    placeholder="admin@society.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={adminEmail}
                    onChangeText={setAdminEmail}
                    left={<TextInput.Icon icon="email-outline" />}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label="Admin Phone"
                    placeholder="+91 98765..."
                    keyboardType="phone-pad"
                    value={adminPhone}
                    onChangeText={setAdminPhone}
                    left={<TextInput.Icon icon="phone-outline" />}
                    style={styles.input}
                  />
                </View>
              </View>
            </AnimatedGlassCard>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* STEP 4: Billing Configuration                  */}
          {/* ═══════════════════════════════════════════════ */}
          {currentStep === 4 && (
            <AnimatedGlassCard delay={100}>
              <View style={styles.stepHeader}>
                <Icon name="cash-register" size={22} color="#F59E0B" />
                <Text variant="titleMedium" style={styles.stepTitle}>
                  Maintenance Billing Setup
                </Text>
              </View>

              <Text style={styles.fieldLabel}>BILLING MODEL</Text>
              <SegmentedButtons
                value={maintenanceMode}
                onValueChange={(val) => setMaintenanceMode(val as any)}
                buttons={[
                  { value: 'PER_SQFT', label: '₹ Per Sq. Ft' },
                  { value: 'FIXED', label: 'Fixed Monthly' },
                ]}
                style={styles.segmented}
              />

              {maintenanceMode === 'PER_SQFT' ? (
                <TextInput
                  mode="outlined"
                  label="Maintenance Rate per Sq. Ft (₹) *"
                  placeholder="e.g., 3.5"
                  keyboardType="decimal-pad"
                  value={maintenancePerSqFt}
                  onChangeText={setMaintenancePerSqFt}
                  left={<TextInput.Icon icon="currency-inr" />}
                  style={styles.input}
                />
              ) : (
                <TextInput
                  mode="outlined"
                  label="Fixed Monthly Fee (₹) *"
                  placeholder="e.g., 3500"
                  keyboardType="number-pad"
                  value={fixedMonthlyFee}
                  onChangeText={setFixedMonthlyFee}
                  left={<TextInput.Icon icon="currency-inr" />}
                  style={styles.input}
                />
              )}

              <View style={styles.fieldRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <TextInput
                    mode="outlined"
                    label="Due Day of Month *"
                    placeholder="e.g., 10"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={dueDayOfMonth}
                    onChangeText={setDueDayOfMonth}
                    left={<TextInput.Icon icon="calendar-range" />}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    mode="outlined"
                    label="Grace Period (Days)"
                    placeholder="e.g., 5"
                    keyboardType="number-pad"
                    value={gracePeriodDays}
                    onChangeText={setGracePeriodDays}
                    left={<TextInput.Icon icon="clock-outline" />}
                    style={styles.input}
                  />
                </View>
              </View>

              <TextInput
                mode="outlined"
                label="Late Fee Penalty (%)"
                placeholder="e.g., 5"
                keyboardType="decimal-pad"
                value={lateFeePercentage}
                onChangeText={setLateFeePercentage}
                left={<TextInput.Icon icon="percent-outline" />}
                right={<TextInput.Affix text="% per month" />}
                style={styles.input}
              />

              {/* Billing Preview Card */}
              <View style={styles.billingPreview}>
                <Text style={styles.billingPreviewTitle}>💰 Billing Preview</Text>
                <View style={styles.billingPreviewRow}>
                  <Text style={styles.billingPreviewLabel}>Model</Text>
                  <Text style={styles.billingPreviewValue}>
                    {maintenanceMode === 'PER_SQFT' ? `₹${maintenancePerSqFt} per sq.ft` : `₹${fixedMonthlyFee} flat fee`}
                  </Text>
                </View>
                <View style={styles.billingPreviewRow}>
                  <Text style={styles.billingPreviewLabel}>Due Date</Text>
                  <Text style={styles.billingPreviewValue}>{dueDayOfMonth}th of every month</Text>
                </View>
                <View style={styles.billingPreviewRow}>
                  <Text style={styles.billingPreviewLabel}>Grace Period</Text>
                  <Text style={styles.billingPreviewValue}>{gracePeriodDays} days after due</Text>
                </View>
                <View style={styles.billingPreviewRow}>
                  <Text style={styles.billingPreviewLabel}>Late Fee</Text>
                  <Text style={[styles.billingPreviewValue, { color: '#EF4444' }]}>
                    {lateFeePercentage}% per month
                  </Text>
                </View>
                {maintenanceMode === 'PER_SQFT' && parseInt(totalUnits) > 0 && (
                  <View style={[styles.billingPreviewRow, { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 8, marginTop: 4 }]}>
                    <Text style={styles.billingPreviewLabel}>Est. Monthly (1000 sq.ft)</Text>
                    <Text style={[styles.billingPreviewValue, { color: '#10B981', fontWeight: '800' }]}>
                      ₹{(parseFloat(maintenancePerSqFt || '0') * 1000).toLocaleString('en-IN')}
                    </Text>
                  </View>
                )}
              </View>
            </AnimatedGlassCard>
          )}
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.navRow}>
          {currentStep > 1 ? (
            <Button
              mode="outlined"
              icon="arrow-left"
              onPress={handleBack}
              style={styles.navBtn}
            >
              Previous
            </Button>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          <Button
            mode="contained"
            buttonColor={currentStep === 4 ? '#10B981' : '#8B5CF6'}
            icon={currentStep === 4 ? 'check-decagram' : 'arrow-right'}
            contentStyle={{ flexDirection: 'row-reverse' }}
            loading={isSubmitting}
            disabled={!canProceed()}
            onPress={handleNext}
            style={styles.navBtn}
          >
            {currentStep === 4 ? 'Register Society' : 'Next Step'}
          </Button>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────
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

  // Progress Card
  progressCard: {
    marginBottom: 6,
    padding: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#8B5CF6',
    fontWeight: '800',
  },
  stepLabelCompleted: {
    color: '#10B981',
  },
  stepConnector: {
    position: 'absolute',
    top: 14,
    left: '70%',
    width: '60%',
    height: 2,
    backgroundColor: '#E2E8F0',
  },
  stepConnectorCompleted: {
    backgroundColor: '#10B981',
  },
  progressBar: {
    height: 4,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  progressText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },

  // Step Content
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  stepTitle: {
    fontWeight: '800',
    color: '#0F172A',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Hints
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },

  // State Picker
  stateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    marginBottom: 10,
  },
  stateSelectorText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  statePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  stateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  stateOptionActive: {
    backgroundColor: '#F5F3FF',
  },
  stateOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  stateOptionTextActive: {
    color: '#8B5CF6',
    fontWeight: '700',
  },

  // Preview Banner
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },

  // Section Divider
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },

  // Billing Preview
  billingPreview: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  billingPreviewTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 10,
  },
  billingPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  billingPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78716C',
  },
  billingPreviewValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Navigation
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  navBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 2,
  },

  // Success Screen
  successCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#A7F3D0',
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
    width: 70,
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
