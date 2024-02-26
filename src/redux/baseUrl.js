import { createSlice } from "@reduxjs/toolkit";

export const baseUrl = createSlice({
    name: "baseurl",
    initialState: {
        url: "",
    },
    reducers: {
        setBaseUrl: (state, action) => {
            // name, id에 API 값 받아오기
            state.url = action.payload.baseurl;
            // state 변화를 알림
            return state;
        },

    },
});

export const { setBaseUrl } = baseUrl.actions;
export default baseUrl.reducer;