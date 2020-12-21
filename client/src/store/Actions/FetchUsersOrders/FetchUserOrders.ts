import { Actions } from "./actions";
import { Dispatch } from "redux";
import axios from "axios";

export const FetchUserOrder = () => async (dispatch: Dispatch) => {
  const baseURL = {
    dev: "http://localhost:5000/api/fetch-user-orders",
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;
  try {
    dispatch({ type: Actions.FETCH_USER_ORDERS_REQUEST });
    const { data } = await axios.get(url, { withCredentials: true });
    dispatch({ type: Actions.FETCH_USER_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Actions.FETCH_USER_ORDERS_FAIL, payload: error });
  }
};
