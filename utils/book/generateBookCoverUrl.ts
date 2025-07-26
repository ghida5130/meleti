/**
 * 도서 cover 기본 url을 통해 앞,뒤,옆면 이미지를 반환
 *
 * @param cover 도서 기본 cover 이미지 URL
 * @returns 앞면, 옆면, 뒷면 이미지 URL 객체
 * @throws {Error} cover URL에 'coversum' 또는 '_' 구문이 없을 경우
 */
export function generateBookCoverUrl(cover: string): { coverImage: string; sideImage: string; backImage: string } {
    const bookNum = cover.match(/coversum\/(.*?)_/);
    if (!bookNum) {
        throw new Error("'coversum', '_' not found.");
    }
    const bookImageURL = cover.split(/coversum/)[0];

    // 이미지 가져오기
    const coverImage = cover.replace("coversum", "cover500"); //큰 사이즈로 가져오기위해 url수정
    const sideImage = `${bookImageURL}spineflip/${bookNum[1]}_d.jpg`;
    const backImage = `${bookImageURL}letslook/${bookNum[1]}_b.jpg`;

    return { coverImage, sideImage, backImage };
}
