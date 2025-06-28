import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/user/userSlice";

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

    const setUserData = ({ accessToken, name, email, expiresIn }: userDataType) =>
        dispatch(setUser({ accessToken: accessToken, name: name, email: email, expiresIn: expiresIn }));
    const clearUserData = () => {
        dispatch(clearUser());
    };

    return { userName, userEmail, isLogin, setUserData, clearUserData };
};
