import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MarketPlace from './MarketPlace';
import ItemView from './ItemView';
import ProfileSetting from '../RenterComponents/ProfileSetting';
import LanderHome from '../LenderComponents/LenderHome';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'MarketPlace') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Marketplace" component={MarketPlace} />
      <Tab.Screen name="Profile" component={ProfileSetting} />
    </Tab.Navigator>
  );
};

const RenterHome = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="LanderHome" component={LanderHome} />
      <Stack.Screen
        name="ItemView"
        component={ItemView}
        options={() => ({
          title: 'Item Details',
        })}
      />
    </Stack.Navigator>
  );
};

export default RenterHome;