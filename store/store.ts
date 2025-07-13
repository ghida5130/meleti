import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import toastReducer from "./toast/toastSlice";

export const makeStore = () => {
    return configureStore({
        reducer: { user: userReducer, toast: toastReducer },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
