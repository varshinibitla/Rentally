import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { getAuth } from '@firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await getAuth().signOut();
      // Reset navigation stack back to SignIn
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignIn' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;