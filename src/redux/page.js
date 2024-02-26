import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
    name: "page",
    initialState: {
        firstPage: "",
    },
    reducers: {
        setPage: (state, action) => {
            // name, id에 API 값 받아오기
            state.firstPage = action.payload.page;
            // state 변화를 알림
            return state;
        },

    },
});

export const { setPage } = pageSlice.actions;
export default pageSlice.reducer;