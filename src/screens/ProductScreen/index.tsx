import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import QuantitySelector from '../../components/quantitySelector';
import Button from '../../components/button';
import ImageCarousel from '../../components/imageCarousel';
import {useRoute} from '@react-navigation/native';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';
import { useNavigation } from '@react-navigation/native';

const ProductScreen = () => {
  const [selectedOption, setSelectedOption] = useState();
  const [quantity, setQuantity] = useState(1);
  const [oneProductDetail, setOneProductDetail] = useState({});
  const Route = useRoute().params;
  const navigation = useNavigation();
  const idProduct = Route.id;
  const oneProduct = async () => {
    const res = await API.graphql(
      graphqlOperation(queries.getProduct, {id: `${idProduct}`}),
    );
    const result = await res.data.getProduct;
    const optionsResult = await result.options[0];
    setOneProductDetail(result);
    setSelectedOption(optionsResult);
  };
  useEffect(() => {
    if (
      !oneProductDetail ||
      oneProductDetail == undefined ||
      oneProductDetail == null
    ) {
      return <Text>Loading...</Text>;
    }
    oneProduct();
  },[]);

  const onAddToCart = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    if (!oneProductDetail || !userData) {
      return;
    }
    const newCartProduct = {
      userSub: userData.attributes.sub,
      quantity,
      option: selectedOption,
      productID:oneProductDetail.id,
    };
    await API.graphql({
      query: mutations.createCartProduct,
      variables: {input: newCartProduct},
    });
    navigation.navigate('ShoppingCart');
  };

  return (
    <ScrollView style={styles.root}>
      {/* Image carousel */}
      {Object.keys(oneProductDetail).length > 0 && (
        <ImageCarousel images={oneProductDetail.images} />
      )}
      {/* Option Selector */}
      {/* Price */}
      <Text style={styles.title}>{oneProductDetail.title}</Text>
      {oneProductDetail&&<Text style={styles.price}>
          from {oneProductDetail.price}
          {oneProductDetail.oldPrice && (
            <Text style={styles.oldPrice}>{oneProductDetail.oldPrice}</Text>
          )}
        </Text>}
      {/* Color options */}
      {Object.keys(oneProductDetail).length > 0&&<Picker
          selectedValue={selectedOption}
          onValueChange={itemValue => setSelectedOption(itemValue)}>
          {oneProductDetail.options.map(option => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>}
      {/* Description */}
      <Text style={styles.description}>{oneProductDetail.description}</Text>
      {/* Quantity selector */}
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      {/* Button */}
      <Button
        text={'Add To Cart'}
        onPress={onAddToCart}
        containerStyles={{backgroundColor: '#e3c985'}}
      />
      <Button
        text={'Buy Now'}
        onPress={() => {
          console.warn('Buy Now');
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {padding: 10, backgroundColor: 'white'},
  title: {fontSize: 18},
  price: {fontSize: 18, fontWeight: 'bold'},
  oldPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  description: {marginVertical: 10, lineHeight: 20},
});
export default ProductScreen;
