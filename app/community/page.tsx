import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/community.module.scss";

// public
import newPostIcon from "@/public/community/newPost.svg";
import testBookImage from "@/public/test/frontTestImage2.jpg";

export const metadata = {
    title: "Meleti 커뮤니티",
};

export default function Community() {
    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <h1 style={{ fontSize: "25px", fontWeight: "800" }}>커뮤니티</h1>
                <Link href="/community/post/quote/create" className={styles.newPostButton}>
                    <Image src={newPostIcon} alt="new post button" width={15} />새 글
                </Link>
            </div>

            <div className={styles.postArea}>
                <div className={styles.quoteArea}>
                    <p>2025.03.11</p>
                    <p>멸망 이전의 샹그릴라 - p.139</p>
                    <p>&quot;이곳에 글귀가 작성됩니다.&quot;</p>
                    <p>♥️ 17</p>
                </div>
                <div className={styles.bookCoverImage}>
                    <Image src={testBookImage} alt="quotes book cover image" width={50} />
                </div>
                <div className={styles.authorArea}>
                    <div className={styles.authorProfileImage}>
                        <Image src={testBookImage} alt="author profile image" fill style={{ objectFit: "cover" }} />
                    </div>
                    <p>작성자</p>
                </div>
            </div>

            {/* <p>글귀, 책페이지, 책표지, 책제목, 작성날짜, 작성자, 작성자 프로필 이미지, 좋아요수</p> */}
        </div>
    );
}
