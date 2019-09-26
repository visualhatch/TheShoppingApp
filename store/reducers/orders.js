import {ADD_ORDER} from "../actions/orders";
import Order from "../../models/order";

const inititalState = {
    orders: []
};

export default (state = inititalState, action) => {
    switch (action.type) {
        case ADD_ORDER:
            const newOrder = new Order(
                new Date().toString(),
                action.orderData.items,
                action.orderData.amount,
                new Date()
            );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            };
    }

    return state;
}