import { createSlice } from "@reduxjs/toolkit";

interface userStateType {
    accessToken: string | null;
    name: string | null;
    email: string | null;
}

const initialState: userStateType = {
    accessToken: "",
    name: "",
    email: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.accessToken = action.payload.accessToken;
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        clearUser(state) {
            state.accessToken = null;
            state.name = null;
            state.email = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
