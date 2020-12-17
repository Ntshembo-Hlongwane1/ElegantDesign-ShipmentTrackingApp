import Actions from "../../Actions/Auth/Actions";
import { Action } from "redux";

interface ReduxAction<T> extends Action {
  payload: T;
}

export const SignUpReducer = (
  state = { signUpStatus: [] },
  action: ReduxAction<any>
) => {
  switch (action.type) {
    case Actions.SIGNUP_REQUEST:
      return { loading: true };

    case Actions.SIGNUP_SUCCESS:
      return { loading: false, signUpStatus: action.payload };

    case Actions.SIGNUP_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const SignInReducer = (
  state = { signInStatus: [] },
  action: ReduxAction<any>
) => {
  switch (action.type) {
    case Actions.SIGNIN_REQUEST:
      return { loading: true };
    case Actions.SIGNIN_SUCCESS:
      return { loading: false, signInStatus: action.payload };
    case Actions.SIGNIN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const LogOutReducer = (
  state = { logOutStatus: [] },
  action: ReduxAction<any>
) => {
  switch (action.type) {
    case Actions.LOGOUT_REQUEST:
      return { loading: true };
    case Actions.LOGOUT_SUCCESS:
      return { loading: false, logOutStatus: action.payload };
    case Actions.LOGOUT_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};

export const isLoggedInReducer = (
  state = { authStatus: [] },
  action: ReduxAction<any>
) => {
  switch (action.type) {
    case Actions.CHECK_IS_AUTHENTICATED_REQUEST:
      return { loading: true };
    case Actions.CHECK_IS_AUTHENTICATED_SUCCESS:
      return { loading: false, authStatus: action.payload };
    case Actions.CHECK_IS_AUTHENTICATED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
