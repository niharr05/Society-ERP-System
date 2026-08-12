import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, Switch, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface CreateNoticeScreenProps {
  onBack?: () => void;
}

export const CreateNoticeScreen: React.FC<CreateNoticeScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<'GENERAL' | 'MAINTENANCE' | 'EVENT' | 'EMERGENCY'>('GENERAL');
  const [content, setContent] = React.useState('');
  const [isImportant, setIsImportant] = React.useState(false);
  const [sendPush, setSendPush] = React.useState(true);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState(false);

  const handleSubmit = () => {
    if (!title || !content) return;
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
            Back to Dashboard
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Publish Official Notice
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Broadcast society circulars, event alerts, or maintenance notices
        </Text>
      </View>

      {successMsg ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 8 }}>
            📢 Notice Published & Sent!
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#64748B', marginBottom: 20 }}>
            Your notice has been added to the digital notice board. FCM push notification dispatched to residents.
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Done
              </Button>
            )}
            <Button mode="contained" onPress={() => setSuccessMsg(false)}>
              Publish Another
            </Button>
          </View>
        </GlassCard>
      ) : (
        <GlassCard>
          <Text variant="labelSmall" style={styles.label}>
            NOTICE CATEGORY
          </Text>
          <SegmentedButtons
            value={category}
            onValueChange={(val) => setCategory(val as any)}
            buttons={[
              { value: 'GENERAL', label: 'General' },
              { value: 'MAINTENANCE', label: 'Work' },
              { value: 'EVENT', label: 'Event' },
              { value: 'EMERGENCY', label: 'Alert' },
            ]}
            style={styles.segmented}
          />

          <TextInput
            mode="outlined"
            label="Notice Title"
            placeholder="e.g., Annual General Body Meeting Notice"
            value={title}
            onChangeText={setTitle}
            left={<TextInput.Icon icon="bullhorn-outline" />}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Notice Details & Content"
            placeholder="Type complete details of the announcement here..."
            multiline
            numberOfLines={5}
            value={content}
            onChangeText={setContent}
            style={[styles.input, { minHeight: 120 }]}
          />

          {/* Toggle Switches */}
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0F172A' }}>
                Mark as High Priority / Urgent
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748B' }}>
                Displays red alert banner on resident dashboard
              </Text>
            </View>
            <Switch value={isImportant} onValueChange={setIsImportant} color={AppColors.error} />
          </View>

          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text variant="titleSmall" style={{ fontWeight: '700', color: '#0F172A' }}>
                Send Instant Push Notification
              </Text>
              <Text variant="bodySmall" style={{ color: '#64748B' }}>
                Broadcast alert to all resident mobile devices
              </Text>
            </View>
            <Switch value={sendPush} onValueChange={setSendPush} color={AppColors.primary} />
          </View>

          <Button
            mode="contained"
            style={styles.submitBtn}
            loading={isSubmitting}
            disabled={!title || !content}
            icon="bullhorn"
            onPress={handleSubmit}
          >
            Publish Notice Board Post
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
  },
  segmented: {
    marginBottom: 14,
  },
  input: {
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
    marginTop: 14,
  },
});
