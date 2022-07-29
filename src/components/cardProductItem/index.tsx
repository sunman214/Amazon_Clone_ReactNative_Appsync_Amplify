import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QuantitySelector from '../quantitySelector';
import {API, DataStore} from 'aws-amplify';
import * as mutations from '../../graphql/mutations';

interface CartProductItemProps {
  cartItem: CartProduct;
}

const CartProductItem = ({cartItem}: CartProductItemProps) => {
  //console.log('cartItem',cartItem)
  const {item, ...cartProduct} = cartItem;
  const [cardStart,setCardStart]=useState([])
  //const [quantity, setQuantity] = useState(quantityProp);

  /*  const updateQuantity = async (newQuantity: number) => {
    const original = await DataStore.query(CartProduct, cartProduct.id);
    console.log('original',original)
    await DataStore.save(
      CartProduct.copyOf(original, updated => {
        updated.quantity = newQuantity;
      })
    );
  } */
  const updateQuantity = () => {};
  const increment = () => {};
  const decrement = () => {};
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{
            uri: `${item.image}`,
          }}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {item.title}
          </Text>
          {/* Ratings */}
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((_e, i) => (
              <FontAwesome
                key={`${i}`}
                style={styles.star}
                name={i < Math.floor(item.avgRating) ? 'star' : 'star-o'}
                size={18}
                color={'#e47911'}
              />
            ))}
            <Text>{item.ratings}</Text>
          </View>
          <Text style={styles.price}>
            from {item.price}
            {item.oldPrice && (
              <Text style={styles.oldPrice}>{item.oldPrice}</Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <View style={{flexDirection: 'row'}}>
          <Pressable onPress={decrement} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Text style={styles.quantitys}>{cartProduct.quantity}</Text>
          <Pressable onPress={increment} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  row: {flexDirection: 'row'},
  page: {padding: 10},
  image: {flex: 2, height: 150, resizeMode: 'contain'},
  rightContainer: {padding: 10, flex: 3},
  starContainer: {flexDirection: 'row', alignItems: 'center'},
  star: {marginVertical: 5},
  title: {fontSize: 18},
  price: {fontSize: 18, fontWeight: 'bold'},
  oldPrice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  quantityContainer: {marginVertical: 10, marginLeft: 30},
  button: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d1d1',
  },
  buttonText: {},
  quantitys: {fontSize: 18, paddingHorizontal:10},
});
export default CartProductItem;
