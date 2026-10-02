import { createSlice } from "@reduxjs/toolkit";

interface userStateType {
    uid: string | null;
    name: string | null;
    email: string | null;
    userImage: string | null;
    isDemo: boolean;
}

const initialState: userStateType = {
    uid: null,
    name: null,
    email: null,
    userImage: null,
    isDemo: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.uid = action.payload.uid;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.userImage = action.payload.userImage;
            state.isDemo = action.payload.isDemo;
        },
        setUserImage(state, action) {
            state.userImage = action.payload;
        },
        clearUser(state) {
            state.uid = null;
            state.name = null;
            state.email = null;
            state.userImage = null;
            state.isDemo = false;
        },
    },
});

export const { setUser, setUserImage, clearUser } = userSlice.actions;
export default userSlice.reducer;
