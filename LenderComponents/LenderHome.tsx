import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import YourListings from './YourListings';
import AddListings from './AddListings';
import ProfileSetting from './ProfileSetting';
import EditListing from './EditListing';
import ItemDetail from './ItemDetail';
import Chatbot from './Chatbot';
import MarketPlace from '../RenterComponents/MarketPlace';
import ItemView from '../RenterComponents/ItemView';
import PaymentCheckoutScreen from '../RenterComponents/PaymentCheckoutScreen';
import EditProfile from './EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';
          if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Listings') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'AI Chat') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Listings" component={MarketPlace} />
      <Tab.Screen name="AI Chat" component={Chatbot} />
      <Tab.Screen name="Profile" component={ProfileSetting} />
    </Tab.Navigator>
  );
};

const LenderHome = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="EditListing" component={EditListing} options={{ title: 'Edit Listing' }} />
      <Stack.Screen name="AddListings" component={AddListings} options={{ title: 'Add Listing' }} />
      <Stack.Screen name="ItemDetail" component={ItemDetail} options={{ title: 'Details' }} />
      <Stack.Screen name="Chatbot" component={Chatbot} />
      <Stack.Screen name="ItemView" component={ItemView} options={{ title: 'Details' }} />
      <Stack.Screen name="PaymentCheckoutScreen" component={PaymentCheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile' }} />
    </Stack.Navigator>
  );
};



export default LenderHome;