import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Search, Send, Eye, TrendingUp, Calendar, Mail, X } from 'lucide-react-native';
import { sampleStudents } from '@/data/facultyData';

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<{[key: string]: any[]}>({});
  const [showChatHistory, setShowChatHistory] = useState(false);

  const filteredStudents = sampleStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProfile = (studentId: string) => {
    router.push(`/faculty/student-detail/${studentId}`);
  };

  const handleSendMessage = (student: any) => {
    setSelectedStudent(student);
    setMessage('');
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    
    const newMessage = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleString(),
      sender: 'Faculty',
      studentId: selectedStudent?.id,
      studentName: selectedStudent?.name
    };
    
    // Store message in history
    const updatedHistory = {
      ...messageHistory,
      [selectedStudent?.id]: [
        ...(messageHistory[selectedStudent?.id] || []),
        newMessage
      ]
    };
    setMessageHistory(updatedHistory);
    
    Alert.alert(
      'Message Sent', 
      `Message sent to ${selectedStudent?.name} successfully!`,
      [{ text: 'OK', onPress: () => {
        setShowMessageModal(false);
        setMessage('');
        setShowChatHistory(true);
      }}]
    );
  };

  const renderMessageHistory = () => {
    const messages = messageHistory[selectedStudent?.id] || [];
    
    if (messages.length === 0) {
      return (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages yet</Text>
          <Text style={styles.noMessagesSubtext}>Start a conversation with {selectedStudent?.name}</Text>
        </View>
      );
    }

    return (
      <View style={styles.chatHistoryContainer}>
        <Text style={styles.chatHistoryTitle}>Message History</Text>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageBubble}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageSender}>{msg.sender}</Text>
              <Text style={styles.messageTime}>{msg.timestamp}</Text>
            </View>
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderStudentCard = ({ item }: { item: any }) => (
    <View style={styles.studentCard}>
      <View style={styles.studentHeader}>
        <View style={styles.studentAvatar}>
          <User size={24} color="#ffffff" strokeWidth={2.5} />
        </View>
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentReg}>{item.regNo}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.viewButton]}
            onPress={() => handleViewProfile(item.id)}
          >
            <Eye size={16} color="#02462D" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => handleSendMessage(item)}
          >
            <Send size={16} color="#02462D" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.studentStats}>
        <View style={styles.statItem}>
          <TrendingUp size={14} color="#10B981" strokeWidth={2} />
          <Text style={styles.statText}>CGPA: {item.cgpa}</Text>
        </View>
        <View style={styles.statItem}>
          <Calendar size={14} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.statText}>Attendance: {item.attendance}%</Text>
        </View>
        <View style={styles.statItem}>
          <Mail size={14} color="#FFC702" strokeWidth={2} />
          <Text style={styles.statText}>Sem {item.semester}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Students</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#A8A8AA" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            placeholderTextColor="#A8A8AA"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.resultsText}>{filteredStudents.length} students found</Text>
        
        <FlatList
          data={filteredStudents}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.studentsList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        visible={showMessageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showChatHistory ? 'Chat History' : 'Send Message'}
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.toggleButton}
                onPress={() => setShowChatHistory(!showChatHistory)}
              >
                <Text style={styles.toggleButtonText}>
                  {showChatHistory ? 'New Message' : 'History'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <X size={24} color="#02462D" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentNameText}>To: {selectedStudent?.name}</Text>
              <Text style={styles.studentEmailText}>{selectedStudent?.email}</Text>
            </View>
            
            {showChatHistory ? (
              renderMessageHistory()
            ) : (
              <>
                <View style={styles.messageContainer}>
                  <Text style={styles.messageLabel}>Message</Text>
                  <TextInput
                    style={styles.messageInput}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Enter your message or notification..."
                    placeholderTextColor="#A8A8AA"
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
                
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowMessageModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={sendMessage}
                  >
                    <Send size={16} color="#02462D" strokeWidth={2.5} />
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
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
  studentsList: {
    paddingBottom: 24,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    backgroundColor: '#FFC702',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  studentReg: {
    fontSize: 14,
    color: '#FFC702',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewButton: {
    backgroundColor: '#FFC702',
  },
  messageButton: {
    backgroundColor: '#FFC702',
  },
  studentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleButton: {
    backgroundColor: 'rgba(36, 70, 45, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleButtonText: {
    color: '#02462D',
    fontSize: 14,
    fontWeight: '600',
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
  modalStudentInfo: {
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  studentNameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 4,
  },
  studentEmailText: {
    fontSize: 14,
    color: '#A8A8AA',
  },
  messageContainer: {
    marginBottom: 24,
  },
  messageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    minHeight: 120,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  cancelButtonText: {
    color: '#A8A8AA',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#FFC702',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendButtonText: {
    color: '#02462D',
    fontSize: 16,
    fontWeight: '600',
  },
  chatHistoryContainer: {
    flex: 1,
    marginBottom: 24,
  },
  chatHistoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC702',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFC702',
  },
  messageTime: {
    fontSize: 12,
    color: '#A8A8AA',
  },
  messageText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noMessagesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC702',
    marginBottom: 8,
  },
  noMessagesSubtext: {
    fontSize: 14,
    color: '#A8A8AA',
    textAlign: 'center',
  },
});