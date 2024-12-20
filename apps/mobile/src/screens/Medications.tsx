import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../styles/theme';

const medications = [
  {
    id: '1',
    name: 'Losartana',
    dosage: '50mg',
    frequency: '1x ao dia',
    time: '08:00',
    remaining: 15,
    instructions: 'Tomar em jejum',
    startDate: '01/12/2023',
    endDate: '01/03/2024',
    status: 'active',
  },
  {
    id: '2',
    name: 'Atorvastatina',
    dosage: '20mg',
    frequency: '1x ao dia',
    time: '20:00',
    remaining: 20,
    instructions: 'Tomar após a refeição',
    startDate: '01/12/2023',
    endDate: '01/03/2024',
    status: 'active',
  },
  {
    id: '3',
    name: 'Metformina',
    dosage: '850mg',
    frequency: '2x ao dia',
    time: '08:00, 20:00',
    remaining: 30,
    instructions: 'Tomar durante as refeições',
    startDate: '01/12/2023',
    endDate: '01/03/2024',
    status: 'active',
  },
];

export default function Medications() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Medicamentos Ativos</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-variant" size={24} color={theme.colors.primary[500]} />
          </TouchableOpacity>
        </View>

        {medications.map((medication) => (
          <TouchableOpacity key={medication.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDosage}>{medication.dosage}</Text>
              </View>
              <View style={styles.remainingContainer}>
                <Text style={styles.remainingCount}>{medication.remaining}</Text>
                <Text style={styles.remainingLabel}>Restantes</Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.infoRow}>
                <Icon name="clock" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.infoText}>
                  {medication.frequency} às {medication.time}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="information" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.infoText}>{medication.instructions}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="calendar-range" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.infoText}>
                  {medication.startDate} até {medication.endDate}
                </Text>
              </View>
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="bell" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.actionText}>Lembrete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="history" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.actionText}>Histórico</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="refresh" size={20} color={theme.colors.primary[500]} />
                <Text style={styles.actionText}>Renovar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Icon name="plus" size={24} color={theme.colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  filterButton: {
    padding: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  medicationDosage: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  remainingContainer: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  remainingCount: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary[600],
  },
  remainingLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary[600],
  },
  cardContent: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[500],
    marginTop: theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
}); 