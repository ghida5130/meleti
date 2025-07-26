// bcrypt로 암호화
import bcrypt from "bcryptjs";

/**
 * bcrypt 해시 생성
 * @param plain 암호 원본 문자열
 * @returns 암호화된 해시 문자열
 */
export async function hashPassword(plain: string): Promise<string> {
    return await bcrypt.hash(plain, 10);
}

/**
 * bcrypt 해시 검증
 * @param plain 사용자가 입력한 암호 원본 문자열
 * @param hashed 해시
 * @returns 암호 검증 결과 (true | false)
 */
export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
}
