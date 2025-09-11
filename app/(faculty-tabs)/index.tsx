import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Users, BookOpen, FileText, User, Calendar, TrendingUp, Award, Home, GraduationCap, Clock, CheckCircle, XCircle, ArrowLeft, Search, FileText as FileTextIcon, Download } from 'lucide-react-native';
import { theme } from '@/theme';
import { sampleAssignmentSubmissions } from '@/data/facultyData';

export default function FacultyDashboardTab() {
  const [showAssignmentApproval, setShowAssignmentApproval] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [submissions, setSubmissions] = useState(sampleAssignmentSubmissions);

  const stats = [
    { label: 'Total Students', value: '156', icon: Users, color: theme.colors.accent },
    { label: 'Active Subjects', value: '4', icon: BookOpen, color: theme.colors.accent },
    { label: 'Assignment', value: '12', icon: FileText, color: theme.colors.accent },
    { label: 'Submission', value: '89%', icon: TrendingUp, color: theme.colors.accent },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Manage Students',
      subtitle: 'View & manage enrolled students',
      icon: Users,
      color: '#FFC702',
      route: '/faculty/manage-students',
    },
    {
      id: '2',
      title: 'Assignments',
      subtitle: 'Create & track assignments',
      icon: FileText,
      color: '#FFC702',
      route: '/(faculty-tabs)/assignments',
    },
    {
      id: '3',
      title: 'Assignment Approval',
      subtitle: 'Approve or reject assignments',
      icon: CheckCircle,
      color: '#FFC702',
      action: () => setShowAssignmentApproval(true),
    },
  ];

  const recentActivity = [
    { id: '1', action: 'New assignment submitted', student: 'John Doe', time: '2 hours ago' },
    { id: '2', action: 'Student enrolled', student: 'Jane Smith', time: '4 hours ago' },
    { id: '3', action: 'Assignment graded', student: 'Jane Smith', time: '1 day ago' },
  ];

  const renderStatCard = (stat: any, index: number) => (
    <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
      <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
        <stat.icon size={20} color={stat.color} strokeWidth={2.5} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    </View>
  );

  const renderQuickAction = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={() => item.action ? item.action() : router.push(item.route)}
    >
      <View style={[styles.actionIcon, { backgroundColor: `${item.color}15` }]}>
        <item.icon size={28} color={item.color} strokeWidth={2.5} />
      </View>
      <Text style={styles.actionTitle}>{item.title}</Text>
      <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  const renderActivityItem = ({ item }: { item: any }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityDot} />
      <View style={styles.activityContent}>
        <Text style={styles.activityAction}>{item.action}</Text>
        <Text style={styles.activityStudent}>{item.student}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  // Assignment approval helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'docx': return '📝';
      case 'pptx': return '📊';
      default: return '📁';
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    submission.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStudentPress = (submission: any) => {
    setSelectedStudent(submission);
  };

  const handleTopicPress = (topic: any) => {
    setSelectedTopic(topic);
  };

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedStudent) {
      setSelectedStudent(null);
    } else {
      setShowAssignmentApproval(false);
      setSearchQuery('');
    }
  };

  const handleApprove = () => {
    Alert.alert(
      'Approve Assignment',
      'Are you sure you want to approve this assignment topic?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Approve',
          onPress: () => {
            // Update the topic status
            const updatedSubmissions = submissions.map(submission => {
              if (submission.id === selectedStudent?.id) {
                const updatedTopics = submission.topics.map(topic => 
                  topic.id === selectedTopic?.id ? { ...topic, status: 'approved' } : topic
                );
                return { ...submission, topics: updatedTopics };
              }
              return submission;
            });
            setSubmissions(updatedSubmissions);
            Alert.alert('Success', 'Assignment topic approved successfully!');
            setSelectedTopic(null);
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Assignment',
      'Are you sure you want to reject this assignment topic?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          onPress: () => {
            // Update the topic status
            const updatedSubmissions = submissions.map(submission => {
              if (submission.id === selectedStudent?.id) {
                const updatedTopics = submission.topics.map(topic => 
                  topic.id === selectedTopic?.id ? { ...topic, status: 'rejected' } : topic
                );
                return { ...submission, topics: updatedTopics };
              }
              return submission;
            });
            setSubmissions(updatedSubmissions);
            Alert.alert('Success', 'Assignment topic rejected successfully!');
            setSelectedTopic(null);
          },
        },
      ]
    );
  };

  const handleDownload = () => {
    Alert.alert('Download', `Downloading ${selectedTopic?.fileName}...`);
  };

  const renderStudentCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => handleStudentPress(item)}
    >
      <View style={styles.studentHeader}>
        <View style={styles.studentInfo}>
          <View style={styles.studentIcon}>
            <User size={20} color="#FFC702" strokeWidth={2.5} />
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.studentRegNo}>{item.regNo}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.assignmentInfo}>
        <Text style={styles.assignmentTitle}>{item.assignmentTitle}</Text>
        <Text style={styles.subjectName}>{item.subjectName}</Text>
        <View style={styles.submissionInfo}>
          <Clock size={12} color="#A8A8AA" strokeWidth={2} />
          <Text style={styles.submissionDate}>Submitted: {item.submittedAt}</Text>
        </View>
      </View>
      
      <View style={styles.topicsInfo}>
        <Text style={styles.topicsCount}>
          {item.topics.length} topic{item.topics.length !== 1 ? 's' : ''} submitted
        </Text>
        <View style={styles.topicStatuses}>
          {item.topics.map((topic: any, index: number) => (
            <View
              key={topic.id}
              style={[
                styles.topicStatusDot,
                { backgroundColor: getStatusColor(topic.status) }
              ]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTopicCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={() => handleTopicPress(item)}
    >
      <View style={styles.topicHeader}>
        <View style={styles.topicIcon}>
          <FileTextIcon size={16} color="#FFC702" strokeWidth={2.5} />
        </View>
        <View style={styles.topicInfo}>
          <Text style={styles.topicTitle}>{item.title}</Text>
          <Text style={styles.topicFileName}>{item.fileName}</Text>
        </View>
        <View style={[styles.topicStatusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.topicStatusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.topicFooter}>
        <Clock size={12} color="#A8A8AA" strokeWidth={2} />
        <Text style={styles.topicDate}>{item.submittedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  // Assignment Viewer Component
  const AssignmentViewer = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#02462D" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Assignment Viewer</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.studentInfo}>
          <View style={styles.studentIcon}>
            <User size={20} color="#FFC702" strokeWidth={2.5} />
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{selectedStudent?.studentName}</Text>
            <Text style={styles.assignmentTitle}>{selectedStudent?.assignmentTitle}</Text>
          </View>
        </View>

        <View style={styles.topicCard}>
          <View style={styles.topicHeader}>
            <Text style={styles.topicTitle}>{selectedTopic?.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedTopic?.status || 'pending')}20` }]}>
              <Text style={[styles.statusText, { color: getStatusColor(selectedTopic?.status || 'pending') }]}>
                {getStatusText(selectedTopic?.status || 'pending')}
              </Text>
            </View>
          </View>
          
          <View style={styles.fileInfo}>
            <View style={styles.fileIcon}>
              <Text style={styles.fileTypeIcon}>{getFileTypeIcon(selectedTopic?.fileType || 'pdf')}</Text>
            </View>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName}>{selectedTopic?.fileName}</Text>
              <Text style={styles.fileType}>{selectedTopic?.fileType?.toUpperCase()}</Text>
            </View>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Download size={20} color="#FFC702" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.submissionInfo}>
            <Clock size={16} color="#A8A8AA" strokeWidth={2} />
            <Text style={styles.submissionDate}>Submitted: {selectedTopic?.submittedAt}</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Review Actions</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.approveButton]} 
              onPress={handleApprove}
              disabled={selectedTopic?.status === 'approved'}
            >
              <CheckCircle size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.actionButtonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]} 
              onPress={handleReject}
              disabled={selectedTopic?.status === 'rejected'}
            >
              <XCircle size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Review Guidelines</Text>
          <Text style={styles.instructionsText}>
            • Check if the assignment meets the requirements{'\n'}
            • Verify the quality and accuracy of the work{'\n'}
            • Ensure proper formatting and presentation{'\n'}
            • Provide feedback if rejecting the assignment{'\n'}
            • Notifications will be sent to the student automatically
          </Text>
        </View>
      </ScrollView>
    </View>
  );

  // Assignment Topics Component
  const AssignmentTopics = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#02462D" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Assignment Topics</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.studentInfoHeader}>
        <Text style={styles.studentName}>{selectedStudent?.studentName}</Text>
        <Text style={styles.studentRegNo}>{selectedStudent?.regNo}</Text>
        <Text style={styles.assignmentTitle}>{selectedStudent?.assignmentTitle}</Text>
      </View>
      
      <FlatList
        data={selectedStudent?.topics || []}
        renderItem={renderTopicCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.topicsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // Assignment Approval Component
  const AssignmentApproval = () => (
    <View style={styles.overlayContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#02462D" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.title}>Assignment Approval</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#A8A8AA" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students or assignments..."
            placeholderTextColor="#A8A8AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.resultsText}>
          {filteredSubmissions.length} assignment submission{filteredSubmissions.length !== 1 ? 's' : ''}
        </Text>
        
        <FlatList
          data={filteredSubmissions}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.studentsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {showAssignmentApproval ? (
        selectedTopic ? (
          <AssignmentViewer />
        ) : selectedStudent ? (
          <AssignmentTopics />
        ) : (
          <AssignmentApproval />
        )
      ) : (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.facultyName}>Prof. Pradeep A</Text>
              <Text style={styles.departmentInfo}>Artificial Intelligence and Data Science Department</Text>
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/(faculty-tabs)/notifications')}
            >
              <Bell size={24} color={theme.colors.primary} strokeWidth={2.5} />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              {stats.map(renderStatCard)}
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <FlatList
              data={quickActions}
              renderItem={renderQuickAction}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.actionRow}
              scrollEnabled={false}
            />
          </View>

          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <FlatList
              data={recentActivity}
              renderItem={renderActivityItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: '#FFC702',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#02462D',
    marginBottom: 4,
  },
  facultyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#02462D',
    marginBottom: 4,
  },
  departmentInfo: {
    fontSize: 14,
    color: '#02462D',
  },
  notificationButton: {
    position: 'relative',
    backgroundColor: 'rgba(36, 70, 45, 0.1)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFC702',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    width: '47%',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
    minWidth: 0,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
    flexWrap: 'nowrap',
    textAlign: 'left',
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  actionRow: {
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#1A1A1A',
    width: '47%',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#FFC702',
    lineHeight: 16,
  },
  activityContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  activityItem: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    backgroundColor: '#FFC702',
    borderRadius: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  activityStudent: {
    fontSize: 12,
    color: '#FFC702',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#FFC702',
  },
  // Assignment Approval Overlay Styles
  overlayContainer: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  backButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02462D',
  },
  placeholder: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#FFC702',
    paddingBottom: 24,
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
  resultsText: {
    fontSize: 14,
    color: '#FFC702',
    marginBottom: 16,
  },
  studentsList: {
    paddingBottom: 24,
  },
  studentCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFC702',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  studentRegNo: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  assignmentInfo: {
    marginBottom: 12,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 4,
  },
  subjectName: {
    fontSize: 12,
    color: '#A8A8AA',
    marginBottom: 8,
  },
  submissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  submissionDate: {
    fontSize: 11,
    color: '#A8A8AA',
  },
  topicsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topicsCount: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  topicStatuses: {
    flexDirection: 'row',
    gap: 4,
  },
  topicStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  studentInfoHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  topicsList: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  topicCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FFC702',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  topicFileName: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  topicStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  topicStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  topicDate: {
    fontSize: 11,
    color: '#A8A8AA',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  fileIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FFC702',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileTypeIcon: {
    fontSize: 20,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  fileType: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  downloadButton: {
    backgroundColor: 'rgba(255, 199, 2, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionsCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#A8A8AA',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});