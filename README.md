# Value Alpha - 금융 위키

> 투자분석부터 금융권 취업까지, 금융 학습의 모든 것

**[pollmap.github.io/Value_Alpha](https://pollmap.github.io/Value_Alpha/)**

[![GitHub Stars](https://img.shields.io/github/stars/pollmap/Value_Alpha?style=flat-square)](https://github.com/pollmap/Value_Alpha/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/pollmap/Value_Alpha?style=flat-square)](https://github.com/pollmap/Value_Alpha/network/members)
[![Last Commit](https://img.shields.io/github/last-commit/pollmap/Value_Alpha?style=flat-square)](https://github.com/pollmap/Value_Alpha/commits)

## 프로젝트 소개

Value Alpha는 한국어 금융 교육을 위한 오픈소스 위키 플랫폼입니다. 재무제표 기초부터 기업 밸류에이션, 금융권 취업 가이드까지 체계적으로 정리합니다.

### 주요 특징

- **4-Layer 투자분석 체계**: 기초 회계 → 재무분석 → 산업분석 → 기업분석
- **인터랙티브 도구**: DCF 계산기, WACC 계산기, 옵션 프라이서, 투자 시뮬레이터 등 15종
- **금융권 취업 가이드**: 직무 분류, 진입 요건, 공모전/대회, 커리어 로드맵
- **170+ 금융 기업 디렉토리**: 은행, 증권, 보험, 자산운용, VC/PE, 핀테크 등 전 섹터
- **투자 대가 학습**: Graham, Buffett, Lynch, Fisher, Dalio, Marks, Greenblatt, Livermore

## 콘텐츠 구성

| 카테고리 | 문서 수 | 내용 |
|----------|---------|------|
| 기초 회계 (Layer 1) | 23 | 재무상태표, 손익계산서, 현금흐름표, 주석 분석 |
| 재무분석 (Layer 2) | 11 | 수익성, 성장성, 안정성, 효율성 분석 |
| 산업분석 (Layer 3) | 12 | 포터 5 Forces, 시장 구조, 규제 환경 |
| 기업분석 (Layer 4) | 10 | 경쟁우위, 경영진 평가, ESG |
| 밸류에이션 | 12 | DCF, 상대가치, LBO, 잔여이익모형 |
| 거시경제 | 6 | GDP, 금리, 인플레이션, 경기순환 |
| 매매 전략 | 7 | 가치투자, 모멘텀, 퀀트, 스윙 트레이딩 |
| 금융 산업 & 기업 | 22 | 6개 산업 가이드 + 170개 기업 총람 |
| 취업 & 커리어 | 5 | 50+ 직무, 42+ 공모전, 자격증 가이드 |
| 케이스 스터디 | 5 | 삼성전자, SK하이닉스, 현대차, 카카오, 네이버 |
| 인터랙티브 도구 | 15+ | 계산기, 퀴즈, 시뮬레이터, MBTI 테스트 |
| **합계** | **184+** | |

## 인터랙티브 도구

### 금융 계산기
- **DCF Calculator** - 기업가치 산출 + 민감도 분석
- **WACC Calculator** - 가중평균자본비용 계산
- **Graham Number** - 그레이엄 넘버 + 안전마진
- **PEG Screener** - PEG 기반 스크리닝
- **Duration Calculator** - 채권 듀레이션/컨벡서티
- **Option Pricer** - Black-Scholes 옵션 가격 + 그릭스
- **Compound Interest** - 복리 계산기
- **Mortgage Calculator** - 주택담보대출 계산기

### 교육 도구
- **Market Survivor** - 100년 금융 역사 투자 시뮬레이션 (50개 시나리오 중 10개 랜덤)
- **Finance MBTI** - 금융 성향 테스트 (16개 유형)
- **Quiz System** - 회계/재무/밸류에이션 퀴즈 (4가지 문제 유형)
- **Progress Tracker** - 학습 진도 추적

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Docusaurus 3.4 |
| 언어 | TypeScript, MDX |
| 호스팅 | GitHub Pages |
| 검색 | docusaurus-search-local (한국어/영어) |
| 수식 | KaTeX (remark-math + rehype-katex) |
| 차트 | Recharts |
| 아이콘 | Lucide React |
| CI/CD | GitHub Actions (빌드 검증 + 시크릿 스캔) |

## 로컬 개발

### 사전 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
git clone https://github.com/pollmap/Value_Alpha.git
cd Value_Alpha/wiki

npm install
npm run start
```

브라우저에서 `http://localhost:3000/Value_Alpha/` 접속

### 빌드

```bash
npm run build
npm run serve
```

## 프로젝트 구조

```
Value_Alpha/
├── .github/workflows/          # CI/CD (deploy, PR validation)
├── wiki/
│   ├── docs/                   # 마크다운/MDX 문서 (184개)
│   │   ├── foundation/         # Layer 1: 기초 회계
│   │   ├── financial-analysis/ # Layer 2: 재무분석
│   │   ├── industry-analysis/  # Layer 3: 산업분석
│   │   ├── company-analysis/   # Layer 4: 기업분석
│   │   ├── valuation/          # 밸류에이션
│   │   ├── macroeconomics/     # 거시경제
│   │   ├── career/             # 취업 가이드
│   │   ├── companies/          # 금융 기업 디렉토리
│   │   ├── masters/            # 투자 대가
│   │   ├── calculators/        # 계산기 문서
│   │   └── ...
│   ├── src/
│   │   ├── components/         # React 인터랙티브 컴포넌트 (15종)
│   │   └── css/                # 커스텀 스타일
│   ├── static/                 # 정적 파일
│   ├── sidebars.js             # 사이드바 구조
│   ├── docusaurus.config.js    # 사이트 설정
│   └── package.json
└── README.md
```

## 기여

기여를 환영합니다. [Issues](https://github.com/pollmap/Value_Alpha/issues)와 Pull Requests를 통해 참여할 수 있습니다.

- PR 제목은 conventional commit 형식을 따릅니다: `feat:`, `fix:`, `docs:`, `refactor:` 등
- PR 시 빌드 검증과 시크릿 스캔이 자동 실행됩니다

## 라이선스

MIT License
