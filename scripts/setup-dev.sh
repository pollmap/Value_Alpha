#!/bin/bash
set -e

echo "🚀 Valuation Academy 개발 환경 설정 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 프로젝트 루트 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

echo -e "${YELLOW}📁 프로젝트 루트: $PROJECT_ROOT${NC}"

# 환경 변수 파일 확인
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env 파일이 없습니다. .env.example에서 복사합니다...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env 파일이 생성되었습니다. 필요한 값들을 설정해주세요.${NC}"
fi

# Node.js 버전 확인
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        echo -e "${RED}❌ Node.js 18 이상이 필요합니다. 현재 버전: $(node -v)${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Node.js $(node -v) 감지됨${NC}"
else
    echo -e "${YELLOW}⚠️  Node.js가 설치되어 있지 않습니다. Wiki 개발에 필요합니다.${NC}"
fi

# Docker 확인
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker $(docker --version | cut -d' ' -f3) 감지됨${NC}"
else
    echo -e "${RED}❌ Docker가 설치되어 있지 않습니다.${NC}"
    exit 1
fi

# Docker Compose 확인
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose 감지됨${NC}"
elif docker compose version &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose (plugin) 감지됨${NC}"
else
    echo -e "${RED}❌ Docker Compose가 설치되어 있지 않습니다.${NC}"
    exit 1
fi

# Wiki 의존성 설치
echo -e "\n${YELLOW}📦 Wiki 의존성 설치 중...${NC}"
cd "$PROJECT_ROOT/wiki"
if [ -f package.json ]; then
    npm install
    echo -e "${GREEN}✅ Wiki 의존성 설치 완료${NC}"
else
    echo -e "${YELLOW}⚠️  wiki/package.json이 없습니다. 건너뜁니다.${NC}"
fi

# 공유 모듈 의존성 설치
echo -e "\n${YELLOW}📦 공유 모듈 의존성 설치 중...${NC}"
cd "$PROJECT_ROOT/shared"
if [ -f package.json ]; then
    npm install
    echo -e "${GREEN}✅ 공유 모듈 의존성 설치 완료${NC}"
else
    echo -e "${YELLOW}⚠️  shared/package.json이 없습니다. 건너뜁니다.${NC}"
fi

cd "$PROJECT_ROOT"

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}✅ 개발 환경 설정 완료!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "다음 명령어로 서비스를 시작하세요:"
echo ""
echo -e "  ${YELLOW}# 전체 서비스 (Docker)${NC}"
echo -e "  docker-compose up -d"
echo ""
echo -e "  ${YELLOW}# Wiki 개발 서버만${NC}"
echo -e "  cd wiki && npm run start"
echo ""
echo -e "  ${YELLOW}# 서비스 상태 확인${NC}"
echo -e "  docker-compose ps"
echo ""
echo -e "📍 접속 URL:"
echo -e "  - Wiki:    http://wiki.localhost:3000"
echo -e "  - LMS:     http://lms.localhost:8000"
echo -e "  - Studio:  http://studio.localhost:8001"
echo -e "  - Auth:    http://auth.localhost:8080"
