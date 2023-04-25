import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import authReducer from "./state";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import persistReducer from "redux-persist/es/persistReducer";

// Configuration for Redux Persist
const persistConfig = {
  key: "root", // Key to identify the persisted data in storage
  storage, // Storage medium to use for persisting the data (e.g., local storage)
  version: 1, // Version number for the persisted data (optional)
};

// Create a persisted reducer by wrapping the original reducer with Redux Persist's persistReducer function
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure the Redux store using Redux Toolkit's configureStore function
const store = configureStore({
  // Use the persisted reducer as the root reducer
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Configure serializable action checking
      serializableCheck: {
        // Ignore certain actions to prevent serialization errors
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
