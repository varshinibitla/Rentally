// SurveyScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { getDatabase, ref, update } from '@firebase/database';
import { getAuth } from '@firebase/auth';

const SurveyScreen = ({ route, navigation }) => {
  const { listing } = route.params;
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const auth = getAuth();

  const submit = async () => {
    if (!rating) return Alert.alert('Please enter a rating');
    const db = getDatabase();
    const postRef = ref(db, `listings/${listing.id}/ratings`);
    // append your new rating + optional comments
    // (you can decide how to store comments in your schema)
    await update(postRef, { /* e.g. push into array */ });
    Alert.alert('Thanks for your feedback!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{listing.itemName}</Text>
      <TextInput
        style={styles.input}
        placeholder="Rating (1–5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any comments?"
        multiline
        value={comments}
        onChangeText={setComments}
      />
      <Button title="Submit" onPress={submit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, padding: 10 }
});

export default SurveyScreen;
