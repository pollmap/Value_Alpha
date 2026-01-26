#!/bin/bash
set -e

echo "🚀 Valuation Academy 배포 시작..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 프로젝트 루트 디렉토리로 이동
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# 환경 확인
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env 파일이 없습니다. .env.example을 참고하여 생성해주세요.${NC}"
    exit 1
fi

# 필수 환경변수 확인
source .env
if [ -z "$CLAUDE_API_KEY" ] || [ "$CLAUDE_API_KEY" == "sk-ant-api03-xxxxx" ]; then
    echo -e "${YELLOW}⚠️  경고: CLAUDE_API_KEY가 설정되지 않았습니다. AI 챗봇 기능이 작동하지 않습니다.${NC}"
fi

# Wiki 빌드
echo -e "\n${YELLOW}📦 Wiki 빌드 중...${NC}"
cd "$PROJECT_ROOT/wiki"
if [ -f package.json ]; then
    npm run build
    echo -e "${GREEN}✅ Wiki 빌드 완료${NC}"
fi

cd "$PROJECT_ROOT"

# Docker 이미지 빌드
echo -e "\n${YELLOW}🐳 Docker 이미지 빌드 중...${NC}"
docker-compose build

# 기존 컨테이너 중지
echo -e "\n${YELLOW}🛑 기존 서비스 중지 중...${NC}"
docker-compose down --remove-orphans

# 서비스 시작
echo -e "\n${YELLOW}🔄 서비스 시작 중...${NC}"
docker-compose up -d

# 상태 확인
echo -e "\n${YELLOW}⏳ 서비스 시작 대기 중...${NC}"
sleep 10

# 헬스체크
echo -e "\n${YELLOW}🏥 헬스체크 수행 중...${NC}"

check_service() {
    local service=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
            echo -e "${GREEN}✅ $service 정상${NC}"
            return 0
        fi
        echo -e "${YELLOW}   $service 대기 중... ($attempt/$max_attempts)${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done

    echo -e "${RED}❌ $service 응답 없음${NC}"
    return 1
}

# 서비스 헬스체크 (선택적)
# check_service "Wiki" "http://localhost:3000"
# check_service "LMS" "http://localhost:8000"

# 상태 확인
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}✅ 배포 완료!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
docker-compose ps
echo ""
echo -e "📍 접속 URL:"
echo -e "  - Wiki:    http://wiki.localhost:3000"
echo -e "  - LMS:     http://lms.localhost:8000"
echo -e "  - Studio:  http://studio.localhost:8001"
echo -e "  - Auth:    http://auth.localhost:8080"
echo ""
echo -e "📋 로그 확인:"
echo -e "  docker-compose logs -f [service_name]"
echo ""
echo -e "🛑 서비스 중지:"
echo -e "  docker-compose down"
