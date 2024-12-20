import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../styles/theme';

const profile = {
  name: 'João Silva',
  age: 45,
  bloodType: 'O+',
  height: '1.75',
  weight: '80',
  allergies: ['Penicilina', 'Látex'],
  conditions: ['Hipertensão', 'Diabetes Tipo 2'],
  emergencyContact: {
    name: 'Maria Silva',
    relationship: 'Esposa',
    phone: '(11) 98765-4321',
  },
};

const metrics = [
  {
    id: '1',
    name: 'Pressão Arterial',
    value: '120/80',
    unit: 'mmHg',
    icon: 'heart-pulse',
    date: '18/12/2023',
  },
  {
    id: '2',
    name: 'Glicemia',
    value: '100',
    unit: 'mg/dL',
    icon: 'water',
    date: '18/12/2023',
  },
  {
    id: '3',
    name: 'IMC',
    value: '26.1',
    unit: 'kg/m²',
    icon: 'human',
    date: '18/12/2023',
  },
];

export default function HealthProfile() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Icon name="pencil" size={16} color={theme.colors.text.inverse} />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.info}>{profile.age} anos | {profile.bloodType}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Métricas Recentes</Text>
        <View style={styles.metricsContainer}>
          {metrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <Icon name={metric.icon} size={24} color={theme.colors.primary[500]} />
              <Text style={styles.metricValue}>
                {metric.value}
                <Text style={styles.metricUnit}> {metric.unit}</Text>
              </Text>
              <Text style={styles.metricName}>{metric.name}</Text>
              <Text style={styles.metricDate}>{metric.date}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações de Saúde</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Altura</Text>
            <Text style={styles.infoValue}>{profile.height} m</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={styles.infoValue}>{profile.weight} kg</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alergias</Text>
            <Text style={styles.infoValue}>{profile.allergies.join(', ')}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Condições</Text>
            <Text style={styles.infoValue}>{profile.conditions.join(', ')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato de Emergência</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{profile.emergencyContact.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Relação</Text>
            <Text style={styles.infoValue}>{profile.emergencyContact.relationship}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{profile.emergencyContact.phone}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  info: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  metricValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.sm,
  },
  metricUnit: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.secondary,
  },
  metricName: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  metricDate: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  infoCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  infoValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.medium,
  },
}); 