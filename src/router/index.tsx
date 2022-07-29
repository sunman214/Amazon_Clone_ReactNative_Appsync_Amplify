import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './BottomTab';

const Root = createNativeStackNavigator();
function NavigationTab() {
  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{headerShown: false}}>
        <Root.Screen name="BottomTab" component={BottomTab} />
      </Root.Navigator>
    </NavigationContainer>
  );
}
export default NavigationTab;
