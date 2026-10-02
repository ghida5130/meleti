"use client";

import dynamic from "next/dynamic";
import { AladinItemsType } from "@/types/aladin";
import CarouselSkeleton from "@/components/skeletons/carouselSkeleton";

const Carousel = dynamic(() => import("./carousel"), {
    loading: () => <CarouselSkeleton />,
});

export default function CarouselSlot({ data }: { data: AladinItemsType[] }) {
    return <Carousel data={data} />;
}
