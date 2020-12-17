import {
  FETCH_ALL_ORDERS_FAIL,
  FETCH_ALL_ORDERS_REQUEST,
  FETCH_ALL_ORDERS_SUCCESS,
} from "../../Actions/FetchAllOrder/Actions";
import { Action } from "redux";

interface ReduxAction<T> extends Action {
  payload: T;
}

export const FetchAllOrdersReducers = (
  state = { ShipmentOrders: [] },
  action: ReduxAction<any>
) => {
  switch (action.type) {
    case FETCH_ALL_ORDERS_REQUEST:
      return { loading: true };
    case FETCH_ALL_ORDERS_SUCCESS:
      return { loading: false, ShipmentOrders: action.payload };

    case FETCH_ALL_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
