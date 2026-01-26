/**
 * Valuation Academy 공유 타입 정의
 */

// DCF 관련 타입
export interface DCFInputs {
  fcf: number[];              // 향후 5년 FCF 예측 (억원)
  wacc: number;               // 할인율 (%)
  terminalGrowth: number;     // 영구성장률 (%)
  sharesOutstanding: number;  // 발행주식수 (백만주)
  netDebt: number;            // 순부채 (억원)
}

export interface DCFResult {
  pvFCF: number[];            // 각 연도 FCF 현재가치
  terminalValue: number;      // 터미널 가치
  pvTerminalValue: number;    // 터미널 가치 현재가치
  enterpriseValue: number;    // 기업가치
  equityValue: number;        // 자기자본가치
  intrinsicPrice: number;     // 주당 내재가치
  tvPercentage: number;       // TV 비중 (%)
}

// WACC 관련 타입
export interface WACCInputs {
  // CAPM 구성요소
  riskFreeRate: number;       // 무위험이자율 (%)
  beta: number;               // 베타
  marketRiskPremium: number;  // 시장위험프리미엄 (%)

  // 부채비용
  costOfDebt: number;         // 세전 부채비용 (%)
  taxRate: number;            // 법인세율 (%)

  // 자본구조
  equityValue: number;        // 시가총액 (억원)
  debtValue: number;          // 이자부부채 (억원)
}

export interface WACCResult {
  costOfEquity: number;       // 자기자본비용 (%)
  afterTaxCostOfDebt: number; // 세후 부채비용 (%)
  equityWeight: number;       // 자기자본 비중
  debtWeight: number;         // 부채 비중
  wacc: number;               // WACC (%)
  totalValue: number;         // 총 자본가치
}

// 그레이엄 넘버 관련 타입
export interface GrahamInputs {
  eps: number;                // 주당순이익 (원)
  bvps: number;               // 주당순자산 (원)
  currentPrice: number;       // 현재 주가 (원)
}

export interface GrahamResult {
  grahamNumber: number;       // 그레이엄 넘버
  marginOfSafety: number;     // 안전마진 (%)
  currentPER: number;         // 현재 PER
  currentPBR: number;         // 현재 PBR
  perCriteria: boolean;       // PER 기준 충족
  pbrCriteria: boolean;       // PBR 기준 충족
  combinedCriteria: boolean;  // 복합 기준 충족
  isUndervalued: boolean;     // 저평가 여부
}

// PEG 관련 타입
export interface PEGInputs {
  ticker: string;
  per: number;                // PER
  epsGrowthRate: number;      // EPS 성장률 (%)
  currentPrice: number;       // 현재 주가
}

export interface PEGResult {
  peg: number;                // PEG Ratio
  interpretation: 'undervalued' | 'fair' | 'overvalued';
  fairValue: number;          // 적정 가치 추정
}

// 채권 듀레이션 관련 타입
export interface DurationInputs {
  faceValue: number;          // 액면가
  couponRate: number;         // 표면이율 (%)
  ytm: number;                // 만기수익률 (%)
  yearsToMaturity: number;    // 잔존 만기 (년)
  frequency: 1 | 2 | 4;       // 이자 지급 빈도 (연 1,2,4회)
}

export interface DurationResult {
  macaulayDuration: number;   // 맥컬레이 듀레이션
  modifiedDuration: number;   // 수정 듀레이션
  convexity: number;          // 컨벡시티
  bondPrice: number;          // 채권 가격
  priceChange1bp: number;     // 1bp 변동 시 가격 변화
}

// 옵션 그릭스 관련 타입
export interface OptionInputs {
  spotPrice: number;          // 기초자산 현재가
  strikePrice: number;        // 행사가
  timeToExpiry: number;       // 잔존 만기 (년)
  riskFreeRate: number;       // 무위험이자율 (%)
  volatility: number;         // 내재변동성 (%)
  optionType: 'call' | 'put';
}

export interface OptionResult {
  price: number;              // 옵션 가격
  delta: number;              // 델타
  gamma: number;              // 감마
  theta: number;              // 세타 (일당)
  vega: number;               // 베가
  rho: number;                // 로
  intrinsicValue: number;     // 내재가치
  timeValue: number;          // 시간가치
}

// 민감도 분석 관련 타입
export interface SensitivityInput {
  baseValue: number;
  range: number[];
}

export interface SensitivityResult {
  label: string;
  values: number[];
}

// AI 챗봇 관련 타입
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatContext {
  currentPage?: string;
  relatedTopics?: string[];
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

// 학습 관련 타입
export interface LearningModule {
  id: string;
  title: string;
  description: string;
  duration: number;           // 분 단위
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  wikiLinks?: string[];
}

export interface UserProgress {
  moduleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  score?: number;
  completedAt?: Date;
}
