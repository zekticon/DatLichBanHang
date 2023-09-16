import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './authSlice';
import userReducer from './userSlice';
import brandReducer from './brandSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
const persistConfig = {
    key: 'rootDental',
    version: 1,
    whitelist: ['auth', 'cartRedux'],
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    brands: brandReducer,
    categories: categoryReducer,
    product: productReducer,
    cartRedux: cartReducer,
    order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export let persistor = persistStore(store);
