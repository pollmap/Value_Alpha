# Value Alpha - AI 밸류에이션 교육 플랫폼

## 프로젝트 개요
Docusaurus 기반 금융 교육 위키 + 인터랙티브 도구 플랫폼.
DCF, 상대가치평가, 기술적 분석 등 투자와 가치평가를 학습하는 한국어 교육 사이트.

## 기술 스택
- **프레임워크**: Docusaurus 3.4 (React + TypeScript + MDX)
- **API**: Anthropic Claude SDK (@anthropic-ai/sdk)
- **빌드**: npm, Node.js 18+
- **배포**: Docker Compose (Open edX, MySQL, MongoDB, Redis, Elasticsearch, Keycloak)

## 디렉토리 구조
- `wiki/` - Docusaurus 메인 앱 (컴포넌트, 문서, 설정)
- `api/` - 백엔드 API 핸들러 (chat.ts)
- `shared/` - 공유 타입 정의
- `nginx/` - 리버스 프록시 설정
- `scripts/` - 유틸리티 스크립트

## 주요 컴포넌트
- `ChatWidget` - AI 튜터 채팅 (메모리 기능 내장)
- `ProgressTracker` - 학습 진도 추적 (localStorage)
- 금융 계산기 8종 (DCF, WACC, Graham, Bond Duration 등)
- Market Survivor, Finance MBTI 등 인터랙티브 도구

## 메모리 시스템
ChatWidget에 claude-mem 영감의 메모리 시스템이 통합되어 있음:
- localStorage 기반 대화 이력 영속화
- AI 요약을 통한 컨텍스트 압축
- 학습 진도 기반 컨텍스트 주입
- 세션 관리 및 검색 기능

## 빌드 명령어
```bash
cd wiki && npm install && npm run build
cd wiki && npm start  # 개발 서버
```

## 환경 변수
- `CLAUDE_API_KEY` - Anthropic API 키 (api/chat.ts에서 사용)
