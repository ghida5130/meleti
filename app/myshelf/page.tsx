import styles from "@/styles/myshelf.module.scss";

// components
import MyShelfClient from "@/components/myshelf/myShelfClient";

export const metadata = {
    title: "Meleti 서재",
};

export default function MyShelf() {
    return (
        <div className={styles.wrap}>
            <MyShelfClient />
        </div>
    );
}
