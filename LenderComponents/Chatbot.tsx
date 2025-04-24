import React, {useEffect, useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import GeminiService from './GeminiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8ff',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#dde',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccd',
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: '#f9faff',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4a80f5',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1ebff',
    borderBottomRightRadius: 6,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#dde',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  clearButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#f0f3fa',
  },
  clearButtonText: {
    color: '#4a80f5',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typing: {
    fontSize: 12,
    color: '#4a80f5',
    fontStyle: 'italic',
    marginBottom: 5,
    marginLeft: 10,
  },
  userInfo: {
    fontSize: 17,
    color: '#666',
    marginLeft: 15,
  },
});

const USER = {_id: 'usr1', name: 'Customer'};
const AI = {_id: 'ai', name: 'RentBuddy'};

// Helper to generate truly unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  
  const navigation = useNavigation();
  const route = useRoute();
  const auth = getAuth();

  useEffect(() => {
    // Get current user info
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName || 'User');
      setUserId(currentUser.uid);
    } else if (route.params?.userName) {
      // Fallback to params if provided
      setUserName(route.params.userName);
      setUserId(route.params.userId || route.params.userName);
    } else {
      // Default case
      setUserName('Guest');
      setUserId('guest');
    }
  }, [auth.currentUser, route.params]);

  useEffect(() => {
    // Only load chat history when userId is available
    if (userId) {
      loadChatHistory();
    }
  }, [userId]);

  useEffect(() => {
    // Save chat history whenever messages change
    if (messages.length > 0 && userId) {
      GeminiService.saveHistory(messages, userId);
    }
  }, [messages, userId]);

  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      const history = await GeminiService.loadHistory(userId);
      if (history.length > 0) {
        // Ensure all loaded messages have proper unique keys
        const validatedHistory = history.map(msg => {
          if (!msg._id || msg._id.indexOf('-') === -1) {
            return { ...msg, _id: generateUniqueId() };
          }
          return msg;
        });
        setMessages(validatedHistory);
      } else {
        // Initialize with welcome message if no history
        addMessage(AI, '');
        GeminiService.initialCompletion(onPartialCompletion, userName);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      Alert.alert('Error', 'Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const onPartialCompletion = ({token}) => {
    setMessages(prev =>
      prev.map((msg, index) => {
        if (index === 0 && msg.user._id === AI._id) {
          return {...msg, text: msg.text + token};
        }
        return msg;
      }),
    );
  };

  const addMessage = (user, text) => {
    setMessages(prev => {
      const message = {
        _id: generateUniqueId(),
        createdAt: new Date(),
        user,
        text,
      };
      return [message, ...prev];
    });
  };

  const handleSend = async () => {
    if (inputText.trim() && !isResponding) {
      setIsResponding(true);
      const userInput = inputText;
      setInputText('');
      
      // Add user message first
      const userMessageId = generateUniqueId();
      const aiMessageId = generateUniqueId();
      
      // Add messages with unique IDs
      setMessages(prev => [
        {
          _id: aiMessageId,
          createdAt: new Date(),
          user: AI,
          text: ''
        },
        {
          _id: userMessageId,
          createdAt: new Date(),
          user: USER,
          text: userInput
        },
        ...prev
      ]);
      
      try {
        // Get updated messages - we'll pass the current messages plus our new ones
        const updatedMessages = [
          {
            _id: aiMessageId,
            createdAt: new Date(),
            user: AI,
            text: ''
          },
          {
            _id: userMessageId,
            createdAt: new Date(),
            user: USER,
            text: userInput
          },
          ...messages
        ];
        
        await GeminiService.completion(userInput, onPartialCompletion, updatedMessages);
      } catch (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message');
      } finally {
        setIsResponding(false);
      }
    }
  };
  
  const clearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all chat history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await GeminiService.clearHistory(userId);
              setMessages([]);
              addMessage(AI, '');
              GeminiService.initialCompletion(onPartialCompletion, userName);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const renderMessage = ({item}) => {
    const isUser = item.user._id === USER._id;
    return (
      <View style={[
        styles.messageContainer, 
        isUser ? styles.userMessage : styles.aiMessage
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestampText}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>RentBuddy</Text>
            <Text style={styles.userInfo}>Hi, {userName}!</Text>
          </View>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearHistory}>
            <Text style={styles.clearButtonText}>New Chat</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
          keyboardVerticalOffset={80}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4a80f5" />
              <Text>Loading your conversation...</Text>
            </View>
          ) : (
            <>
              <FlatList
                style={styles.chatContainer}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item._id}
                inverted={true}
              />
              {isResponding && (
                <Text style={styles.typing}>RentBuddy is typing...</Text>
              )}
            </>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="What event are you planning?"
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                (inputText.trim() === '' || isResponding) && { opacity: 0.5 }
              ]} 
              onPress={handleSend}
              disabled={inputText.trim() === '' || isResponding}>
              <Text style={styles.sendButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default Chatbot;