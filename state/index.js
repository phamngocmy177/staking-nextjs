import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import application from "./application/reducer";
import multicall from "./multicall/reducer";
import transactions from "./transactions/reducer";

// const PERSISTED_KEYS = ["transactions"];

// const store = configureStore({
//   reducer: {
//     application,
//     transactions,
//     multicall,
//     catalystPrograms,
//   },
//   middleware: [
//     ...getDefaultMiddleware({ thunk: false }),
//     save({ states: PERSISTED_KEYS, debounce: 1000 }),
//   ],
//   preloadedState: load({ states: PERSISTED_KEYS }),
// });

// // store.dispatch(updateVersion());

// export default store;

const rootReducer = combineReducers({
  application,
  transactions,
  multicall,
});

const makeStore = ({ isServer }) => {
  if (isServer) {
    //If it's on server side, create a store
    return configureStore({
      reducer: rootReducer,
      middleware: [...getDefaultMiddleware({ thunk: false })],
    });
  } else {
    //If it's on client side, create a store which will persist
    // const storage = storage.default

    const persistConfig = {
      key: "root",
      version: 1,
      whitelist: ["transactions"],
      storage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer); // Create a new reducer with our existing reducer

    const store = configureStore({
      reducer: persistedReducer,
      middleware: getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    });

    store.__persistor = persistStore(store); // This creates a persistor object & push that persisted object to .__persistor, so that we can avail the persistability feature

    return store;
  }
};
// Export the wrapper & wrap the pages/_app.js with this wrapper only

const wrapper = createWrapper(makeStore);

export default wrapper;
