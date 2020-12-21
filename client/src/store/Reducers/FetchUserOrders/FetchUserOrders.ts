import { Actions } from "../../Actions/FetchUsersOrders/actions";
import { Action } from "redux";

interface ReduxActions<T> extends Action {
  payload: T;
}

export const FetchUsersOrders = (
  state = { userHistoryOrders: [] },
  action: ReduxActions<any>
) => {
  switch (action.type) {
    case Actions.FETCH_USER_ORDERS_REQUEST:
      return { loading: true };
    case Actions.FETCH_USER_ORDERS_SUCCESS:
      return { loading: false, userHistoryOrders: action.payload };
    case Actions.FETCH_USER_ORDERS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
