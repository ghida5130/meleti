import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideToast, showToast } from "@/store/toast/toastSlice";
import { useEffect } from "react";

type ToastDataType = {
    message: string;
    type?: "success" | "error" | "info";
};

// toast redux store 사용 custom hook
export const useToast = () => {
    const dispatch = useAppDispatch();

    const toastMessage = useAppSelector((state) => state.toast.message);
    const toastType = useAppSelector((state) => state.toast.type);
    const toastVisible = useAppSelector((state) => state.toast.visible);

    const setToast = ({ message, type }: ToastDataType) => dispatch(showToast({ message: message, type: type }));

    // toast가 show 된후 3초뒤 자동으로 hide
    useEffect(() => {
        if (!toastVisible) return;
        const timer = setTimeout(() => {
            dispatch(hideToast());
        }, 3000);

        return () => clearTimeout(timer);
    }, [toastVisible, dispatch]);

    return {
        toastMessage,
        toastType,
        toastVisible,
        setToast,
    };
};
