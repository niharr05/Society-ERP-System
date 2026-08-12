import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, HelperText, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface RaiseTicketScreenProps {
  onBack?: () => void;
}

export const RaiseTicketScreen: React.FC<RaiseTicketScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  const [category, setCategory] = React.useState<'PLUMBING' | 'ELECTRICAL' | 'SECURITY' | 'CLEANLINESS' | 'OTHER'>('PLUMBING');
  const [priority, setPriority] = React.useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [locationUnit, setLocationUnit] = React.useState('Flat B-201');
  const [hasPhoto, setHasPhoto] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState(false);

  const handleSubmit = () => {
    if (!title || !description) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
    }, 1000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: AppColors.background }]}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Icon name="arrow-left" size={24} color="#0F172A" />
          <Text variant="titleMedium" style={styles.backText}>
            Back to Tickets
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Raise Maintenance Ticket
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Report a complaint or issue to the Society Management
        </Text>
      </View>

      {successMsg ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 8 }}>
            🎉 Ticket Created Successfully!
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#64748B', marginBottom: 20 }}>
            Ticket #TKT-8409 has been assigned to the Maintenance Supervisor. You will receive updates via push notifications.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Back to Tickets
              </Button>
            )}
            <Button mode="contained" onPress={() => setSuccessMsg(false)}>
              Raise Another
            </Button>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text variant="labelSmall" style={styles.label}>
            COMPLAINT CATEGORY
          </Text>
          <SegmentedButtons
            value={category}
            onValueChange={(val) => setCategory(val as any)}
            buttons={[
              { value: 'PLUMBING', label: 'Plumbing' },
              { value: 'ELECTRICAL', label: 'Electric' },
              { value: 'SECURITY', label: 'Security' },
              { value: 'CLEANLINESS', label: 'Hygiene' },
            ]}
            style={styles.segmented}
          />

          <Text variant="labelSmall" style={styles.label}>
            PRIORITY LEVEL
          </Text>
          <SegmentedButtons
            value={priority}
            onValueChange={(val) => setPriority(val as any)}
            buttons={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'URGENT', label: 'Urgent' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            mode="outlined"
            label="Ticket Title"
            placeholder="e.g., Water leakage in bathroom ceiling"
            value={title}
            onChangeText={setTitle}
            left={<TextInput.Icon icon="alert-circle-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Location / Flat Number"
            value={locationUnit}
            onChangeText={setLocationUnit}
            left={<TextInput.Icon icon="map-marker-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Detailed Description"
            placeholder="Describe the issue, timing, and any specific notes for maintenance staff..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={[styles.input, { minHeight: 100 }]}
          />

          {/* Photo Attachment Section */}
          <Text variant="labelSmall" style={styles.label}>
            ATTACH ISSUE PHOTO (OPTIONAL)
          </Text>
          <TouchableOpacity
            style={[styles.photoBox, hasPhoto && styles.photoBoxAttached]}
            onPress={() => setHasPhoto(!hasPhoto)}
          >
            <Icon
              name={hasPhoto ? 'check-circle' : 'camera-plus'}
              size={32}
              color={hasPhoto ? '#059669' : AppColors.primary}
            />
            <Text style={[styles.photoText, hasPhoto && { color: '#059669' }]}>
              {hasPhoto ? 'Photo Attached (leakage_photo.jpg)' : 'Tap to Take Photo or Attach File'}
            </Text>
          </TouchableOpacity>

          <Button
            mode="contained"
            style={styles.submitBtn}
            loading={isSubmitting}
            disabled={!title || !description}
            icon="send"
            onPress={handleSubmit}
          >
            Submit Ticket
          </Button>
        </GlassCard>
      )}

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
    marginBottom: 16,
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
  },
  label: {
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
    marginTop: 4,
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
  },
  photoBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  photoBoxAttached: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  photoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 6,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
