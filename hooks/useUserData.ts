import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser, setToken, finishInitializingUser } from "@/store/user/userSlice";

interface userDataType {
    accessToken: string;
    name: string;
    email: string;
    expiresIn: number;
}

export const useUserData = () => {
    const dispatch = useAppDispatch();
    const userName = useAppSelector((state) => state.user.name);
    const userEmail = useAppSelector((state) => state.user.email);
    const userAccessToken = useAppSelector((state) => state.user.accessToken);
    const isLogin = !!userAccessToken;
    const isTokenInit = useAppSelector((state) => state.user.isInitializing);

    const setUserData = ({ accessToken, name, email, expiresIn }: userDataType) =>
        dispatch(setUser({ accessToken: accessToken, name: name, email: email, expiresIn: expiresIn }));
    const clearUserData = () => {
        dispatch(clearUser());
    };
    const setAccessToken = (accessToken: string) => dispatch(setToken({ accessToken: accessToken }));
    const finishInit = () => {
        dispatch(finishInitializingUser());
    };

    return {
        userName,
        userEmail,
        userAccessToken,
        isLogin,
        isTokenInit,
        setUserData,
        clearUserData,
        setAccessToken,
        finishInit,
    };
};
