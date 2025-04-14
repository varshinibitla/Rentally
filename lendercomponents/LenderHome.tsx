import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import YourListings from './YourListings';
import AddListings from './AddListings';
import Settings from './Settings';
import EditListing from './EditListing';
import MarketPlace from './MarketPlace';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'YourListings') {
            iconName = focused ? 'albums' : 'albums-outline';
          } else if (route.name === 'AddListings') {
            iconName = focused ? 'add' : 'add-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'MarketPlace') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="MarketPlace" component={MarketPlace} />
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
    </Stack.Navigator>
  );
};

export default LenderHome;