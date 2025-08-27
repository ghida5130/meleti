import SearchResultPage from "@/components/pages/search/searchResultPage";

export async function generateMetadata({ searchParams }: { searchParams: { query?: string } }) {
    return {
        title: `Meleti - ${searchParams.query} 검색결과`,
    };
}

export default async function SearchResult({ searchParams }: { searchParams: { query?: string } }) {
    return <SearchResultPage query={searchParams.query} />;
}
