import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import CartItem from "../../models/cart-item";
import {ADD_ORDER} from "../actions/orders";

const inititalState = {
    items: {},
    totalAmount: 0
};

export default (state = inititalState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;

            let updateOrNewCartItem;

            if (state.items[addedProduct.id]) {
                updateOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    state.items[addedProduct.id].sum + productPrice
                );
            } else {
                updateOrNewCartItem = new CartItem(1, productPrice, productTitle, productPrice);
            }
            return {
                ...state,
                items: {...state.items, [addedProduct.id]: updateOrNewCartItem},
                totalAmount: state.totalAmount + productPrice,
            };


        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.pid];
            const currentQty = selectedCartItem.quantity;

            let updatedCartItems;

            if (currentQty > 1) {
                //need to reduce it
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = {...state.items, [action.pid]: updatedCartItem}
            } else {
                updatedCartItems = {...state.items};
                delete updatedCartItems[action.pid];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };


        case ADD_ORDER:
            return inititalState;
    }
    return state;
}