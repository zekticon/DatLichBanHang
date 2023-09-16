import { createSlice } from '@reduxjs/toolkit';

const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        allBrand: {
            isFetching: false,
            brands: null,
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
        getBrandsStart: (state) => {
            state.allBrand.isFetching = true;
        },
        getBrandsSuccess: (state, action) => {
            state.allBrand.isFetching = false;
            state.allBrand.brands = action.payload;
            state.allBrand.error = false;
        },
        getBrandsFail: (state) => {
            state.allBrand.isFetching = false;
            state.allBrand.error = true;
        },

        createBrandStart: (state) => {
            state.create.isFetching = true;
        },
        createBrandSuccess: (state, action) => {
            state.create.isFetching = false;
            state.create.error = false;
        },
        createBrandFail: (state) => {
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

        editBrandStart: (state) => {
            state.edit.isFetching = true;
        },
        editBrandSuccess: (state) => {
            state.edit.isFetching = false;
            state.edit.error = false;
        },
        editBrandFail: (state) => {
            state.edit.isFetching = false;
            state.edit.error = true;
        },
    },
});

export const {
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
} = brandSlice.actions;

export default brandSlice.reducer;
