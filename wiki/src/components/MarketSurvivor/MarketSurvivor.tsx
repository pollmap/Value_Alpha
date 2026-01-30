import React, { useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Action = 'buy' | 'sell' | 'hold' | 'short';
type PositionSize = 25 | 50 | 75 | 100;

interface Scenario {
  id: number;
  year: string;
  title: string;
  period: string;
  targetAsset: string; // 매매 대상 자산
  assetDetail: string; // 자산 상세 설명
  headline: string;
  description: string;
  chartDescription: string;
  kospiLevel: string;
  bestAction: Action;
  actualOutcome: string;
  returnPercent: number; // what actually happened to the market next
  explanation: string;
}

interface RoundResult {
  scenarioId: number;
  action: Action;
  positionSize: PositionSize;
  portfolioChange: number;
  portfolioAfter: number;
  wasOptimal: boolean;
}

interface Ranking {
  title: string;
  emoji: string;
  description: string;
  minReturn: number;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const INITIAL_CAPITAL = 100_000_000;

const scenarios: Scenario[] = [
  {
    id: 1,
    year: '1997년 10월',
    title: 'IMF 외환위기 전야',
    period: '1997 IMF 위기',
    targetAsset: 'KOSPI 대형주 (삼성전자, 현대자동차, SK텔레콤)',
    assetDetail: '시가총액 상위 대형 수출주 포트폴리오',
    headline: '태국 바트화 폭락, 아시아 금융위기 확산 우려',
    description:
      '동남아시아에서 시작된 외환위기가 한국으로 번질 조짐을 보이고 있습니다. 기업 부채비율이 400%를 넘는 대기업이 속출하고, 외환보유고가 급격히 감소하고 있습니다. 한보철강, 삼미그룹 등이 이미 부도 처리되었습니다.',
    chartDescription:
      'KOSPI가 700선에서 급격히 하락 중입니다. 거래량이 급증하고 외국인 매도세가 거세집니다.',
    kospiLevel: 'KOSPI 700 → 하락 추세',
    bestAction: 'sell',
    actualOutcome:
      '1997년 12월 IMF 구제금융 신청, KOSPI는 280까지 폭락했습니다.',
    returnPercent: -60,
    explanation:
      'IMF 외환위기로 KOSPI는 700에서 280까지 약 60% 폭락했습니다. 대규모 기업 부도와 금융기관 퇴출이 이어졌습니다.',
  },
  {
    id: 2,
    year: '1998년 9월',
    title: 'IMF 위기 바닥권',
    period: '1998 IMF 회복 초기',
    targetAsset: '금융주 (국민은행, 신한금융, 하나은행)',
    assetDetail: '구조조정 수혜가 예상되는 은행·금융지주 종목',
    headline: 'IMF 구제금융 이후, 구조조정 본격화 - 금 모으기 운동 확산',
    description:
      'IMF 구제금융 이후 강도 높은 구조조정이 진행 중입니다. 실업률이 7%를 돌파했지만, 금 모으기 운동 등 국민적 노력이 계속되고 있습니다. 환율이 안정화 조짐을 보이기 시작합니다.',
    chartDescription:
      'KOSPI가 300 부근에서 저점을 형성하고 있습니다. 극도의 공포 분위기이지만, 일부 외국인 매수세가 유입됩니다.',
    kospiLevel: 'KOSPI 310 → 바닥권 형성',
    bestAction: 'buy',
    actualOutcome:
      '1999년 KOSPI는 1,000을 돌파하며 3배 이상 상승했습니다.',
    returnPercent: 220,
    explanation:
      '위기 이후 구조조정과 외국인 투자 유입으로 KOSPI는 310에서 1,000 이상으로 급등했습니다. 공포 속에서 매수한 투자자들이 큰 수익을 거뒀습니다.',
  },
  {
    id: 3,
    year: '2000년 3월',
    title: 'IT 버블 정점',
    period: '2000 닷컴 버블',
    targetAsset: '코스닥 IT주 (새롬기술, 골드뱅크, 다음커뮤니케이션)',
    assetDetail: '인터넷·벤처 관련 코스닥 상장 IT 기업',
    headline: '인터넷 혁명! 코스닥 벤처기업 주가 하늘 모르고 상승',
    description:
      '인터넷 관련 기업들의 주가가 매일 상한가를 기록하고 있습니다. 새롬기술, 골드뱅크 등 IT 벤처기업의 시가총액이 전통 대기업을 추월했습니다. "이번에는 다르다"는 분위기가 지배적입니다.',
    chartDescription:
      '코스닥 지수가 2,800을 돌파했습니다. 개인투자자의 신용매수가 사상 최고치를 기록합니다.',
    kospiLevel: 'KOSPI 1,050 / 코스닥 2,834',
    bestAction: 'sell',
    actualOutcome:
      '코스닥은 2,834에서 500 이하로 폭락하며 80% 이상 하락했습니다.',
    returnPercent: -45,
    explanation:
      'IT 버블 붕괴로 코스닥은 80% 이상 폭락했습니다. "이번에는 다르다"는 말은 버블의 전형적 신호였습니다.',
  },
  {
    id: 4,
    year: '2003년 3월',
    title: '카드 대란과 이라크 전쟁',
    period: '2003 카드사태',
    targetAsset: 'KOSPI 내수주 (LG전자, 삼성SDI, 포스코)',
    assetDetail: '내수 경기에 민감한 중대형주 포트폴리오',
    headline: '신용카드 부실 위기, 이라크 전쟁 발발 - 시장 공포 확산',
    description:
      '신용카드 남발로 인한 대규모 부실이 터지고 있습니다. LG카드가 유동성 위기에 빠졌고, 미국의 이라크 침공이 시작되었습니다. 이중 악재에 시장이 크게 흔들리고 있습니다.',
    chartDescription:
      'KOSPI가 500선 부근까지 하락했습니다. 투자심리가 극도로 위축되어 있습니다.',
    kospiLevel: 'KOSPI 515 → 공포 구간',
    bestAction: 'buy',
    actualOutcome:
      '2003년 하반기부터 반등 시작, 2007년 KOSPI 2,000 돌파까지 4배 상승했습니다.',
    returnPercent: 80,
    explanation:
      '카드 대란과 전쟁이라는 이중 악재가 해소되며 시장은 강하게 반등했습니다. 공포 속에서 매수한 장기 투자자들이 큰 성과를 거뒀습니다.',
  },
  {
    id: 5,
    year: '2007년 10월',
    title: '중국발 세계 호황 정점',
    period: '2007 글로벌 호황',
    targetAsset: '조선·철강·해운주 (현대중공업, POSCO, 한진해운)',
    assetDetail: '중국 특수 수혜 수출 업종 대표주',
    headline: 'KOSPI 사상 첫 2,000 돌파! 중국 특수에 수출 기업 실적 최고',
    description:
      '중국 경제성장에 힘입어 한국 수출 기업들의 실적이 사상 최고를 기록하고 있습니다. KOSPI가 처음으로 2,000을 돌파했으며, "3,000은 시간문제"라는 전망이 나옵니다.',
    chartDescription:
      'KOSPI가 2,050을 돌파하며 사상 최고가를 경신 중입니다. 모든 업종이 고르게 상승하고 있습니다.',
    kospiLevel: 'KOSPI 2,063 → 사상 최고가',
    bestAction: 'sell',
    actualOutcome:
      '2008년 글로벌 금융위기로 KOSPI는 890까지 폭락했습니다.',
    returnPercent: -55,
    explanation:
      '서브프라임 모기지 부실이 글로벌 금융위기로 확대되며 KOSPI는 2,063에서 890까지 57% 폭락했습니다.',
  },
  {
    id: 6,
    year: '2008년 10월',
    title: '글로벌 금융위기 공포',
    period: '2008 금융위기',
    targetAsset: '삼성전자 (반도체·IT 대장주)',
    assetDetail: '한국 시가총액 1위, 반도체 글로벌 리더',
    headline: '리먼브라더스 파산! 세계 금융시장 붕괴 - 공포지수 사상 최고',
    description:
      '미국 투자은행 리먼브라더스가 파산하며 글로벌 금융시스템이 마비되고 있습니다. 각국 정부가 긴급 구제금융에 나서고 있지만, 공포가 걷히지 않고 있습니다. 원화 가치가 급락하고 있습니다.',
    chartDescription:
      'KOSPI가 900선이 무너지며 연일 급락 중입니다. 서킷브레이커가 발동되었습니다.',
    kospiLevel: 'KOSPI 938 → 급락 중',
    bestAction: 'buy',
    actualOutcome:
      '2009년 각국 경기부양책에 힘입어 KOSPI는 1,700까지 회복했습니다.',
    returnPercent: 80,
    explanation:
      '각국 정부의 대규모 경기부양책과 양적완화 정책으로 시장은 급반등했습니다. 위기 속에서 용기 있게 매수한 투자자들이 보상받았습니다.',
  },
  {
    id: 7,
    year: '2011년 8월',
    title: '유럽 재정위기',
    period: '2011 유럽 위기',
    targetAsset: '현대자동차 (자동차·수출 대표주)',
    assetDetail: '글로벌 판매 확대 중인 한국 대표 수출 기업',
    headline: '그리스 디폴트 우려, 유럽 재정위기 확산 - 미국 신용등급 강등',
    description:
      '그리스, 이탈리아 등 남유럽 국가들의 재정위기가 심화되고 있습니다. 미국도 S&P로부터 사상 최초의 신용등급 강등을 받았습니다. 글로벌 경기 더블딥(이중침체) 우려가 커지고 있습니다.',
    chartDescription:
      'KOSPI가 2,200에서 1,700으로 급락했습니다. 외국인 매도세가 집중되고 있습니다.',
    kospiLevel: 'KOSPI 1,700 → 급락 후 불안',
    bestAction: 'hold',
    actualOutcome:
      'ECB의 적극적 개입으로 유럽 위기가 완화되며 KOSPI는 1,900~2,000선으로 점진적 회복했습니다.',
    returnPercent: 15,
    explanation:
      '유럽 재정위기는 심각했지만, 2008년 수준의 시스템 리스크는 아니었습니다. ECB의 "무엇이든 하겠다" 선언으로 위기가 완화되었습니다.',
  },
  {
    id: 8,
    year: '2020년 3월',
    title: 'COVID-19 팬데믹 공포',
    period: '2020 코로나 폭락',
    targetAsset: 'KODEX 200 ETF (KOSPI 200 추종)',
    assetDetail: 'KOSPI 200 지수를 추종하는 국내 대표 ETF',
    headline: '코로나19 세계적 대유행 선언! 경제 셧다운 - 전세계 동시 폭락',
    description:
      'WHO가 코로나19 팬데믹을 선언했습니다. 전 세계적으로 봉쇄 조치가 시행되며 경제활동이 마비되고 있습니다. KOSPI는 한 달 만에 35% 이상 폭락했습니다.',
    chartDescription:
      'KOSPI가 2,200에서 1,450까지 폭락했습니다. 사이드카와 서킷브레이커가 연이어 발동됩니다.',
    kospiLevel: 'KOSPI 1,457 → 폭락 (한달 -35%)',
    bestAction: 'buy',
    actualOutcome:
      '각국 대규모 유동성 공급으로 KOSPI는 2021년 1월 3,266까지 급등했습니다.',
    returnPercent: 120,
    explanation:
      '전례 없는 유동성 공급과 비대면 산업 성장으로 사상 최대 상승장이 펼쳐졌습니다. 동학개미운동으로 개인투자자들이 대거 시장에 참여했습니다.',
  },
  {
    id: 9,
    year: '2021년 6월',
    title: '동학개미 열풍과 과열 논란',
    period: '2021 과열장',
    targetAsset: '2차전지·바이오주 (LG에너지솔루션, 삼성바이오로직스, 카카오)',
    assetDetail: '개인투자자 집중 매수 업종의 고평가 성장주',
    headline: 'KOSPI 3,300 목전! 개인투자자 열풍 - "이번엔 진짜 다르다"',
    description:
      '동학개미운동과 서학개미 열풍이 이어지며 주식시장이 과열 양상을 보이고 있습니다. 빚투(신용거래)가 사상 최고치를 기록하고, 20~30대 젊은 투자자들이 대거 유입되었습니다. "주식만이 답"이라는 분위기입니다.',
    chartDescription:
      'KOSPI가 3,200을 넘어서며 사상 최고가를 경신 중입니다. 개인 신용잔고가 25조원을 돌파했습니다.',
    kospiLevel: 'KOSPI 3,278 → 사상 최고가',
    bestAction: 'sell',
    actualOutcome:
      '2022년 KOSPI는 금리 인상과 인플레이션 충격으로 2,200선까지 30% 이상 하락했습니다.',
    returnPercent: -30,
    explanation:
      '각국 중앙은행의 금리 인상 전환과 인플레이션 충격으로 성장주 중심의 하락이 이어졌습니다. 과도한 낙관론은 위험 신호였습니다.',
  },
  {
    id: 10,
    year: '2022년 9월',
    title: '금리 인상 충격과 경기침체 우려',
    period: '2022 긴축 충격',
    targetAsset: 'SK하이닉스 (반도체·메모리)',
    assetDetail: '글로벌 메모리 반도체 2위, 경기 민감 대형주',
    headline: '미국 기준금리 4% 돌파! 강달러 폭풍 - 원화 1,400원 돌파',
    description:
      '미 연준이 자이언트 스텝(75bp 금리 인상)을 연달아 단행하고 있습니다. 원달러 환율이 1,400원을 돌파하며 13년 만의 최고치를 기록했습니다. 글로벌 경기침체 공포가 확산되고 있습니다.',
    chartDescription:
      'KOSPI가 2,200에서 2,150으로 하락하며 연저점 부근에서 등락 중입니다. 외국인 매도세가 지속됩니다.',
    kospiLevel: 'KOSPI 2,155 → 저점 부근',
    bestAction: 'buy',
    actualOutcome:
      '2023년 AI 혁명 기대감과 금리 인상 종료 기대로 KOSPI는 2,600선까지 반등했습니다.',
    returnPercent: 25,
    explanation:
      'AI 혁명에 대한 기대감과 금리 인상 사이클 종료 전망이 시장을 견인했습니다. 반도체 업종이 특히 강하게 반등했습니다.',
  },
];

const rankings: Ranking[] = [
  {
    title: '전설의 투자자',
    emoji: '(S)',
    description:
      '워런 버핏에 비견되는 탁월한 투자 감각을 보여주셨습니다. 위기를 기회로 만드는 안목이 뛰어납니다.',
    minReturn: 200,
  },
  {
    title: '숙련된 펀드매니저',
    emoji: '(A)',
    description:
      '시장의 흐름을 정확히 읽어내는 능력이 우수합니다. 리스크 관리와 수익 추구의 균형을 잘 잡았습니다.',
    minReturn: 80,
  },
  {
    title: '유능한 트레이더',
    emoji: '(B)',
    description:
      '평균 이상의 투자 판단력을 보여주셨습니다. 시장 사이클에 대한 이해가 양호합니다.',
    minReturn: 30,
  },
  {
    title: '평범한 투자자',
    emoji: '(C)',
    description:
      '시장 평균 수준의 성과입니다. 시장 사이클 학습을 통해 더 나은 판단이 가능합니다.',
    minReturn: 0,
  },
  {
    title: '초보 투자자',
    emoji: '(D)',
    description:
      '손실을 경험했지만 중요한 교훈을 얻었습니다. 역사적 사례 학습을 통해 실력을 키워보세요.',
    minReturn: -30,
  },
  {
    title: '위기의 투자자',
    emoji: '(F)',
    description:
      '큰 손실을 기록했습니다. 하지만 실전이 아닌 시뮬레이션에서 배울 수 있어 다행입니다.',
    minReturn: -Infinity,
  },
];

const ACTION_LABELS: Record<Action, string> = {
  buy: '매수',
  sell: '매도',
  hold: '관망',
  short: '공매도',
};

// ─── Helper Functions ────────────────────────────────────────────────────────

function formatKRW(value: number): string {
  if (value >= 100_000_000) {
    const eok = Math.floor(value / 100_000_000);
    const remainder = value % 100_000_000;
    if (remainder === 0) return `${eok}억원`;
    const man = Math.floor(remainder / 10_000);
    return `${eok}억 ${man.toLocaleString()}만원`;
  }
  if (value >= 10_000) {
    const man = Math.floor(value / 10_000);
    return `${man.toLocaleString()}만원`;
  }
  return `${value.toLocaleString()}원`;
}

function calculateReturn(
  action: Action,
  positionSize: PositionSize,
  marketReturn: number
): number {
  const exposure = positionSize / 100;
  switch (action) {
    case 'buy':
      return marketReturn * exposure;
    case 'sell':
      // selling avoids the move (if market drops, you saved; if market rises, you missed)
      return -marketReturn * exposure * 0.3; // partial friction for wrong sell
    case 'hold':
      return marketReturn * 0.3 * exposure; // partial market exposure
    case 'short':
      return -marketReturn * exposure;
    default:
      return 0;
  }
}

function getActionScore(action: Action, bestAction: Action): number {
  if (action === bestAction) return 1.0;
  // partial credit matrix
  const partialCredit: Record<Action, Record<Action, number>> = {
    buy: { buy: 1.0, hold: 0.3, sell: -0.3, short: -0.8 },
    sell: { sell: 1.0, hold: 0.3, buy: -0.3, short: 0.5 },
    hold: { hold: 1.0, buy: 0.3, sell: 0.3, short: -0.2 },
    short: { short: 1.0, sell: 0.5, hold: 0.0, buy: -0.8 },
  };
  return partialCredit[bestAction][action] ?? 0;
}

function getRanking(returnPercent: number): Ranking {
  for (const rank of rankings) {
    if (returnPercent >= rank.minReturn) return rank;
  }
  return rankings[rankings.length - 1];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    fontFamily:
      "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    background: 'var(--ifm-card-background-color, #ffffff)',
    border: '1px solid var(--ifm-color-emphasis-300, #dadde1)',
    borderRadius: 12,
    padding: 28,
    marginBottom: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    margin: '0 0 8px 0',
    color: 'var(--ifm-color-primary, #2e8555)',
  },
  subtitle: {
    fontSize: 15,
    color: 'var(--ifm-color-emphasis-600, #666)',
    margin: 0,
  },
  portfolioBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'var(--ifm-color-emphasis-100, #f5f6f7)',
    borderRadius: 8,
    padding: '12px 20px',
    marginBottom: 20,
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  portfolioLabel: {
    fontSize: 13,
    color: 'var(--ifm-color-emphasis-600, #666)',
    margin: 0,
  },
  portfolioValue: {
    fontSize: 22,
    fontWeight: 700,
    margin: 0,
  },
  roundBadge: {
    display: 'inline-block',
    background: 'var(--ifm-color-primary, #2e8555)',
    color: '#fff',
    padding: '4px 14px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },
  yearBadge: {
    display: 'inline-block',
    background: 'var(--ifm-color-emphasis-200, #ebedf0)',
    color: 'var(--ifm-color-emphasis-700, #444)',
    padding: '3px 10px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 8,
  },
  scenarioTitle: {
    fontSize: 22,
    fontWeight: 700,
    margin: '8px 0',
    color: 'var(--ifm-font-color-base, #1c1e21)',
  },
  headline: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--ifm-color-danger, #e3116c)',
    margin: '12px 0 8px 0',
    padding: '10px 16px',
    background: 'var(--ifm-color-danger-contrast-background, #fff5f5)',
    borderRadius: 8,
    borderLeft: '4px solid var(--ifm-color-danger, #e3116c)',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: 'var(--ifm-font-color-base, #1c1e21)',
    margin: '12px 0',
  },
  chartBox: {
    background: 'var(--ifm-color-emphasis-100, #f5f6f7)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 16,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  chartIcon: {
    fontSize: 18,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 700,
    color: 'var(--ifm-color-emphasis-700, #444)',
    marginBottom: 10,
    marginTop: 16,
  },
  actionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  actionButton: {
    padding: '14px 16px',
    border: '2px solid var(--ifm-color-emphasis-300, #dadde1)',
    borderRadius: 10,
    background: 'var(--ifm-card-background-color, #fff)',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center' as const,
    transition: 'all 0.15s ease',
    color: 'var(--ifm-font-color-base, #1c1e21)',
  },
  actionButtonSelected: {
    borderColor: 'var(--ifm-color-primary, #2e8555)',
    background: 'var(--ifm-color-primary-contrast-background, #e6f6ed)',
    color: 'var(--ifm-color-primary, #2e8555)',
  },
  sizeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 8,
    marginBottom: 20,
  },
  sizeButton: {
    padding: '10px 8px',
    border: '2px solid var(--ifm-color-emphasis-300, #dadde1)',
    borderRadius: 8,
    background: 'var(--ifm-card-background-color, #fff)',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center' as const,
    transition: 'all 0.15s ease',
    color: 'var(--ifm-font-color-base, #1c1e21)',
  },
  sizeButtonSelected: {
    borderColor: 'var(--ifm-color-primary, #2e8555)',
    background: 'var(--ifm-color-primary-contrast-background, #e6f6ed)',
    color: 'var(--ifm-color-primary, #2e8555)',
  },
  confirmButton: {
    width: '100%',
    padding: '16px',
    border: 'none',
    borderRadius: 10,
    background: 'var(--ifm-color-primary, #2e8555)',
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
  },
  confirmButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  resultBox: {
    borderRadius: 10,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  resultPositive: {
    background: 'var(--ifm-color-success-contrast-background, #e6f9ee)',
    border: '1px solid var(--ifm-color-success, #00a86b)',
  },
  resultNegative: {
    background: 'var(--ifm-color-danger-contrast-background, #fff5f5)',
    border: '1px solid var(--ifm-color-danger, #e3116c)',
  },
  resultNeutral: {
    background: 'var(--ifm-color-emphasis-100, #f5f6f7)',
    border: '1px solid var(--ifm-color-emphasis-300, #dadde1)',
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 700,
    margin: '0 0 8px 0',
  },
  resultText: {
    fontSize: 14,
    lineHeight: 1.6,
    margin: '4px 0',
  },
  nextButton: {
    width: '100%',
    padding: '14px',
    border: 'none',
    borderRadius: 10,
    background: 'var(--ifm-color-primary-dark, #277148)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 12,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid var(--ifm-color-emphasis-200, #ebedf0)',
    fontSize: 14,
    flexWrap: 'wrap' as const,
    gap: 4,
  },
  summaryItemLabel: {
    fontWeight: 500,
    color: 'var(--ifm-color-emphasis-700, #444)',
    flex: '1 1 auto',
  },
  summaryDecision: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
  },
  badgeCorrect: {
    background: 'var(--ifm-color-success-contrast-background, #e6f9ee)',
    color: 'var(--ifm-color-success-dark, #007a4d)',
  },
  badgeWrong: {
    background: 'var(--ifm-color-danger-contrast-background, #fff5f5)',
    color: 'var(--ifm-color-danger-dark, #b30e5a)',
  },
  badgePartial: {
    background: 'var(--ifm-color-warning-contrast-background, #fff8e6)',
    color: 'var(--ifm-color-warning-dark, #b37800)',
  },
  rankCard: {
    textAlign: 'center' as const,
    padding: 32,
    background:
      'linear-gradient(135deg, var(--ifm-color-primary-lightest, #e6f6ed) 0%, var(--ifm-color-primary-contrast-background, #f0fff6) 100%)',
    borderRadius: 16,
    marginBottom: 24,
    border: '2px solid var(--ifm-color-primary, #2e8555)',
  },
  rankEmoji: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 4,
  },
  rankTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--ifm-color-primary-dark, #277148)',
    margin: '8px 0',
  },
  rankDescription: {
    fontSize: 15,
    lineHeight: 1.6,
    color: 'var(--ifm-color-emphasis-700, #444)',
    margin: '8px 0 0 0',
  },
  restartButton: {
    display: 'block',
    width: '100%',
    padding: '16px',
    border: '2px solid var(--ifm-color-primary, #2e8555)',
    borderRadius: 10,
    background: 'transparent',
    color: 'var(--ifm-color-primary, #2e8555)',
    fontSize: 17,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 16,
    transition: 'all 0.15s ease',
  },
  startButton: {
    display: 'block',
    width: '100%',
    padding: '18px',
    border: 'none',
    borderRadius: 12,
    background: 'var(--ifm-color-primary, #2e8555)',
    color: '#fff',
    fontSize: 18,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 20,
    transition: 'opacity 0.15s ease',
  },
  introList: {
    listStyle: 'none',
    padding: 0,
    margin: '16px 0',
  },
  introListItem: {
    padding: '8px 0',
    fontSize: 15,
    color: 'var(--ifm-font-color-base, #1c1e21)',
    borderBottom: '1px solid var(--ifm-color-emphasis-200, #ebedf0)',
  },
  progressBar: {
    width: '100%',
    height: 6,
    background: 'var(--ifm-color-emphasis-200, #ebedf0)',
    borderRadius: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--ifm-color-primary, #2e8555)',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  comparisonRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8,
    flexWrap: 'wrap' as const,
  },
  comparisonItem: {
    flex: 1,
    minWidth: 140,
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.5,
  },
  yourChoice: {
    background: 'var(--ifm-color-emphasis-100, #f5f6f7)',
    border: '1px solid var(--ifm-color-emphasis-300, #dadde1)',
  },
  optimalChoice: {
    background: 'var(--ifm-color-primary-contrast-background, #e6f6ed)',
    border: '1px solid var(--ifm-color-primary, #2e8555)',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--ifm-color-emphasis-200, #ebedf0)',
    margin: '16px 0',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center' as const,
    margin: '16px 0',
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  statItem: {
    flex: '1 1 100px',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    margin: 0,
  },
  statLabel: {
    fontSize: 12,
    color: 'var(--ifm-color-emphasis-600, #666)',
    margin: '4px 0 0 0',
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

type GamePhase = 'intro' | 'playing' | 'result' | 'summary';

export default function MarketSurvivor(): JSX.Element {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [portfolio, setPortfolio] = useState(INITIAL_CAPITAL);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedSize, setSelectedSize] = useState<PositionSize | null>(null);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showingResult, setShowingResult] = useState(false);
  const [currentChange, setCurrentChange] = useState(0);

  const resetGame = useCallback(() => {
    setPhase('intro');
    setCurrentRound(0);
    setPortfolio(INITIAL_CAPITAL);
    setSelectedAction(null);
    setSelectedSize(null);
    setResults([]);
    setShowingResult(false);
    setCurrentChange(0);
  }, []);

  const startGame = useCallback(() => {
    setPhase('playing');
    setCurrentRound(0);
    setPortfolio(INITIAL_CAPITAL);
    setResults([]);
  }, []);

  const submitDecision = useCallback(() => {
    if (selectedAction === null || selectedSize === null) return;

    const scenario = scenarios[currentRound];
    const changePercent = calculateReturn(
      selectedAction,
      selectedSize,
      scenario.returnPercent
    );
    const changeAmount = Math.round(portfolio * (changePercent / 100));
    const newPortfolio = portfolio + changeAmount;
    const isOptimal = selectedAction === scenario.bestAction;

    setCurrentChange(changeAmount);
    setPortfolio(newPortfolio);
    setResults((prev) => [
      ...prev,
      {
        scenarioId: scenario.id,
        action: selectedAction,
        positionSize: selectedSize,
        portfolioChange: changeAmount,
        portfolioAfter: newPortfolio,
        wasOptimal: isOptimal,
      },
    ]);
    setShowingResult(true);
  }, [selectedAction, selectedSize, currentRound, portfolio]);

  const nextRound = useCallback(() => {
    if (currentRound + 1 >= scenarios.length) {
      setPhase('summary');
    } else {
      setCurrentRound((prev) => prev + 1);
      setSelectedAction(null);
      setSelectedSize(null);
      setShowingResult(false);
      setPhase('playing');
    }
  }, [currentRound]);

  const totalReturn =
    ((portfolio - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;

  // ── Intro Screen ─────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Market Survivor</h2>
            <p style={styles.subtitle}>시장 서바이버 - 투자 시뮬레이션 게임</p>
          </div>

          <p style={styles.descriptionText}>
            1997년부터 2022년까지, 한국 주식시장의 결정적 순간들을 직접 경험해 보세요. 각 라운드에서 실제 역사적 상황을 바탕으로 투자 결정을 내리고, 그 결과를 확인합니다.
          </p>

          <ul style={styles.introList}>
            <li style={styles.introListItem}>
              <strong>시작 자본:</strong> 1억원 (100,000,000원)
            </li>
            <li style={styles.introListItem}>
              <strong>총 라운드:</strong> 10라운드 (역사적 시장 이벤트)
            </li>
            <li style={styles.introListItem}>
              <strong>투자 선택:</strong> 매수 / 매도 / 관망 / 공매도
            </li>
            <li style={styles.introListItem}>
              <strong>포지션 크기:</strong> 자산의 25% / 50% / 75% / 100%
            </li>
            <li style={styles.introListItem}>
              <strong>목표:</strong> 최대 수익률 달성 및 투자 등급 획득
            </li>
          </ul>

          <div
            style={{
              padding: '14px 18px',
              background:
                'var(--ifm-color-warning-contrast-background, #fff8e6)',
              borderRadius: 8,
              border:
                '1px solid var(--ifm-color-warning-dark, #b37800)',
              fontSize: 13,
              lineHeight: 1.6,
              color: 'var(--ifm-color-emphasis-800, #333)',
              marginBottom: 8,
            }}
          >
            <strong>Tip:</strong> 시장이 극도의 공포에 빠졌을 때가 매수의 기회일 수 있고, 모두가 열광할 때가 매도의 신호일 수 있습니다. 역사적 패턴을 읽어보세요.
          </div>

          <button style={styles.startButton} onClick={startGame}>
            게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  // ── Summary Screen ───────────────────────────────────────────────────────

  if (phase === 'summary') {
    const ranking = getRanking(totalReturn);
    const optimalCount = results.filter((r) => r.wasOptimal).length;

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>게임 결과</h2>
          </div>

          <div style={styles.rankCard}>
            <div style={styles.rankEmoji}>{ranking.emoji}</div>
            <h3 style={styles.rankTitle}>{ranking.title}</h3>
            <p style={styles.rankDescription}>{ranking.description}</p>
          </div>

          <div style={styles.statRow}>
            <div style={styles.statItem}>
              <p
                style={{
                  ...styles.statValue,
                  color:
                    totalReturn >= 0
                      ? 'var(--ifm-color-success, #00a86b)'
                      : 'var(--ifm-color-danger, #e3116c)',
                }}
              >
                {totalReturn >= 0 ? '+' : ''}
                {totalReturn.toFixed(1)}%
              </p>
              <p style={styles.statLabel}>총 수익률</p>
            </div>
            <div style={styles.statItem}>
              <p style={styles.statValue}>{formatKRW(portfolio)}</p>
              <p style={styles.statLabel}>최종 자산</p>
            </div>
            <div style={styles.statItem}>
              <p style={styles.statValue}>
                {optimalCount}/{scenarios.length}
              </p>
              <p style={styles.statLabel}>최적 판단</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginTop: 0,
              marginBottom: 16,
            }}
          >
            라운드별 상세 결과
          </h3>
          <div style={styles.summarySection}>
            {results.map((result, idx) => {
              const scenario = scenarios[idx];
              const score = getActionScore(result.action, scenario.bestAction);
              let badgeStyle = styles.badgeWrong;
              let badgeText = '부적절';
              if (score >= 0.8) {
                badgeStyle = styles.badgeCorrect;
                badgeText = '최적';
              } else if (score >= 0.2) {
                badgeStyle = styles.badgePartial;
                badgeText = '보통';
              }

              return (
                <div key={idx} style={styles.summaryItem}>
                  <span style={styles.summaryItemLabel}>
                    <strong>R{idx + 1}.</strong> {scenario.title} ({scenario.year})
                  </span>
                  <div style={styles.summaryDecision}>
                    <span>
                      {ACTION_LABELS[result.action]} {result.positionSize}%
                    </span>
                    <span style={{ ...styles.badge, ...badgeStyle }}>
                      {badgeText}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color:
                          result.portfolioChange >= 0
                            ? 'var(--ifm-color-success, #00a86b)'
                            : 'var(--ifm-color-danger, #e3116c)',
                        fontSize: 13,
                        minWidth: 80,
                        textAlign: 'right' as const,
                      }}
                    >
                      {result.portfolioChange >= 0 ? '+' : ''}
                      {formatKRW(result.portfolioChange)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            나의 결정 vs 최적 결정
          </h3>

          {results.map((result, idx) => {
            const scenario = scenarios[idx];
            return (
              <div key={idx} style={{ marginBottom: 16 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ifm-color-emphasis-600, #666)',
                    margin: '0 0 4px 0',
                  }}
                >
                  R{idx + 1}. {scenario.title}
                </p>
                <div style={styles.comparisonRow}>
                  <div
                    style={{
                      ...styles.comparisonItem,
                      ...styles.yourChoice,
                    }}
                  >
                    <strong>나의 선택:</strong>{' '}
                    {ACTION_LABELS[result.action]} ({result.positionSize}%)
                  </div>
                  <div
                    style={{
                      ...styles.comparisonItem,
                      ...styles.optimalChoice,
                    }}
                  >
                    <strong>최적 선택:</strong>{' '}
                    {ACTION_LABELS[scenario.bestAction]} (100%)
                  </div>
                </div>
              </div>
            );
          })}

          <button style={styles.restartButton} onClick={resetGame}>
            다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  // ── Playing Screen ───────────────────────────────────────────────────────

  const scenario = scenarios[currentRound];

  return (
    <div style={styles.container}>
      {/* Progress */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((currentRound + (showingResult ? 1 : 0)) / scenarios.length) * 100}%`,
          }}
        />
      </div>

      {/* Portfolio */}
      <div style={styles.portfolioBar}>
        <div>
          <p style={styles.portfolioLabel}>현재 자산</p>
          <p
            style={{
              ...styles.portfolioValue,
              color:
                portfolio >= INITIAL_CAPITAL
                  ? 'var(--ifm-color-success, #00a86b)'
                  : 'var(--ifm-color-danger, #e3116c)',
            }}
          >
            {formatKRW(portfolio)}
          </p>
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <p style={styles.portfolioLabel}>수익률</p>
          <p
            style={{
              ...styles.portfolioValue,
              fontSize: 18,
              color:
                totalReturn >= 0
                  ? 'var(--ifm-color-success, #00a86b)'
                  : 'var(--ifm-color-danger, #e3116c)',
            }}
          >
            {totalReturn >= 0 ? '+' : ''}
            {totalReturn.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Scenario Card */}
      <div style={styles.card}>
        <div>
          <span style={styles.roundBadge}>
            Round {currentRound + 1} / {scenarios.length}
          </span>
          <span style={styles.yearBadge}>{scenario.year}</span>
        </div>

        <h3 style={styles.scenarioTitle}>{scenario.title}</h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'var(--ifm-color-primary-contrast-background, #e6f6ed)',
            borderRadius: 8,
            marginBottom: 12,
            border: '1px solid var(--ifm-color-primary-light, #4caf7c)',
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ifm-color-primary-dark, #277148)' }}>
            매매 대상:
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ifm-font-color-base, #1c1e21)' }}>
            {scenario.targetAsset}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600, #666)', margin: '0 0 12px 0' }}>
          {scenario.assetDetail}
        </p>

        <div style={styles.headline}>{scenario.headline}</div>

        <p style={styles.descriptionText}>{scenario.description}</p>

        <div style={styles.chartBox}>
          <span style={styles.chartIcon}>&#x1F4C9;</span>
          <span>{scenario.chartDescription}</span>
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ifm-color-emphasis-800, #333)',
            marginBottom: 8,
          }}
        >
          {scenario.kospiLevel}
        </div>

        {!showingResult ? (
          <>
            <hr style={styles.divider} />

            <p style={styles.sectionLabel}>투자 결정을 내려주세요</p>
            <div style={styles.actionGrid}>
              {(
                [
                  ['buy', '매수 (Buy)'],
                  ['sell', '매도 (Sell)'],
                  ['hold', '관망 (Hold)'],
                  ['short', '공매도 (Short)'],
                ] as [Action, string][]
              ).map(([action, label]) => (
                <button
                  key={action}
                  style={{
                    ...styles.actionButton,
                    ...(selectedAction === action
                      ? styles.actionButtonSelected
                      : {}),
                  }}
                  onClick={() => setSelectedAction(action)}
                >
                  {label}
                </button>
              ))}
            </div>

            <p style={styles.sectionLabel}>포지션 크기 (자산 대비 비율)</p>
            <div style={styles.sizeGrid}>
              {([25, 50, 75, 100] as PositionSize[]).map((size) => (
                <button
                  key={size}
                  style={{
                    ...styles.sizeButton,
                    ...(selectedSize === size
                      ? styles.sizeButtonSelected
                      : {}),
                  }}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}%
                </button>
              ))}
            </div>

            <button
              style={{
                ...styles.confirmButton,
                ...(selectedAction === null || selectedSize === null
                  ? styles.confirmButtonDisabled
                  : {}),
              }}
              onClick={submitDecision}
              disabled={selectedAction === null || selectedSize === null}
            >
              결정 확정
            </button>
          </>
        ) : (
          <>
            <hr style={styles.divider} />

            <div
              style={{
                ...styles.resultBox,
                ...(currentChange > 0
                  ? styles.resultPositive
                  : currentChange < 0
                    ? styles.resultNegative
                    : styles.resultNeutral),
              }}
            >
              <p style={styles.resultTitle}>
                {currentChange > 0
                  ? '수익 발생!'
                  : currentChange < 0
                    ? '손실 발생'
                    : '변동 없음'}
              </p>
              <p style={styles.resultText}>
                <strong>매매 대상:</strong> {scenario.targetAsset}
              </p>
              <p style={styles.resultText}>
                <strong>나의 결정:</strong>{' '}
                {ACTION_LABELS[selectedAction!]} ({selectedSize}%)
              </p>
              <p style={styles.resultText}>
                <strong>포트폴리오 변동:</strong>{' '}
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      currentChange >= 0
                        ? 'var(--ifm-color-success-dark, #007a4d)'
                        : 'var(--ifm-color-danger-dark, #b30e5a)',
                  }}
                >
                  {currentChange >= 0 ? '+' : ''}
                  {formatKRW(currentChange)}
                </span>
              </p>
              <p style={styles.resultText}>
                <strong>최적 행동:</strong>{' '}
                {ACTION_LABELS[scenario.bestAction]}
                {selectedAction === scenario.bestAction
                  ? ' -- 정확한 판단이었습니다!'
                  : ''}
              </p>
            </div>

            <div
              style={{
                background:
                  'var(--ifm-color-emphasis-100, #f5f6f7)',
                borderRadius: 10,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  margin: '0 0 6px 0',
                  color: 'var(--ifm-color-emphasis-800, #333)',
                }}
              >
                실제 결과
              </p>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: '0 0 8px 0',
                }}
              >
                {scenario.actualOutcome}
              </p>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  margin: 0,
                  color: 'var(--ifm-color-emphasis-600, #666)',
                }}
              >
                {scenario.explanation}
              </p>
            </div>

            <button style={styles.nextButton} onClick={nextRound}>
              {currentRound + 1 < scenarios.length
                ? `다음 라운드 (Round ${currentRound + 2})`
                : '최종 결과 보기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
