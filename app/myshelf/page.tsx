import MyShelfClient from "@/components/myshelf/myShelfClient";
import styles from "/styles/myshelf.module.scss";

export default function MyShelf() {
    return (
        <div className={styles.wrap}>
            <MyShelfClient />
        </div>
    );
}
