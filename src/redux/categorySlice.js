import { createSlice } from '@reduxjs/toolkit';

const category = createSlice({
    name: 'category',
    initialState: {
        allCategory: {
            isFetching: false,
            categories: null,
            error: false,
        },
        allCategoryCustomer: {
            isFetching: false,
            categories: null,
            error: false,
        },
        listParent: {
            isFetching: false,
            data: null,
            error: false,
        },

        create: {
            isFetching: false,
            error: false,
        },
        delete: {
            isFetching: false,
            error: false,
        },
        edit: {
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getCategoryStartAdmin: (state) => {
            state.allCategory.isFetching = true;
        },
        getCategorySuccessAdmin: (state, action) => {
            state.allCategory.isFetching = false;
            state.allCategory.categories = action.payload;
            state.allCategory.error = false;
        },
        getCategoryFailAdmin: (state) => {
            state.allCategory.isFetching = false;
            state.allCategory.error = true;
        },
        getCategoryStart: (state) => {
            state.allCategoryCustomer.isFetching = true;
        },
        getCategorySuccess: (state, action) => {
            state.allCategoryCustomer.isFetching = false;
            state.allCategoryCustomer.categories = action.payload;
            state.allCategoryCustomer.error = false;
        },
        getCategoryFail: (state) => {
            state.allCategoryCustomer.isFetching = false;
            state.allCategoryCustomer.error = true;
        },

        getListCategoryStart: (state) => {
            state.listParent.isFetching = true;
        },
        getListCategorySuccess: (state, action) => {
            state.listParent.isFetching = false;
            state.listParent.data = action.payload;
            state.listParent.error = false;
        },
        getListCategoryFail: (state) => {
            state.listParent.isFetching = false;
            state.listParent.error = true;
        },

        createCategoryStart: (state) => {
            state.create.isFetching = true;
        },
        createCategorySuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.error = false;
        },
        createCategoryFail: (state) => {
            state.create.isFetching = false;
            state.create.error = true;
        },

        deleteBrandStart: (state) => {
            state.delete.isFetching = true;
        },
        deleteBrandSuccess: (state) => {
            state.delete.isFetching = false;
            state.delete.error = false;
        },
        deleteBrandFail: (state) => {
            state.delete.isFetching = false;
            state.delete.error = true;
        },

        editCategoryStart: (state) => {
            state.edit.isFetching = true;
        },
        editCategorySuccess: (state) => {
            state.edit.isFetching = false;
            state.edit.error = false;
        },
        editCategoryFail: (state) => {
            state.edit.isFetching = false;
            state.edit.error = true;
        },

        deleteCategoryStart: (state) => {
            state.delete.isFetching = true;
        },
        deleteCategorySuccess: (state) => {
            state.delete.isFetching = false;
            state.delete.error = false;
        },
        deleteCategoryFail: (state) => {
            state.delete.isFetching = false;
            state.delete.error = true;
        },
    },
});

export const {
    getCategoryStartAdmin,
    getCategorySuccessAdmin,
    getCategoryFailAdmin,
    getCategoryStart,
    getCategorySuccess,
    getCategoryFail,
    getListCategoryStart,
    getListCategorySuccess,
    getListCategoryFail,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFail,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFail,
    editCategoryStart,
    editCategorySuccess,
    editCategoryFail,
} = category.actions;

export default category.reducer;
