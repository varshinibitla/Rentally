import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the original model name
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const HISTORY_KEY_PREFIX = 'chat_history_';

// Define the AI's personality/role
const AI_PERSONA = `As an AI assistant for a rental company:
- Be simple, concise, and friendly in your responses
- Specialize in helping customers decide what to rent for events (beach parties, house warmings, birthdays, etc.)
- Focus on practical recommendations based on event type, guest count, and location
- Suggest specific rental items that would enhance their event
- Ask clarifying questions if needed to provide better recommendations
- Always be positive and enthusiastic about helping plan their event`;

class GeminiService {
  async saveHistory(messages, userId) {
    try {
      const key = `${HISTORY_KEY_PREFIX}${userId || 'default'}`;
      await AsyncStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  async loadHistory(userId) {
    try {
      const key = `${HISTORY_KEY_PREFIX}${userId || 'default'}`;
      const history = await AsyncStorage.getItem(key);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  async clearHistory(userId) {
    try {
      const key = `${HISTORY_KEY_PREFIX}${userId || 'default'}`;
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      return false;
    }
  }

  async completion(prompt, onPartial, chatHistory = []) {
    try {
      // Simplify the request format to match the example curl request
      const conversationMessages = [...chatHistory].reverse();
      const conversation = [];
      
      // Add AI persona as system instruction
      conversation.push(`System: ${AI_PERSONA}`);
      
      // Add the conversation history in a simple format
      for (let i = 0; i < conversationMessages.length; i++) {
        const message = conversationMessages[i];
        if (message.text.trim()) {
          const role = message.user._id === 'usr1' ? 'User' : 'Assistant';
          conversation.push(`${role}: ${message.text}`);
        }
      }
      
      // Add the current prompt if not already included
      const lastMessage = conversationMessages[0];
      if (!lastMessage || lastMessage.user._id !== 'usr1' || lastMessage.text !== prompt) {
        conversation.push(`User: ${prompt}`);
      }
      
      // Combine into a single text prompt
      const fullPrompt = conversation.join('\n\n');
      
      const res = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            { 
              parts: [
                { text: fullPrompt }
              ] 
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      onPartial({ token: text });
      return text;
    } catch (err) {
      console.error('Gemini error:', err?.response?.data || err.message);
      onPartial({ token: 'Something went wrong. Try again.' });
      return 'Something went wrong. Try again.';
    }
  }
  
  // This method is for the initial welcome message when there's no history
  async initialCompletion(onPartial, userName) {
    try {
      const userGreeting = userName ? `for ${userName}` : '';
      const welcomePrompt = `${AI_PERSONA}\n\nIntroduce yourself as RentBuddy, a helpful assistant for a rental company that specializes in event rentals ${userGreeting}. Keep it brief and ask what kind of event the customer is planning.`;
      
      const res = await axios.post(
        `${API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            { 
              parts: [
                { text: welcomePrompt }
              ] 
            }
          ],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 150,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const text = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      onPartial({ token: text });
      return text;
    } catch (err) {
      console.error('Gemini error:', err?.response?.data || err.message);
      const greeting = userName ? `Hi ${userName}!` : 'Hi!';
      const defaultMessage = `${greeting} I'm RentBuddy, your event rental assistant. What kind of event are you planning?`;
      onPartial({ token: defaultMessage });
      return defaultMessage;
    }
  }
}

export default new GeminiService();