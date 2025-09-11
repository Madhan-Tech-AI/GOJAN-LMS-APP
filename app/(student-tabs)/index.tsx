import React, { useState } from 'react';
import { theme } from '@/theme';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Modal, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, BookOpen, Clock, TrendingUp, Calendar, Award, Target, FileText, Award as Trophy, X, CalendarDays, AlertCircle, GraduationCap, Filter } from 'lucide-react-native';
import { sampleSubjects, sampleAssignments, sampleNotifications } from '@/data/sampleData';
import { sampleStudents } from '@/data/facultyData';

export default function StudentHomePage() {
  const params = useLocalSearchParams();
  const passedName = typeof params.name === 'string' ? params.name : undefined;
  const passedSemester = typeof params.semester === 'string' ? params.semester : undefined;
  const passedDepartment = typeof params.department === 'string' ? params.department : 'Artificial Intelligence and Data Science';
  const [showCAResultModal, setShowCAResultModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [studentDetails, setStudentDetails] = useState({
    registrationNo: '',
    dateOfBirth: ''
  });

  const upcomingAssignments = sampleAssignments.filter(a => a.status === 'pending').slice(0, 3);
  
  // Sample schedule data
  const scheduleData = [
    {
      id: '1',
      type: 'event',
      title: 'Annual Sports Meet',
      description: 'Annual sports competition for all departments',
      date: '2024-01-15',
      time: '09:00 AM',
      icon: CalendarDays,
      color: '#10B981',
      status: 'past'
    },
    {
      id: '2',
      type: 'assignment',
      title: 'Data Structures Assignment Due',
      description: 'Submit your final project report',
      date: '2024-02-18',
      time: '11:59 PM',
      icon: FileText,
      color: '#F59E0B',
      status: 'future'
    },
    {
      id: '3',
      type: 'exam',
      title: 'Database Management Exam',
      description: 'Mid-semester examination',
      date: '2024-02-20',
      time: '10:00 AM',
      icon: GraduationCap,
      color: '#EF4444',
      status: 'future'
    },
    {
      id: '4',
      type: 'event',
      title: 'Tech Workshop',
      description: 'Web development workshop by industry experts',
      date: '2024-02-22',
      time: '02:00 PM',
      icon: CalendarDays,
      color: '#10B981',
      status: 'future'
    },
    {
      id: '5',
      type: 'assignment',
      title: 'Software Engineering Project',
      description: 'Final project submission deadline',
      date: '2024-02-25',
      time: '11:59 PM',
      icon: FileText,
      color: '#F59E0B',
      status: 'future'
    },
    {
      id: '6',
      type: 'exam',
      title: 'Computer Networks Exam',
      description: 'End-semester examination',
      date: '2024-02-28',
      time: '09:00 AM',
      icon: GraduationCap,
      color: '#EF4444',
      status: 'future'
    },
    {
      id: '7',
      type: 'event',
      title: 'Faculty Meeting',
      description: 'Monthly faculty coordination meeting',
      date: '2024-02-14',
      time: '03:00 PM',
      icon: CalendarDays,
      color: '#10B981',
      status: 'present'
    },
    {
      id: '8',
      type: 'assignment',
      title: 'Web Development Quiz',
      description: 'Online quiz on HTML, CSS, and JavaScript',
      date: '2024-02-16',
      time: '02:00 PM',
      icon: FileText,
      color: '#F59E0B',
      status: 'future'
    }
  ];

  const filteredScheduleData = selectedFilter === 'all' 
    ? scheduleData 
    : scheduleData.filter(item => item.type === selectedFilter);
  
  const stats = [
    { label: 'CGPA', value: '8.7', icon: TrendingUp, color: theme.colors.accent },
    { label: 'Attendance', value: '92%', icon: Calendar, color: theme.colors.accent },
    { label: 'Completed', value: '15', icon: Award, color: theme.colors.accent },
    { label: 'Pending', value: '3', icon: Target, color: theme.colors.accent },
  ];

  const normalizeRegNo = (value: string) => value.replace(/\s+/g, '');
  const isValidDobFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
  const handleCAResultSubmit = () => {
    const reg = normalizeRegNo(studentDetails.registrationNo);
    const dob = studentDetails.dateOfBirth;
    if (!reg || !dob) return;
    if (!/^\d+$/.test(reg)) return;
    if (!isValidDobFormat(dob)) return;

    const match = sampleStudents.find(s => normalizeRegNo(s.regNo) === reg && s.dob === dob);
    if (!match) return;

    setShowCAResultModal(false);
    setStudentDetails({ registrationNo: '', dateOfBirth: '' });
    router.push({ pathname: '/(student-tabs)/ca-results', params: { regNo: reg, dob } });
  };

  const handleFilterSelect = (filterType: string) => {
    setSelectedFilter(filterType);
    setShowFilterModal(false);
  };

  const isFormComplete = studentDetails.registrationNo && studentDetails.dateOfBirth;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return { icon: Target, color: theme.colors.accent, bg: 'rgba(255, 199, 2, 0.15)' };
      case 'announcement':
        return { icon: Bell, color: theme.colors.accent, bg: 'rgba(255, 199, 2, 0.15)' };
      case 'event':
        return { icon: Calendar, color: theme.colors.accent, bg: 'rgba(255, 199, 2, 0.15)' };
      default:
        return { icon: Bell, color: theme.colors.accent, bg: 'rgba(255, 199, 2, 0.15)' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const renderScheduleCard = ({ item }: { item: any }) => {
    const IconComponent = item.icon;
    const daysUntil = getDaysUntil(item.date);
    
    return (
      <View style={styles.scheduleCard}>
        <View style={[styles.scheduleIcon, { backgroundColor: `${item.color}20` }]}>
          <IconComponent size={24} color={item.color} strokeWidth={2.5} />
        </View>
        
        <View style={styles.scheduleContent}>
          <View style={styles.scheduleHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.scheduleTitle}>{item.title}</Text>
            </View>
            <View style={[styles.typeBadge, { backgroundColor: `${item.color}20` }]}>
              <Text style={[styles.typeText, { color: item.color }]}>{item.type}</Text>
            </View>
          </View>
          
          <Text style={styles.scheduleDescription}>{item.description}</Text>
          
          <View style={styles.scheduleFooter}>
            <View style={styles.dateTimeContainer}>
              <Calendar size={14} color={theme.colors.accent} strokeWidth={2} />
              <Text style={styles.scheduleDate}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={14} color={theme.colors.accent} strokeWidth={2} />
              <Text style={styles.scheduleTime}>{item.time}</Text>
            </View>
            <View style={[styles.daysUntilBadge, { 
              backgroundColor: item.status === 'past' ? '#6B7280' : 
                             daysUntil === 'Today' || daysUntil === 'Tomorrow' ? '#EF4444' : '#F59E0B' 
            }]}>
              <Text style={styles.daysUntilText}>{item.status === 'past' ? 'Past' : daysUntil}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNotificationCard = ({ item }: { item: any }) => {
    const iconConfig = getNotificationIcon(item.type);
    const IconComponent = iconConfig.icon;
    
    return (
      <TouchableOpacity style={styles.notificationCard}>
        <View style={[styles.notificationIcon, { backgroundColor: iconConfig.bg }]}>
          <IconComponent size={20} color={iconConfig.color} strokeWidth={2.5} />
        </View>
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTypeBadge}>
            <Text style={styles.typeText}>{item.type}</Text>
          </View>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <View style={styles.notificationFooter}>
            <View style={styles.timeContainer}>
              <Clock size={12} color={theme.colors.accent} strokeWidth={2} />
              <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubjectCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.subjectCard}
      onPress={() => router.push(`/subject/${item.id}`)}
    >
      <View style={styles.subjectGradient}>
        <BookOpen size={28} color="#02462D" strokeWidth={2.5} />
      </View>
      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.name}</Text>
        <Text style={styles.subjectCode}>{item.code}</Text>
        <View style={styles.creditsBadge}>
          <Text style={styles.creditsText}>{item.credits} Credits</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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

  const renderUpcomingAssignment = ({ item }: { item: any }) => (
    <View style={styles.assignmentPreview}>
      <View style={styles.assignmentDot} />
      <View style={styles.assignmentContent}>
        <Text style={styles.assignmentTitle}>{item.title}</Text>
        <View style={styles.assignmentMeta}>
          <Clock size={12} color="#FFC702" />
          <Text style={styles.assignmentDue}>{item.daysLeft} days left</Text>
        </View>
      </View>
    </View>
  );

  if (showSchedule) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowSchedule(false)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedule & Events</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
              <Filter size={20} color={theme.colors.accent} strokeWidth={2.5} />
            </TouchableOpacity>
            
            {/* Filter Dropdown */}
            {showFilterModal && (
              <View style={styles.filterDropdown}>
                <TouchableOpacity 
                  style={[styles.filterDropdownOption, selectedFilter === 'all' && styles.filterDropdownOptionActive]}
                  onPress={() => handleFilterSelect('all')}
                >
                  <Text style={[styles.filterDropdownText, selectedFilter === 'all' && styles.filterDropdownTextActive]}>
                    All Events
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterDropdownOption, selectedFilter === 'event' && styles.filterDropdownOptionActive]}
                  onPress={() => handleFilterSelect('event')}
                >
                  <CalendarDays size={16} color={selectedFilter === 'event' ? theme.colors.accent : theme.colors.textMuted} />
                  <Text style={[styles.filterDropdownText, selectedFilter === 'event' && styles.filterDropdownTextActive]}>
                    Events
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterDropdownOption, selectedFilter === 'assignment' && styles.filterDropdownOptionActive]}
                  onPress={() => handleFilterSelect('assignment')}
                >
                  <FileText size={16} color={selectedFilter === 'assignment' ? theme.colors.accent : theme.colors.textMuted} />
                  <Text style={[styles.filterDropdownText, selectedFilter === 'assignment' && styles.filterDropdownTextActive]}>
                    Assignments
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.filterDropdownOption, selectedFilter === 'exam' && styles.filterDropdownOptionActive]}
                  onPress={() => handleFilterSelect('exam')}
                >
                  <GraduationCap size={16} color={selectedFilter === 'exam' ? theme.colors.accent : theme.colors.textMuted} />
                  <Text style={[styles.filterDropdownText, selectedFilter === 'exam' && styles.filterDropdownTextActive]}>
                    Exams
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsText}>{filteredScheduleData.length} {selectedFilter === 'all' ? 'upcoming events' : selectedFilter + 's'}</Text>
          
          <FlatList
            data={filteredScheduleData}
            renderItem={renderScheduleCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scheduleList}
            scrollEnabled={false}
          />
        </ScrollView>

        {/* Overlay to close dropdown when clicking outside */}
        {showFilterModal && (
          <TouchableOpacity 
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          />
        )}
      </SafeAreaView>
    );
  }

  if (showNotifications) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setShowNotifications(false)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications & Updates</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsText}>{sampleNotifications.length} notifications</Text>
          
          <FlatList
            data={sampleNotifications}
            renderItem={renderNotificationCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
            scrollEnabled={false}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.studentName}>{passedName ? passedName : 'Student'}</Text>
            <Text style={styles.semesterInfo}>Semester {passedSemester ? passedSemester : '—'} • {passedDepartment}</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(true)}
          >
            <Bell size={24} color={theme.colors.primary} strokeWidth={2.5} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Academic Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map(renderStatCard)}
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(student-tabs)/assignments')}>
              <FileText size={24} color={theme.colors.primary} strokeWidth={2.5} />
              <Text style={styles.quickActionText}>View Tasks</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(student-tabs)/subjects')}>
              <BookOpen size={24} color={theme.colors.primary} strokeWidth={2.5} />
              <Text style={styles.quickActionText}>Browse Subjects</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setShowCAResultModal(true)}>
              <Trophy size={24} color={theme.colors.primary} strokeWidth={2.5} />
              <Text style={styles.quickActionText}>CA Result</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => setShowSchedule(true)}>
              <Calendar size={24} color={theme.colors.primary} strokeWidth={2.5} />
              <Text style={styles.quickActionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
            <TouchableOpacity onPress={() => router.push('/(student-tabs)/assignments')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingAssignments}
            renderItem={renderUpcomingAssignment}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.subjectsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Subjects</Text>
            <TouchableOpacity onPress={() => router.push('/(student-tabs)/subjects')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sampleSubjects.slice(0, 3)}
            renderItem={renderSubjectCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* CA Result Modal */}
      <Modal
        visible={showCAResultModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCAResultModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CA Result</Text>
              <TouchableOpacity onPress={() => setShowCAResultModal(false)}>
                <X size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>Enter your details to view CA results</Text>
            
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Registration Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter 12-digit registration number"
                  keyboardType="numeric"
                  value={studentDetails.registrationNo}
                  onChangeText={(text) => setStudentDetails({...studentDetails, registrationNo: text})}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="YYYY-MM-DD"
                  value={studentDetails.dateOfBirth}
                  onChangeText={(text) => setStudentDetails({...studentDetails, dateOfBirth: text})}
                  maxLength={10}
                />
              </View>
            </View>
            
            {isFormComplete && (
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleCAResultSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
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
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: theme.colors.accent,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  studentName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  semesterInfo: {
    fontSize: 14,
    color: theme.colors.primary,
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
    backgroundColor: theme.colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
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
    color: theme.colors.accent,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    width: '47%',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: theme.colors.shadow,
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
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 30,
    paddingTop: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: theme.colors.accent,
    width: '47%',
    aspectRatio: 1.2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 8,
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  upcomingSection: {
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  assignmentPreview: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentDot: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 4,
    marginRight: 12,
  },
  assignmentContent: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  assignmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignmentDue: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  subjectsSection: {
    paddingHorizontal: 30,
    paddingTop: 32,
    paddingBottom: 32,
  },
  subjectCard: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subjectGradient: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.accent,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  subjectCode: {
    fontSize: 14,
    color: theme.colors.accent,
    marginBottom: 8,
  },
  creditsBadge: {
    backgroundColor: 'rgba(255, 199, 2, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  creditsText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 16,
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 48,
  },
  content: {
    paddingHorizontal: 30,
    paddingTop: 24,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  notificationsList: {
    paddingBottom: 32,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 199, 2, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    color: theme.colors.accent,
    fontWeight: '500',
  },
  notificationTypeBadge: {
    backgroundColor: 'rgba(255, 199, 2, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  scheduleList: {
    paddingBottom: 32,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scheduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  scheduleDescription: {
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scheduleDate: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  scheduleTime: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  daysUntilBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  daysUntilText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  filterButtonText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  filterModalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  filterModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  filterOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  filterOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  filterOptionTextActive: {
    color: theme.colors.primary,
  },
  filterContainer: {
    position: 'relative',
  },
  filterDropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 0,
    minWidth: 140,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  filterDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.glassBorder,
  },
  filterDropdownOptionActive: {
    backgroundColor: 'rgba(255, 199, 2, 0.1)',
  },
  filterDropdownText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textMuted,
  },
  filterDropdownTextActive: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
});