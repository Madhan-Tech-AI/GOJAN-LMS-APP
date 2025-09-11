import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput, Image, Dimensions, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Camera, CreditCard as Edit3, LogOut, Mail, GraduationCap, TrendingUp, Calendar, Award, Settings, Download, X, Eye, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { sampleStudents } from '@/data/facultyData';

export default function ProfilePage() {
  const params = useLocalSearchParams();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  // Academic Calendar removed
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [transcriptData, setTranscriptData] = useState({ name: '', regNo: '' });
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [selectedCalDate, setSelectedCalDate] = useState<number | null>(null);
  const [selectedCalMonth, setSelectedCalMonth] = useState<number | null>(null);
  const [selectedCalEvents, setSelectedCalEvents] = useState<string[]>([]);

  // Get student data from sample data based on email
  const loggedInEmail = params.email as string;
  const studentData = sampleStudents.find(student => 
    student.email.toLowerCase() === loggedInEmail?.toLowerCase()
  ) || {
    name: 'P. Madhan Kumar',
    regNo: '110523243011',
    department: 'B.Tech Artificial Intelligence and Data Science',
    email: 'madhankumar070406@gmail.com',
    cgpa: 8.7,
    attendance: 92,
    semester: 5
  };

  const studentName = studentData.name;
  const studentRegNo = studentData.regNo;
  const studentDepartment = studentData.department;
  const studentEmail = studentData.email;

  const handleEditProfile = () => {};

  const handleChangePicture = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option:',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Gallery', onPress: () => pickImage('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    try {
      let result;
      if (source === 'camera') {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Camera permission is required to take photos.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
          Alert.alert('Permission Required', 'Gallery permission is required to select photos.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => router.replace('/student-login') },
      ]
    );
  };
  const achievements = [
    { title: 'Perfect Attendance', description: '100% attendance this month', icon: CheckCircle, color: '#10B981' },
    { title: 'Top Performer', description: 'Highest CGPA in class', icon: Award, color: '#F59E0B' },
    { title: 'Early Submitter', description: 'All assignments on time', icon: TrendingUp, color: '#8B5CF6' },
  ];

  const quickActions = [
    { title: 'View Transcript', icon: Eye, color: '#3B82F6', onPress: () => setShowTranscriptModal(true) },
    { title: 'Settings', icon: Settings, color: '#A8A8AA', onPress: () => setShowSettings(true) },
  ];

  const handleTranscriptSubmit = () => {
    if (!transcriptData.name || !transcriptData.regNo) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // Here you would typically make an API call to get the transcript data
    Alert.alert('Transcript Generated', `Name: ${transcriptData.name}\nRegistration: ${transcriptData.regNo}\n\nCollege Fee Details:\n- Tuition Fee: ₹50,000\n- Library Fee: ₹2,000\n- Lab Fee: ₹5,000\n- Total: ₹57,000`);
    setShowTranscriptModal(false);
    setTranscriptData({ name: '', regNo: '' });
  };

  const Calendar = () => {
    const year = new Date().getFullYear();
    return (
      <View>
        {Array.from({ length: 12 }, (_, m) => m).map((monthIndex) => {
          const screenWidth = Dimensions.get('window').width;
          const horizontalPadding = 24 * 2;
          const gaps = 6 * 8;
          const daySize = Math.floor((screenWidth - horizontalPadding - gaps) / 7);
          const firstDay = new Date(year, monthIndex, 1).getDay();
          const numDays = new Date(year, monthIndex + 1, 0).getDate();
          const blanks = Array.from({ length: firstDay });
          const days = Array.from({ length: numDays }, (_, i) => i + 1);
          const monthName = new Date(year, monthIndex).toLocaleString('default', { month: 'long' });
          return (
            <View key={`month-${monthIndex}`} style={{ marginBottom: 20 }}>
              <Text style={styles.calendarMonth}>{monthName} {year}</Text>
              <View style={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Text key={day + monthIndex} style={styles.calendarDayHeader}>{day}</Text>
                ))}
                {blanks.map((_, i) => (
                  <View key={`blank-${monthIndex}-${i}`} style={[styles.calendarDay, { width: daySize, height: daySize }]} />
                ))}
                {days.map((day) => {
                  const marked = (monthIndex === 11 && (day === 15 || day === 20 || day === 25));
                  const selected = selectedCalMonth === monthIndex && selectedCalDate === day;
                  return (
                    <TouchableOpacity
                      key={`day-${monthIndex}-${day}`}
                      style={[styles.calendarDay, { width: daySize, height: daySize }]}
                      onPress={() => {
                        setSelectedCalMonth(monthIndex);
                        setSelectedCalDate(day);
                        if (monthIndex === 11 && day === 15) setSelectedCalEvents(['Final Exams start', 'Lab Viva']);
                        else if (monthIndex === 11 && day === 20) setSelectedCalEvents(['Project Submission', 'Department Meetup']);
                        else if (monthIndex === 11 && day === 25) setSelectedCalEvents(['Holiday - Christmas']);
                        else setSelectedCalEvents(['No scheduled events']);
                      }}
                    >
                      <View style={[styles.dayInner, selected && styles.selectedDayInner]}>
                        <Text style={styles.calendarDayText}>{day}</Text>
                        {marked && <View style={styles.markedDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedCalMonth === monthIndex && selectedCalDate !== null && (
                <BlurView intensity={30} tint="dark" style={styles.blurCard}>
                  <View style={styles.blurContent}>
                    <Text style={styles.blurTitle}>{monthName} {selectedCalDate}, {year}</Text>
                    {selectedCalEvents.map((e, idx) => (
                      <Text key={`${monthIndex}-${selectedCalDate}-${idx}`} style={styles.blurItem}>• {e}</Text>
                    ))}
                  </View>
                </BlurView>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 40, height: 40 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicture}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <User size={48} color="#02462D" strokeWidth={2.5} />
              )}
            </View>
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangePicture}>
              <Camera size={16} color="#FFC702" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.studentName}>{studentName}</Text>
          <Text style={styles.studentId}>{studentRegNo}</Text>
          <Text style={styles.studentProgram}>{studentDepartment}</Text>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Academic Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#10B981" strokeWidth={2.5} />
              <Text style={styles.statValue}>{studentData.cgpa}</Text>
              <Text style={styles.statLabel}>CGPA</Text>
            </View>
            <View style={styles.statCard}>
              <CheckCircle size={24} color="#3B82F6" strokeWidth={2.5} />
              <Text style={styles.statValue}>{studentData.attendance}%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statCard}>
              <Award size={24} color="#F59E0B" strokeWidth={2.5} />
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}15` }]}>
                {achievement.icon && React.createElement(achievement.icon, { size: 20, color: achievement.color, strokeWidth: 2.5 })}
              </View>
              <View style={styles.achievementInfo}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard} onPress={action.onPress}>
                <action.icon size={20} color={action.color} strokeWidth={2.5} />
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Mail size={20} color="#FFC702" strokeWidth={2.5} />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{studentEmail}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <GraduationCap size={20} color="#FFC702" strokeWidth={2.5} />
              <Text style={styles.infoLabel}>Current Semester</Text>
            </View>
            <Text style={styles.infoValue}>Semester {studentData.semester}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" strokeWidth={2.5} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettings(false)} style={{ padding: 4 }}>
              <ArrowLeft size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Settings</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                thumbColor={notificationsEnabled ? '#FFC702' : '#999999'}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,199,2,0.4)' }}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Assignment Reminders</Text>
              <Switch
                value={assignmentReminders}
                onValueChange={setAssignmentReminders}
                disabled={!notificationsEnabled}
                thumbColor={assignmentReminders ? '#FFC702' : '#999999'}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,199,2,0.4)' }}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Deadline Alerts</Text>
              <Switch
                value={deadlineReminders}
                onValueChange={setDeadlineReminders}
                disabled={!notificationsEnabled}
                thumbColor={deadlineReminders ? '#FFC702' : '#999999'}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,199,2,0.4)' }}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Email Alerts</Text>
              <Switch
                value={emailAlerts}
                onValueChange={setEmailAlerts}
                thumbColor={emailAlerts ? '#FFC702' : '#999999'}
                trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(255,199,2,0.4)' }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Academic Calendar Modal removed as requested */}

      {/* Transcript Modal */}
      <Modal visible={showTranscriptModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTranscriptModal(false)} style={{ padding: 4 }}>
              <ArrowLeft size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>View Transcript</Text>
            <View style={{ width: 24 }} />
          </View>
          <ScrollView style={styles.modalContent}>
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Student Name</Text>
              <TextInput
                style={styles.formInput}
                value={transcriptData.name}
                onChangeText={(text) => setTranscriptData(prev => ({ ...prev, name: text }))}
                placeholder="Enter your full name"
                placeholderTextColor="#A8A8AA"
              />
              
              <Text style={styles.formLabel}>Registration Number</Text>
              <TextInput
                style={styles.formInput}
                value={transcriptData.regNo}
                onChangeText={(text) => setTranscriptData(prev => ({ ...prev, regNo: text }))}
                placeholder="Enter your registration number"
                placeholderTextColor="#A8A8AA"
              />
              
              <TouchableOpacity style={styles.submitButton} onPress={handleTranscriptSubmit}>
                <Text style={styles.submitButtonText}>Generate Transcript</Text>
              </TouchableOpacity>
            </View>
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
  editButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    backgroundColor: '#FFC702',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    backgroundColor: '#02462D',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#02462D',
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    color: '#FFC702',
    marginBottom: 4,
  },
  studentProgram: {
    fontSize: 14,
    color: '#FFC702',
  },
  statsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#FFC702',
  },
  quickActionsSection: {
    marginBottom: 32,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
    textAlign: 'center',
  },
  infoSection: {
    gap: 12,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#FFC702',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  settingToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  settingValue: {
    fontSize: 14,
    color: '#FFC702',
    fontWeight: '500',
  },
  calendarContainer: {
    paddingVertical: 20,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  calendarDayHeader: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC702',
    paddingVertical: 8,
  },
  calendarDay: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayInner: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayInner: {
    backgroundColor: 'rgba(255, 199, 2, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 199, 2, 0.6)',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  markedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFC702',
    position: 'absolute',
    bottom: 6,
  },
  blurCard: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blurContent: {
    padding: 16,
  },
  blurTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  blurItem: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  formContainer: {
    paddingVertical: 20,
  },
  formLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  formInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  submitButton: {
    backgroundColor: '#FFC702',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#02462D',
  },
});