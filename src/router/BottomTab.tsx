import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AddressScreen from '../screens/AddressScreen';
import ProductScreen from '../screens/ProductScreen';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Homestack from './Homestack';
import ShoppingCardStack from './ShoppingCardStack';
import MenuScreen from '../screens/MenuScreen';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e47911',
        tabBarInactiveTintColor: '#ffbd7d',
      }}>
      <Tab.Screen
        name="Home"
        component={Homestack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Address"
        component={AddressScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon2 name="person" color={color} size={25} />
          ),
        }}
      />
       <Tab.Screen
        name="ShoppingCart"
        component={ShoppingCardStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({color, size}) => (
            <Icon name="shopping-cart" color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, size}) => (
            <Icon2 name="ios-menu" color={color} size={25} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTab;
