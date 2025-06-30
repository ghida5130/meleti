import { createSlice } from "@reduxjs/toolkit";

interface userStateType {
    accessToken: string | null;
    name: string | null;
    email: string | null;
    expiresIn: number | null;
}

const initialState: userStateType = {
    accessToken: null,
    name: null,
    email: null,
    expiresIn: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.accessToken = action.payload.accessToken;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.expiresIn = action.payload.expiresIn;
        },
        clearUser(state) {
            state.accessToken = null;
            state.name = null;
            state.email = null;
            state.expiresIn = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
