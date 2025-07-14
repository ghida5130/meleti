export function generateBookCoverUrl(cover: string) {
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
