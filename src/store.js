import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { loadUser, setupInterceptors } from "./actions/authActions";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ),
);
setupInterceptors(store);

const token = localStorage.getItem("token");
if (token) {
  store.dispatch(loadUser());
}

export default store;
