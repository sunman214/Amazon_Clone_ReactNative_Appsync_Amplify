/* eslint-disable prettier/prettier */
import React, {useState,useEffect} from 'react';
import { View, StyleSheet,FlatList } from 'react-native';
import ProductItem from '../../components/productItem';
import { API,graphqlOperation } from 'aws-amplify';
import * as queries from '../../graphql/queries';
import * as mutations from '../../graphql/mutations';

const HomeScreen = ({searchValue}:{searchValue:string}) => {
  const [products, setProducts] = useState([]);
  const fetchProducts = async() =>{
    const res = await (
      API.graphql({ query: queries.listProducts }) as Promise<ListProductsResult>
    );
    const result = await res.data.listProducts.items
    setProducts(result);
  };
  useEffect(() =>{
    fetchProducts();
  },[]);
  return (
      <View style={styles.page}>
        <FlatList
        data={products}
        renderItem={({item})=><ProductItem item={item}/>}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
      />
      </View>
  );
};

const styles = StyleSheet.create({
 page:{padding:10},
});
export default HomeScreen;
