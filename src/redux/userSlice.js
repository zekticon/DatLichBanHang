import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'brand',
    initialState: {
        users: {
            allUsers: null,
            isFetching: false,
            error: false,
        },
        userInfo: {
            user: null,
            isFetching: false,
            error: false,
        },
        createUser: {
            isFetching: false,
            error: false,
        },
        editUser: {
            isFetching: false,
            error: false,
        },
        deleteUser: {
            isFetching: false,
            error: false,
        },
    },
    reducers: {
        getUsersStart: (state) => {
            state.users.isFetching = true;
        },
        getUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUsers = action.payload.data;
            state.users.error = false;
        },
        getUsersFail: (state) => {
            state.users.isFetching = false;
            state.users.error = true;
        },

        getUsersInfoStart: (state) => {
            state.userInfo.isFetching = true;
        },
        getUsersInfoSuccess: (state, action) => {
            state.userInfo.isFetching = false;
            state.userInfo.user = action.payload.data;
            state.userInfo.error = false;
        },
        getUsersInfoFail: (state) => {
            state.userInfo.isFetching = false;
            state.userInfo.error = true;
        },
        deleteUserStart: (state) => {
            state.deleteUser.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.deleteUser.isFetching = false;
            state.deleteUser.error = false;
        },
        deleteUserFail: (state) => {
            state.deleteUser.isFetching = false;
            state.deleteUser.error = true;
        },

        createUserStart: (state) => {
            state.createUser.isFetching = true;
        },
        createUserSuccess: (state, action) => {
            state.createUser.isFetching = false;
            state.createUser.error = false;
        },
        createUserFail: (state) => {
            state.createUser.isFetching = false;
            state.createUser.error = true;
        },

        editUserStart: (state) => {
            state.editUser.isFetching = true;
        },
        editUserSuccess: (state, action) => {
            state.editUser.isFetching = false;
            state.editUser.error = false;
        },
        editUserUserFail: (state) => {
            state.editUser.isFetching = false;
            state.editUser.error = true;
        },
    },
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFail,
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
} = userSlice.actions;

export default userSlice.reducer;
