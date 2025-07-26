import SearchResultPage from "@/components/pages/searchResultPage";

export async function generateMetadata({ searchParams }: { searchParams: { query?: string } }) {
    return {
        title: `Meleti 검색 : ${searchParams.query}`,
    };
}

export default async function SearchResult({ searchParams }: { searchParams: { query?: string } }) {
    return <SearchResultPage query={searchParams.query} />;
}
