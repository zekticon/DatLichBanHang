import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'order',
    initialState: {
        allOrderNew: {
            data: [],
            isFetching: false,
            error: false,
        },
        // deleteCart: {
        //     isFetching: false,
        //     error: false,
        // },
    },
    reducers: {
        getAllOrderNewStart: (state) => {
            state.allOrderNew.isFetching = true;
        },
        getAllOrderNewSuccess: (state, action) => {
            state.allOrderNew.isFetching = false;
            state.allOrderNew.data = action.payload;
            state.allOrderNew.error = false;
        },
        getAllOrderNewFail: (state) => {
            state.allOrderNew.isFetching = false;
            state.allOrderNew.error = true;
        },
    },
});

export const { getAllOrderNewStart, getAllOrderNewSuccess, getAllOrderNewFail } = cartSlice.actions;

export default cartSlice.reducer;
