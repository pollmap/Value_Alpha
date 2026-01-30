import React, { useState } from 'react';

// ─── Type Definitions ────────────────────────────────────────────────

interface Question {
  id: number;
  dimension: 'SD' | 'AQ' | 'IE' | 'RC';
  text: string;
  choiceA: string;
  choiceB: string;
}

interface TypeProfile {
  code: string;
  name: string;
  description: string;
  sectors: string[];
  sectorLinks: string[];
  jobs: { title: string; desc: string }[];
  certs: string[];
  companies: string[];
}

// ─── Questions (20 total, 5 per dimension) ───────────────────────────

const questions: Question[] = [
  // SD: 안정(S) vs 도전(D) — questions 1-5
  {
    id: 1,
    dimension: 'SD',
    text: '커리어를 시작할 때, 어떤 환경이 더 끌리나요?',
    choiceA: '체계적인 교육 프로그램과 안정적인 연봉이 보장되는 대형 금융기관',
    choiceB: '빠르게 성장하며 다양한 역할을 경험할 수 있는 스타트업/소규모 조직',
  },
  {
    id: 2,
    dimension: 'SD',
    text: '프로젝트 결과의 불확실성에 대해 어떻게 생각하나요?',
    choiceA: '예측 가능한 결과를 위해 검증된 방법론을 따르는 것이 좋다',
    choiceB: '불확실하더라도 높은 성과를 노릴 수 있는 새로운 접근이 흥미롭다',
  },
  {
    id: 3,
    dimension: 'SD',
    text: '다음 중 더 가치 있다고 느끼는 것은?',
    choiceA: '수십 년간 축적된 조직의 노하우와 브랜드 신뢰',
    choiceB: '업계의 관행을 깨뜨리는 혁신적 비즈니스 모델',
  },
  {
    id: 4,
    dimension: 'SD',
    text: '연봉 협상 시, 어떤 구조가 더 매력적인가요?',
    choiceA: '기본급이 높고 안정적인 보상 체계',
    choiceB: '기본급은 낮지만 성과에 따라 큰 인센티브가 가능한 구조',
  },
  {
    id: 5,
    dimension: 'SD',
    text: '10년 후 자신의 모습으로 더 와닿는 것은?',
    choiceA: '해당 분야의 전문가로 인정받으며 조직의 핵심 인력이 된 모습',
    choiceB: '여러 도전을 거쳐 자신만의 투자 철학이나 사업을 구축한 모습',
  },

  // AQ: 분석(A) vs 정량(Q) — questions 6-10
  {
    id: 6,
    dimension: 'AQ',
    text: '기업을 분석할 때 더 자연스러운 접근은?',
    choiceA: '경영진 인터뷰, 산업 동향, 경쟁 구도 등 정성적 요소 파악',
    choiceB: '재무제표 비율, 통계 모델, 밸류에이션 수치 중심 분석',
  },
  {
    id: 7,
    dimension: 'AQ',
    text: '어떤 과목이 더 흥미로웠나요?',
    choiceA: '경영전략, 마케팅, 산업분석 등 비즈니스 판단 과목',
    choiceB: '통계학, 계량경제, 파생상품 이론 등 수리적 과목',
  },
  {
    id: 8,
    dimension: 'AQ',
    text: '보고서를 작성할 때, 어떤 스타일인가요?',
    choiceA: '논리적 스토리라인과 설득력 있는 내러티브 구성에 집중',
    choiceB: '데이터 기반의 차트와 수치적 근거 제시에 집중',
  },
  {
    id: 9,
    dimension: 'AQ',
    text: '투자 의사결정 시 더 신뢰하는 것은?',
    choiceA: '업계 전문가의 인사이트와 질적 판단',
    choiceB: '백테스팅 결과와 정량적 시그널',
  },
  {
    id: 10,
    dimension: 'AQ',
    text: '새로운 업무 도구를 배운다면?',
    choiceA: 'Bloomberg 터미널, 산업 리서치 DB 등 정보 분석 툴',
    choiceB: 'Python, R, SQL 등 데이터 프로그래밍 언어',
  },

  // IE: 내향(I) vs 외향(E) — questions 11-15
  {
    id: 11,
    dimension: 'IE',
    text: '가장 생산적이라고 느끼는 업무 환경은?',
    choiceA: '조용히 집중해서 깊이 있는 분석 작업을 하는 시간',
    choiceB: '다양한 사람들과 미팅하며 아이디어를 교환하는 시간',
  },
  {
    id: 12,
    dimension: 'IE',
    text: '업무 성과를 인정받는 방식 중 더 와닿는 것은?',
    choiceA: '작성한 리포트나 분석의 정확성과 깊이를 인정받는 것',
    choiceB: '클라이언트나 동료로부터 커뮤니케이션 능력을 인정받는 것',
  },
  {
    id: 13,
    dimension: 'IE',
    text: '점심시간 활용 방식으로 더 선호하는 것은?',
    choiceA: '혼자 또는 소수와 조용히 식사하며 에너지 재충전',
    choiceB: '다양한 부서 사람들과 네트워킹 점심',
  },
  {
    id: 14,
    dimension: 'IE',
    text: '금융권에서 더 해보고 싶은 역할은?',
    choiceA: '데이터와 리서치에 기반한 의견을 제시하는 역할',
    choiceB: '고객을 직접 만나 솔루션을 제안하고 관계를 구축하는 역할',
  },
  {
    id: 15,
    dimension: 'IE',
    text: '스트레스를 받을 때 선호하는 해소법은?',
    choiceA: '혼자만의 시간을 갖고 조용히 정리하기',
    choiceB: '친구나 동료와 대화하며 풀기',
  },

  // RC: 규정(R) vs 창의(C) — questions 16-20
  {
    id: 16,
    dimension: 'RC',
    text: '업무 프로세스에 대한 생각은?',
    choiceA: '명확한 매뉴얼과 절차가 있어야 효율적으로 일할 수 있다',
    choiceB: '상황에 맞게 유연하게 대응하는 것이 더 효과적이다',
  },
  {
    id: 17,
    dimension: 'RC',
    text: '규제와 컴플라이언스에 대한 태도는?',
    choiceA: '금융은 신뢰 산업이므로 규제 준수가 가장 중요하다',
    choiceB: '규제 안에서도 혁신의 여지를 찾는 것이 경쟁력이다',
  },
  {
    id: 18,
    dimension: 'RC',
    text: '조직 문화에서 더 중요하게 생각하는 것은?',
    choiceA: '체계적인 의사결정 구조와 명확한 역할 분담',
    choiceB: '수평적 문화와 자율적인 업무 방식',
  },
  {
    id: 19,
    dimension: 'RC',
    text: '새로운 금융 상품이 등장했을 때의 반응은?',
    choiceA: '기존 규정과 리스크 프레임워크로 먼저 검증해야 한다',
    choiceB: '시장 기회를 먼저 파악하고 빠르게 적용 방법을 모색한다',
  },
  {
    id: 20,
    dimension: 'RC',
    text: '5년 후 금융업에서 가장 중요한 것은?',
    choiceA: '신뢰와 안정성을 기반으로 한 전통 금융의 진화',
    choiceB: '기술과 창의성으로 무장한 새로운 금융 패러다임',
  },
];

// ─── 16 Type Profiles ────────────────────────────────────────────────

const typeProfiles: Record<string, TypeProfile> = {
  SAIR: {
    code: 'SAIR',
    name: '안정의 수호자',
    description:
      '당신은 체계적이고 신중한 성격으로, 조직의 안정성과 리스크 관리를 최우선으로 생각합니다. 정성적 판단력과 분석 능력이 뛰어나며, 규정과 프로세스를 충실히 따르는 가운데 조직의 건전성을 지키는 데 큰 보람을 느낍니다. 대형 금융기관의 핵심 인력으로 성장할 잠재력이 높습니다.',
    sectors: ['시중은행', '정책금융기관', '공제회'],
    sectorLinks: ['/companies/banks', '/companies/policy-finance', '/companies/mutual-aid'],
    jobs: [
      { title: '여신심사', desc: '기업 및 개인 대출의 건전성을 심사하고 리스크를 평가합니다' },
      { title: '리스크관리', desc: '시장·신용·운영 리스크를 모니터링하고 관리 체계를 운영합니다' },
      { title: '감사/컴플라이언스', desc: '내부통제와 규정 준수를 관리합니다' },
    ],
    certs: ['신용분석사', '금융위험관리사(FRM)', 'CFA Level 1'],
    companies: ['KB국민은행', '산업은행', '한국수출입은행', '신용보증기금'],
  },
  SAER: {
    code: 'SAER',
    name: '관계의 조율사',
    description:
      '당신은 사람과의 관계를 통해 가치를 창출하는 데 뛰어난 재능이 있습니다. 안정적인 환경에서 고객과의 신뢰를 쌓아가며, 체계적인 프로세스 안에서 고객 맞춤형 서비스를 제공하는 것에 강점이 있습니다. 금융 서비스업의 핵심 가치인 관계 금융을 실현할 인재입니다.',
    sectors: ['은행 PB', '카드사', '보험사'],
    sectorLinks: ['/companies/banks', '/companies/card', '/companies/insurance'],
    jobs: [
      { title: 'PB(프라이빗뱅커)', desc: '고액자산가를 대상으로 종합 자산관리 서비스를 제공합니다' },
      { title: '마케팅', desc: '고객 세분화와 맞춤 금융 상품 마케팅 전략을 수립합니다' },
      { title: '고객관리(RM)', desc: '기업/개인 고객과의 관계를 관리하고 금융 솔루션을 제안합니다' },
    ],
    certs: ['AFPK', 'CFP', '은행텔러자격'],
    companies: ['하나은행', '삼성카드', '삼성생명', 'KB증권 WM'],
  },
  SAIC: {
    code: 'SAIC',
    name: '혁신의 설계자',
    description:
      '당신은 안정성을 기반으로 하되, 창의적 사고로 새로운 방향을 제시하는 능력이 있습니다. 정성적 분석력과 혁신적 마인드를 결합하여, 기존 금융의 프레임워크를 개선하고 디지털 전환을 이끄는 역할에 적합합니다. 전통 금융과 핀테크의 가교 역할을 할 수 있는 인재입니다.',
    sectors: ['인터넷전문은행', '핀테크', '금융 IT'],
    sectorLinks: ['/companies/banks', '/companies/fintech', '/companies/fintech'],
    jobs: [
      { title: '프로덕트매니저(PM)', desc: '금융 상품·서비스의 기획부터 출시까지 총괄합니다' },
      { title: '디지털전략', desc: '금융기관의 디지털 트랜스포메이션 전략을 수립합니다' },
      { title: 'UX 기획', desc: '사용자 중심의 금융 서비스 경험을 설계합니다' },
    ],
    certs: ['AFPK', 'SQLD', 'PMP'],
    companies: ['카카오뱅크', '토스', '네이버파이낸셜', '케이뱅크'],
  },
  SAEC: {
    code: 'SAEC',
    name: '소통의 개척자',
    description:
      '당신은 뛰어난 대인관계 능력과 분석적 사고를 겸비한 유형입니다. 안정적 기반 위에서 자율적으로 고객과 시장을 개척하는 역할에 강합니다. 금융 상품에 대한 이해를 바탕으로 영업 현장에서 고객의 니즈를 정확히 파악하고 솔루션을 제안하는 데 탁월합니다.',
    sectors: ['보험 GA관리', 'WM센터', '은행 영업점'],
    sectorLinks: ['/companies/insurance', '/companies/securities', '/companies/banks'],
    jobs: [
      { title: '영업관리', desc: 'GA채널 및 영업조직의 성과를 관리하고 전략을 수립합니다' },
      { title: '자산관리(WM)', desc: '고객의 자산 포트폴리오를 설계하고 관리합니다' },
      { title: '방카슈랑스', desc: '은행 채널을 통한 보험 상품 판매 전략을 수립합니다' },
    ],
    certs: ['AFPK', 'CFP', '변액보험판매자격'],
    companies: ['삼성생명', 'KB손해보험', '미래에셋증권 WM', '한화생명'],
  },
  SQIR: {
    code: 'SQIR',
    name: '정밀의 분석가',
    description:
      '당신은 수리적 능력과 체계적 사고를 겸비한 분석 전문가입니다. 복잡한 데이터 속에서 패턴을 찾아내고, 정밀한 모델을 구축하는 데 강점이 있습니다. 규정과 프로세스를 준수하며 독립적으로 깊이 있는 분석 작업을 수행하는 환경에서 최고의 성과를 발휘합니다.',
    sectors: ['보험 계리', '리스크관리', '금융감독원'],
    sectorLinks: ['/companies/insurance', '/career/job-categories', '/companies/policy-finance'],
    jobs: [
      { title: '계리사', desc: '보험 상품의 가격 결정과 책임준비금을 산출합니다' },
      { title: '리스크모델링', desc: '금융 리스크를 정량화하고 모델을 개발·검증합니다' },
      { title: 'ALM 분석', desc: '자산-부채 매칭 전략을 수립하고 관리합니다' },
    ],
    certs: ['보험계리사', 'FRM', 'SOA(북미계리사)'],
    companies: ['삼성화재', '한화생명', '금융감독원', 'DB손해보험'],
  },
  SQER: {
    code: 'SQER',
    name: '데이터의 통역사',
    description:
      '당신은 수리적 분석 능력과 커뮤니케이션 능력을 균형 있게 갖춘 유형입니다. 데이터에서 의미를 추출하고 이를 비전문가에게도 이해하기 쉽게 전달하는 데 탁월합니다. 체계적 환경에서 데이터 기반 의사결정을 지원하는 역할에 가장 적합합니다.',
    sectors: ['카드사', '저축은행', '캐피탈'],
    sectorLinks: ['/companies/card', '/companies/savings-banks', '/companies/capital'],
    jobs: [
      { title: '데이터분석', desc: '고객 행동 데이터를 분석하여 비즈니스 인사이트를 도출합니다' },
      { title: '심사/여신', desc: '정량적 모델 기반으로 신용 심사 체계를 운영합니다' },
      { title: 'CRM 분석', desc: '고객 관계 데이터를 분석하여 마케팅 전략을 수립합니다' },
    ],
    certs: ['ADsP', 'SQLD', '신용분석사'],
    companies: ['삼성카드', '현대카드', 'SBI저축은행', '현대캐피탈'],
  },
  SQIC: {
    code: 'SQIC',
    name: '시스템의 혁신가',
    description:
      '당신은 수리·기술적 역량과 혁신적 사고를 겸비한 유형입니다. 복잡한 시스템을 설계하고 기술로 금융의 새로운 가능성을 여는 데 관심이 많습니다. 독립적으로 깊이 있는 기술 작업을 수행하면서도 창의적 접근을 추구하는 환경에서 빛납니다.',
    sectors: ['핀테크', '금융인프라', '빅테크 금융'],
    sectorLinks: ['/companies/fintech', '/companies/fintech', '/companies/fintech'],
    jobs: [
      { title: '데이터사이언스', desc: 'ML/AI를 활용한 금융 모델을 개발합니다' },
      { title: '시스템개발', desc: '금융 거래 시스템과 인프라를 설계·개발합니다' },
      { title: 'AI/ML 엔지니어', desc: '금융 데이터를 활용한 인공지능 모델을 구축합니다' },
    ],
    certs: ['ADsP/ADP', 'CFA Level 1', 'AWS 자격증'],
    companies: ['토스', '카카오페이', '두나무', 'NHN페이코'],
  },
  SQEC: {
    code: 'SQEC',
    name: '정량의 소통가',
    description:
      '당신은 정량적 분석 역량과 뛰어난 소통 능력을 동시에 보유한 유형입니다. 수치와 데이터를 활용하면서도 고객과의 직접적인 소통을 즐기며, 자율적인 환경에서 성과를 만들어내는 데 강합니다. 금융 세일즈와 자문 분야에서 차별화된 역량을 발휘할 수 있습니다.',
    sectors: ['증권 WM', '은행 기업금융', '자산운용 세일즈'],
    sectorLinks: ['/companies/securities', '/companies/banks', '/companies/asset-management'],
    jobs: [
      { title: '자산관리(WM)', desc: '정량적 분석을 기반으로 고객 맞춤 포트폴리오를 제안합니다' },
      { title: '기업금융(CF)', desc: '기업 고객의 자금 조달과 재무 구조를 자문합니다' },
      { title: '펀드세일즈', desc: '기관투자자에게 펀드 상품을 소개하고 관계를 관리합니다' },
    ],
    certs: ['CFA', 'AFPK/CFP', '투자자산운용사'],
    companies: ['미래에셋증권', 'KB증권', '삼성자산운용', 'NH투자증권'],
  },
  DAIR: {
    code: 'DAIR',
    name: '전략의 감별사',
    description:
      '당신은 도전적 환경에서 깊이 있는 분석으로 투자 기회를 발굴하는 유형입니다. 독립적으로 산업과 기업을 연구하며, 체계적인 분석 프레임워크 안에서 날카로운 인사이트를 도출하는 데 탁월합니다. 리서치와 신용분석 분야에서 최고의 역량을 발휘할 수 있습니다.',
    sectors: ['증권 리서치', '신용평가사', '자산운용'],
    sectorLinks: ['/companies/securities', '/companies/credit-rating', '/companies/asset-management'],
    jobs: [
      { title: '애널리스트(리서치)', desc: '산업과 기업을 분석하여 투자 의견을 제시합니다' },
      { title: '신용분석', desc: '기업 및 금융상품의 신용등급을 평가합니다' },
      { title: '전략/이코노미스트', desc: '거시경제와 시장 전략에 대한 분석을 수행합니다' },
    ],
    certs: ['CFA', 'CIIA', '금융투자분석사'],
    companies: ['한국투자증권', '한국신용평가', 'NICE신용평가', '삼성증권'],
  },
  DAER: {
    code: 'DAER',
    name: '딜의 마에스트로',
    description:
      '당신은 도전적인 딜 환경에서 관계를 활용하여 기회를 만드는 데 뛰어난 유형입니다. 분석적 사고와 대인관계 역량을 결합하여, 체계적 프로세스 안에서 대규모 금융 거래를 성사시키는 역할에 적합합니다. IB와 M&A 분야에서 최고의 딜메이커로 성장할 수 있습니다.',
    sectors: ['증권 IB', 'M&A 자문', '대형 회계법인 FAS'],
    sectorLinks: ['/companies/securities', '/career/job-categories', '/companies/securities'],
    jobs: [
      { title: 'IB(투자은행)', desc: '기업의 자본 조달, 구조조정, M&A를 자문합니다' },
      { title: '딜소싱', desc: 'M&A 및 투자 기회를 발굴하고 딜을 추진합니다' },
      { title: 'IPO/유상증자', desc: '기업공개와 자본시장 거래를 주관합니다' },
    ],
    certs: ['CFA', '공인회계사(CPA)', '변호사'],
    companies: ['삼성증권 IB', '한국투자증권 IB', '미래에셋증권 IB', 'NH투자증권 IB'],
  },
  DAIC: {
    code: 'DAIC',
    name: '가치의 탐험가',
    description:
      '당신은 남들이 보지 못하는 가치를 발견하는 눈을 가진 유형입니다. 도전적이고 자율적인 환경에서 독립적으로 투자 대상을 분석하고, 창의적 시각으로 숨겨진 가치를 평가하는 데 강점이 있습니다. VC, PE, 자산운용 분야에서 탁월한 투자 전문가로 성장할 수 있습니다.',
    sectors: ['자산운용', 'VC/PEF', '사모펀드'],
    sectorLinks: ['/companies/asset-management', '/companies/vc-pe', '/companies/vc-pe'],
    jobs: [
      { title: '펀드매니저', desc: '투자 포트폴리오를 구성하고 운용 전략을 실행합니다' },
      { title: '심사역(VC)', desc: '스타트업의 투자 가치를 평가하고 투자를 집행합니다' },
      { title: '바이아웃 심사', desc: '기업 인수 기회를 평가하고 가치 창출 전략을 수립합니다' },
    ],
    certs: ['CFA', 'CAIA', '투자자산운용사'],
    companies: ['한국투자파트너스', '스틱인베스트먼트', '삼성자산운용', 'IMM인베스트먼트'],
  },
  DAEC: {
    code: 'DAEC',
    name: '시장의 교섭가',
    description:
      '당신은 시장의 역동적인 환경에서 빠른 판단력과 대인관계 능력으로 기회를 잡는 유형입니다. 정성적 감각과 소통 능력을 바탕으로 트레이딩과 세일즈 영역에서 뛰어난 성과를 발휘할 수 있습니다. 자유롭고 도전적인 금융시장의 최전선에서 가장 빛나는 인재입니다.',
    sectors: ['증권 S&T', '외환딜링', '선물사'],
    sectorLinks: ['/companies/securities', '/companies/banks', '/companies/securities'],
    jobs: [
      { title: '트레이더', desc: '주식, 채권, 외환 등 금융상품을 직접 매매합니다' },
      { title: '세일즈(기관영업)', desc: '기관투자자에게 시장 뷰와 투자 아이디어를 제공합니다' },
      { title: '외환딜러', desc: '외환시장에서 환율 거래를 수행합니다' },
    ],
    certs: ['금융투자분석사', '외환관리사', 'CFA'],
    companies: ['골드만삭스 서울', 'JP모간 서울', '한국투자증권 S&T', '삼성증권 트레이딩'],
  },
  DQIR: {
    code: 'DQIR',
    name: '퀀트 전략가',
    description:
      '당신은 수학과 통계를 무기로 금융시장의 비밀을 풀어내는 유형입니다. 도전적 환경에서 독립적으로 정밀한 정량 모델을 개발하는 데 열정이 있으며, 체계적인 리스크 프레임워크 안에서 최적의 투자 전략을 설계합니다. 퀀트 금융의 최전선에서 활약할 인재입니다.',
    sectors: ['자산운용 퀀트', '선물사', '리스크 컨설팅'],
    sectorLinks: ['/companies/asset-management', '/companies/securities', '/career/job-categories'],
    jobs: [
      { title: '퀀트', desc: '수학적 모델을 활용하여 투자 전략을 개발합니다' },
      { title: '리스크모델링', desc: 'VaR, 스트레스테스트 등 리스크 모델을 설계합니다' },
      { title: '파생상품 가격결정', desc: '옵션 등 파생상품의 이론가를 산출합니다' },
    ],
    certs: ['FRM', 'CQF', 'CFA'],
    companies: ['삼성자산운용', '미래에셋자산운용', '타워리서치', '이스트스프링'],
  },
  DQER: {
    code: 'DQER',
    name: '시장의 해석자',
    description:
      '당신은 정량적 분석과 시장 감각을 겸비한 유형입니다. 도전적 환경에서 데이터와 수치를 기반으로 시장을 해석하며, 규정된 프레임워크 안에서 거래 상대방과 적극적으로 소통합니다. 파생상품, 구조화 금융 등 복잡한 금융의 세계에서 핵심 역할을 수행할 수 있습니다.',
    sectors: ['증권 S&T', '파생상품', '구조화금융'],
    sectorLinks: ['/companies/securities', '/career/job-categories', '/companies/securities'],
    jobs: [
      { title: '파생상품트레이딩', desc: '옵션, 선물 등 파생상품을 거래하고 헤지합니다' },
      { title: '구조화금융', desc: 'ABS, MBS 등 구조화 상품을 설계하고 운용합니다' },
      { title: '프라이싱', desc: '복잡한 금융상품의 가격을 산정하고 호가를 제시합니다' },
    ],
    certs: ['FRM', 'CFA', '금융공학 관련 석사'],
    companies: ['한국투자증권', 'NH투자증권', '메리츠증권', 'KB증권'],
  },
  DQIC: {
    code: 'DQIC',
    name: '알고리즘의 창조자',
    description:
      '당신은 기술과 금융의 교차점에서 새로운 가치를 창출하는 유형입니다. 도전적이고 자율적인 환경에서 독립적으로 정량 모델과 알고리즘을 설계·구현하는 데 열정이 있습니다. 코딩과 수학적 사고를 결합하여 금융의 미래를 프로그래밍하는 인재입니다.',
    sectors: ['핀테크', '자산운용 퀀트', '크립토/블록체인'],
    sectorLinks: ['/companies/fintech', '/companies/asset-management', '/companies/fintech'],
    jobs: [
      { title: '퀀트개발', desc: '투자 전략 알고리즘을 설계하고 시스템으로 구현합니다' },
      { title: '알고리즘트레이딩', desc: '자동화된 매매 시스템을 개발하고 운영합니다' },
      { title: '블록체인개발', desc: 'DeFi, 스마트컨트랙트 등 블록체인 금융을 개발합니다' },
    ],
    certs: ['CQF', 'FRM', 'CS/금융공학 석사'],
    companies: ['두나무', '토스증권', '쿼터백자산운용', '헤지펀드'],
  },
  DQEC: {
    code: 'DQEC',
    name: '네트워크의 전략가',
    description:
      '당신은 정량적 역량과 대인관계 능력, 그리고 창의적 사고를 모두 갖춘 다재다능한 유형입니다. 도전적 환경에서 다양한 이해관계자와 소통하며 복잡한 딜을 성사시키는 역할에 적합합니다. VC/PE와 자본시장 분야에서 전략적 네트워킹과 분석을 결합한 독보적 역할을 수행할 수 있습니다.',
    sectors: ['VC/PEF', '증권 IB', '벤처캐피탈'],
    sectorLinks: ['/companies/vc-pe', '/companies/securities', '/companies/vc-pe'],
    jobs: [
      { title: '심사역(PE)', desc: '투자 대상 기업의 가치를 평가하고 딜을 구조화합니다' },
      { title: 'ECM/DCM', desc: '주식/채권 발행을 통한 자본 조달을 주관합니다' },
      { title: '벤처투자심사', desc: '스타트업의 기술·시장성을 분석하고 투자를 결정합니다' },
    ],
    certs: ['CFA', 'CPA', 'CAIA'],
    companies: ['한국벤처투자', 'KKR 서울', 'MBK파트너스', 'NH투자증권 IB'],
  },
};

// ─── Component ───────────────────────────────────────────────────────

const FinanceMBTI: React.FC = () => {
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [result, setResult] = useState<TypeProfile | null>(null);
  const [animating, setAnimating] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(true);

  const totalQuestions = questions.length;

  // Compute result type from answers
  const computeType = (ans: Record<number, 'A' | 'B'>): string => {
    const dims: Record<string, { a: number; b: number }> = {
      SD: { a: 0, b: 0 },
      AQ: { a: 0, b: 0 },
      IE: { a: 0, b: 0 },
      RC: { a: 0, b: 0 },
    };

    questions.forEach((q) => {
      const choice = ans[q.id];
      if (choice === 'A') dims[q.dimension].a++;
      else if (choice === 'B') dims[q.dimension].b++;
    });

    const sd = dims.SD.a >= dims.SD.b ? 'S' : 'D';
    const aq = dims.AQ.a >= dims.AQ.b ? 'A' : 'Q';
    const ie = dims.IE.a >= dims.IE.b ? 'I' : 'E';
    const rc = dims.RC.a >= dims.RC.b ? 'R' : 'C';

    return `${sd}${aq}${ie}${rc}`;
  };

  const handleAnswer = (choice: 'A' | 'B') => {
    if (animating) return;

    const q = questions[currentQ];
    const newAnswers = { ...answers, [q.id]: choice };
    setAnswers(newAnswers);

    if (currentQ < totalQuestions - 1) {
      setAnimating(true);
      setFadeIn(false);
      setTimeout(() => {
        setCurrentQ(currentQ + 1);
        setFadeIn(true);
        setAnimating(false);
      }, 300);
    } else {
      // Compute result
      setAnimating(true);
      setFadeIn(false);
      setTimeout(() => {
        const typeCode = computeType(newAnswers);
        setResult(typeProfiles[typeCode] || typeProfiles['SAIR']);
        setFadeIn(true);
        setAnimating(false);
      }, 500);
    }
  };

  const handleReset = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentQ(0);
      setAnswers({});
      setResult(null);
      setFadeIn(true);
    }, 300);
  };

  const progress = result ? 100 : ((currentQ) / totalQuestions) * 100;

  // ─── Styles ──────────────────────────────────────────────────────

  const styles: Record<string, React.CSSProperties> = {
    container: {
      maxWidth: 720,
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    progressBarOuter: {
      width: '100%',
      height: 8,
      backgroundColor: '#e5e7eb',
      borderRadius: 4,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressBarInner: {
      height: '100%',
      backgroundColor: '#2563eb',
      borderRadius: 4,
      transition: 'width 0.4s ease',
      width: `${progress}%`,
    },
    progressText: {
      textAlign: 'right' as const,
      fontSize: 14,
      color: '#6b7280',
      marginBottom: 24,
    },
    card: {
      background: '#ffffff',
      borderRadius: 16,
      padding: '32px 28px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      opacity: fadeIn ? 1 : 0,
      transform: fadeIn ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    questionNumber: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      color: '#fff',
      borderRadius: 20,
      padding: '4px 14px',
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 16,
    },
    questionText: {
      fontSize: 20,
      fontWeight: 700,
      color: '#111827',
      lineHeight: 1.5,
      marginBottom: 28,
      marginTop: 0,
    },
    choiceButton: {
      display: 'block',
      width: '100%',
      padding: '16px 20px',
      marginBottom: 12,
      border: '2px solid #e5e7eb',
      borderRadius: 12,
      backgroundColor: '#fafafa',
      cursor: 'pointer',
      textAlign: 'left' as const,
      fontSize: 16,
      lineHeight: 1.5,
      color: '#374151',
      fontWeight: 500,
      transition: 'all 0.2s ease',
    },
    choiceButtonHoverA: {
      borderColor: '#2563eb',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
    },
    choiceButtonHoverB: {
      borderColor: '#7c3aed',
      backgroundColor: '#f5f3ff',
      color: '#6d28d9',
    },
    choiceLabel: {
      display: 'inline-block',
      fontWeight: 700,
      marginRight: 8,
      fontSize: 14,
    },

    // Result styles
    resultHeader: {
      textAlign: 'center' as const,
      marginBottom: 32,
    },
    typeCode: {
      display: 'inline-block',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      color: '#fff',
      borderRadius: 12,
      padding: '8px 24px',
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: 4,
      marginBottom: 12,
    },
    typeName: {
      fontSize: 26,
      fontWeight: 800,
      color: '#111827',
      marginTop: 12,
      marginBottom: 8,
    },
    typeDesc: {
      fontSize: 16,
      color: '#4b5563',
      lineHeight: 1.7,
      marginBottom: 0,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 12,
      marginTop: 28,
      paddingBottom: 8,
      borderBottom: '2px solid #e5e7eb',
    },
    tag: {
      display: 'inline-block',
      padding: '6px 14px',
      borderRadius: 20,
      fontSize: 14,
      fontWeight: 600,
      marginRight: 8,
      marginBottom: 8,
    },
    sectorTag: {
      backgroundColor: '#eff6ff',
      color: '#2563eb',
      textDecoration: 'none',
    },
    certTag: {
      backgroundColor: '#f5f3ff',
      color: '#7c3aed',
    },
    companyTag: {
      backgroundColor: '#f0fdf4',
      color: '#16a34a',
    },
    jobCard: {
      background: '#f9fafb',
      borderRadius: 10,
      padding: '14px 18px',
      marginBottom: 10,
      border: '1px solid #e5e7eb',
    },
    jobTitle: {
      fontWeight: 700,
      fontSize: 15,
      color: '#2563eb',
      marginBottom: 4,
    },
    jobDesc: {
      fontSize: 14,
      color: '#6b7280',
      margin: 0,
    },
    resetButton: {
      display: 'block',
      width: '100%',
      padding: '16px',
      marginTop: 32,
      border: 'none',
      borderRadius: 12,
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      color: '#fff',
      fontSize: 17,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'opacity 0.2s ease',
    },
    linkRow: {
      marginTop: 24,
      padding: '16px 20px',
      background: '#f9fafb',
      borderRadius: 12,
      border: '1px solid #e5e7eb',
    },
    linkRowTitle: {
      fontSize: 14,
      fontWeight: 700,
      color: '#6b7280',
      marginBottom: 8,
      marginTop: 0,
    },
    link: {
      display: 'inline-block',
      color: '#2563eb',
      fontSize: 14,
      fontWeight: 500,
      marginRight: 16,
      marginBottom: 4,
      textDecoration: 'none',
    },
    dimensionBar: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10,
      fontSize: 14,
    },
    dimLabel: {
      width: 32,
      fontWeight: 700,
      textAlign: 'center' as const,
    },
    dimBarOuter: {
      flex: 1,
      height: 10,
      backgroundColor: '#e5e7eb',
      borderRadius: 5,
      margin: '0 10px',
      overflow: 'hidden',
      position: 'relative' as const,
    },
    dimBarInner: {
      height: '100%',
      borderRadius: 5,
      transition: 'width 0.6s ease',
    },
  };

  // ─── Render Question ─────────────────────────────────────────────

  const renderQuestion = () => {
    const q = questions[currentQ];
    const dimensionLabels: Record<string, string> = {
      SD: '환경 선호',
      AQ: '사고 방식',
      IE: '업무 스타일',
      RC: '조직 문화',
    };

    return (
      <div style={styles.card}>
        <span style={styles.questionNumber}>
          Q{currentQ + 1} / {totalQuestions} &middot; {dimensionLabels[q.dimension]}
        </span>
        <p style={styles.questionText}>{q.text}</p>
        <ChoiceButton label="A" text={q.choiceA} onClick={() => handleAnswer('A')} variant="A" />
        <ChoiceButton label="B" text={q.choiceB} onClick={() => handleAnswer('B')} variant="B" />
      </div>
    );
  };

  // ─── Render Result ───────────────────────────────────────────────

  const renderResult = () => {
    if (!result) return null;

    // Compute dimension scores for visualization
    const dims: Record<string, { a: number; b: number }> = {
      SD: { a: 0, b: 0 },
      AQ: { a: 0, b: 0 },
      IE: { a: 0, b: 0 },
      RC: { a: 0, b: 0 },
    };
    questions.forEach((q) => {
      const choice = answers[q.id];
      if (choice === 'A') dims[q.dimension].a++;
      else if (choice === 'B') dims[q.dimension].b++;
    });

    const dimConfig = [
      { key: 'SD', left: 'S (안정)', right: 'D (도전)' },
      { key: 'AQ', left: 'A (분석)', right: 'Q (정량)' },
      { key: 'IE', left: 'I (내향)', right: 'E (외향)' },
      { key: 'RC', left: 'R (규정)', right: 'C (창의)' },
    ];

    return (
      <div style={styles.card}>
        <div style={styles.resultHeader}>
          <div style={styles.typeCode}>{result.code}</div>
          <div style={styles.typeName}>{result.name}</div>
          <p style={styles.typeDesc}>{result.description}</p>
        </div>

        {/* Dimension visualization */}
        <div style={styles.sectionTitle}>성향 분석</div>
        {dimConfig.map((dim) => {
          const total = dims[dim.key].a + dims[dim.key].b;
          const leftPct = total > 0 ? (dims[dim.key].a / total) * 100 : 50;
          const isLeft = leftPct >= 50;
          return (
            <div key={dim.key} style={styles.dimensionBar}>
              <span
                style={{
                  ...styles.dimLabel,
                  color: isLeft ? '#2563eb' : '#9ca3af',
                  fontSize: 13,
                  width: 70,
                  textAlign: 'right' as const,
                }}
              >
                {dim.left}
              </span>
              <div style={styles.dimBarOuter}>
                <div
                  style={{
                    ...styles.dimBarInner,
                    width: `${leftPct}%`,
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                  }}
                />
              </div>
              <span
                style={{
                  ...styles.dimLabel,
                  color: !isLeft ? '#7c3aed' : '#9ca3af',
                  fontSize: 13,
                  width: 70,
                  textAlign: 'left' as const,
                }}
              >
                {dim.right}
              </span>
            </div>
          );
        })}

        {/* Sectors */}
        <div style={styles.sectionTitle}>추천 섹터</div>
        <div>
          {result.sectors.map((sector, i) => (
            <a
              key={i}
              href={result.sectorLinks[i] || '#'}
              style={{ ...styles.tag, ...styles.sectorTag }}
            >
              {sector}
            </a>
          ))}
        </div>

        {/* Jobs */}
        <div style={styles.sectionTitle}>추천 직무</div>
        {result.jobs.map((job, i) => (
          <div key={i} style={styles.jobCard}>
            <div style={styles.jobTitle}>{job.title}</div>
            <p style={styles.jobDesc}>{job.desc}</p>
          </div>
        ))}

        {/* Certs */}
        <div style={styles.sectionTitle}>추천 자격증</div>
        <div>
          {result.certs.map((cert, i) => (
            <span key={i} style={{ ...styles.tag, ...styles.certTag }}>
              {cert}
            </span>
          ))}
        </div>

        {/* Companies */}
        <div style={styles.sectionTitle}>적합 기업 예시</div>
        <div>
          {result.companies.map((company, i) => (
            <span key={i} style={{ ...styles.tag, ...styles.companyTag }}>
              {company}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={styles.linkRow}>
          <p style={styles.linkRowTitle}>더 알아보기</p>
          <a href="/companies-overview" style={styles.link}>
            금융권 기업 총람
          </a>
          <a href="/career-job-categories" style={styles.link}>
            직무 종류 및 특성
          </a>
          <a href="/career-requirements" style={styles.link}>
            합격 요건 분석
          </a>
          <a href="/career-roadmap" style={styles.link}>
            취업 로드맵
          </a>
        </div>

        <button
          style={styles.resetButton}
          onClick={handleReset}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.opacity = '0.85';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.opacity = '1';
          }}
        >
          다시 테스트하기
        </button>
      </div>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────

  return (
    <div style={styles.container}>
      {/* Progress bar */}
      <div style={styles.progressBarOuter}>
        <div style={styles.progressBarInner} />
      </div>
      <div style={styles.progressText}>
        {result ? '완료!' : `${currentQ + 1} / ${totalQuestions}`}
      </div>

      {/* Content */}
      {result ? renderResult() : renderQuestion()}
    </div>
  );
};

// ─── ChoiceButton Sub-component ────────────────────────────────────

interface ChoiceButtonProps {
  label: string;
  text: string;
  onClick: () => void;
  variant: 'A' | 'B';
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ label, text, onClick, variant }) => {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '16px 20px',
    marginBottom: 12,
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: 16,
    lineHeight: 1.5,
    color: '#374151',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  const hoverStyleA: React.CSSProperties = {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
  };

  const hoverStyleB: React.CSSProperties = {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
    color: '#6d28d9',
  };

  const hoverStyle = variant === 'A' ? hoverStyleA : hoverStyleB;
  const appliedStyle = hovered ? { ...baseStyle, ...hoverStyle } : baseStyle;

  return (
    <button
      style={appliedStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        style={{
          display: 'inline-block',
          fontWeight: 700,
          marginRight: 8,
          fontSize: 14,
          color: hovered ? (variant === 'A' ? '#2563eb' : '#7c3aed') : '#9ca3af',
        }}
      >
        {label}.
      </span>
      {text}
    </button>
  );
};

export default FinanceMBTI;
