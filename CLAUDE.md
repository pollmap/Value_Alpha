# CLAUDE.md — Value Alpha 프로젝트 가이드

## 프로젝트 개요
- **프레임워크**: Docusaurus v3.9
- **배포**: GitHub Pages (`pollmap.github.io/Value_Alpha/`)
- **언어**: 한국어 (ko)

## 핵심 설정 (반드시 숙지)

### URL 라우팅
- `baseUrl`: `/Value_Alpha/`
- `routeBasePath`: `/` — docs가 루트에서 서빙됨
- **내부 링크에 `/docs/` 접두사 절대 사용 금지** — `routeBasePath: '/'`이므로 `/docs/`가 경로에 포함되지 않음
- 올바른 예: `(/valuation/dcf/overview)`
- 잘못된 예: `(/docs/valuation/dcf/overview)`

### 문서 ID 규칙 (sidebars.js)
- **항상 파일 경로 기반 ID 사용** — `wiki/docs/` 기준 상대 경로에서 확장자 제거
- 예: `wiki/docs/foundation/overview.md` → ID: `foundation/overview`
- 예: `wiki/docs/banking-industry/index.mdx` → ID: `banking-industry/index`
- **frontmatter에 custom `id` 사용 금지** — custom id가 있으면 Docusaurus가 `{폴더경로}/{custom-id}`로 해석하여 sidebar 참조와 불일치 발생
  - 잘못된 예: `id: crypto-industry-index` → 실제 ID가 `crypto-industry/crypto-industry-index`가 됨
  - 올바른 방법: `id` 필드 생략 → 파일 경로 그대로 `crypto-industry/index`가 됨
- **새 문서 생성 시 반드시 frontmatter에서 `id:` 줄 제거할 것**

### 사이드바 구조 (6대 카테고리)
1. **투자분석 체계** — 4-Layer (회계→재무분석→산업분석→기업분석), 밸류에이션, 케이스 스터디
2. **자산 & 시장** — 거시경제, 채권, 파생상품, 부동산, 암호화폐, 매매 전략
3. **리스크 & 포트폴리오** — 리스크 관리, 기술적 분석
4. **금융권 커리어** — 산업 가이드, 기업 총람, 취업 가이드
5. **도구 & 계산기** — 밸류에이션/리스크 계산기, 모델링 도구, 분석 도구
6. **학습 자료** — 퀴즈, 투자 대가, 용어 사전, MBTI, Market Survivor

## 빌드 & 개발

```bash
cd wiki
npm install
npm run start   # 개발 서버
npm run build   # 프로덕션 빌드 (broken link 검증 포함)
```

- **변경 후 반드시 `npm run build` 실행하여 검증** — broken link, sidebar ID 오류 등 빌드 시에만 발견됨
- `onBrokenLinks: 'warn'` 설정이므로 빌드 출력에서 broken link 경고 확인 필요

## 자주 발생하는 실수 & 방지책

### 1. Sidebar doc ID 불일치
- **원인**: frontmatter에 custom `id` 추가 시 Docusaurus가 `{폴더}/{id}`로 조합
- **방지**: 새 문서 생성 시 `id:` 필드 절대 사용하지 말 것. `title`, `sidebar_label`, `description`, `keywords`만 사용
- **진단**: `npm run build` 에러 메시지에서 "These sidebar document ids do not exist" 확인

### 2. 내부 링크 깨짐
- **원인 A**: `/docs/` 접두사 사용 — routeBasePath가 `/`이므로 불필요
- **원인 B**: 존재하지 않는 페이지 참조
- **방지**: 관련 페이지 링크 작성 시 실제 파일 경로 확인 후 작성
- **진단**: `npm run build` 출력에서 broken link 경고 확인

### 3. Calculator 문서 ID
- `wiki/docs/calculators/` 하위 파일들은 custom `id` 없이 경로 기반 ID 사용
- 예: `calculators/bond.mdx` → ID: `calculators/bond`

### 4. SSR 호환성
- `localStorage`, `sessionStorage`, `window` 등 브라우저 API는 반드시 `BrowserOnly` 래퍼 또는 `useEffect` 내에서 사용
- Docusaurus SSR 빌드에서 `window is not defined` 에러 방지

### 5. 커뮤니티 기능
- Giscus 미사용 (GitHub App 미설치, Discussions 미활성화)
- 현재 GitHub Issues API 기반 커뮤니티 보드로 구현됨
- `wiki/src/components/GiscusComments/GiscusComments.tsx`

## 파일 구조

```
Value_Alpha/
├── wiki/
│   ├── docs/              # 모든 문서 (259+개)
│   ├── sidebars.js        # 사이드바 구조 정의
│   ├── docusaurus.config.js
│   └── src/
│       ├── components/    # React 컴포넌트
│       │   ├── FinanceMBTI/
│       │   ├── GiscusComments/
│       │   ├── HomepageHero/
│       │   └── MarketSurvivor/
│       ├── css/
│       └── pages/
├── CONTRIBUTING.md
└── CLAUDE.md              # 이 파일
```

## 커밋 컨벤션
- 형식: `type(scope): description`
- 타입: feat, fix, docs, style, refactor, test, chore
- 한글 또는 영어 사용 가능
