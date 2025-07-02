import SearchClient from "@/components/search/searchClient";
import styles from "/styles/search.module.scss";

export default function Search() {
    return (
        <div className={styles.searchPageWrap}>
            <SearchClient />
        </div>
    );
}
