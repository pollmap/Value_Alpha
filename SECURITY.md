# Security Policy

## Reporting a Vulnerability

보안 취약점을 발견하셨다면 공개 이슈 대신 아래 방법으로 비공개 제보해 주세요:

1. GitHub Security Advisories를 통해 비공개 제보
2. 또는 maintainer에게 직접 연락

## Branch Protection Rules

이 저장소는 다음과 같은 브랜치 보호 규칙을 사용합니다:

### `main` 브랜치
- 직접 push 금지 (Pull Request 필수)
- 최소 1명의 리뷰어 승인 필요
- 상태 검사 통과 필수 (CI/CD)
- 관리자도 규칙 적용

## 기여 가이드라인

### Pull Request 규칙
1. 악의적인 코드 삽입 금지
2. 개인정보 포함 금지
3. 저작권 침해 콘텐츠 금지
4. 스팸/광고 금지

위반 시 PR 거부 및 기여자 차단될 수 있습니다.

## 개인정보 보호

### 커밋 시 주의사항
- API 키, 비밀번호 등 민감 정보 커밋 금지
- 개인 이메일 대신 GitHub 제공 no-reply 이메일 사용 권장
  - 설정: GitHub Settings → Emails → "Keep my email addresses private"

### 실수로 민감 정보를 커밋한 경우
1. 즉시 해당 키/비밀번호 무효화
2. `git filter-branch` 또는 BFG Repo-Cleaner로 히스토리에서 제거
3. GitHub Support에 캐시 삭제 요청

## 라이선스

이 프로젝트의 콘텐츠는 저작권으로 보호됩니다.
- 학습 목적의 개인 사용: 허용
- 상업적 이용: 사전 허가 필요
- 재배포: 출처 명시 필수

## 악용 신고

스팸, 악성 PR, 부적절한 콘텐츠를 발견하면 GitHub의 "Report abuse" 기능을 사용하거나 Issue로 신고해 주세요.
