import React, { useState, useCallback, useMemo, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type AssetClass = 'stocks' | 'bonds' | 'gold' | 'cash' | 'realestate';

interface AssetAllocation {
  stocks: number;
  bonds: number;
  gold: number;
  cash: number;
  realestate: number;
}

interface Scenario {
  id: number;
  year: string;
  title: string;
  period: string;
  headline: string;
  description: string;
  marketContext: string;
  returns: AssetAllocation; // % return for each asset class
  bestAllocation: AssetAllocation;
  actualOutcome: string;
  explanation: string;
}

interface RoundResult {
  scenarioId: number;
  allocation: AssetAllocation;
  portfolioChange: number;
  portfolioAfter: number;
  returns: AssetAllocation;
}

interface Ranking {
  title: string;
  grade: string;
  description: string;
  minReturn: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_CAPITAL = 100_000_000;
const ROUNDS_PER_GAME = 10;

const ASSET_LABELS: Record<AssetClass, string> = {
  stocks: '주식',
  bonds: '채권',
  gold: '금',
  cash: '현금',
  realestate: '부동산',
};

const ASSET_COLORS: Record<AssetClass, string> = {
  stocks: '#e74c3c',
  bonds: '#3498db',
  gold: '#f1c40f',
  cash: '#95a5a6',
  realestate: '#9b59b6',
};

// 50개 시나리오 풀: 1929년 대공황부터 2024년까지 100년 (매 게임 10개 랜덤 선택)
const scenarios: Scenario[] = [
  // 1920s-1930s: 대공황
  { id: 1, year: '1929년 10월', title: '검은 목요일 - 대공황 시작', period: '1929 대공황', headline: '월가 대폭락! 주식시장 역사상 최악의 붕괴', description: '뉴욕 증시가 하루에 11% 폭락했습니다. 투기 열풍이 끝나고 거대한 거품이 터지기 시작합니다.', marketContext: '다우존스 381 → 급락', returns: { stocks: -45, bonds: 5, gold: 15, cash: 0, realestate: -20 }, bestAllocation: { stocks: 0, bonds: 30, gold: 50, cash: 20, realestate: 0 }, actualOutcome: '1929-1932년 다우존스 89% 폭락', explanation: '대공황으로 주식시장은 89% 하락했고, 금은 안전자산으로 각광받았습니다.' },
  { id: 2, year: '1932년 7월', title: '대공황 바닥', period: '1932 대공황 바닥', headline: '다우존스 역대 최저점 기록 - 실업률 25%', description: '주식시장이 1929년 고점 대비 89% 하락한 바닥에 도달했습니다. 극도의 비관론이 지배합니다.', marketContext: '다우존스 41 (역대 최저)', returns: { stocks: 120, bonds: 10, gold: -5, cash: 0, realestate: 30 }, bestAllocation: { stocks: 70, bonds: 20, gold: 0, cash: 10, realestate: 0 }, actualOutcome: '1932-1936년 다우존스 3배 상승', explanation: '극단적 비관론 속에서 매수한 투자자들이 큰 수익을 거뒀습니다.' },
  // 1940s: 2차 세계대전
  { id: 3, year: '1941년 12월', title: '진주만 공습', period: '1941 2차대전', headline: '일본, 진주만 기습! 미국 2차대전 참전', description: '일본의 진주만 공습으로 미국이 2차 세계대전에 참전합니다. 전쟁 불확실성이 시장을 압도합니다.', marketContext: '다우존스 115 → 급락', returns: { stocks: -20, bonds: 3, gold: 10, cash: 0, realestate: -10 }, bestAllocation: { stocks: 20, bonds: 40, gold: 30, cash: 10, realestate: 0 }, actualOutcome: '전쟁 초기 혼란 후 군수 산업 호황', explanation: '전쟁 초기 혼란 후 군수 산업 중심으로 시장이 회복했습니다.' },
  { id: 4, year: '1945년 8월', title: '2차대전 종전', period: '1945 종전', headline: '일본 항복! 2차 세계대전 종료', description: '2차 세계대전이 종료되었습니다. 전후 재건과 새로운 세계 질서가 형성됩니다.', marketContext: '다우존스 165', returns: { stocks: 25, bonds: 2, gold: -5, cash: 0, realestate: 40 }, bestAllocation: { stocks: 50, bonds: 20, gold: 0, cash: 10, realestate: 20 }, actualOutcome: '전후 호황과 베이비붐 시대 개막', explanation: '전후 재건 수요와 베이비붐으로 경제가 크게 성장했습니다.' },
  // 1950s
  { id: 5, year: '1950년 6월', title: '한국전쟁 발발', period: '1950 한국전쟁', headline: '북한 남침! 한국전쟁 발발 - 동서 냉전 격화', description: '한국전쟁이 발발하며 냉전이 뜨거운 전쟁으로 확대될 우려가 커집니다.', marketContext: '다우존스 225 → 불안', returns: { stocks: -10, bonds: 5, gold: 20, cash: 0, realestate: 5 }, bestAllocation: { stocks: 30, bonds: 30, gold: 30, cash: 10, realestate: 0 }, actualOutcome: '초기 하락 후 군수 산업 호황', explanation: '전쟁 불확실성 후 군수 지출 확대로 시장이 회복했습니다.' },
  { id: 6, year: '1955년 1월', title: '전후 호황 정점', period: '1955 호황', headline: '미국 경제 황금기 - 소비 붐 절정', description: '전후 베이비붐과 소비 혁명이 절정에 달했습니다. 자동차, 가전, 주택 수요가 폭발합니다.', marketContext: '다우존스 400 돌파', returns: { stocks: 30, bonds: 3, gold: -5, cash: 0, realestate: 25 }, bestAllocation: { stocks: 60, bonds: 20, gold: 0, cash: 10, realestate: 10 }, actualOutcome: '1950년대 후반까지 호황 지속', explanation: '전후 소비 붐과 교외화로 경제 성장이 지속되었습니다.' },
  // 1960s
  { id: 7, year: '1962년 10월', title: '쿠바 미사일 위기', period: '1962 쿠바위기', headline: '핵전쟁 위기! 미소 쿠바에서 대치', description: '소련이 쿠바에 핵미사일을 배치하며 핵전쟁 직전까지 갔습니다. 세계가 공포에 떨었습니다.', marketContext: '다우존스 급락 중', returns: { stocks: -25, bonds: 8, gold: 25, cash: 0, realestate: -10 }, bestAllocation: { stocks: 10, bonds: 30, gold: 40, cash: 20, realestate: 0 }, actualOutcome: '위기 해소 후 급반등', explanation: '핵전쟁 위기가 해소되자 시장은 빠르게 회복했습니다.' },
  { id: 8, year: '1968년 4월', title: '베트남전 확대와 사회 혼란', period: '1968 사회혼란', headline: 'MLK 암살, 베트남전 수렁 - 미국 사회 분열', description: '베트남전 장기화, 마틴 루터 킹 암살, 학생 시위 등 사회적 혼란이 극에 달했습니다.', marketContext: '다우존스 900 부근', returns: { stocks: -15, bonds: 5, gold: 15, cash: 0, realestate: 5 }, bestAllocation: { stocks: 20, bonds: 35, gold: 30, cash: 15, realestate: 0 }, actualOutcome: '1969-1970년 경기침체', explanation: '사회 혼란과 인플레이션 압력으로 시장이 조정받았습니다.' },
  // 1970s: 스태그플레이션
  { id: 9, year: '1971년 8월', title: '닉슨 쇼크 - 금본위제 폐지', period: '1971 닉슨쇼크', headline: '달러-금 태환 중단! 브레튼우즈 체제 붕괴', description: '닉슨 대통령이 달러의 금 태환을 중단했습니다. 전후 국제통화체제가 종료됩니다.', marketContext: '달러 가치 급락', returns: { stocks: 10, bonds: -5, gold: 45, cash: -3, realestate: 15 }, bestAllocation: { stocks: 20, bonds: 10, gold: 50, cash: 10, realestate: 10 }, actualOutcome: '금 가격 폭등, 인플레이션 시작', explanation: '금본위제 폐지로 금 가격이 폭등하고 인플레이션이 시작되었습니다.' },
  { id: 10, year: '1973년 10월', title: '1차 오일쇼크', period: '1973 오일쇼크', headline: 'OPEC 석유 금수! 유가 4배 폭등', description: '중동 전쟁을 계기로 OPEC이 석유 금수 조치를 단행했습니다. 유가가 4배 폭등합니다.', marketContext: '다우존스 1,000 → 577', returns: { stocks: -45, bonds: -5, gold: 70, cash: 0, realestate: -15 }, bestAllocation: { stocks: 0, bonds: 10, gold: 60, cash: 30, realestate: 0 }, actualOutcome: '1973-1974년 대폭락, 스태그플레이션', explanation: '오일쇼크로 스태그플레이션이 발생하며 주식과 채권 모두 하락했습니다.' },
  { id: 11, year: '1974년 12월', title: '스태그플레이션 바닥', period: '1974 바닥', headline: '다우존스 577 - 10년 만에 최저점', description: '오일쇼크와 스태그플레이션으로 주식시장이 바닥을 쳤습니다. 극도의 비관론입니다.', marketContext: '다우존스 577 (저점)', returns: { stocks: 75, bonds: 15, gold: -10, cash: 0, realestate: 40 }, bestAllocation: { stocks: 60, bonds: 25, gold: 5, cash: 10, realestate: 0 }, actualOutcome: '1975-1976년 강한 반등', explanation: '극단적 비관론 속에서 매수한 투자자가 큰 수익을 거뒀습니다.' },
  { id: 12, year: '1979년 10월', title: '2차 오일쇼크', period: '1979 오일쇼크', headline: '이란혁명! 유가 재폭등 - 인플레이션 20%', description: '이란 혁명으로 2차 오일쇼크가 발생했습니다. 인플레이션이 20%에 육박합니다.', marketContext: '금리 급등, 경기침체 우려', returns: { stocks: -20, bonds: -15, gold: 120, cash: 5, realestate: 10 }, bestAllocation: { stocks: 0, bonds: 0, gold: 70, cash: 30, realestate: 0 }, actualOutcome: '1980년 금 가격 사상 최고', explanation: '2차 오일쇼크로 금이 역대 최고가를 기록했습니다.' },
  // 1980s
  { id: 13, year: '1980년 1월', title: '금 버블 정점', period: '1980 금버블', headline: '금 온스당 $850! 역대 최고가 경신', description: '인플레이션 공포로 금 가격이 온스당 $850까지 폭등했습니다. 극단적 탐욕 상태입니다.', marketContext: '금 $850 (역대 최고)', returns: { stocks: 25, bonds: 20, gold: -45, cash: 10, realestate: -5 }, bestAllocation: { stocks: 40, bonds: 40, gold: 0, cash: 20, realestate: 0 }, actualOutcome: '금 가격 80% 폭락, 주식 강세 시작', explanation: '볼커의 금리 인상으로 인플레이션이 잡히며 금이 폭락했습니다.' },
  { id: 14, year: '1982년 8월', title: '볼커 긴축 바닥', period: '1982 바닥', headline: '실업률 11%! 경기침체 최악 - 하지만...', description: '볼커의 긴축으로 심각한 경기침체가 왔지만, 인플레이션이 잡히기 시작합니다.', marketContext: '다우존스 777 (저점)', returns: { stocks: 60, bonds: 35, gold: -15, cash: 8, realestate: 20 }, bestAllocation: { stocks: 50, bonds: 40, gold: 0, cash: 10, realestate: 0 }, actualOutcome: '1982-2000년 대세 상승장 시작', explanation: '금리 인하 사이클 시작으로 역사적 강세장이 시작되었습니다.' },
  { id: 15, year: '1987년 10월', title: '블랙 먼데이', period: '1987 블랙먼데이', headline: '다우존스 하루 22.6% 폭락! 역대 최악의 하루', description: '프로그램 매매와 공포가 결합하여 다우존스가 하루에 22.6% 폭락했습니다.', marketContext: '다우존스 2,246 → 1,739', returns: { stocks: -25, bonds: 8, gold: 5, cash: 0, realestate: -5 }, bestAllocation: { stocks: 30, bonds: 40, gold: 15, cash: 15, realestate: 0 }, actualOutcome: '2년 내 신고가 회복', explanation: '블랙먼데이 폭락은 빠르게 회복되었고 강세장이 이어졌습니다.' },
  { id: 16, year: '1989년 12월', title: '일본 버블 정점', period: '1989 일본버블', headline: '닛케이 38,915! 일본 경제 세계 1위 전망', description: '일본 증시가 사상 최고가를 기록했습니다. "일본이 미국을 추월한다"는 전망이 지배적입니다.', marketContext: '닛케이 38,915 (역대 최고)', returns: { stocks: -40, bonds: 5, gold: 0, cash: 3, realestate: -50 }, bestAllocation: { stocks: 10, bonds: 50, gold: 10, cash: 30, realestate: 0 }, actualOutcome: '잃어버린 30년 시작', explanation: '일본 버블 붕괴로 30년간 시장이 회복하지 못했습니다.' },
  // 1990s
  { id: 17, year: '1990년 8월', title: '걸프전 발발', period: '1990 걸프전', headline: '이라크 쿠웨이트 침공! 유가 급등', description: '이라크가 쿠웨이트를 침공하며 걸프전이 시작되었습니다. 유가가 급등합니다.', marketContext: '다우존스 2,500 → 하락', returns: { stocks: -15, bonds: 5, gold: 10, cash: 0, realestate: -10 }, bestAllocation: { stocks: 20, bonds: 40, gold: 25, cash: 15, realestate: 0 }, actualOutcome: '빠른 종전 후 상승 재개', explanation: '걸프전이 빠르게 종료되며 시장이 회복했습니다.' },
  { id: 18, year: '1995년 1월', title: '인터넷 시대 개막', period: '1995 인터넷', headline: 'Netscape 상장! 인터넷 혁명 시작', description: '넷스케이프 상장으로 인터넷 시대가 본격화됩니다. 새로운 기술 혁명이 시작됩니다.', marketContext: '다우존스 4,000 → 상승', returns: { stocks: 35, bonds: 15, gold: -5, cash: 3, realestate: 10 }, bestAllocation: { stocks: 60, bonds: 25, gold: 0, cash: 10, realestate: 5 }, actualOutcome: '1995-2000년 기술주 강세', explanation: '인터넷 혁명이 기술주 강세를 이끌었습니다.' },
  { id: 19, year: '1997년 10월', title: 'IMF 외환위기 전야', period: '1997 IMF', headline: '아시아 금융위기 확산 - 한국 위기감 고조', description: '동남아에서 시작된 외환위기가 한국으로 번지고 있습니다. 기업 부채가 위험 수준입니다.', marketContext: 'KOSPI 700 → 급락', returns: { stocks: -60, bonds: 15, gold: 20, cash: 5, realestate: -40 }, bestAllocation: { stocks: 0, bonds: 30, gold: 40, cash: 30, realestate: 0 }, actualOutcome: 'IMF 구제금융, KOSPI 280 폭락', explanation: 'IMF 외환위기로 KOSPI가 60% 폭락했습니다.' },
  { id: 20, year: '1998년 9월', title: 'IMF 위기 바닥', period: '1998 바닥', headline: 'KOSPI 280! 금 모으기 운동 - 극도의 공포', description: 'IMF 위기로 KOSPI가 280까지 폭락했습니다. 국민적 금 모으기 운동이 진행 중입니다.', marketContext: 'KOSPI 280 (역대 최저)', returns: { stocks: 220, bonds: 10, gold: -5, cash: 0, realestate: 80 }, bestAllocation: { stocks: 70, bonds: 20, gold: 0, cash: 10, realestate: 0 }, actualOutcome: '1999년 KOSPI 1,000 돌파', explanation: '극단적 공포 속에서 매수한 투자자가 3배 이상 수익을 거뒀습니다.' },
  // 2000s
  { id: 21, year: '2000년 3월', title: 'IT 버블 정점', period: '2000 닷컴버블', headline: '나스닥 5,000! 인터넷 기업 시총 폭등', description: '인터넷 기업들의 주가가 하늘을 모르고 오르고 있습니다. "이번에는 다르다"는 분위기입니다.', marketContext: '나스닥 5,048 (역대 최고)', returns: { stocks: -50, bonds: 10, gold: 5, cash: 3, realestate: 10 }, bestAllocation: { stocks: 10, bonds: 50, gold: 15, cash: 25, realestate: 0 }, actualOutcome: '나스닥 80% 폭락', explanation: 'IT 버블 붕괴로 나스닥이 80% 폭락했습니다.' },
  { id: 22, year: '2001년 9월', title: '9/11 테러', period: '2001 9/11', headline: '세계무역센터 테러! 미국 본토 공격', description: '9/11 테러로 세계무역센터가 붕괴했습니다. 전례 없는 충격이 시장을 덮칩니다.', marketContext: '뉴욕증시 일시 폐장', returns: { stocks: -15, bonds: 8, gold: 10, cash: 0, realestate: -5 }, bestAllocation: { stocks: 20, bonds: 40, gold: 25, cash: 15, realestate: 0 }, actualOutcome: '단기 하락 후 반등', explanation: '9/11 충격은 단기적이었고 시장은 점차 회복했습니다.' },
  { id: 23, year: '2002년 10월', title: '닷컴 버블 바닥', period: '2002 바닥', headline: '나스닥 1,100대! IT 버블 완전 붕괴', description: 'IT 버블이 완전히 붕괴했습니다. 나스닥은 고점 대비 78% 하락했습니다.', marketContext: '나스닥 1,114 (저점)', returns: { stocks: 50, bonds: 5, gold: 20, cash: 0, realestate: 25 }, bestAllocation: { stocks: 50, bonds: 25, gold: 15, cash: 10, realestate: 0 }, actualOutcome: '2003년부터 회복 시작', explanation: '버블 바닥에서 매수한 투자자가 이후 상승장을 즐겼습니다.' },
  { id: 24, year: '2003년 3월', title: '이라크 전쟁', period: '2003 이라크전', headline: '미국, 이라크 침공! 카드 대란 겹쳐', description: '미국의 이라크 침공과 국내 카드사 부실이 겹쳐 시장이 크게 흔들립니다.', marketContext: 'KOSPI 515 (공포)', returns: { stocks: 80, bonds: 5, gold: 15, cash: 0, realestate: 40 }, bestAllocation: { stocks: 60, bonds: 20, gold: 10, cash: 10, realestate: 0 }, actualOutcome: '2007년 KOSPI 2,000 돌파', explanation: '이중 악재가 해소되며 시장은 강하게 반등했습니다.' },
  { id: 25, year: '2005년 6월', title: '부동산 버블 형성', period: '2005 주택버블', headline: '미국 주택가격 역대 최고! 서브프라임 활황', description: '미국 주택가격이 연일 상승하고 있습니다. 서브프라임 모기지가 폭발적으로 늘어납니다.', marketContext: '주택가격 지수 사상 최고', returns: { stocks: 15, bonds: 5, gold: 15, cash: 2, realestate: 20 }, bestAllocation: { stocks: 30, bonds: 30, gold: 20, cash: 20, realestate: 0 }, actualOutcome: '2006년 주택시장 정점 후 하락', explanation: '주택 버블은 2006년 정점을 찍고 붕괴하기 시작했습니다.' },
  { id: 26, year: '2007년 10월', title: '글로벌 호황 정점', period: '2007 정점', headline: 'KOSPI 2,000 돌파! 중국 특수 절정', description: '중국 경제 호황으로 한국 수출 기업 실적이 사상 최고입니다. "KOSPI 3,000 간다" 분위기입니다.', marketContext: 'KOSPI 2,063 (사상 최고)', returns: { stocks: -55, bonds: 10, gold: 25, cash: 3, realestate: -30 }, bestAllocation: { stocks: 0, bonds: 40, gold: 35, cash: 25, realestate: 0 }, actualOutcome: '2008년 금융위기로 대폭락', explanation: '서브프라임 부실이 글로벌 금융위기로 확대되었습니다.' },
  { id: 27, year: '2008년 9월', title: '리먼브라더스 파산', period: '2008 금융위기', headline: '리먼 파산! 세계 금융 시스템 붕괴 위기', description: '미국 투자은행 리먼브라더스가 파산했습니다. 글로벌 금융시스템이 마비되고 있습니다.', marketContext: 'KOSPI 938 → 급락', returns: { stocks: -40, bonds: 15, gold: 25, cash: 2, realestate: -35 }, bestAllocation: { stocks: 0, bonds: 40, gold: 40, cash: 20, realestate: 0 }, actualOutcome: '시장 추가 하락 후 바닥', explanation: '리먼 파산 이후에도 시장은 더 하락했습니다.' },
  { id: 28, year: '2009년 3월', title: '금융위기 바닥', period: '2009 바닥', headline: 'S&P 500 666! 공포지수 역대 최고', description: 'S&P 500이 666까지 폭락했습니다. 세계 경제 붕괴 우려가 절정에 달했습니다.', marketContext: 'S&P 500 666 (저점)', returns: { stocks: 80, bonds: 10, gold: 20, cash: 0, realestate: 30 }, bestAllocation: { stocks: 60, bonds: 25, gold: 10, cash: 5, realestate: 0 }, actualOutcome: '2009-2020년 역사상 최장 상승장', explanation: '각국의 양적완화와 경기부양책으로 역사적 상승장이 시작되었습니다.' },
  // 2010s
  { id: 29, year: '2010년 5월', title: '플래시 크래시', period: '2010 플래시크래시', headline: '다우존스 1,000포인트 순간 폭락!', description: '알고리즘 매매 오류로 다우존스가 분 단위에 1,000포인트 폭락했다가 회복했습니다.', marketContext: '다우존스 급등락', returns: { stocks: 10, bonds: 8, gold: 25, cash: 1, realestate: 5 }, bestAllocation: { stocks: 40, bonds: 30, gold: 20, cash: 10, realestate: 0 }, actualOutcome: '빠른 회복 후 상승 지속', explanation: '플래시 크래시는 일시적이었고 시장은 상승을 이어갔습니다.' },
  { id: 30, year: '2011년 8월', title: '유럽 재정위기', period: '2011 유럽위기', headline: '그리스 디폴트 우려, 미국 신용등급 강등', description: '유럽 재정위기가 심화되고 미국도 신용등급이 강등되었습니다. 더블딥 우려가 커집니다.', marketContext: 'KOSPI 1,700 → 급락', returns: { stocks: 15, bonds: 10, gold: 30, cash: 1, realestate: 0 }, bestAllocation: { stocks: 30, bonds: 35, gold: 25, cash: 10, realestate: 0 }, actualOutcome: 'ECB 개입으로 안정화', explanation: 'ECB의 적극적 개입으로 유럽 위기가 완화되었습니다.' },
  { id: 31, year: '2012년 9월', title: 'QE3 발표', period: '2012 QE3', headline: '연준 QE3 발표! 무제한 양적완화', description: '연준이 무제한 양적완화(QE3)를 발표했습니다. "연준과 싸우지 마라" 분위기입니다.', marketContext: 'S&P 500 1,400 → 상승', returns: { stocks: 30, bonds: 5, gold: -5, cash: 0, realestate: 20 }, bestAllocation: { stocks: 60, bonds: 20, gold: 5, cash: 10, realestate: 5 }, actualOutcome: '2013-2014년 강세장 지속', explanation: '양적완화가 자산가격을 밀어올렸습니다.' },
  { id: 32, year: '2013년 5월', title: '테이퍼 탠트럼', period: '2013 테이퍼', headline: '연준, 양적완화 축소 시사 - 채권 폭락', description: '버냉키 연준 의장이 양적완화 축소를 시사하자 채권시장이 폭락했습니다.', marketContext: '금리 급등, 신흥국 자금 유출', returns: { stocks: 20, bonds: -10, gold: -25, cash: 1, realestate: 10 }, bestAllocation: { stocks: 50, bonds: 10, gold: 5, cash: 30, realestate: 5 }, actualOutcome: '초기 충격 후 상승 재개', explanation: '테이퍼 탠트럼 충격은 일시적이었습니다.' },
  { id: 33, year: '2015년 8월', title: '중국 증시 폭락', period: '2015 중국폭락', headline: '중국 증시 한 달 40% 폭락! 위안화 평가절하', description: '중국 증시가 한 달 만에 40% 폭락하고 위안화가 평가절하되었습니다.', marketContext: '글로벌 동반 하락', returns: { stocks: -15, bonds: 5, gold: 10, cash: 1, realestate: -5 }, bestAllocation: { stocks: 25, bonds: 40, gold: 20, cash: 15, realestate: 0 }, actualOutcome: '단기 조정 후 회복', explanation: '중국 우려는 단기적이었고 시장은 회복했습니다.' },
  { id: 34, year: '2016년 6월', title: '브렉시트', period: '2016 브렉시트', headline: '영국, EU 탈퇴 결정! 파운드 폭락', description: '영국 국민투표에서 브렉시트가 결정되었습니다. 예상 밖의 결과에 시장이 충격받았습니다.', marketContext: '글로벌 증시 급락', returns: { stocks: 15, bonds: 8, gold: 10, cash: 1, realestate: 5 }, bestAllocation: { stocks: 40, bonds: 30, gold: 15, cash: 15, realestate: 0 }, actualOutcome: '빠른 회복 후 상승', explanation: '브렉시트 충격은 빠르게 흡수되었습니다.' },
  { id: 35, year: '2016년 11월', title: '트럼프 당선', period: '2016 트럼프', headline: '트럼프 대통령 당선! 예상 밖의 결과', description: '도널드 트럼프가 미국 대통령에 당선되었습니다. 감세와 규제완화 기대감이 커집니다.', marketContext: '초기 선물 급락 후 반등', returns: { stocks: 25, bonds: -5, gold: -10, cash: 0, realestate: 10 }, bestAllocation: { stocks: 55, bonds: 20, gold: 10, cash: 10, realestate: 5 }, actualOutcome: '2017년 트럼프 랠리', explanation: '감세 기대감으로 트럼프 랠리가 이어졌습니다.' },
  { id: 36, year: '2018년 2월', title: '변동성 쇼크', period: '2018 VIX쇼크', headline: 'VIX 급등! 주식시장 급락 - 변동성 상품 폭발', description: '변동성 지수(VIX)가 급등하며 변동성 역베팅 상품들이 폭발했습니다.', marketContext: 'S&P 500 10% 조정', returns: { stocks: -10, bonds: 3, gold: 5, cash: 1, realestate: 0 }, bestAllocation: { stocks: 35, bonds: 35, gold: 15, cash: 15, realestate: 0 }, actualOutcome: '빠른 회복 후 재상승', explanation: '변동성 쇼크는 일시적 조정이었습니다.' },
  { id: 37, year: '2018년 12월', title: '연준 긴축 공포', period: '2018 긴축', headline: '연준 금리인상 지속 - 연말 폭락장', description: '연준의 금리인상 기조와 미중 무역전쟁으로 연말 시장이 급락했습니다.', marketContext: 'S&P 500 20% 조정', returns: { stocks: -20, bonds: 5, gold: 10, cash: 2, realestate: -5 }, bestAllocation: { stocks: 20, bonds: 40, gold: 25, cash: 15, realestate: 0 }, actualOutcome: '2019년 1월 연준 피봇', explanation: '연준이 긴축 기조를 바꾸며 시장이 반등했습니다.' },
  { id: 38, year: '2019년 1월', title: '연준 피봇', period: '2019 피봇', headline: '연준, 금리인상 중단 시사 - 시장 급반등', description: '연준이 금리인상 중단을 시사하며 시장이 강하게 반등합니다.', marketContext: 'S&P 500 급반등', returns: { stocks: 30, bonds: 8, gold: 15, cash: 2, realestate: 10 }, bestAllocation: { stocks: 55, bonds: 25, gold: 10, cash: 10, realestate: 0 }, actualOutcome: '2019년 강세장', explanation: '연준 피봇으로 2019년이 강세장으로 마감했습니다.' },
  // 2020s
  { id: 39, year: '2020년 2월', title: '코로나 공포 시작', period: '2020 코로나초기', headline: '코로나19 글로벌 확산 - 이탈리아 봉쇄', description: '코로나19가 중국을 넘어 유럽으로 확산되고 있습니다. 이탈리아가 봉쇄에 들어갔습니다.', marketContext: 'S&P 500 사상 최고 후 하락 시작', returns: { stocks: -35, bonds: 10, gold: 15, cash: 1, realestate: -20 }, bestAllocation: { stocks: 0, bonds: 40, gold: 35, cash: 25, realestate: 0 }, actualOutcome: '3월 대폭락', explanation: '코로나 팬데믹으로 한 달 만에 35% 폭락했습니다.' },
  { id: 40, year: '2020년 3월', title: '코로나 대폭락 바닥', period: '2020 바닥', headline: 'S&P 500 한 달 35% 폭락! 서킷브레이커 연발', description: '코로나 팬데믹으로 한 달 만에 35% 폭락했습니다. 연준이 무제한 양적완화를 선언합니다.', marketContext: 'S&P 500 2,237 (저점)', returns: { stocks: 120, bonds: 5, gold: 20, cash: 0, realestate: 30 }, bestAllocation: { stocks: 70, bonds: 15, gold: 10, cash: 5, realestate: 0 }, actualOutcome: 'V자 반등, 2021년 사상 최고가', explanation: '전례 없는 유동성 공급으로 역사상 가장 빠른 회복이 이뤄졌습니다.' },
  { id: 41, year: '2020년 11월', title: '백신 개발 성공', period: '2020 백신', headline: '화이자 백신 90% 효과! 경제 정상화 기대', description: '코로나 백신 개발 성공 소식에 경제 정상화 기대감이 급등합니다.', marketContext: '가치주 급등, 성장주 조정', returns: { stocks: 25, bonds: -5, gold: -10, cash: 0, realestate: 20 }, bestAllocation: { stocks: 55, bonds: 20, gold: 5, cash: 10, realestate: 10 }, actualOutcome: '리오프닝 랠리', explanation: '백신 기대감으로 리오프닝 테마가 급등했습니다.' },
  { id: 42, year: '2021년 1월', title: '밈 주식 광풍', period: '2021 밈주식', headline: 'GME 1,000% 폭등! 개미 vs 월가 대결', description: '게임스탑(GME) 주가가 1,000% 폭등하며 밈 주식 광풍이 불고 있습니다.', marketContext: '개별 종목 극단적 변동성', returns: { stocks: 10, bonds: -3, gold: -5, cash: 0, realestate: 15 }, bestAllocation: { stocks: 40, bonds: 30, gold: 10, cash: 20, realestate: 0 }, actualOutcome: '밈 주식 폭락, 광풍 진정', explanation: '밈 주식 광풍은 단기에 그쳤습니다.' },
  { id: 43, year: '2021년 11월', title: '인플레이션 공포 시작', period: '2021 인플레', headline: 'CPI 6.8%! 40년 만의 인플레이션', description: '미국 소비자물가가 6.8%로 40년 만의 최고치를 기록했습니다. 연준 대응이 주목됩니다.', marketContext: '나스닥 고점 형성', returns: { stocks: -25, bonds: -15, gold: 5, cash: 0, realestate: -10 }, bestAllocation: { stocks: 15, bonds: 20, gold: 30, cash: 35, realestate: 0 }, actualOutcome: '2022년 긴축 충격', explanation: '인플레이션이 연준 긴축을 촉발했습니다.' },
  { id: 44, year: '2022년 1월', title: '연준 긴축 전환', period: '2022 긴축시작', headline: '연준, 금리인상 시사 - 기술주 폭락 시작', description: '연준이 금리인상 시작을 시사하며 기술주 중심으로 조정이 시작됩니다.', marketContext: '나스닥 고점 대비 -20%', returns: { stocks: -30, bonds: -15, gold: 5, cash: 3, realestate: -10 }, bestAllocation: { stocks: 10, bonds: 20, gold: 35, cash: 35, realestate: 0 }, actualOutcome: '2022년 약세장', explanation: '연준 긴축으로 2022년이 약세장으로 전환되었습니다.' },
  { id: 45, year: '2022년 6월', title: '인플레이션 정점', period: '2022 인플레정점', headline: 'CPI 9.1%! 40년 최고 - 75bp 자이언트 스텝', description: '미국 CPI가 9.1%로 40년 최고치를 기록했습니다. 연준이 75bp 금리인상을 단행합니다.', marketContext: 'S&P 500 연저점 부근', returns: { stocks: 15, bonds: -5, gold: -5, cash: 3, realestate: -15 }, bestAllocation: { stocks: 30, bonds: 30, gold: 15, cash: 25, realestate: 0 }, actualOutcome: '인플레 피크아웃 시작', explanation: '인플레이션이 정점을 지나며 시장이 안도했습니다.' },
  { id: 46, year: '2022년 10월', title: '긴축 충격 바닥', period: '2022 바닥', headline: '원달러 1,440원! 글로벌 긴축 충격 절정', description: '강달러와 금리 충격으로 원달러가 1,440원까지 치솟았습니다. 긴축 공포가 절정입니다.', marketContext: 'KOSPI 2,155 (연저점)', returns: { stocks: 25, bonds: 10, gold: 5, cash: 2, realestate: 10 }, bestAllocation: { stocks: 45, bonds: 30, gold: 10, cash: 15, realestate: 0 }, actualOutcome: '2023년 반등 시작', explanation: '금리 인상 종료 기대감으로 시장이 반등했습니다.' },
  { id: 47, year: '2023년 3월', title: 'SVB 파산', period: '2023 SVB', headline: '실리콘밸리은행 파산! 금융위기 재연 우려', description: '실리콘밸리은행(SVB)이 파산하며 2008년 금융위기 재연 우려가 커집니다.', marketContext: '은행주 폭락', returns: { stocks: 10, bonds: 8, gold: 10, cash: 2, realestate: -5 }, bestAllocation: { stocks: 35, bonds: 35, gold: 15, cash: 15, realestate: 0 }, actualOutcome: '빠른 진화, 시장 안정', explanation: '연준과 FDIC의 빠른 대응으로 위기가 진화되었습니다.' },
  { id: 48, year: '2023년 11월', title: 'AI 랠리', period: '2023 AI랠리', headline: 'ChatGPT 열풍! AI 수혜주 폭등', description: 'ChatGPT 등장 이후 AI 수혜주들이 폭등하고 있습니다. 엔비디아가 시총 1조 달러를 돌파합니다.', marketContext: 'AI 테마 급등', returns: { stocks: 25, bonds: 5, gold: 10, cash: 2, realestate: 5 }, bestAllocation: { stocks: 55, bonds: 25, gold: 10, cash: 10, realestate: 0 }, actualOutcome: 'AI 테마 지속 강세', explanation: 'AI 혁명 기대감이 기술주를 견인했습니다.' },
  { id: 49, year: '2024년 3월', title: '연준 피봇 기대', period: '2024 피봇기대', headline: '연준 금리인하 시사! 시장 사상 최고가', description: '연준이 2024년 금리인하를 시사하며 시장이 사상 최고가를 경신하고 있습니다.', marketContext: 'S&P 500 5,000 돌파', returns: { stocks: 15, bonds: 8, gold: 10, cash: 2, realestate: 10 }, bestAllocation: { stocks: 50, bonds: 30, gold: 10, cash: 10, realestate: 0 }, actualOutcome: '금리인하 기대감 지속', explanation: '금리인하 기대감이 시장을 지지하고 있습니다.' },
  { id: 50, year: '2024년 8월', title: '엔캐리 청산 쇼크', period: '2024 엔캐리', headline: '일본 금리인상! 글로벌 캐리 트레이드 청산', description: '일본은행의 깜짝 금리인상으로 엔캐리 트레이드 청산이 발생하며 글로벌 증시가 급락했습니다.', marketContext: '닛케이 -12%, KOSPI -8%', returns: { stocks: -10, bonds: 5, gold: 5, cash: 2, realestate: -5 }, bestAllocation: { stocks: 30, bonds: 35, gold: 20, cash: 15, realestate: 0 }, actualOutcome: '단기 충격 후 회복', explanation: '엔캐리 청산 충격은 단기에 그쳤습니다.' },
];

function selectRandomScenarios(count: number): Scenario[] {
  const shuffled = [...scenarios];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).sort((a, b) => a.id - b.id);
}

const rankings: Ranking[] = [
  { title: '전설의 투자자', grade: 'S', description: '워런 버핏에 비견되는 탁월한 투자 감각입니다.', minReturn: 200 },
  { title: '마스터 투자자', grade: 'A+', description: '시장의 흐름을 정확히 읽어내는 능력이 뛰어납니다.', minReturn: 100 },
  { title: '숙련된 펀드매니저', grade: 'A', description: '리스크 관리와 수익 추구의 균형이 우수합니다.', minReturn: 50 },
  { title: '유능한 트레이더', grade: 'B+', description: '평균 이상의 투자 판단력을 보여주셨습니다.', minReturn: 25 },
  { title: '준수한 투자자', grade: 'B', description: '시장 사이클에 대한 이해가 양호합니다.', minReturn: 10 },
  { title: '평범한 투자자', grade: 'C', description: '시장 평균 수준의 성과입니다.', minReturn: 0 },
  { title: '초보 투자자', grade: 'D', description: '손실을 경험했지만 중요한 교훈을 얻었습니다.', minReturn: -20 },
  { title: '위기의 투자자', grade: 'F', description: '큰 손실을 기록했습니다. 실전이 아니어서 다행입니다.', minReturn: -Infinity },
];

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

function calculatePortfolioReturn(allocation: AssetAllocation, returns: AssetAllocation): number {
  let totalReturn = 0;
  const assets: AssetClass[] = ['stocks', 'bonds', 'gold', 'cash', 'realestate'];
  for (const asset of assets) {
    totalReturn += (allocation[asset] / 100) * returns[asset];
  }
  return totalReturn;
}

function getRanking(returnPercent: number): Ranking {
  for (const rank of rankings) {
    if (returnPercent >= rank.minReturn) return rank;
  }
  return rankings[rankings.length - 1];
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: 900, margin: '0 auto', fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif" },
  card: { background: 'var(--ifm-card-background-color, #fff)', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  title: { fontSize: 24, fontWeight: 800, margin: '0 0 8px 0', color: 'var(--ifm-color-primary)' },
  subtitle: { fontSize: 14, color: 'var(--ifm-color-emphasis-600)', margin: 0 },
  portfolioBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: '12px 20px', marginBottom: 16, flexWrap: 'wrap' as const, gap: 8 },
  roundBadge: { display: 'inline-block', background: 'var(--ifm-color-primary)', color: '#fff', padding: '4px 12px', borderRadius: 16, fontSize: 12, fontWeight: 600 },
  yearBadge: { display: 'inline-block', background: 'var(--ifm-color-emphasis-200)', color: 'var(--ifm-color-emphasis-700)', padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600, marginLeft: 8 },
  scenarioTitle: { fontSize: 20, fontWeight: 700, margin: '8px 0' },
  headline: { fontSize: 15, fontWeight: 600, color: 'var(--ifm-color-danger)', margin: '12px 0 8px 0', padding: '10px 14px', background: 'var(--ifm-color-danger-contrast-background)', borderRadius: 8, borderLeft: '4px solid var(--ifm-color-danger)' },
  descriptionText: { fontSize: 14, lineHeight: 1.7, margin: '12px 0' },
  sectionLabel: { fontSize: 14, fontWeight: 700, color: 'var(--ifm-color-emphasis-700)', marginBottom: 10, marginTop: 16 },
  confirmButton: { width: '100%', padding: '14px', border: 'none', borderRadius: 10, background: 'var(--ifm-color-primary)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  confirmButtonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  nextButton: { width: '100%', padding: '14px', border: 'none', borderRadius: 10, background: 'var(--ifm-color-primary-dark)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 12 },
  restartButton: { display: 'block', width: '100%', padding: '14px', border: '2px solid var(--ifm-color-primary)', borderRadius: 10, background: 'transparent', color: 'var(--ifm-color-primary)', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 16 },
  startButton: { display: 'block', width: '100%', padding: '16px', border: 'none', borderRadius: 12, background: 'var(--ifm-color-primary)', color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginTop: 20 },
  progressBar: { width: '100%', height: 6, background: 'var(--ifm-color-emphasis-200)', borderRadius: 3, marginBottom: 16, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'var(--ifm-color-primary)', borderRadius: 3, transition: 'width 0.3s ease' },
  divider: { border: 'none', borderTop: '1px solid var(--ifm-color-emphasis-200)', margin: '16px 0' },
  chartContainer: { background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: 16, marginBottom: 16 },
  sliderContainer: { marginBottom: 12 },
  slider: { width: '100%', cursor: 'pointer' },
  allocationGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 },
  allocationItem: { padding: '12px', borderRadius: 8, border: '1px solid var(--ifm-color-emphasis-300)' },
  resultBox: { borderRadius: 10, padding: 16, marginTop: 16, marginBottom: 16 },
  resultPositive: { background: 'var(--ifm-color-success-contrast-background)', border: '1px solid var(--ifm-color-success)' },
  resultNegative: { background: 'var(--ifm-color-danger-contrast-background)', border: '1px solid var(--ifm-color-danger)' },
};

// ─── Components ──────────────────────────────────────────────────────────────

type GamePhase = 'intro' | 'playing' | 'result' | 'summary';

export default function MarketSurvivor(): JSX.Element {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentRound, setCurrentRound] = useState(0);
  const [portfolio, setPortfolio] = useState(INITIAL_CAPITAL);
  const [allocation, setAllocation] = useState<AssetAllocation>({ stocks: 60, bonds: 20, gold: 10, cash: 10, realestate: 0 });
  const [results, setResults] = useState<RoundResult[]>([]);
  const [showingResult, setShowingResult] = useState(false);
  const [currentChange, setCurrentChange] = useState(0);
  const [portfolioHistory, setPortfolioHistory] = useState<number[]>([INITIAL_CAPITAL]);
  const activeScenarios = useRef<Scenario[]>(selectRandomScenarios(ROUNDS_PER_GAME));

  const totalAllocation = useMemo(() => {
    return allocation.stocks + allocation.bonds + allocation.gold + allocation.cash + allocation.realestate;
  }, [allocation]);

  const resetGame = useCallback(() => {
    activeScenarios.current = selectRandomScenarios(ROUNDS_PER_GAME);
    setPhase('intro');
    setCurrentRound(0);
    setPortfolio(INITIAL_CAPITAL);
    setAllocation({ stocks: 60, bonds: 20, gold: 10, cash: 10, realestate: 0 });
    setResults([]);
    setShowingResult(false);
    setCurrentChange(0);
    setPortfolioHistory([INITIAL_CAPITAL]);
  }, []);

  const startGame = useCallback(() => {
    setPhase('playing');
    setCurrentRound(0);
    setPortfolio(INITIAL_CAPITAL);
    setResults([]);
    setPortfolioHistory([INITIAL_CAPITAL]);
  }, []);

  const handleAllocationChange = (asset: AssetClass, value: number) => {
    const currentOthers = totalAllocation - allocation[asset];
    const maxAllowed = 100 - currentOthers;
    const newValue = Math.min(value, maxAllowed);
    setAllocation(prev => ({ ...prev, [asset]: newValue }));
  };

  const submitDecision = useCallback(() => {
    if (totalAllocation !== 100) return;

    const scenario = activeScenarios.current[currentRound];
    const returnPercent = calculatePortfolioReturn(allocation, scenario.returns);
    const changeAmount = Math.round(portfolio * (returnPercent / 100));
    const newPortfolio = Math.max(0, portfolio + changeAmount);

    setCurrentChange(changeAmount);
    setPortfolio(newPortfolio);
    setPortfolioHistory(prev => [...prev, newPortfolio]);
    setResults(prev => [...prev, {
      scenarioId: scenario.id,
      allocation: { ...allocation },
      portfolioChange: changeAmount,
      portfolioAfter: newPortfolio,
      returns: scenario.returns,
    }]);
    setShowingResult(true);
  }, [allocation, currentRound, portfolio, totalAllocation]);

  const nextRound = useCallback(() => {
    if (currentRound + 1 >= activeScenarios.current.length) {
      setPhase('summary');
    } else {
      setCurrentRound(prev => prev + 1);
      setShowingResult(false);
    }
  }, [currentRound]);

  const totalReturn = ((portfolio - INITIAL_CAPITAL) / INITIAL_CAPITAL) * 100;

  // Portfolio Chart Component
  const PortfolioChart = () => {
    const maxValue = Math.max(...portfolioHistory, INITIAL_CAPITAL);
    const minValue = Math.min(...portfolioHistory, 0);
    const range = maxValue - minValue || 1;
    const height = 120;
    const width = 100;

    const points = portfolioHistory.map((value, index) => {
      const x = (index / Math.max(portfolioHistory.length - 1, 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div style={styles.chartContainer}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>포트폴리오 가치 변화</div>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 120 }}>
          {/* Grid lines */}
          <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="var(--ifm-color-emphasis-300)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="0" x2={width} y2="0" stroke="var(--ifm-color-emphasis-300)" strokeWidth="0.3" />
          <line x1="0" y1={height} x2={width} y2={height} stroke="var(--ifm-color-emphasis-300)" strokeWidth="0.3" />

          {/* Initial capital line */}
          <line x1="0" y1={height - ((INITIAL_CAPITAL - minValue) / range) * height} x2={width} y2={height - ((INITIAL_CAPITAL - minValue) / range) * height} stroke="var(--ifm-color-emphasis-400)" strokeWidth="0.5" strokeDasharray="4,2" />

          {/* Portfolio line */}
          <polyline fill="none" stroke={totalReturn >= 0 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)'} strokeWidth="2" points={points} />

          {/* Current point */}
          {portfolioHistory.length > 0 && (
            <circle
              cx={(portfolioHistory.length - 1) / Math.max(portfolioHistory.length - 1, 1) * width}
              cy={height - ((portfolioHistory[portfolioHistory.length - 1] - minValue) / range) * height}
              r="3"
              fill={totalReturn >= 0 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)'}
            />
          )}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ifm-color-emphasis-600)', marginTop: 4 }}>
          <span>시작</span>
          <span>현재 (R{currentRound + 1}/{activeScenarios.current.length})</span>
        </div>
      </div>
    );
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={styles.title}>Market Survivor</h2>
            <p style={styles.subtitle}>100년 투자 시뮬레이션 - 1929~2024</p>
          </div>

          <p style={styles.descriptionText}>
            1929년 대공황부터 2024년까지, 100년간 금융 역사의 결정적 순간 50개 중 무작위로 10개를 시간순으로 경험합니다.
            플레이할 때마다 다른 시나리오가 선택되어 매번 새로운 도전이 됩니다.
          </p>

          <div style={{ background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>게임 정보</div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8 }}>
              <li><strong>시작 자본:</strong> 1억원</li>
              <li><strong>총 라운드:</strong> 10라운드 (50개 중 랜덤 선택, 시간순 진행)</li>
              <li><strong>자산군:</strong> 주식, 채권, 금, 현금, 부동산</li>
              <li><strong>목표:</strong> 최대 수익률 달성</li>
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
            {(['stocks', 'bonds', 'gold', 'cash', 'realestate'] as AssetClass[]).map(asset => (
              <div key={asset} style={{ textAlign: 'center', padding: 8, background: 'var(--ifm-color-emphasis-100)', borderRadius: 6 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: ASSET_COLORS[asset], margin: '0 auto 4px' }} />
                <div style={{ fontSize: 12, fontWeight: 600 }}>{ASSET_LABELS[asset]}</div>
              </div>
            ))}
          </div>

          <button style={styles.startButton} onClick={startGame}>
            게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  // Summary Screen
  if (phase === 'summary') {
    const ranking = getRanking(totalReturn);

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <h2 style={styles.title}>게임 결과</h2>
          </div>

          <div style={{ textAlign: 'center', padding: 24, background: 'linear-gradient(135deg, var(--ifm-color-primary-lightest), var(--ifm-color-primary-contrast-background))', borderRadius: 12, marginBottom: 20, border: '2px solid var(--ifm-color-primary)' }}>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{ranking.grade}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--ifm-color-primary-dark)' }}>{ranking.title}</div>
            <p style={{ fontSize: 14, color: 'var(--ifm-color-emphasis-700)', margin: '8px 0 0' }}>{ranking.description}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800, margin: 0, color: totalReturn >= 0 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </p>
              <p style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', margin: '4px 0 0' }}>총 수익률</p>
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{formatKRW(portfolio)}</p>
              <p style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', margin: '4px 0 0' }}>최종 자산</p>
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>{activeScenarios.current.length}R</p>
              <p style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', margin: '4px 0 0' }}>총 라운드</p>
            </div>
          </div>

          <PortfolioChart />

          <button style={styles.restartButton} onClick={resetGame}>
            다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  // Playing Screen
  const scenario = activeScenarios.current[currentRound];

  return (
    <div style={styles.container}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progressFill, width: `${((currentRound + (showingResult ? 1 : 0)) / activeScenarios.current.length) * 100}%` }} />
      </div>

      <div style={styles.portfolioBar}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)' }}>현재 자산</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: portfolio >= INITIAL_CAPITAL ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
            {formatKRW(portfolio)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)' }}>수익률</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: totalReturn >= 0 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)' }}>
            {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
          </div>
        </div>
      </div>

      <PortfolioChart />

      <div style={styles.card}>
        <div>
          <span style={styles.roundBadge}>Round {currentRound + 1} / {activeScenarios.current.length}</span>
          <span style={styles.yearBadge}>{scenario.year}</span>
        </div>

        <h3 style={styles.scenarioTitle}>{scenario.title}</h3>
        <div style={styles.headline}>{scenario.headline}</div>
        <p style={styles.descriptionText}>{scenario.description}</p>
        <div style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)', marginBottom: 16 }}>{scenario.marketContext}</div>

        {!showingResult ? (
          <>
            <hr style={styles.divider} />
            <p style={styles.sectionLabel}>자산 배분 결정 (합계 100%)</p>

            <div style={styles.allocationGrid}>
              {(['stocks', 'bonds', 'gold', 'cash', 'realestate'] as AssetClass[]).map(asset => (
                <div key={asset} style={styles.allocationItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: ASSET_COLORS[asset] }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{ASSET_LABELS[asset]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocation[asset]}
                    onChange={(e) => handleAllocationChange(asset, parseInt(e.target.value))}
                    style={styles.slider}
                  />
                  <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: 'var(--ifm-color-primary)' }}>
                    {allocation[asset]}%
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', margin: '16px 0', padding: '10px', background: totalAllocation === 100 ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-warning-contrast-background)', borderRadius: 8 }}>
              <span style={{ fontWeight: 600 }}>총 배분: {totalAllocation}%</span>
              {totalAllocation !== 100 && <span style={{ color: 'var(--ifm-color-warning-dark)', marginLeft: 8 }}>(100%가 되어야 합니다)</span>}
            </div>

            <button
              style={{ ...styles.confirmButton, ...(totalAllocation !== 100 ? styles.confirmButtonDisabled : {}) }}
              onClick={submitDecision}
              disabled={totalAllocation !== 100}
            >
              결정 확정
            </button>
          </>
        ) : (
          <>
            <hr style={styles.divider} />
            <div style={{ ...styles.resultBox, ...(currentChange >= 0 ? styles.resultPositive : styles.resultNegative) }}>
              <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>
                {currentChange >= 0 ? '수익 발생!' : '손실 발생'}
              </p>
              <p style={{ fontSize: 14, margin: '4px 0' }}>
                <strong>포트폴리오 변동:</strong>{' '}
                <span style={{ fontWeight: 700, color: currentChange >= 0 ? 'var(--ifm-color-success-dark)' : 'var(--ifm-color-danger-dark)' }}>
                  {currentChange >= 0 ? '+' : ''}{formatKRW(currentChange)} ({currentChange >= 0 ? '+' : ''}{((currentChange / (portfolio - currentChange)) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>

            <div style={{ background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 8px' }}>자산별 수익률</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, fontSize: 12 }}>
                {(['stocks', 'bonds', 'gold', 'cash', 'realestate'] as AssetClass[]).map(asset => (
                  <div key={asset} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 600 }}>{ASSET_LABELS[asset]}</div>
                    <div style={{ color: scenario.returns[asset] >= 0 ? 'var(--ifm-color-success)' : 'var(--ifm-color-danger)', fontWeight: 700 }}>
                      {scenario.returns[asset] >= 0 ? '+' : ''}{scenario.returns[asset]}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--ifm-color-emphasis-100)', borderRadius: 8, padding: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>실제 결과</p>
              <p style={{ fontSize: 13, margin: '0 0 8px' }}>{scenario.actualOutcome}</p>
              <p style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', margin: 0 }}>{scenario.explanation}</p>
            </div>

            <button style={styles.nextButton} onClick={nextRound}>
              {currentRound + 1 < activeScenarios.current.length ? `다음 라운드 (Round ${currentRound + 2})` : '최종 결과 보기'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
