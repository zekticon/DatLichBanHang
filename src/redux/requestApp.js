import request from '~/utils/request';
import {
    addProductStart,
    addProductSuccess,
    addProductFail,
    deleteCartStart,
    deleteCartSuccess,
    deleteCartFail,
} from './cartSlice';
import { logoutCustomerStart, logoutCustomerSuccess, logoutCustomerFail } from './authSlice';
import config from '~/config';
export const addProductToCartRedux = async (dispatch, arr) => {
    dispatch(addProductStart());
    try {
        dispatch(addProductSuccess(arr));
        return;
    } catch (e) {
        console.log(e);
        dispatch(addProductFail());
    }
};

export const deleteCartRedux = async (dispatch) => {
    dispatch(deleteCartStart());
    try {
        dispatch(deleteCartSuccess());
        return;
    } catch (e) {
        console.log(e);
        dispatch(deleteCartFail());
    }
};

export const addProductToCart = async (data) => {
    try {
        let res = await request.post('/api/add-product-to-cart', data);
        console.log(res);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const logoutCustomer = async (dispatch) => {
    try {
        console.log('cjecllll');

        dispatch(logoutCustomerSuccess());
        return {
            errCode: 0,
        };
    } catch (e) {
        console.log(e);
        dispatch(logoutCustomerFail());

        // navigate(config.routes.loginAdmin);
    }
};
