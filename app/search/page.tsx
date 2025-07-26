import styles from "@/styles/search.module.scss";

// components
import SearchClient from "@/components/search/searchClient";

export const metadata = {
    title: "Meleti 도서 검색",
};

export default function Search() {
    return (
        <div className={styles.searchPageWrap}>
            <SearchClient />
        </div>
    );
}
