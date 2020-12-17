import {
  FETCH_ALL_ORDERS_FAIL,
  FETCH_ALL_ORDERS_REQUEST,
  FETCH_ALL_ORDERS_SUCCESS,
} from "./Actions";
import axios from "axios";
import { Dispatch } from "redux";

export const FetchAllOrder = () => async (disptach: Dispatch) => {
  const baseURL = {
    dev: "http://localhost:5000/api/get-all-order",
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

  try {
    disptach({ type: FETCH_ALL_ORDERS_REQUEST });
    const { data } = await axios.get(url, { withCredentials: true });
    disptach({ type: FETCH_ALL_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    disptach({ type: FETCH_ALL_ORDERS_FAIL, payload: error });
  }
};
