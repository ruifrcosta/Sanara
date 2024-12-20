import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../styles/theme';

const records = {
  exams: [
    {
      id: '1',
      type: 'Hemograma Completo',
      date: '15/12/2023',
      doctor: 'Dr. João Santos',
      facility: 'Laboratório Central',
      status: 'completed',
      results: 'Disponível',
    },
    {
      id: '2',
      type: 'Eletrocardiograma',
      date: '10/12/2023',
      doctor: 'Dra. Maria Silva',
      facility: 'Hospital São Lucas',
      status: 'completed',
      results: 'Disponível',
    },
  ],
  consultations: [
    {
      id: '1',
      specialty: 'Cardiologia',
      doctor: 'Dra. Maria Silva',
      date: '05/12/2023',
      diagnosis: 'Hipertensão controlada',
      prescriptions: ['Losartana 50mg'],
      notes: 'Manter medicação atual',
    },
    {
      id: '2',
      specialty: 'Clínico Geral',
      doctor: 'Dr. João Santos',
      date: '01/12/2023',
      diagnosis: 'Check-up de rotina',
      prescriptions: [],
      notes: 'Exames solicitados',
    },
  ],
  documents: [
    {
      id: '1',
      name: 'Atestado Médico',
      date: '05/12/2023',
      doctor: 'Dra. Maria Silva',
      type: 'PDF',
    },
    {
      id: '2',
      name: 'Resultado Exames',
      date: '15/12/2023',
      doctor: 'Dr. João Santos',
      type: 'PDF',
    },
  ],
};

export default function Records() {
  const [activeTab, setActiveTab] = useState('exams');

  const renderExams = () => (
    <View>
      {records.exams.map((exam) => (
        <TouchableOpacity key={exam.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{exam.type}</Text>
              <Text style={styles.cardSubtitle}>{exam.date}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Icon name="check-circle" size={20} color={theme.colors.status.success} />
              <Text style={styles.statusText}>{exam.results}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Icon name="doctor" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{exam.doctor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="hospital-building" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{exam.facility}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConsultations = () => (
    <View>
      {records.consultations.map((consultation) => (
        <TouchableOpacity key={consultation.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{consultation.specialty}</Text>
              <Text style={styles.cardSubtitle}>{consultation.date}</Text>
            </View>
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Icon name="doctor" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{consultation.doctor}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="clipboard-text" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{consultation.diagnosis}</Text>
            </View>
            {consultation.prescriptions.length > 0 && (
              <View style={styles.infoRow}>
                <Icon name="pill" size={16} color={theme.colors.secondary[500]} />
                <Text style={styles.infoText}>
                  {consultation.prescriptions.join(', ')}
                </Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Icon name="note-text" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{consultation.notes}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDocuments = () => (
    <View>
      {records.documents.map((document) => (
        <TouchableOpacity key={document.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.documentInfo}>
              <Text style={styles.cardTitle}>{document.name}</Text>
              <Text style={styles.cardSubtitle}>{document.date}</Text>
            </View>
            <Icon name="file-pdf-box" size={32} color={theme.colors.status.error} />
          </View>
          <View style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Icon name="doctor" size={16} color={theme.colors.secondary[500]} />
              <Text style={styles.infoText}>{document.doctor}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'exams' && styles.activeTab]}
          onPress={() => setActiveTab('exams')}
        >
          <Text
            style={[styles.tabText, activeTab === 'exams' && styles.activeTabText]}
          >
            Exames
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'consultations' && styles.activeTab]}
          onPress={() => setActiveTab('consultations')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'consultations' && styles.activeTabText,
            ]}
          >
            Consultas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
          onPress={() => setActiveTab('documents')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'documents' && styles.activeTabText,
            ]}
          >
            Documentos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'consultations' && renderConsultations()}
        {activeTab === 'documents' && renderDocuments()}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.sm,
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
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  cardSubtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.status.success,
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
    flex: 1,
  },
  documentInfo: {
    flex: 1,
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