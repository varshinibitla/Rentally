import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Linking } from 'react-native';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([
    { from: 'bot', text: 'Hey! Ask me anything about renting items 🤝' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
  
    const userMessage = { from: 'user', text: input };
    let botReply = "I'm not sure yet, but I’ll be smarter soon 🤖";
  
    const lower = input.toLowerCase();
    if (lower.includes('camera')) {
      botReply = "We have DSLRs, GoPros, and tripods!";
    } else if (lower.includes('price')) {
      botReply = "Prices vary — check YourListings for current rates.";
    } else if (lower.includes('rent')) {
      botReply = "You can rent items from Add Listings or search available ones!";
    } else if (lower.includes('hello') || lower.includes('hi')) {
      botReply = "Hello there! How can I assist your rental needs today?";
    } else {
      botReply = "I didn't know that, but I searched it on Google for you!";
      
      // Delay to let UI update before opening browser
      setTimeout(() => {
        Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(input)}`);
      }, 500);
    }
  
    setMessages(prev => [...prev, userMessage, { from: 'bot', text: botReply }]);
    setInput('');
  };

  const renderItem = ({ item }: { item: { from: string; text: string } }) => (
    <Text style={item.from === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ask something..."
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  userText: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
  botText: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
});

export default Chatbot;