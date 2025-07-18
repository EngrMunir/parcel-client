import authReducer from "../features/auth/authSlice";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist"
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web


const persistConfig ={
    key:'auth',
     storage,
  whitelist: ['auth'],
}

const persistedAuthReducer = persistReducer(persistConfig,authReducer);

export const store = configureStore({
    reducer:{
        [baseApi.reducerPath]:baseApi.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddlewares) => getDefaultMiddlewares({
        serializableCheck:{
            ignoredActions:[FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE,REGISTER],
        }
   
    }).concat(baseApi.middleware)
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistor = persistStore(store)