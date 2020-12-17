import Action from "./Actions";
import axios from "axios";
import { Dispatch } from "redux";

export const SignUp = (
  username: string,
  email: string,
  password: string,
  user_role: string
) => async (dispatch: Dispatch) => {
  const baseURL = {
    dev: `http://localhost:5000/api/user-signup/${user_role}`,
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;
  const form_data = new FormData();
  form_data.append("username", username);
  form_data.append("email", email);
  form_data.append("password", password);

  try {
    dispatch({ type: Action.SIGNUP_REQUEST });
    const { data } = await axios.post(url, form_data, {
      withCredentials: true,
    });
    dispatch({ type: Action.SIGNUP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Action.SIGNUP_FAIL, payload: error });
  }
};

export const SignIn = (username: string, password: string) => async (
  dispatch: Dispatch
) => {
  const baseURL = {
    dev: "http://localhost:5000/api/user-sigin",
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

  const form_data = new FormData();
  form_data.append("username", username);
  form_data.append("password", password);
  try {
    dispatch({ type: Action.SIGNIN_REQUEST });
    const { data } = await axios.post(url, form_data, {
      withCredentials: true,
    });
    dispatch({ type: Action.SIGNIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Action.SIGNIN_FAIL, payload: error });
  }
};

export const LogOut = () => async (dispatch: Dispatch) => {
  const baseURL = {
    dev: "http://localhost:5000/api/logout",
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

  try {
    dispatch({ type: Action.LOGOUT_REQUEST });
    const { status } = await axios.get(url, { withCredentials: true });
  } catch (error) {
    dispatch({ type: Action.LOGOUT_FAIL, payload: error });
  }
};

export const isAutheticated = () => async (dispatch: Dispatch) => {
  const baseURL = {
    dev: "http://localhost:5000/api/isLoggedIn",
    prod: "",
  };
  const url =
    process.env.NODE_ENV === "production" ? baseURL.prod : baseURL.dev;

  try {
    dispatch({ type: Action.CHECK_IS_AUTHENTICATED_REQUEST });
    const { data } = await axios.get(url, { withCredentials: true });
    dispatch({ type: Action.CHECK_IS_AUTHENTICATED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: Action.CHECK_IS_AUTHENTICATED_FAIL, payload: error });
  }
};
