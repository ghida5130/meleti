import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser } from "@/store/user/userSlice";

interface userDataType {
    accessToken: string;
    name: string;
    email: string;
}

export const useUserData = () => {
    const dispatch = useAppDispatch();
    const userName = useAppSelector((state) => state.user.name);
    const userEmail = useAppSelector((state) => state.user.email);
    const userAccessToken = useAppSelector((state) => state.user.accessToken);
    const isLogin = !!userAccessToken;

    const setUserData = ({ accessToken, name, email }: userDataType) =>
        dispatch(setUser({ accessToken: accessToken, name: name, email: email }));
    const clearUserData = () => {
        clearUser();
    };

    return { userName, userEmail, isLogin, setUserData, clearUserData };
};
