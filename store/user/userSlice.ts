import { createSlice } from "@reduxjs/toolkit";

interface userStateType {
    accessToken: string | null;
    name: string | null;
    email: string | null;
    userImage: string | null;
    expiresIn: number | null;
    isInitializing: boolean;
}

const initialState: userStateType = {
    accessToken: null,
    name: null,
    email: null,
    userImage: null,
    expiresIn: null,
    isInitializing: true,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.accessToken = action.payload.accessToken;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.userImage = action.payload.userImage;
            state.expiresIn = action.payload.expiresIn;
            state.isInitializing = false;
        },
        clearUser(state) {
            state.accessToken = null;
            state.name = null;
            state.email = null;
            state.userImage = null;
            state.expiresIn = null;
            state.isInitializing = false;
        },
        setToken(state, action) {
            state.accessToken = action.payload.accessToken;
            state.isInitializing = false;
        },
        finishInitializingUser(state) {
            state.isInitializing = false;
        },
    },
});

export const { setUser, clearUser, setToken, finishInitializingUser } = userSlice.actions;
export default userSlice.reducer;
