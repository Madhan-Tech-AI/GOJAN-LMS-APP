import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GraduationCap, Users, ChevronRight } from 'lucide-react-native';

export default function RoleSelectionPage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.collegeHeader}>
          <Text style={styles.collegeName}>Gojan School of Business and Technology</Text>
          <Text style={styles.collegeQuote}>Empowering Education Through Technology</Text>
        </View>
        
        <View style={styles.headerSection}>
          <Text style={styles.title}>Choose Your Portal</Text>
          <Text style={styles.subtitle}>Select your role to access the Learning Management System</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, styles.studentButton]} 
            onPress={() => router.push('/student-login')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <GraduationCap size={48} color="#02462D" strokeWidth={2.5} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.roleButtonText}>Student Portal</Text>
                <Text style={styles.roleButtonSubtext}>Access your courses, assignments, and academic progress</Text>
              </View>
              <ChevronRight size={24} color="rgba(36, 70, 45, 0.7)" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleButton, styles.facultyButton]} 
            onPress={() => router.push('/faculty-login')}
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconContainer}>
                <Users size={48} color="#FFC702" strokeWidth={2.5} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.roleButtonText, { color: '#FFC702' }]}>Faculty Portal</Text>
                <Text style={[styles.roleButtonSubtext, { color: 'rgba(255, 199, 2, 0.8)' }]}>Manage courses, students, and academic content</Text>
              </View>
              <ChevronRight size={24} color="rgba(255, 199, 2, 0.7)" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02462D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  collegeHeader: {
    alignItems: 'center',
    marginBottom: 60,
  },
  collegeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 8,
    textAlign: 'center',
  },
  collegeQuote: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    gap: 20,
    marginBottom: 60,
  },
  roleButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  studentButton: {
    backgroundColor: '#FFC702',
  },
  facultyButton: {
    backgroundColor: '#02462D',
    borderWidth: 2,
    borderColor: '#FFC702',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  roleButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#02462D',
    marginBottom: 6,
  },
  roleButtonSubtext: {
    fontSize: 14,
    color: 'rgba(36, 70, 45, 0.8)',
    lineHeight: 20,
  },
});