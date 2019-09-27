import React from 'react';

import { useSelector } from "react-redux";

import {FlatList, Text, StyleSheet, Platform} from 'react-native';
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";

import OrderItem from "../../components/shop/OrderItem";

const OrdersScreen = props => {

    const orders = useSelector(state => state.orders.orders);

 return (
     <FlatList
         data={orders}
         keyExtractor={item => item.id}
         renderItem={itemData =>
             <OrderItem
                 amount={itemData.item.totalAmount}
                 date={itemData.item.readableDate}
                 items={itemData.item.items}
             />}
     />
 );
};

OrdersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title={'Menu'}
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    }

};

const styles = StyleSheet.create({

});

export default OrdersScreen;