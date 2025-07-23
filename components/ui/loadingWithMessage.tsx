// components
import LoadingImage from "./loadingImage";

export default function LoadingWithMessage({ message }: { message: string }) {
    return (
        <>
            <LoadingImage />
            <p>{message}</p>
        </>
    );
}
