import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import countryList from 'country-list';
import Button from '../../components/button';
import {DataStore, Auth, API, graphqlOperation} from 'aws-amplify';
import {CartProduct} from '../../models';
import * as mutations from '../../graphql/mutations';
import {useNavigation, useRoute} from '@react-navigation/native';

const countries = countryList.getData();

const AddressScreen = () => {
  const [selectedNation, setSelectedNation] = useState();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressErr, setAddressErr] = useState('');
  const [city, setCity] = useState('');

  const navigation = useNavigation();
  const route = useRoute();
  const amount = Math.floor(route.params?.finalPrice * 100 || 0);


  useEffect(() => {
    initPayment();
  console.warn(Number.isInteger(amount));
  }, []);

  const fetchPaymentIntentClientSecret = async () => {
    const response = await API.graphql(
      graphqlOperation(mutations.createPaymentIntent, {input: amount}),
      console.log(response),
    );
  };
  const initPayment = async () => {
    await fetchPaymentIntentClientSecret();
  };

  const saveOrder = async () => {
    //get user details items
    const userData = await Auth.currentAuthenticatedUser();
    // create a new order
    try {
      const newOrder = await API.graphql({
        query: mutations.createOrder,
        variables: {
          input: {
            userSub: userData.attributes.sub,
            fullName,
            phone,
            country: selectedNation,
            city,
            address,
          },
        },
      });
      console.log('newOrder', newOrder);
    } catch (error) {
      console.log('ooops', error.message);
    }
    // create 1 new orderPoroduct

    //delete cartShopping

    //Hien thong bao ban da dat hang thanh cong

    // chuyen ve trang chu Home => Done
    //attack all cart items to the order
    /*  const cardItems = await DataStore.query(CartProduct, cp =>
      cp.userSub('eq', userData.attributes.sub),
    ); */

    //delete all cart items
    /*  await Promise.all(
      cardItems.map(cardItem =>
        DataStore.save(
          new OrderProduct({
            quantity: cardItem.quantity,
            option: cardItem.option,
            productID: cardItem.productID,
            orderID: new Order.id(),
          }),
        ),
      ),
    ); */
    //await Promise.all(cardItems.map(cardItem => DataStore.delete(cardItem)));
    //redirect home
    //navigation.navigate('Home');
  };

  const onCheckout = () => {
    if (addressErr) {
      Alert.alert('Fix all fields before submitting error');
      return;
    }
    if (!fullName) {
      Alert.alert('please enter your name');
      return;
    }
    if (!phone) {
      Alert.alert('please enter your phone');
      return;
    }
    //handle payment, nhấn nút checkout sẽ hiện ra stripe để thanh toán tiền
    //console.warn('ngon');
    //saveOrder();
    console.warn('succeed');
  };

  const validateAddress = () => {
    if (address.length < 6) {
      setAddressErr('Address is too short');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <View style={styles.root}>
        <View style={styles.row}>
          <Picker
            selectedValue={selectedNation}
            onValueChange={itemValue => setSelectedNation(itemValue)}>
            {countries.map(
              (country: {
                code: React.Key | null | undefined;
                name: string | undefined;
              }) => (
                <Picker.Item
                  key={country.code}
                  label={country.name}
                  value={country.code}
                />
              ),
            )}
          </Picker>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Full name (First and last name)</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Full name"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="Phone number"
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onEndEditing={validateAddress}
            onChangeText={text => {
              setAddress(text);
              setAddressErr('');
            }}
            style={styles.input}
            placeholder="Address"
          />
          {addressErr && <Text style={styles.addressErr}>{addressErr}</Text>}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>City</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholder="City"
          />
        </View>
        <Button text="Check out" onPress={onCheckout} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  root: {padding: 10},
  row: {},
  label: {fontWeight: 'bold'},
  addressErr: {color: 'red'},
  input: {
    backgroundColor: 'white',
    padding: 5,
    marginVertical: 5,
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 2,
  },
});
