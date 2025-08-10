import styles from "@/styles/myshelf.module.scss";

// components
import MyShelfClient from "@/components/myshelf/myShelfClient";

export default function MyShelfPage() {
    return (
        <div className={styles.wrap}>
            <MyShelfClient />
        </div>
    );
}
