import {
    loginFail,
    loginStart,
    loginSuccess,
    logoutStart,
    logoutSuccess,
    logoutFail,
    loginCustomerStart,
    loginCustomerSuccess,
    loginCustomerFail,
} from './authSlice';
import { login, loginCustomer, getAllUsers, getUserInfo } from '~/services/index';
import config from '~/config';
import {
    getUsersFail,
    getUsersStart,
    getUsersSuccess,
    getUsersInfoStart,
    getUsersInfoSuccess,
    getUsersInfoFail,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFail,
    createUserStart,
    createUserSuccess,
    createUserFail,
    editUserStart,
    editUserSuccess,
    editUserUserFail,
} from './userSlice';

import {
    getBrandsStart,
    getBrandsSuccess,
    getBrandsFail,
    createBrandStart,
    createBrandSuccess,
    createBrandFail,
    deleteBrandStart,
    deleteBrandSuccess,
    deleteBrandFail,
    editBrandStart,
    editBrandSuccess,
    editBrandFail,
} from './brandSlice';
import {
    getCategoryStart,
    getCategorySuccess,
    getCategoryFail,
    getCategoryStartAdmin,
    getCategorySuccessAdmin,
    getCategoryFailAdmin,
    getListCategoryStart,
    getListCategorySuccess,
    getListCategoryFail,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFail,
    editCategoryStart,
    editCategorySuccess,
    editCategoryFail,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFail,
} from './categorySlice';
import {
    getAllProductStart,
    getAllProductSuccess,
    getAllProductFail,
    createProductStart,
    createProductSuccess,
    createProductFail,
    deleteProductStart,
    deleteProductSuccess,
    deleteProductFail,
    getProductInfoStart,
    getProductInfoSuccess,
    getProductInfoFail,
    searchProductStart,
    searchProductSuccess,
    searchProductFail,
    LittleInFoAllProductStart,
    LittleInFoAllProductSuccess,
    LittleInFoAllProductFail,
} from './productSlice';
import { getAllOrderNewStart, getAllOrderNewSuccess, getAllOrderNewFail } from './orderSlice';
import request from '~/utils/request';

export const loginUser = async (email, password, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await login(email, password);
        dispatch(loginSuccess(res));

        console.log('check res login>>>', res);
        // if (res.errCode === 0) {
        //     if (res.user.roleId !== 'Admin') {
        //         navigate(config.routes.profile);
        //     } else {
        //         navigate(config.routes.dashboard);
        //     }
        // }

        return res;
    } catch (e) {
        dispatch(loginFail);
    }
};

export const loginCus = async (dispatch, email, password, navigate) => {
    dispatch(loginCustomerStart());
    try {
        const res = await loginCustomer(email, password);
        dispatch(loginCustomerSuccess(res));
        if (res.errCode === 0) {
            if (res.user.roleId !== 'Admin') {
                navigate(config.routes.home);
            } else {
                navigate(config.routes.customer_login);
            }
        }

        return res;
    } catch (e) {
        dispatch(loginCustomerFail);
    }
};

export const logoutUser = async (dispatch, axiosJWT, id, accessToken, navigate) => {
    console.log('check token', accessToken);

    try {
        dispatch(logoutStart());
        const res = await axiosJWT.get(`/api/logout?id=${id}`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(logoutSuccess());
            navigate(config.routes.loginAdmin);
        } else {
            console.log(res);
            dispatch(logoutFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(logoutFail());

        // navigate(config.routes.loginAdmin);
    }
};

export const getAllUsersRedux = async (accessToken, dispatch, axiosJWT, navigate) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get(`/api/getAllUsers`, { headers: { token: `Bearer ${accessToken}` } });

        if (res.data.errCode === 0) {
            dispatch(getUsersSuccess(res));
        } else {
            console.log(res);
        }
    } catch (e) {
        console.log(e);
        navigate(config.routes.loginAdmin);
        dispatch(getUsersFail());
    }
};

export const getDetailUser = async (id, accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersInfoStart());
    try {
        const res = await axiosJWT(`/api/getUserInfoById?id=${id}`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(getUsersInfoSuccess(res.data));
        } else {
            console.log(res);
        }
    } catch (e) {
        console.log(e);
        dispatch(getUsersInfoFail());
    }
};

export const handleEditUser = async (data, accessToken, dispatch, axiosJWT) => {
    dispatch(editUserStart());
    try {
        const res = await axiosJWT.put('/api/editUser', data, { headers: { token: `Bearer ${accessToken}` } });

        if (res.data.errCode === 0) {
            dispatch(editUserSuccess());
            dispatch(getUsersInfoSuccess(res.data));
            return res.data;
        } else {
            console.log(res.data);
            dispatch(editUserUserFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(editUserUserFail());
    }
};

export const deleteUserById = async (id, accessToken, dispatch, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete(`${process.env.REACT_APP_BACKEND_URL}api/deleteUser?id=${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.errCode === 0) {
            dispatch(deleteUserSuccess(res.data));

            await getAllUsersRedux(accessToken, dispatch, axiosJWT);
        } else {
            console.log(res);
            dispatch(deleteUserFail());
        }

        return res.data;
    } catch (e) {
        console.log(e);
        dispatch(deleteUserFail());
    }
};

export const createNewUser = async (data, accessToken, dispatch, axiosJWT) => {
    dispatch(createUserStart());
    try {
        const res = await axiosJWT.post(`${process.env.REACT_APP_BACKEND_URL}api/register`, data, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.errCode === 0) {
            dispatch(createUserSuccess());

            await getAllUsersRedux(accessToken, dispatch, axiosJWT);
        } else {
            console.log(res);
            dispatch(createUserFail());
        }

        return res.data;
    } catch (e) {
        console.log(e);
        dispatch(createUserFail());
    }
};

export const createNewCustomer = async (dispatch, data) => {
    dispatch(createUserStart());
    try {
        const res = await request.post('/api/registerCustomer', data);
        if (res.data.errCode === 0) {
            dispatch(createUserSuccess());
        } else {
            console.log(res);
            dispatch(createUserFail());
        }
        return res.data;
    } catch (e) {
        console.log(e);
        dispatch(createUserFail());
    }
};

export const createNewBrand = async (data, accessToken, dispatch, axiosJWT) => {
    dispatch(createBrandStart());
    try {
        const res = await axiosJWT.post(`/api/createNewBrand`, data, { headers: { token: `Bearer ${accessToken}` } });
        console.log(res);
        if (res.data.errCode === 0) {
            dispatch(createBrandSuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(createBrandFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(createBrandFail());
    }
};

export const getAllBrands = async (accessToken, dispatch, axiosJWT, navigate) => {
    dispatch(getBrandsStart());
    try {
        const res = await axiosJWT.get(`/api/getAllBrands`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(getBrandsSuccess(res));
        } else {
            console.log(res);
        }
    } catch (e) {
        console.log(e);
        navigate(config.routes.loginAdmin);
        dispatch(getBrandsFail());
    }
};

export const deleteBrand = async (dispatch, axiosJWT, id, accessToken) => {
    dispatch(deleteBrandStart());
    try {
        const res = await axiosJWT.delete(`/api/deleteBrand?id=${id}`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(deleteBrandSuccess());
            return res.data;
        } else {
            dispatch(deleteBrandFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(deleteBrandFail());
    }
};

export const editBrand = async (dispatch, axiosJWT, data, accessToken) => {
    dispatch(editBrandStart());
    try {
        const res = await axiosJWT.put('/api/editBrand', data, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(editBrandSuccess());
            return res.data;
        } else {
            dispatch(editBrandFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(editBrandFail());
    }
};

export const getAllCategoryAdmin = async (accessToken, dispatch, axiosJWT, navigate) => {
    dispatch(getCategoryStartAdmin());
    try {
        const res = await axiosJWT.get(`/api/getAllCategoryAdmin`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(getCategorySuccessAdmin(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(getCategoryFailAdmin());
        }
    } catch (e) {
        console.log(e);
        navigate(config.routes.loginAdmin);
        dispatch(getCategoryFailAdmin());
    }
};

export const getAllCategory = async (dispatch) => {
    dispatch(getCategoryStart());
    try {
        const res = await request.get(`/api/getAllCategory?limit=${20}`);
        if (res.data.errCode === 0) {
            dispatch(getCategorySuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(getCategoryFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(getCategoryFail());
    }
};

export const getListParentCategory = async (dispatch) => {
    dispatch(getListCategoryStart());
    try {
        const res = await request.get(`/api/getAllParentCategory?limit=${14}`);
        if (res.data.errCode === 0) {
            dispatch(getListCategorySuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(getListCategoryFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(getListCategoryFail());
    }
};

export const createNewCategory = async (data, accessToken, dispatch, axiosJWT) => {
    dispatch(createCategoryStart());
    try {
        const res = await axiosJWT.post(`/api/createNewCategory`, data, {
            headers: { token: `Bearer ${accessToken}` },
        });
        console.log(res);
        if (res.data.errCode === 0) {
            dispatch(createCategorySuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(createCategoryFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(createCategoryFail());
    }
};

export const editCategory = async (dispatch, axiosJWT, data, accessToken) => {
    dispatch(editCategoryStart());
    try {
        const res = await axiosJWT.put('/api/editCategory', data, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(editCategorySuccess());
            return res.data;
        } else {
            dispatch(editCategoryFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(editCategoryFail());
    }
};

export const deleteCategory = async (dispatch, axiosJWT, id, accessToken) => {
    dispatch(deleteCategoryStart());
    try {
        const res = await axiosJWT.delete(`/api/deleteCategory?id=${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.errCode === 0) {
            dispatch(deleteCategorySuccess());
            return res.data;
        } else {
            dispatch(deleteCategoryFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(deleteCategoryFail());
    }
};

export const getAllProduct = async (accessToken, dispatch, axiosJWT, navigate) => {
    dispatch(getAllProductStart());
    try {
        const res = await axiosJWT.get(`/api/getAllProduct`, { headers: { token: `Bearer ${accessToken}` } });
        if (res.data.errCode === 0) {
            dispatch(getAllProductSuccess(res));
            return res.data.data;
        } else {
            console.log(res);
            dispatch(getAllProductFail());
        }
    } catch (e) {
        console.log(e);
        navigate(config.routes.loginAdmin);
        dispatch(getAllProductFail());
    }
};

export const getAllProductLittleInfo = async (dispatch) => {
    dispatch(LittleInFoAllProductStart());
    try {
        const res = await request.get(`/api/getAllProductHome`);
        if (res.data.errCode === 0) {
            dispatch(LittleInFoAllProductSuccess());
            return res.data.data;
        } else {
            console.log(res);
            dispatch(LittleInFoAllProductFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(LittleInFoAllProductFail());
    }
};

export const getProductInfoAdminById = async (dispatch, id) => {
    dispatch(getProductInfoStart());
    try {
        const res = await request.get(`/api/getProductInfoAdminById?id=${id}`);
        if (res.data.errCode === 0) {
            dispatch(getProductInfoSuccess(res));
            return res.data.data;
        } else {
            console.log(res);
            dispatch(getProductInfoFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(getProductInfoFail());
    }
};

export const createNewProduct = async (data, accessToken, dispatch, axiosJWT) => {
    dispatch(createProductStart());
    try {
        const res = await axiosJWT.post(`/api/createNewProduct`, data, {
            headers: { token: `Bearer ${accessToken}` },
        });
        console.log(res);
        if (res.data.errCode === 0) {
            dispatch(createProductSuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(createProductFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(createProductFail());
    }
};

export const handleDeleteProduct = async (axiosJWT, id, accessToken, dispatch) => {
    dispatch(deleteProductStart());
    try {
        const res = await axiosJWT.delete(`/api/deleteProduct?id=${id}`, {
            headers: { token: `Bearer ${accessToken}` },
        });
        console.log(res);
        if (res.data.errCode === 0) {
            dispatch(deleteProductSuccess(res.data));
            return res.data;
        } else {
            console.log(res);
            dispatch(deleteProductFail());
            return res.data;
        }
    } catch (e) {
        console.log(e);
        dispatch(deleteProductFail());
    }
};

export const searchProduct = async (dispatch, key) => {
    dispatch(getProductInfoStart());
    try {
        const res = await request.get(`/api/search-product?q=${key}`);
        if (res.data.errCode === 0) {
            dispatch(getProductInfoSuccess());
            return res.data.data;
        } else {
            console.log(res);
            dispatch(getProductInfoFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(getProductInfoFail());
    }
};

//Api order
export const getAllOrderNewAdmin = async (dispatch, axiosJWT, action, accessToken) => {
    dispatch(getAllOrderNewStart());
    try {
        const res = await axiosJWT.get('/api/getAllOrderNew?action=' + action.action, {
            headers: { token: `Bearer ${accessToken}` },
        });
        if (res.data.errCode === 0) {
            dispatch(getAllOrderNewSuccess(res));
            return res.data;
        } else {
            console.log(res);
            dispatch(getAllOrderNewFail());
        }
    } catch (e) {
        console.log(e);
        dispatch(getAllOrderNewFail());
    }
};
