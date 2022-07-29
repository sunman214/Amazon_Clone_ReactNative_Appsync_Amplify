import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import {View, Text, TextInput, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();

interface HeaderComponentProps {
  searchValue: string;
  setSearchValue: () => void;
}

const HeaderComponent = ({
  searchValue,
  setSearchValue,
}: HeaderComponentProps) => {
  return (
    <View style={{backgroundColor: '#22e3dd'}}>
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
          padding: 5,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon name="search" size={16} color={'#22e3dd'} />
        <TextInput
          placeholder="Search..."
          style={{height: 32, marginLeft: 10, fontSize: 18}}
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
    </View>
  );
};

function Homestack() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <SafeAreaView style={{flex: 1}}>
      <Stack.Navigator
        screenOptions={{
          header: () => (
            <HeaderComponent
              searchValue={searchValue}
              setSearchValue={setSearchValue}
            />
          ),
        }}>
        <Stack.Screen name="HomeScreen" options={{title: 'Home'}}>
          {() => <HomeScreen searchValue={searchValue} />}
        </Stack.Screen>
        <Stack.Screen name="ProductDetail" component={ProductScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}
export default Homestack;
