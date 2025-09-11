import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Send, Eye, X } from 'lucide-react-native';
import { sampleStudents } from '@/data/facultyData';

export default function ManageStudentsPage() {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<{[key: string]: any[]}>({});
  const [showChatHistory, setShowChatHistory] = useState(false);

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
      <View style={styles.studentIcon}>
        <User size={24} color="#02462D" />
      </View>
      
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentReg}>Reg No: {item.regNo}</Text>
        <Text style={styles.studentSemester}>Semester {item.semester}</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleViewProfile(item.id)}
        >
          <Eye size={16} color="#02462D" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleSendMessage(item)}
        >
          <Send size={16} color="#02462D" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#02462D" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Students</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>All Students</Text>
        <Text style={styles.subtitle}>{sampleStudents.length} students enrolled</Text>
        
        <FlatList
          data={sampleStudents}
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
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFC702',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFC702',
    marginBottom: 20,
  },
  studentsList: {
    paddingBottom: 20,
  },
  studentCard: {
    backgroundColor: '#1A1A1A',
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
  studentIcon: {
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
    marginBottom: 2,
  },
  studentSemester: {
    fontSize: 12,
    color: '#FFC702',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  actionButton: {
    width: 24,
    height: 24,
    backgroundColor: '#FFC702',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  studentDetailsContainer: {
    flex: 1,
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