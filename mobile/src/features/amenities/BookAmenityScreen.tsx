import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Chip, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GlassCard } from '../../components/GlassCard';
import { AppColors } from '../../config/theme';

interface BookAmenityScreenProps {
  onBack?: () => void;
}

export const BookAmenityScreen: React.FC<BookAmenityScreenProps> = ({ onBack }) => {
  const theme = useTheme();

  const amenities = [
    { id: '1', name: 'Clubhouse Banquet Hall', timing: '09:00 AM - 10:00 PM', pricePerHour: 500, icon: 'office-building-marker' },
    { id: '2', name: 'Swimming Pool Deck', timing: '06:00 AM - 08:00 PM', pricePerHour: 200, icon: 'pool' },
    { id: '3', name: 'Badminton Court 1', timing: '06:00 AM - 10:00 PM', pricePerHour: 150, icon: 'badminton' },
    { id: '4', name: 'Rooftop Terrace Garden', timing: '04:00 PM - 11:00 PM', pricePerHour: 800, icon: 'tree' },
  ];

  const [selectedAmenity, setSelectedAmenity] = React.useState(amenities[0]);
  const [bookingDate, setBookingDate] = React.useState('2026-08-12');
  const [startTime, setStartTime] = React.useState('06:00 PM');
  const [hours, setHours] = React.useState('2');

  const totalAmount = selectedAmenity.pricePerHour * (parseInt(hours) || 1);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState(false);

  const handleBook = () => {
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
          Book Society Amenity
        </Text>
        <Text variant="bodyMedium" style={{ color: AppColors.textSecondary }}>
          Reserve clubhouse, sports courts, or terrace for private events
        </Text>
      </View>

      {successMsg ? (
        <GlassCard style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Text variant="titleMedium" style={{ fontWeight: '800', color: AppColors.secondary, marginBottom: 8 }}>
            🎉 Amenity Booking Confirmed!
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', color: '#64748B', marginBottom: 20 }}>
            {selectedAmenity.name} reserved for {bookingDate} ({startTime}, {hours} Hours).
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {onBack && (
              <Button mode="outlined" onPress={onBack}>
                Done
              </Button>
            )}
            <Button mode="contained" onPress={() => setSuccessMsg(false)}>
              Book Another
            </Button>
          </View>
        </GlassCard>
      ) : (
        <>
          <Text variant="labelSmall" style={styles.label}>
            SELECT AMENITY
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {amenities.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedAmenity(item)}
                style={[
                  styles.amenityCard,
                  selectedAmenity.id === item.id && styles.selectedAmenityCard,
                ]}
              >
                <Icon
                  name={item.icon}
                  size={28}
                  color={selectedAmenity.id === item.id ? '#FFFFFF' : AppColors.primary}
                />
                <Text
                  variant="titleSmall"
                  style={[
                    styles.amenityName,
                    selectedAmenity.id === item.id && { color: '#FFFFFF' },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[
                    styles.amenityPrice,
                    selectedAmenity.id === item.id && { color: '#E0E7FF' },
                  ]}
                >
                  ₹ {item.pricePerHour} / hr
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <GlassCard>
            <Text variant="titleMedium" style={{ fontWeight: '800', color: '#0F172A', marginBottom: 12 }}>
              Reservation Details
            </Text>

            <TextInput
              mode="outlined"
              label="Booking Date"
              value={bookingDate}
              onChangeText={setBookingDate}
              left={<TextInput.Icon icon="calendar" />}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="Start Time"
                value={startTime}
                onChangeText={setStartTime}
                left={<TextInput.Icon icon="clock-outline" />}
                style={[styles.input, { flex: 1, marginRight: 6 }]}
              />
              <TextInput
                mode="outlined"
                label="Duration (Hours)"
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
                style={[styles.input, { flex: 1, marginLeft: 6 }]}
              />
            </View>

            {/* Total Box */}
            <View style={styles.totalBox}>
              <Text variant="titleMedium" style={{ fontWeight: '700', color: '#334155' }}>
                Total Charges:
              </Text>
              <Text variant="headlineSmall" style={{ fontWeight: '800', color: AppColors.primary }}>
                ₹ {totalAmount.toLocaleString()}
              </Text>
            </View>

            <Button
              mode="contained"
              style={styles.submitBtn}
              loading={isSubmitting}
              icon="calendar-check"
              onPress={handleBook}
            >
              Confirm Booking & Pay
            </Button>
          </GlassCard>
        </>
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
    marginBottom: 8,
  },
  amenityCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  selectedAmenityCard: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  amenityName: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 12,
  },
  amenityPrice: {
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    marginVertical: 12,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
