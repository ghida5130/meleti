export default function SectionTitle({ title, width = "100%" }: { title: string; width?: string }) {
    return (
        <h2
            style={{
                fontWeight: "700",
                fontSize: "18px",
                width: `${width}`,
                padding: "20px 0",
                margin: "0 auto",
            }}
        >
            {title}
        </h2>
    );
}
