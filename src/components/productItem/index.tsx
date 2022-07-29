import React from 'react';
import {View, Text, StyleSheet, Image, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

interface ProductItemProps {
  item: {
    id: string;
    title: string;
    image: string;
    avgRating: number;
    ratings: number;
    price: number;
    oldPrice?: number;
  };
}

const ProductItem = ({item}: ProductItemProps) => {
  const navigation = useNavigation();
  const onPress = ()=>{
    navigation.navigate('ProductDetail',{id:item.id})
  }
  return (
    <Pressable onPress={onPress} style={styles.root}>
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
          {[1000, 1001, 1002, 1003, 1004].map((_e, i) => (
            <FontAwesome
              key={`${_e}`}
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
    </Pressable>
  );
};
const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
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
});
export default ProductItem;
