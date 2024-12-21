import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../styles/theme';

const stats = [
  {
    name: 'Consultas',
    value: '3',
    icon: 'calendar',
  },
  {
    name: 'Medicamentos',
    value: '5',
    icon: 'pill',
  },
  {
    name: 'Exames',
    value: '2',
    icon: 'file-document',
  },
];

const appointments = [
  {
    id: '1',
    doctor: 'Dra. Maria Silva',
    specialty: 'Cardiologia',
    date: '20/12/2023',
    time: '14:30',
    type: 'Presencial',
  },
  {
    id: '2',
    doctor: 'Dr. João Santos',
    specialty: 'Clínico Geral',
    date: '22/12/2023',
    time: '10:00',
    type: 'Telemedicina',
  },
];

const medications = [
  {
    id: '1',
    name: 'Losartana',
    dosage: '50mg',
    frequency: '1x ao dia',
    time: '08:00',
    remaining: 15,
  },
  {
    id: '2',
    name: 'Atorvastatina',
    dosage: '20mg',
    frequency: '1x ao dia',
    time: '20:00',
    remaining: 20,
  },
];

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat) => (
          <View key={stat.name} style={styles.statCard}>
            <Icon
              name={stat.icon}
              size={24}
              color={theme.colors.primary[500]}
            />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statName}>{stat.name}</Text>
          </View>
        ))}
      </View>

      {/* Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximas Consultas</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todas</Text>
          </TouchableOpacity>
        </View>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{appointment.doctor}</Text>
              <Text style={styles.cardSubtitle}>{appointment.specialty}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Icon name="calendar" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.cardInfoText}>{appointment.date}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Icon name="clock" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.cardInfoText}>{appointment.time}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Icon
                  name={appointment.type === 'Presencial' ? 'hospital-building' : 'video'}
                  size={16}
                  color={theme.colors.secondary[500]}
                />
                <Text style={styles.cardInfoText}>{appointment.type}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Medications */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Medicamentos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {medications.map((medication) => (
          <View key={medication.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{medication.name}</Text>
              <Text style={styles.cardSubtitle}>{medication.dosage}</Text>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardInfo}>
                <Icon name="clock" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.cardInfoText}>
                  {medication.frequency} às {medication.time}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Icon name="pill" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.cardInfoText}>
                  Restam {medication.remaining} unidades
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginVertical: theme.spacing.xs,
  },
  statName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
  },
  section: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  seeAllButton: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary[500],
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  cardContent: {
    marginTop: theme.spacing.sm,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardInfoText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
}); 