import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../styles/theme';

const appointments = [
  {
    id: '1',
    doctor: 'Dra. Maria Silva',
    specialty: 'Cardiologia',
    date: '20/12/2023',
    time: '14:30',
    type: 'Presencial',
    status: 'upcoming',
    location: 'Hospital São Lucas',
  },
  {
    id: '2',
    doctor: 'Dr. João Santos',
    specialty: 'Clínico Geral',
    date: '22/12/2023',
    time: '10:00',
    type: 'Telemedicina',
    status: 'upcoming',
    location: 'Consulta Online',
  },
  {
    id: '3',
    doctor: 'Dra. Ana Oliveira',
    specialty: 'Dermatologia',
    date: '15/12/2023',
    time: '09:30',
    type: 'Presencial',
    status: 'past',
    location: 'Clínica Dermatológica',
  },
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  const renderAppointment = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.doctor}</Text>
        <Text style={styles.cardSubtitle}>{item.specialty}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <Icon name="calendar" size={16} color={theme.colors.secondary[500]} />
          <Text style={styles.cardInfoText}>{item.date}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Icon name="clock" size={16} color={theme.colors.secondary[500]} />
          <Text style={styles.cardInfoText}>{item.time}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Icon
            name={item.type === 'Presencial' ? 'hospital-building' : 'video'}
            size={16}
            color={theme.colors.secondary[500]}
          />
          <Text style={styles.cardInfoText}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'upcoming' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Próximas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'past' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Anteriores
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

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
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.primary[50],
  },
  tabText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.weights.medium,
  },
  activeTabText: {
    color: theme.colors.primary[600],
  },
  list: {
    padding: theme.spacing.md,
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