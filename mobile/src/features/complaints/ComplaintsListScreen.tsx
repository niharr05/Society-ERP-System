import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Chip, useTheme } from 'react-native-paper';
import { StatusBadge } from '../../components/Common';
import { GlassCard } from '../../components/GlassCard';
import { RaiseTicketScreen } from './RaiseTicketScreen';

export const ComplaintsListScreen = () => {
  const theme = useTheme();
  const [showRaiseTicketForm, setShowRaiseTicketForm] = React.useState(false);

  const mockComplaints = [
    { id: '1', title: 'Water Leakage in Main Shaft', category: 'PLUMBING', unit: 'A-402', priority: 'HIGH', status: 'OPEN' },
    { id: '2', title: 'Elevator B Making Noise', category: 'OTHER', unit: 'Tower B', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: '3', title: 'Street Light Near Gate 2 Blown', category: 'ELECTRICAL', unit: 'Common Area', priority: 'LOW', status: 'RESOLVED' },
  ];

  if (showRaiseTicketForm) {
    return <RaiseTicketScreen onBack={() => setShowRaiseTicketForm(false)} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {mockComplaints.map((item) => (
          <GlassCard key={item.id} style={{ padding: 14 }}>
            <View style={styles.row}>
              <Chip compact style={{ backgroundColor: '#EEF2FF' }} textStyle={{ color: '#4F46E5', fontSize: 10, fontWeight: '700' }}>
                {item.category}
              </Chip>
              <StatusBadge status={item.status} />
            </View>

            <Text variant="titleMedium" style={styles.title}>
              {item.title}
            </Text>
            <Text variant="bodySmall" style={{ color: '#64748B', fontWeight: '600' }}>
              Location: {item.unit} • Priority: {item.priority}
            </Text>
          </GlassCard>
        ))}
      </ScrollView>

      <FAB
        icon="plus"
        label="Raise Ticket"
        style={styles.fab}
        onPress={() => setShowRaiseTicketForm(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});
