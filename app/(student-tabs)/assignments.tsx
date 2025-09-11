import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Upload, Calendar, Clock, Search, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X, FileText, FileImage, File } from 'lucide-react-native';
import { sampleSubjects, sampleAssignments } from '@/data/sampleData';
import * as DocumentPicker from 'expo-document-picker';

export default function AssignmentsPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    registrationNo: '',
    department: '',
    semester: ''
  });

  const filteredAssignments = sampleAssignments.filter(assignment => {
    const matchesSubject = selectedSubject === 'all' || assignment.subjectId === selectedSubject;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    return matchesSubject && matchesSearch && matchesStatus;
  });

  const handleUpload = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowUploadModal(true);
  };

  const pickDocument = async (fileType: string) => {
    try {
      let result;
      if (fileType === 'PDF') {
        result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true,
        });
      } else if (fileType === 'DOC') {
        result = await DocumentPicker.getDocumentAsync({
          type: 'application/msword',
          copyToCacheDirectory: true,
        });
      } else if (fileType === 'PPT') {
        result = await DocumentPicker.getDocumentAsync({
          type: 'application/vnd.ms-powerpoint',
          copyToCacheDirectory: true,
        });
      }

      if (result && !result.canceled && result.assets && result.assets[0]) {
        setSelectedFile(result.assets[0]);
        setShowUploadModal(false);
        setShowFormModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmitAssignment = () => {
    if (studentDetails.name && studentDetails.registrationNo && studentDetails.department && studentDetails.semester) {
      Alert.alert(
        'Success!',
        `Assignment submitted successfully!\n\nFile: ${selectedFile?.name}\nStudent: ${studentDetails.name}\nRegistration: ${studentDetails.registrationNo}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowFormModal(false);
              setSelectedFile(null);
              setSelectedAssignment(null);
              setStudentDetails({ name: '', registrationNo: '', department: '', semester: '' });
            }
          }
        ]
      );
    } else {
      Alert.alert('Error', 'Please fill in all details');
    }
  };

  const isFormComplete = studentDetails.name && studentDetails.registrationNo && studentDetails.department && studentDetails.semester;

  const renderAssignmentCard = ({ item }: { item: any }) => (
    <View style={styles.assignmentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.priorityIndicator}>
          {item.daysLeft <= 3 ? (
            <AlertCircle size={20} color="#EF4444" strokeWidth={2.5} />
          ) : (
            <Clock size={20} color="#F59E0B" strokeWidth={2.5} />
          )}
        </View>
        <View style={[styles.statusBadge, item.status === 'submitted' ? styles.submittedBadge : styles.pendingBadge]}>
          {item.status === 'submitted' ? (
            <CheckCircle size={12} color="#10B981" strokeWidth={2.5} />
          ) : (
            <Clock size={12} color="#F59E0B" strokeWidth={2.5} />
          )}
          <Text style={[styles.statusText, item.status === 'submitted' ? styles.submittedText : styles.pendingText]}>
            {item.status === 'submitted' ? 'Submitted' : 'Pending'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.assignmentTitle}>{item.title}</Text>
      <Text style={styles.assignmentDescription}>{item.description}</Text>
      
      <View style={styles.assignmentMeta}>
        <View style={styles.metaItem}>
          <Calendar size={14} color="#A8A8AA" strokeWidth={2} />
          <Text style={styles.metaText}>Due: {item.dueDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <Clock size={14} color={item.daysLeft <= 3 ? "#EF4444" : "#A8A8AA"} strokeWidth={2} />
          <Text style={[styles.metaText, { color: item.daysLeft <= 3 ? "#EF4444" : "#A8A8AA" }]}>
            {item.daysLeft} days left
          </Text>
        </View>
      </View>
      
      {item.status !== 'submitted' && (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => handleUpload(item)}
        >
          <Upload size={16} color="#02462D" strokeWidth={2.5} />
          <Text style={styles.uploadButtonText}>Submit Assignment</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignments</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#02462D" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assignments..."
            placeholderTextColor="#02462D"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              style={styles.picker}
              dropdownIconColor="#02462D"
            >
              <Picker.Item label="All Subjects" value="all" color="#02462D" />
              {sampleSubjects.map((subject) => (
                <Picker.Item key={subject.id} label={subject.name} value={subject.id} color="#02462D" />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={filterStatus}
              onValueChange={(itemValue) => setFilterStatus(itemValue)}
              style={styles.picker}
              dropdownIconColor="#02462D"
            >
              <Picker.Item label="All Status" value="all" color="#02462D" />
              <Picker.Item label="Pending" value="pending" color="#02462D" />
              <Picker.Item label="Submitted" value="submitted" color="#02462D" />
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.resultsText}>{filteredAssignments.length} assignments found</Text>
        
        <FlatList
          data={filteredAssignments}
          renderItem={renderAssignmentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.assignmentsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* File Type Selection Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose File Type</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <X size={24} color="#02462D" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Select the type of file you want to upload:</Text>
            
            <View style={styles.fileTypeOptions}>
              <TouchableOpacity 
                style={styles.fileTypeOption}
                onPress={() => pickDocument('PDF')}
              >
                <FileText size={32} color="#EF4444" />
                <Text style={styles.fileTypeText}>PDF Document</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fileTypeOption}
                onPress={() => pickDocument('DOC')}
              >
                <File size={32} color="#3B82F6" />
                <Text style={styles.fileTypeText}>Word Document</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.fileTypeOption}
                onPress={() => pickDocument('PPT')}
              >
                <FileImage size={32} color="#8B5CF6" />
                <Text style={styles.fileTypeText}>PowerPoint</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Student Details Form Modal */}
      <Modal
        visible={showFormModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFormModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Student Details</Text>
              <TouchableOpacity onPress={() => setShowFormModal(false)}>
                <X size={24} color="#02462D" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>File: {selectedFile?.name}</Text>
            
            <ScrollView style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Student Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={studentDetails.name}
                  onChangeText={(text) => setStudentDetails({...studentDetails, name: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Registration Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter registration number"
                  value={studentDetails.registrationNo}
                  onChangeText={(text) => setStudentDetails({...studentDetails, registrationNo: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Department *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your department"
                  value={studentDetails.department}
                  onChangeText={(text) => setStudentDetails({...studentDetails, department: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Semester *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter current semester"
                  value={studentDetails.semester}
                  onChangeText={(text) => setStudentDetails({...studentDetails, semester: text})}
                />
              </View>
            </ScrollView>
            
            {isFormComplete && (
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitAssignment}
              >
                <Text style={styles.submitButtonText}>Submit Assignment</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFC702',
    minHeight: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#02462D',
    flex: 1,
  },

  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFC702',
  },
  searchBox: {
    backgroundColor: 'rgba(36, 70, 45, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#02462D',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFC702',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: 'rgba(36, 70, 45, 0.1)',
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 4,
  },
  picker: {
    height: 56,
    color: '#02462D',
    fontSize: 14,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  resultsText: {
    fontSize: 14,
    color: '#FFC702',
    marginBottom: 16,
  },
  assignmentsList: {
    paddingBottom: 24,
  },
  assignmentCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityIndicator: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  submittedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  submittedText: {
    color: '#10B981',
  },
  pendingText: {
    color: '#F59E0B',
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 24,
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#FFC702',
    lineHeight: 20,
    marginBottom: 16,
  },
  assignmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#FFC702',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonText: {
    color: '#02462D',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxHeight: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC702',
    flex: 1,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#FFC702',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  fileTypeOptions: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 20,
  },
  fileTypeOption: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 199, 2, 0.1)',
    borderWidth: 2,
    borderColor: '#FFC702',
    minWidth: 200,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fileTypeText: {
    fontSize: 14,
    color: '#FFC702',
    marginTop: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
    maxHeight: 300,
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFC702',
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFC702',
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 2, 0.3)',
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#FFC702',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonText: {
    color: '#02462D',
    fontSize: 16,
    fontWeight: '700',
  },
});