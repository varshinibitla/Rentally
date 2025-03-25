import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import YourListings from './YourListings';
import AddListings from './AddListings';
import Settings from './Settings';

const Tab = createBottomTabNavigator();

const LenderHome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // Hide the header for tab screens
        }}
      >
        <Tab.Screen name="YourListings" component={YourListings} />
        <Tab.Screen name="AddListings" component={AddListings} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Light background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default LenderHome;