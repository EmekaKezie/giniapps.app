import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
import ztestSlice from "./slices/zestSlice";
import themeSlice from "./slices/themeSlice";
import builderSlice from "./slices/builderSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["themeReducer"],
  blacklist: [],
};

const reducers = combineReducers({
  ztestReducer: ztestSlice,
  themeReducer: themeSlice,
  builderReducer: builderSlice,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
