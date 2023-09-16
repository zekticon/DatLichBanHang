import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false,
        },
        loginCustomer: {
            currentCustomer: null,
            isFetching: false,
            error: false,
        },

        logout: {
            isFetching: false,
            isLogout: false,
            error: false,
        },
        logoutCustomer: {
            isFetching: false,
            isLogout: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFail: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        loginCustomerStart: (state) => {
            state.loginCustomer.isFetching = true;
        },
        loginCustomerSuccess: (state, action) => {
            state.loginCustomer.isFetching = false;
            state.loginCustomer.currentCustomer = action.payload;
            state.loginCustomer.error = false;
        },
        loginCustomerFail: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },

        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
            state.logout.isLogout = true;

            state.logout.error = false;
        },
        logoutFail: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
        logoutCustomerStart: (state) => {
            state.logoutCustomer.isFetching = true;
        },
        logoutCustomerSuccess: (state) => {
            state.loginCustomer.currentCustomer = null;
        },
        logoutCustomerFail: (state) => {
            // state.logoutCustomer.isFetching = false;
            // state.logoutCustomer.error = true;
        },
    },
});

export const {
    loginStart,
    loginFail,
    loginSuccess,

    logoutStart,
    logoutSuccess,
    logoutFail,

    loginCustomerStart,
    loginCustomerSuccess,
    loginCustomerFail,

    logoutCustomerStart,
    logoutCustomerSuccess,
    logoutCustomerFail,
} = authSlice.actions;

export default authSlice.reducer;
