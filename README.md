# Valuation Academy (밸류에이션 아카데미)

> DCF부터 디지털자산까지, 모든 자산 클래스의 가치평가 방법론을 체계적으로 학습할 수 있는 하이브리드 LMS+Wiki 플랫폼

## 🎯 프로젝트 개요

Valuation Academy는 한국 최초의 원스톱 밸류에이션 교육 생태계를 목표로 합니다:

- **Khan Academy**의 마스터리 기반 학습
- **Investopedia**의 사전식 참조
- **CFA Institute**의 체계적 커리큘럼
- **Open edX**의 XBlock으로 인터랙티브 도구 구현
- **Claude API** 기반 RAG 시스템으로 AI 튜터 제공

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                    사용자 인터페이스 계층                        │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   LMS (Open edX)│  Wiki (Docusaurus)│   AI 튜터 (Claude+RAG)    │
│   · 코스 학습   │  · 레퍼런스 문서  │   · Q&A 챗봇              │
│   · 퀴즈/평가   │  · 공식 사전      │   · 계산 설명             │
│   · 진도 추적   │  · 케이스 스터디  │   · 학습 추천             │
│   · XBlock 계산기│  · 용어 해설     │   · 개념 질의응답         │
├─────────────────┴─────────────────┴─────────────────────────────┤
│                    SSO 인증 계층 (Keycloak)                      │
├─────────────────────────────────────────────────────────────────┤
│                    데이터 계층                                   │
│  PostgreSQL(유저) │ Weaviate(벡터) │ Redis(캐시) │ S3(미디어)  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 프로젝트 구조

```
valuation-academy/
├── docker-compose.yml              # 전체 서비스 오케스트레이션
├── .env.example                    # 환경변수 템플릿
│
├── openedx/                        # Open edX LMS
│   ├── config/                     # Tutor 설정 및 플러그인
│   ├── themes/                     # 커스텀 테마
│   └── courses/                    # 코스 콘텐츠 (OLX 포맷)
│
├── wiki/                           # Docusaurus Wiki
│   ├── docs/                       # Wiki 문서
│   └── src/components/             # React 컴포넌트
│
├── shared/                         # 공유 컴포넌트
│   ├── calculators/                # React 계산기
│   ├── ai-chat/                    # AI 챗봇 모듈
│   └── types/                      # 공유 타입 정의
│
├── nginx/                          # 리버스 프록시
└── scripts/                        # 유틸리티 스크립트
```

## 🚀 빠른 시작

### 사전 요구사항

- Docker & Docker Compose
- Node.js 18+
- Git

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-org/valuation-academy.git
cd valuation-academy

# 환경변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값들을 설정

# 개발 환경 시작
./scripts/setup-dev.sh

# 또는 Docker Compose로 직접 실행
docker-compose up -d
```

### 접속 URL

| 서비스 | URL | 설명 |
|--------|-----|------|
| Wiki | http://wiki.localhost:3000 | Docusaurus 문서 사이트 |
| LMS | http://lms.localhost:8000 | Open edX 학습 관리 시스템 |
| Studio | http://studio.localhost:8001 | 코스 제작 도구 |

## 📚 커리큘럼

### 기초 트랙 (40시간)
- F1. 재무제표 기초
- F2. 기업분석 입문
- F3. 가치평가 개념
- F4. 투자의 기초 원리

### 핵심 밸류에이션 트랙 (80시간)
- C1. DCF 분석 완전 정복
- C2. 상대가치평가 마스터
- C3. 잔여이익모형과 EVA
- C4. LBO 모델링

### 자산별 트랙 (100시간)
- A1. 기술적 분석
- A2. 부동산 밸류에이션
- A3. 디지털자산 분석
- A4. 채권 및 파생상품

### 거장 트랙 (40시간)
- 그레이엄, 버핏, 린치, 달리오, 막스, 피셔, 그린블랫, 리버모어

## 🧮 인터랙티브 계산기

- **DCF Calculator** - 기업가치 산출, 민감도 분석
- **WACC Calculator** - 자본비용 계산
- **Graham Number** - 그레이엄 넘버 및 안전마진
- **PEG Screener** - PEG 기반 스크리닝
- **Duration Calculator** - 채권 듀레이션
- **Option Pricer** - Black-Scholes 옵션가격, 그릭스

## 🤖 AI 튜터

Claude API 기반 RAG 시스템으로 24시간 AI 튜터 제공:
- 밸류에이션 관련 질문 답변
- 금융 용어 및 공식 설명
- 관련 문서 및 코스 추천
- 맞춤형 학습 가이드

## 📜 자격증 연계

| 자격증 | 연계 모듈 |
|--------|-----------|
| 투자권유대행인 | F1-F4 기초 전체 |
| 투자자산운용사 | F1-F4, C1-C2, A1 |
| 금융투자분석사 | C1-C4, A4 |
| CFA Level I/II | 전체 기초+핵심 |
| 신용분석사 | F1-F2, C3, A4 |

## 🛠️ 기술 스택

- **LMS**: Open edX (Tutor)
- **Wiki**: Docusaurus 3.x
- **Frontend**: React 18, TypeScript
- **Charts**: Recharts
- **AI**: Claude API (Anthropic)
- **Search**: Meilisearch / Algolia
- **Auth**: Keycloak (OAuth 2.0 / OIDC)
- **Infra**: Docker, Nginx

## 📄 라이선스

MIT License

## 🤝 기여하기

기여를 환영합니다! Issues와 Pull Requests를 통해 참여해주세요.
