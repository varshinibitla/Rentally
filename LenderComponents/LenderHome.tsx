import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YourListings from './YourListings';
import AddListings from './AddListings';
import Settings from './Settings';
import EditListing from './EditListing';
import ItemDetail from './ItemDetail';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="YourListings" component={YourListings} />
      <Tab.Screen name="AddListings" component={AddListings} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
};

const LenderHome = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="EditListing" component={EditListing} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} />
    </Stack.Navigator>
  );
};

export default LenderHome;
