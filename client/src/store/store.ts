import { combineReducers, applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import {
  SignUpReducer,
  LogOutReducer,
  SignInReducer,
  isLoggedInReducer,
} from "./Reducers/Auth/Auth";
import { FetchAllOrdersReducers } from "./Reducers/FetchAllOrderReducer/FetchAllOrderReducer";

const initialState = {};

//Window Interface declaration type to work with TypeScript
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const reducer = combineReducers({
  userSignUpStatus: SignUpReducer,
  userSignInStatus: SignInReducer,
  useLogOutStatus: LogOutReducer,
  userAuthStatus: isLoggedInReducer,
  AllShipmentOrders: FetchAllOrdersReducers,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(thunk))
);

export default store;
