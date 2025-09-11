import * as React from 'react';
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { GraduationCap, Mail, Lock, User, Calendar } from 'lucide-react-native';

import { sampleStudents } from '@/data/facultyData';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [semester, setSemester] = useState('1');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [showSemesterQuestions, setShowSemesterQuestions] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<any | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    const matched = sampleStudents.find(s => s.email.toLowerCase() === email.toLowerCase() && s.password === password);
    if (!matched) {
      Alert.alert('Error', 'Invalid email or password');
      return;
    }
    // Pre-fill known fields from matched user
    setRegistrationNumber(matched.regNo);
    setSemester(String(matched.semester));
    setMatchedStudent(matched);
    setShowSemesterQuestions(true);
  };

  const handleNext = () => {
    if (!semester || !registrationNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const student = matchedStudent ?? sampleStudents.find(s => s.regNo === registrationNumber);
    const name = student?.name ?? 'Student';
    const dept = student?.department ?? 'Artificial Intelligence and Data Science';
    const emailToPass = student?.email ?? email;
    router.push({ pathname: '/(student-tabs)', params: { name, semester, regNo: registrationNumber, department: dept, email: emailToPass } });
  };

  if (showSemesterQuestions) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
              <View style={styles.content}>
                <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <GraduationCap size={48} color="#02462D" strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>Student Information</Text>
            <Text style={styles.subtitle}>Please provide additional details to complete setup</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Which Semester?</Text>
              <View style={styles.pickerContainer}>
                <Calendar size={20} color="#FFC702" strokeWidth={2} />
                <Picker
                  selectedValue={semester}
                  onValueChange={(itemValue) => setSemester(itemValue)}
                  style={styles.picker}
                  dropdownIconColor="#A8A8AA"
                  mode="dialog"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <Picker.Item key={sem} label={`Semester ${sem}`} value={sem.toString()} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registration Number</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#FFC702" strokeWidth={2} />
                <TextInput
                  style={styles.input}
                  value={registrationNumber}
                  onChangeText={setRegistrationNumber}
                  placeholder="Enter registration number"
                  placeholderTextColor="#A8A8AA"
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Complete Setup</Text>
            </TouchableOpacity>
          </View>
        </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <View style={styles.headerSection}>
                      <View style={styles.iconContainer}>
              <GraduationCap size={48} color="#02462D" strokeWidth={2.5} />
            </View>
          <Text style={styles.title}>Student Login</Text>
          <Text style={styles.subtitle}>Access your courses, assignments and academic progress</Text>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
                              <Mail size={20} color="#FFC702" strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#A8A8AA"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
                              <Lock size={20} color="#FFC702" strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#A8A8AA"
                secureTextEntry
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#FFC702',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: '#1A1A1A',
    padding: 28,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#FFC702',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 12,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#FFC702',
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  picker: {
    flex: 1,
    height: 50,
    color: '#ffffff',
  },
  loginButton: {
    backgroundColor: '#FFC702',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: '#02462D',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FFC702',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FFC702',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#02462D',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#FFC702',
    fontSize: 14,
    fontWeight: '500',
  },
});