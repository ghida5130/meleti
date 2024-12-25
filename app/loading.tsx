import LoadingImage from "@/components/atoms/loadingImage";

export default function Loading() {
    return (
        <div style={{ width: "100%", height: "50vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <LoadingImage />
        </div>
    );
}
