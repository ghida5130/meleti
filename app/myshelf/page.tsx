import Image from "next/image";
import styles from "/styles/myshelf.module.scss";
import settingIcon from "/public/myshelf/setting.svg";
import Shelves from "./shelves";

export default function MyShelf() {
    return (
        <div className={styles.myshelfWrap}>
            <div className={styles.topArea}>
                <p>Meleti 님의 서재</p>
                <button>
                    <Image src={settingIcon} alt="my shelf setting button" width={30} />
                </button>
            </div>
            {/* 책장 표시방식 등은 db에 모두 저장하여 컴포넌트 재활용 편리하게 */}
            <Shelves />
        </div>
    );
}
