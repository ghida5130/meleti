import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, setUser, setUserImage } from "@/store/user/userSlice";

interface userDataType {
    uid: string;
    name: string | null;
    email: string | null;
    userImage: string | null;
    isDemo: boolean;
}

// - 사용자 화면 정보만 Redux에 보관
export const useUserData = () => {
    const dispatch = useAppDispatch();
    const userName = useAppSelector((state) => state.user.name);
    const userEmail = useAppSelector((state) => state.user.email);
    const userImage = useAppSelector((state) => state.user.userImage);
    const uid = useAppSelector((state) => state.user.uid);
    const isDemo = useAppSelector((state) => state.user.isDemo);
    const isLogin = !!uid;

    const setUserData = (data: userDataType) => dispatch(setUser(data));
    const updateUserImage = (url: string) => dispatch(setUserImage(url));
    const clearUserData = () => {
        dispatch(clearUser());
    };
    return {
        userName,
        userEmail,
        userImage,
        uid,
        isDemo,
        isLogin,
        setUserData,
        updateUserImage,
        clearUserData,
    };
};
