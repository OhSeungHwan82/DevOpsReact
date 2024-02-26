import { createSlice } from "@reduxjs/toolkit";

export const authToken = createSlice({
    name: "authToken",
    initialState: {
        authToken: "",
    },
    reducers: {
        setAuthToken: (state, action) => {
            // name, id에 API 값 받아오기
            state.authToken = action.payload.authToken;
            // state 변화를 알림
            return state;
        },

    },
});

export const { setAuthToken } = authToken.actions;
export default authToken.reducer;