import { Suspense } from "react";
import styles from "./home.module.scss";

// hooks & utils
import { fetchAladinItems } from "@/lib/api/fetchAladinItems";

// components
import SectionTitle from "../ui/sectionTitle";
import CarouselSlot from "./carouselSlot";
import CarouselSkeleton from "../skeletons/carouselSkeleton";

const sections = [
    { type: "BestSeller", title: "베스트 셀러" },
    { type: "ItemNewSpecial", title: "주목할만한 신간" },
    { type: "BlogBest", title: "블로그 베스트셀러" },
];

async function CarouselSection({ type }: { type: string }) {
    const data = await fetchAladinItems(type);

    return <CarouselSlot data={data} />;
}

export default function Content() {
    return (
        <div className={styles.content}>
            {sections.map(({ type, title }) => (
                <section key={type}>
                    <SectionTitle title={title} />
                    <Suspense fallback={<CarouselSkeleton />}>
                        <CarouselSection type={type} />
                    </Suspense>
                </section>
            ))}
        </div>
    );
}
