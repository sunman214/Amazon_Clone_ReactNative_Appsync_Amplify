/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet,FlatList,Text, Pressable,Image } from 'react-native';
import Button from '../../components/button';
import { useNavigation } from '@react-navigation/native';
import { API, Auth, DataStore, Predicates } from 'aws-amplify';
import * as queries from '../../graphql/queries';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as mutations from '../../graphql/mutations';
import {CartProduct} from '../../models';


const ShoppingCartScreen = () => {
  const [carts,setCards] = useState([]);
  const [finalPrice,setFinalPrice] = useState(0);
  const [count, setCount] = useState(1);
  const [changeQuantity,setChangeQuantity] = useState(0);
  const [idCartQuantity,setIdCartQuantity] = useState('');
  const navigation = useNavigation();

// Goi API lay list Car ve set State
  const listCartProducts = async () => {
    setCount(count=>count + 1);
    console.log('Đây là lần chạy thứ:',count);
    const res  = await API.graphql({ query: queries.listCartProducts });
    const resultCards = await res.data.listCartProducts.items;
    const listProducts = await API.graphql({ query: queries.listProducts });
    const resultProduct = await listProducts.data.listProducts.items;
    if (resultCards.length > 0 && resultProduct.length > 0) {
      const final = resultCards.map((item: { productID: any; })=>
        ({...item,item:resultProduct.find((p: { id: any; }) => p.id === item.productID)})
      );
      setCards(final);
    }
  };

  useEffect(()=>{
      listCartProducts();
  },[]);
  type NewType = void;

  // tinh tong gia tien cac san pham
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getTotalPrice(): NewType {
    const toltalPrices = carts.reduce((summmedPrice, cart) => (
      summmedPrice + cart.item.price * cart.quantity
    ), 0);
    setFinalPrice(toltalPrices);
  }
  useEffect(()=>{getTotalPrice();},[carts, getTotalPrice]);
  // tang giam so luong hang hoa trong card
  const increment = (id: any)=>{
    carts.forEach(ntem => {
      if (ntem.id === id){
       const changeQuantityNumber = ntem.quantity += 1;
      setChangeQuantity(changeQuantityNumber);
      setIdCartQuantity(id);
      }
    });
    setCards([...carts]);
  };

  const decrement = (id: any)=>{
    carts.forEach(ntem => {
      if (ntem.id === id){
        const changeQuantityNumber = ntem.quantity === 1 ? ntem.quantity : ntem.quantity -= 1;
        setChangeQuantity(changeQuantityNumber);
      }
    });
    setCards([...carts]);
  };
  //lam sao day => đồng bộ có vấn đề, chạy lại 1 project mới hợp lý hơn, tìm hiểu cách lập mối quan hệ giữa các bảng

  // Update cartItem, phai chay 1 ham update roi, vi o tren moi la luu du lieu vao DataStore
const updateQuantity = async (newQuantity) => {
  // tao usersub cho model
  const userData = await Auth.currentAuthenticatedUser();
    if (!userData) {
      return;
    }
    const userSub = userData.attributes.sub;
// Xoa moi Model CartProduct trong DataStore
    //await Promise.all(CartProduct.map(cardItem => DataStore.delete(cardItem)));
    await DataStore.delete(CartProduct, Predicates.ALL);
    // Tao Datastore CartProduct
    await Promise.all(
      carts.map(cartItem =>
        DataStore.save(
          new CartProduct({
            id: cartItem.id,
            userSub:userSub,
            quantity: cartItem.quantity,
            option: cartItem.option,
            productID: cartItem.productID,
            product:[],
          })
        )));
    // update
  //const original = await DataStore.query(CartProduct,carts.id); //test xem model co update chua, da updated

  /* await DataStore.save(
    CartProduct.copyOf(original, updated => {
      updated.quantity = newQuantity;
    })
  ); */
  const subscription = DataStore.observe(CartProduct).subscribe(msg => {
    //console.log(msg.element);
  });
};
useEffect(()=>{
  updateQuantity(changeQuantity);
},[increment]);

  // bay gio update khi khach hang quyet dinh mua hang, khach Press Proceed to checkout
  async function onCheckout() {
    navigation.navigate('Address',{finalPrice})
  }




  return (
      <View style={styles.page}>
        <FlatList
        data={carts}
        renderItem={({item})=>(
        <View style={styles.root}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{
            uri: `${item.item.image}`,
          }}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {item.item.title}
          </Text>
          {/* Ratings */}
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((_e, i) => (
              <FontAwesome
                key={`${i}`}
                style={styles.star}
                name={i < Math.floor(item.item.avgRating) ? 'star' : 'star-o'}
                size={18}
                color={'#e47911'}
              />
            ))}
            <Text>{item.item.ratings}</Text>
          </View>
          <Text style={styles.price}>
            from {item.item.price}
            {item.item.oldPrice && (
              <Text style={styles.oldPrice}>{item.item.oldPrice}</Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <View style={{flexDirection: 'row'}}>
          <Pressable onPress={()=>{decrement(item.id);}} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </Pressable>
          <Text style={styles.quantitys}>{item.quantity}</Text>
          <Pressable onPress={()=>{increment(item.id);}} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={()=>(
          <View>
            <Text>Subtotal ({carts.length} items):
              <Text style={{color:'#e47911',fontWeight:'bold'}}>$ {finalPrice.toFixed(2)}</Text>
            </Text>
            <Button text="Proceed to checkout" onPress={onCheckout}
              containerStyles={{backgroundColor:'#f7e300',borderColor:'#c7b702',height:40}}
            />
        </View>
        )}
      />
      </View>
  );
};


export default ShoppingCartScreen;



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


