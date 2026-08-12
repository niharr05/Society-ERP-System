import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, FAB, Chip, useTheme } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { StatusBadge } from '../../components/Common';

export const VisitorsScreen = () => {
  const theme = useTheme();

  const mockVisitors = [
    { id: '1', name: 'Rahul Verma', phone: '+91 9898989898', type: 'GUEST', unit: 'B-201', passcode: '492810', status: 'EXPECTED' },
    { id: '2', name: 'Swiggy Delivery', phone: '+91 9123456789', type: 'DELIVERY', unit: 'A-402', passcode: '104928', status: 'CHECKED_IN' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {mockVisitors.map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium" style={{ fontWeight: '700' }}>
                    {item.name} ({item.type})
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    For Unit {item.unit} • Phone: {item.phone}
                  </Text>
                  <View style={styles.passcodeBadge}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '800' }}>
                      PASSCODE: {item.passcode}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                  <QRCode value={`SOCIETY_PASS_${item.passcode}`} size={56} />
                  <View style={{ marginTop: 6 }}>
                    <StatusBadge status={item.status} />
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <FAB icon="account-plus" label="Pre-Approve" style={styles.fab} onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passcodeBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EEF2FF',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});
