import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, BookOpen, Plus, CreditCard as Edit3, Trash2, X } from 'lucide-react-native';
import { sampleFacultySubjects } from '@/data/facultyData';

export default function ManageSubjectsPage() {
  const [subjects, setSubjects] = useState(sampleFacultySubjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    credits: '',
    semester: '',
  });

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.credits || !newSubject.semester) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    const subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      code: newSubject.code,
      credits: parseInt(newSubject.credits),
      semester: parseInt(newSubject.semester),
    };
    
    setSubjects([...subjects, subject]);
    Alert.alert('Success', 'Subject added successfully!');
    setShowAddModal(false);
    setNewSubject({ name: '', code: '', credits: '', semester: '' });
  };

  const handleEditSubject = (subjectId: string) => {
    Alert.alert('Edit Subject', 'Subject editing feature coming soon!');
  };

  const handleDeleteSubject = (subjectId: string, subjectName: string) => {
    Alert.alert(
      'Delete Subject',
      `Are you sure you want to delete "${subjectName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setSubjects(subjects.filter(s => s.id !== subjectId));
            Alert.alert('Success', 'Subject deleted successfully!');
          }
        },
      ]
    );
  };

  const renderSubjectCard = ({ item }: { item: any }) => (
    <View style={styles.subjectCard}>
      <View style={styles.subjectIcon}>
        <BookOpen size={24} color="#059669" />
      </View>
      
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <Text style={styles.subjectCode}>{item.code}</Text>
        <Text style={styles.subjectDetails}>
          {item.credits} Credits • Semester {item.semester}
        </Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditSubject(item.id)}
        >
          <Edit3 size={16} color="#059669" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteSubject(item.id, item.name)}
        >
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Subjects</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Your Subjects</Text>
        <Text style={styles.subtitle}>{subjects.length} subjects assigned</Text>
        
        <FlatList
          data={subjects}
          renderItem={renderSubjectCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.subjectsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Subject</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#1e293b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject Name</Text>
              <TextInput
                style={styles.input}
                value={newSubject.name}
                onChangeText={(text) => setNewSubject({...newSubject, name: text})}
                placeholder="Enter subject name"
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Subject Code</Text>
              <TextInput
                style={styles.input}
                value={newSubject.code}
                onChangeText={(text) => setNewSubject({...newSubject, code: text})}
                placeholder="Enter subject code (e.g., CS301)"
                placeholderTextColor="#94a3b8"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Credits</Text>
              <TextInput
                style={styles.input}
                value={newSubject.credits}
                onChangeText={(text) => setNewSubject({...newSubject, credits: text})}
                placeholder="Enter credits (e.g., 3)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Semester</Text>
              <TextInput
                style={styles.input}
                value={newSubject.semester}
                onChangeText={(text) => setNewSubject({...newSubject, semester: text})}
                placeholder="Enter semester (e.g., 5)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.addSubjectButton} onPress={handleAddSubject}>
              <Text style={styles.addSubjectButtonText}>Add Subject</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#059669',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  subjectsList: {
    paddingBottom: 20,
  },
  subjectCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#dcfce7',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  subjectDetails: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#dcfce7',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  addSubjectButton: {
    backgroundColor: '#059669',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addSubjectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});