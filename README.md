# Meleti

## 로컬 환경 변수

`.env.example`을 `.env.local`로 복사하고 실제 값을 입력하세요. Firebase 콘솔에서 발급한 서비스 계정 JSON의 `project_id`, `client_email`, `private_key`를 각각 `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`에 넣습니다. 개인 키의 줄바꿈은 `\n`으로 입력할 수 있습니다. `FIREBASE_STORAGE_BUCKET`은 Firebase 프로젝트의 스토리지 버킷 값으로 설정합니다.

로그인 세션은 Firestore `sessions` 컬렉션에 저장됩니다. 만료된 문서 정리를 위해 Firebase 콘솔에서 `sessions` 컬렉션 그룹의 `expiresAt` 필드에 TTL 정책을 설정하세요. 서버는 TTL 삭제 여부와 관계없이 만료 시각을 직접 확인합니다.

또는 세 개의 Firebase 인증 변수 대신 서비스 계정 JSON 전체를 `FIREBASE_SERVICE_ACCOUNT`에 넣을 수 있습니다. 이 경우 JSON에 `project_id`, `client_email`, `private_key`가 모두 있어야 합니다. 알라딘 도서 목록을 보려면 `ALADIN_TTB_KEY`도 설정하세요. `.env.local`은 Git에서 제외되며, 환경 변수를 수정한 뒤에는 개발 서버를 다시 시작해야 합니다.

<div align="center">
<br>
<img width="400" alt="meleti logo" src="https://github.com/ghida5130/image-assets/blob/main/others/meleti_logo_shadow.png">
<br><br>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white">
</div>

## 배포 링크
- https://meleti-sigma.vercel.app/
<br><br>

## 프로젝트 간단 소개
- Next.js와 firebase의 firestore로 개발했으며 개인 프로젝트입니다.
- 도서정보, 도서검색 등 도서 전반의 기능에 Aladin API를 활용했습니다.
- 유저별 독서기록 기능을 제공하며 책 정보 및 구절 공유 커뮤니티 기능을 제공합니다. 관련 데이터는 firestore에서 관리합니다.
- 도서 상세페이지에는 SEO를 적용했고 three.js로 도서를 입체적으로 확인할 수 있습니다.
<br><br>

## Meleti - 나만의 모바일 서재
### 📚 서비스 소개
- 도서 정보 조회와 검색 기능을 제공하는 홈페이지입니다.

### 🏆 카테고리별 조회
- 베스트셀러 등 카테고리별로 도서 조회가 가능합니다.

### 📖 3D 도서 미리보기
- 책을 구매하기 전 3D로 도서를 돌려보며 디자인, 크기, 두께를 확인할 수 있습니다.

### 💬 커뮤니티 기능
- 책에서 인상 깊은 문장이나 책 정보 등을 공유하는 커뮤니티 기능을 제공합니다.
<br><br>

## 화면 구성

- 도서 상세 페이지 - 책 둘러보기, 비교하기 (모바일)
  
<div style="display: flex; justify-content: center;">
<img alt="meleti book detail page" src="https://raw.githubusercontent.com/ghida5130/image-assets/refs/heads/main/comma/projects/meleti/meleti_4.webp" height="600""/>
<img alt="meleti book compare page" src="https://raw.githubusercontent.com/ghida5130/image-assets/refs/heads/main/comma/projects/meleti/meleti_5.webp" height="600" />
</div>
<br><br><br>

- 메인 페이지

<img alt="meleti main page" src="https://raw.githubusercontent.com/ghida5130/image-assets/refs/heads/main/comma/projects/meleti/meleti_1.webp" width="600" />
<br><br><br>

- 마이 페이지

<img alt="meleti mypage" src="https://raw.githubusercontent.com/ghida5130/image-assets/refs/heads/main/comma/projects/meleti/meleti_3.webp" width="600" />
<br><br><br>

- 도서 상세 페이지

<img alt="meleti book detail page" src="https://raw.githubusercontent.com/ghida5130/image-assets/refs/heads/main/comma/projects/meleti/meleti_2.webp" width="600" />

