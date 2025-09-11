import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, Calendar, X, Search, ChartBar as BarChart3, Clock, CircleCheck as CheckCircle, ChevronDown, ArrowLeft, User, Mail, TrendingUp } from 'lucide-react-native';
import { sampleFacultySubjects, sampleFacultyAssignments } from '@/data/facultyData';

export default function FacultyAssignmentsPage() {
  const [selectedSubject, setSelectedSubject] = useState(sampleFacultySubjects[0].id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [currentView, setCurrentView] = useState('assignments'); // 'assignments', 'submissions', 'analytics'
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    maxMarks: '',
  });
  
  const filteredAssignments = sampleFacultyAssignments.filter(
    assignment => assignment.subjectId === selectedSubject &&
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSelectedSubjectName = () => {
    const subject = sampleFacultySubjects.find(s => s.id === selectedSubject);
    return subject ? subject.name : 'Select Subject';
  };

  const closeDropdown = () => {
    setShowSubjectDropdown(false);
  };

  // Mock submission data
  const getSubmissionData = (assignmentId: string) => {
    return [
      { id: '1', studentName: 'P. Madhan Kumar', regNo: '110523243011', submittedAt: '2024-01-15 10:30 AM', status: 'submitted' },
      { id: '2', studentName: 'R. Priya', regNo: '110523243012', submittedAt: '2024-01-15 11:45 AM', status: 'submitted' },
      { id: '3', studentName: 'K. Arjun', regNo: '110523243013', submittedAt: '2024-01-15 02:15 PM', status: 'submitted' },
      { id: '4', studentName: 'S. Deepa', regNo: '110523243014', submittedAt: '2024-01-16 09:20 AM', status: 'submitted' },
      { id: '5', studentName: 'M. Rajesh', regNo: '110523243015', submittedAt: '2024-01-16 01:30 PM', status: 'submitted' },
    ];
  };

  const getAnalyticsData = (assignmentId: string) => {
    return {
      totalStudents: 25,
      submitted: 18,
      pending: 7,
      submissionRate: 72,
      averageScore: 85.5,
      onTimeSubmissions: 15,
      lateSubmissions: 3
    };
  };

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Assignment created and published to students!');
    setShowCreateModal(false);
    setNewAssignment({ title: '', description: '', dueDate: '', maxMarks: '' });
  };

  const handleViewSubmissions = (assignment: any) => {
    setSelectedAssignment(assignment);
    setCurrentView('submissions');
  };

  const handleViewAnalytics = (assignment: any) => {
    setSelectedAssignment(assignment);
    setCurrentView('analytics');
  };

  const handleBackToAssignments = () => {
    setCurrentView('assignments');
    setSelectedAssignment(null);
  };

  const renderAssignmentCard = ({ item }: { item: any }) => {
    const submissionRate = (item.submissions / item.totalStudents) * 100;
    
    return (
      <View style={styles.assignmentCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.assignmentTitle}>{item.title}</Text>
          <View style={styles.submissionBadge}>
            <Text style={styles.submissionText}>{item.submissions}/{item.totalStudents}</Text>
          </View>
        </View>
        
        <Text style={styles.assignmentDescription}>{item.description}</Text>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Submission Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${submissionRate}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(submissionRate)}% submitted</Text>
        </View>
        
        <View style={styles.assignmentMeta}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#A8A8AA" strokeWidth={2} />
            <Text style={styles.metaText}>Due: {item.dueDate}</Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={14} color="#A8A8AA" strokeWidth={2} />
            <Text style={styles.metaText}>{item.totalStudents} students</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => handleViewSubmissions(item)}
          >
            <CheckCircle size={16} color="#ffffff" strokeWidth={2.5} />
            <Text style={styles.buttonText}>View Submissions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.analyticsButton}
            onPress={() => handleViewAnalytics(item)}
          >
            <BarChart3 size={16} color="#FFC702" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSubmissionsPage = () => {
    const submissions = getSubmissionData(selectedAssignment?.id);
    
    return (
      <SafeAreaView style={styles.subPageContainer}>
        <View style={styles.subPageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToAssignments}>
            <ArrowLeft size={24} color="#02462D" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.subPageTitle}>Submissions</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.subPageContent} showsVerticalScrollIndicator={false}>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentInfoTitle}>{selectedAssignment?.title}</Text>
            <Text style={styles.assignmentInfoDescription}>{selectedAssignment?.description}</Text>
            <View style={styles.submissionStats}>
              <Text style={styles.submissionStatsText}>
                {submissions.length} of {selectedAssignment?.totalStudents} students submitted
              </Text>
            </View>
          </View>
          
          <View style={styles.submissionsList}>
            <Text style={styles.submissionsListTitle}>Student Submissions</Text>
            {submissions.map((submission) => (
              <View key={submission.id} style={styles.submissionCard}>
                <View style={styles.submissionHeader}>
                  <View style={styles.studentAvatar}>
                    <User size={20} color="#FFC702" strokeWidth={2.5} />
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{submission.studentName}</Text>
                    <Text style={styles.studentReg}>{submission.regNo}</Text>
                  </View>
                  <View style={styles.submissionStatus}>
                    <CheckCircle size={16} color="#10B981" strokeWidth={2.5} />
                  </View>
                </View>
                <View style={styles.submissionMeta}>
                  <Clock size={14} color="#A8A8AA" strokeWidth={2} />
                  <Text style={styles.submissionTime}>Submitted: {submission.submittedAt}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  const renderAnalyticsPage = () => {
    const analytics = getAnalyticsData(selectedAssignment?.id);
    
    return (
      <SafeAreaView style={styles.subPageContainer}>
        <View style={styles.subPageHeader}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToAssignments}>
            <ArrowLeft size={24} color="#02462D" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.subPageTitle}>Analytics</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.subPageContent} showsVerticalScrollIndicator={false}>
          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentInfoTitle}>{selectedAssignment?.title}</Text>
            <Text style={styles.assignmentInfoDescription}>{selectedAssignment?.description}</Text>
          </View>
          
          <View style={styles.analyticsContainer}>
            <Text style={styles.analyticsTitle}>Assignment Analytics</Text>
            
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <Users size={24} color="#FFC702" strokeWidth={2.5} />
                <Text style={styles.analyticsValue}>{analytics.totalStudents}</Text>
                <Text style={styles.analyticsLabel}>Total Students</Text>
              </View>
              
              <View style={styles.analyticsCard}>
                <CheckCircle size={24} color="#10B981" strokeWidth={2.5} />
                <Text style={styles.analyticsValue}>{analytics.submitted}</Text>
                <Text style={styles.analyticsLabel}>Submitted</Text>
              </View>
              
              <View style={styles.analyticsCard}>
                <Clock size={24} color="#F59E0B" strokeWidth={2.5} />
                <Text style={styles.analyticsValue}>{analytics.pending}</Text>
                <Text style={styles.analyticsLabel}>Pending</Text>
              </View>
              
              <View style={styles.analyticsCard}>
                <TrendingUp size={24} color="#3B82F6" strokeWidth={2.5} />
                <Text style={styles.analyticsValue}>{analytics.submissionRate}%</Text>
                <Text style={styles.analyticsLabel}>Submission Rate</Text>
              </View>
            </View>
            
            <View style={styles.detailedStats}>
              <Text style={styles.detailedStatsTitle}>Detailed Statistics</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Average Score:</Text>
                <Text style={styles.statValue}>{analytics.averageScore}%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>On-time Submissions:</Text>
                <Text style={styles.statValue}>{analytics.onTimeSubmissions}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Late Submissions:</Text>
                <Text style={styles.statValue}>{analytics.lateSubmissions}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  if (currentView === 'submissions') {
    return renderSubmissionsPage();
  }

  if (currentView === 'analytics') {
    return renderAnalyticsPage();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Assignments</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#ffffff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#A8A8AA" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search assignments..."
            placeholderTextColor="#A8A8AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.subjectSelector}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowSubjectDropdown(!showSubjectDropdown)}
        >
          <Text style={styles.dropdownText}>{getSelectedSubjectName()}</Text>
          <ChevronDown size={20} color="#02462D" strokeWidth={2.5} />
        </TouchableOpacity>
        
        {showSubjectDropdown && (
          <>
            <TouchableOpacity 
              style={styles.dropdownBackdrop}
              onPress={closeDropdown}
              activeOpacity={1}
            />
            <View style={styles.dropdownList}>
              {sampleFacultySubjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.dropdownItem,
                    selectedSubject === subject.id && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    setSelectedSubject(subject.id);
                    setShowSubjectDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedSubject === subject.id && styles.selectedDropdownItemText
                  ]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
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

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Assignment</Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <X size={24} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assignment Title *</Text>
              <TextInput
                style={styles.input}
                value={newAssignment.title}
                onChangeText={(text) => setNewAssignment({...newAssignment, title: text})}
                placeholder="Enter assignment title"
                placeholderTextColor="#A8A8AA"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newAssignment.description}
                onChangeText={(text) => setNewAssignment({...newAssignment, description: text})}
                placeholder="Enter detailed assignment description"
                placeholderTextColor="#A8A8AA"
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date *</Text>
              <TextInput
                style={styles.input}
                value={newAssignment.dueDate}
                onChangeText={(text) => setNewAssignment({...newAssignment, dueDate: text})}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#A8A8AA"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maximum Marks</Text>
              <TextInput
                style={styles.input}
                value={newAssignment.maxMarks}
                onChangeText={(text) => setNewAssignment({...newAssignment, maxMarks: text})}
                placeholder="Enter maximum marks (optional)"
                placeholderTextColor="#A8A8AA"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.createButton} onPress={handleCreateAssignment}>
              <Text style={styles.createButtonText}>Create & Publish Assignment</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#02462D',
  },
  addButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFC702',
  },
  searchBox: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
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
  subjectSelector: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFC702',
    position: 'relative',
  },
  dropdownButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    height: 45,
  },
  dropdownText: {
    fontSize: 16,
    color: '#02462D',
    fontWeight: '500',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdownList: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  selectedDropdownItem: {
    backgroundColor: 'rgba(255, 199, 2, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  selectedDropdownItemText: {
    color: '#FFC702',
    fontWeight: '600',
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
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  submissionBadge: {
    backgroundColor: 'rgba(255, 199, 2, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  submissionText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  assignmentDescription: {
    fontSize: 14,
    color: '#FFC702',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 12,
    color: '#FFC702',
    marginBottom: 8,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(168, 168, 170, 0.2)',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '500',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#FFC702',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  analyticsButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#02462D',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFC702',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02462D',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: '#FFC702',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#02462D',
    fontSize: 16,
    fontWeight: '600',
  },
  // Sub-page styles
  subPageContainer: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  subPageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFC702',
    borderBottomWidth: 1,
    borderBottomColor: '#02462D',
  },
  subPageContent: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subPageTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02462D',
    textAlign: 'center',
  },
  assignmentInfo: {
    backgroundColor: '#1A1A1A',
    margin: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 8,
  },
  assignmentInfoDescription: {
    fontSize: 14,
    color: '#A8A8AA',
    lineHeight: 20,
    marginBottom: 12,
  },
  submissionStats: {
    backgroundColor: 'rgba(255, 199, 2, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  submissionStatsText: {
    fontSize: 14,
    color: '#FFC702',
    fontWeight: '600',
    textAlign: 'center',
  },
  submissionsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  submissionsListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 16,
  },
  submissionCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  submissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#FFC702',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  studentReg: {
    fontSize: 14,
    color: '#A8A8AA',
  },
  submissionStatus: {
    marginLeft: 8,
  },
  submissionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submissionTime: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  // Analytics styles
  analyticsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 20,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    backgroundColor: '#1A1A1A',
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#A8A8AA',
    textAlign: 'center',
  },
  detailedStats: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailedStatsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statLabel: {
    fontSize: 14,
    color: '#A8A8AA',
  },
  statValue: {
    fontSize: 14,
    color: '#FFC702',
    fontWeight: '600',
  },
});