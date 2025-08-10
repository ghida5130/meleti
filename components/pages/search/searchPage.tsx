import styles from "@/styles/search.module.scss";

// components
import SearchClient from "@/components/search/searchClient";

export default function SearchPage() {
    return (
        <div className={styles.searchPageWrap}>
            <SearchClient />
        </div>
    );
}
