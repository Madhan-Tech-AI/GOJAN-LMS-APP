import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Mail, GraduationCap, TrendingUp, Calendar, BookOpen, CheckCircle, Clock } from 'lucide-react-native';
import { sampleStudents } from '@/data/facultyData';

export default function StudentDetailPage() {
  const { id } = useLocalSearchParams();
  const student = sampleStudents.find(s => s.id === id);

  // Mock assignment data for demonstration
  const assignmentData = [
    { subject: 'Data Structures', submitted: 8, pending: 2 },
    { subject: 'Algorithms', submitted: 6, pending: 4 },
    { subject: 'Database Systems', submitted: 7, pending: 3 },
    { subject: 'Machine Learning', submitted: 5, pending: 5 },
  ];

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Student not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#02462D" />
        </TouchableOpacity>
        <Text style={styles.title}>Student Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profilePicture}>
            <User size={48} color="#FFC702" />
          </View>
          
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentReg}>{student.regNo}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Mail size={20} color="#FFC702" />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{student.email}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <GraduationCap size={20} color="#FFC702" />
              <Text style={styles.infoLabel}>Current Semester</Text>
            </View>
            <Text style={styles.infoValue}>Semester {student.semester}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <TrendingUp size={20} color="#FFC702" />
              <Text style={styles.infoLabel}>CGPA</Text>
            </View>
            <Text style={styles.infoValue}>{student.cgpa}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Calendar size={20} color="#FFC702" />
              <Text style={styles.infoLabel}>Attendance</Text>
            </View>
            <Text style={styles.infoValue}>{student.attendance}%</Text>
          </View>
        </View>

        <View style={styles.assignmentSection}>
          <Text style={styles.sectionTitle}>Assignment Status</Text>
          <Text style={styles.sectionSubtitle}>Submitted and Pending assignments by subject</Text>
          
          {assignmentData.map((assignment, index) => (
            <View key={index} style={styles.assignmentCard}>
              <View style={styles.assignmentHeader}>
                <BookOpen size={20} color="#FFC702" />
                <Text style={styles.subjectName}>{assignment.subject}</Text>
              </View>
              
              <View style={styles.assignmentStats}>
                <View style={styles.statItem}>
                  <CheckCircle size={16} color="#4CAF50" />
                  <Text style={styles.statLabel}>Submitted</Text>
                  <Text style={styles.statValue}>{assignment.submitted}</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Clock size={16} color="#FF9800" />
                  <Text style={styles.statLabel}>Pending</Text>
                  <Text style={styles.statValue}>{assignment.pending}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFC702',
    borderBottomWidth: 1,
    borderBottomColor: '#02462D',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02462D',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profilePicture: {
    width: 96,
    height: 96,
    backgroundColor: '#1A1A1A',
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 4,
  },
  studentReg: {
    fontSize: 16,
    color: '#A8A8AA',
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
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#A8A8AA',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
  },
  assignmentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#A8A8AA',
    marginBottom: 16,
  },
  assignmentCard: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  assignmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
  },
  assignmentStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLabel: {
    fontSize: 14,
    color: '#A8A8AA',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});