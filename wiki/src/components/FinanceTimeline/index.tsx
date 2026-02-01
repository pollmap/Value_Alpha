import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface TimelineEvent {
  year: number;
  month?: number;
  title: string;
  description: string;
  category: 'crisis' | 'policy' | 'market' | 'institution' | 'regulation';
  impact: 'high' | 'medium' | 'low';
  kospiChange?: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  // 1990년대
  { year: 1997, month: 11, title: 'IMF 외환위기', description: '외환보유고 고갈로 IMF 구제금융 신청. 원/달러 환율 850원→1,960원 급등, 30대 재벌 중 16개 부도, 금융기관 대규모 구조조정', category: 'crisis', impact: 'high', kospiChange: '-72%' },
  { year: 1998, month: 4, title: '예금자보호법 시행', description: '예금보험공사 설립, 1인당 5천만원 한도 예금자 보호 제도 도입', category: 'regulation', impact: 'high' },
  { year: 1998, month: 9, title: '대우그룹 해체', description: '대우그룹 워크아웃 시작, 1999년 공식 해체. 부채 80조원 규모 사상 최대 기업 부도', category: 'crisis', impact: 'high' },
  { year: 1999, month: 5, title: '외국인 투자 전면 개방', description: '외국인 주식 투자한도 완전 폐지. MSCI 선진국 지수 편입 추진 시작', category: 'policy', impact: 'high' },

  // 2000년대
  { year: 2000, month: 3, title: 'IT 버블 정점', description: 'KOSDAQ 2,834pt 사상 최고치 후 폭락. 새롬기술 시총 삼성전자 추월 후 상폐', category: 'crisis', impact: 'high', kospiChange: '-51%' },
  { year: 2001, month: 4, title: '금융지주회사 출범', description: '우리금융지주 설립으로 한국형 금융지주회사 시대 개막. 이후 신한, KB, 하나금융 출범', category: 'institution', impact: 'high' },
  { year: 2003, month: 3, title: '카드대란', description: 'LG카드 유동성 위기, 카드사 연체율 14% 돌파. 400만명 신용불량자 발생', category: 'crisis', impact: 'medium', kospiChange: '-15%' },
  { year: 2005, month: 7, title: '삼성-소버린 경영권 분쟁', description: '영국계 펀드 소버린의 삼성물산 지분 매집. 외국계 투기자본 논쟁 촉발', category: 'market', impact: 'medium' },
  { year: 2007, month: 7, title: 'KOSPI 2,000pt 돌파', description: '사상 첫 KOSPI 2,000pt 돌파. 글로벌 유동성 랠리, 중국 특수', category: 'market', impact: 'medium' },
  { year: 2008, month: 9, title: '글로벌 금융위기', description: '리먼브라더스 파산, 서브프라임 사태. KOSPI 892pt까지 폭락, 환율 1,500원 돌파', category: 'crisis', impact: 'high', kospiChange: '-54%' },
  { year: 2009, month: 3, title: '미국 양적완화 시작', description: 'Fed QE1 시작, 1.75조 달러 유동성 공급. 글로벌 증시 반등 시작', category: 'policy', impact: 'high' },

  // 2010년대
  { year: 2011, month: 2, title: '저축은행 사태', description: '부산저축은행 등 16개 저축은행 영업정지. 부동산 PF 부실, 분식회계 적발', category: 'crisis', impact: 'medium' },
  { year: 2013, month: 5, title: '테이퍼 탠트럼', description: 'Fed 양적완화 축소 시사에 신흥국 자금 이탈. 원화 10% 절하', category: 'policy', impact: 'medium', kospiChange: '-10%' },
  { year: 2014, month: 4, title: '세월호 참사', description: '세월호 침몰 사고. 소비심리 위축, 내수 경기 악화', category: 'crisis', impact: 'low' },
  { year: 2015, month: 8, title: '중국 위안화 절하', description: '중국 인민은행 위안화 평가절하. 차이나 쇼크로 글로벌 증시 동반 하락', category: 'crisis', impact: 'medium', kospiChange: '-15%' },
  { year: 2016, month: 1, title: 'MSCI EM 지수 중국 A주 편입 발표', description: 'MSCI 신흥국 지수에 중국 A주 편입. 한국 비중 희석 우려', category: 'market', impact: 'medium' },
  { year: 2017, month: 11, title: '비트코인 광풍', description: '비트코인 2만 달러 돌파, 김치 프리미엄 30% 발생. 가상자산 투자 열풍', category: 'market', impact: 'medium' },
  { year: 2018, month: 10, title: '미중 무역분쟁 격화', description: '미중 관세 전쟁 심화. 반도체 다운사이클 진입, 수출 감소', category: 'crisis', impact: 'medium', kospiChange: '-17%' },
  { year: 2019, month: 7, title: '일본 수출규제', description: '일본 반도체 소재 수출규제. 소부장 국산화 정책 본격화', category: 'policy', impact: 'medium' },

  // 2020년대
  { year: 2020, month: 3, title: '코로나19 팬데믹', description: '팬데믹 선언, KOSPI 1,439pt 폭락. 서킷브레이커 4회 발동', category: 'crisis', impact: 'high', kospiChange: '-35%' },
  { year: 2020, month: 5, title: '동학개미운동', description: '개인투자자 대규모 순매수(80조원+). 코스피 V자 반등 견인', category: 'market', impact: 'high' },
  { year: 2021, month: 1, title: 'KOSPI 3,000pt 돌파', description: '사상 첫 3,000pt 돌파. 3,316pt 역대 최고치 기록(21년 7월)', category: 'market', impact: 'high' },
  { year: 2021, month: 4, title: '쿠팡 NYSE 상장', description: '쿠팡 뉴욕증시 상장, 시총 100조원. 한국 스타트업 최대 규모 IPO', category: 'institution', impact: 'medium' },
  { year: 2022, month: 3, title: 'Fed 금리 인상 시작', description: 'Fed 기준금리 인상 시작. 5.5%까지 급속 긴축, 글로벌 자산가격 조정', category: 'policy', impact: 'high', kospiChange: '-24%' },
  { year: 2022, month: 5, title: '테라-루나 폭락', description: '알고리즘 스테이블코인 테라/루나 붕괴. 60조원 증발, 국내 투자자 피해 막대', category: 'crisis', impact: 'high' },
  { year: 2022, month: 10, title: '레고랜드 사태', description: '강원도 레고랜드 ABCP 디폴트. 채권시장 경색, 자금시장 신용경색', category: 'crisis', impact: 'medium' },
  { year: 2023, month: 1, title: 'IFRS17 시행', description: '보험업 새 회계기준 IFRS17 본격 시행. 보험사 재무제표 대변혁', category: 'regulation', impact: 'medium' },
  { year: 2023, month: 3, title: 'SVB 파산', description: '미국 실리콘밸리은행 파산. 2008년 이후 최대 은행 파산, 금리 리스크 부각', category: 'crisis', impact: 'medium' },
  { year: 2023, month: 7, title: 'AI 반도체 랠리', description: 'ChatGPT 열풍으로 엔비디아 시총 1조달러 돌파. HBM 등 AI 반도체 수혜', category: 'market', impact: 'high' },
  { year: 2024, month: 2, title: '밸류업 프로그램 발표', description: '코리아 디스카운트 해소 위한 기업 밸류업 프로그램. 주주환원 강화 정책', category: 'policy', impact: 'medium' },
  { year: 2024, month: 9, title: 'Fed 금리 인하 시작', description: 'Fed 4년여 만에 금리 인하 시작. 50bp 빅컷으로 피벗 신호', category: 'policy', impact: 'high' },
  { year: 2025, month: 1, title: '금융투자소득세 시행', description: '금융투자소득세 본격 시행. 주식 양도차익 과세 체계 전면 개편', category: 'regulation', impact: 'high' },
  { year: 2025, month: 6, title: '국민연금 주주권 강화', description: '국민연금 스튜어드십 코드 2.0. 적극적 주주권 행사, ESG 투자 확대', category: 'policy', impact: 'medium' },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  crisis: { bg: '#ff4d4f', text: 'white' },
  policy: { bg: '#1890ff', text: 'white' },
  market: { bg: '#52c41a', text: 'white' },
  institution: { bg: '#722ed1', text: 'white' },
  regulation: { bg: '#fa8c16', text: 'white' },
};

const CATEGORY_LABELS: Record<string, string> = {
  crisis: '위기',
  policy: '정책',
  market: '시장',
  institution: '제도',
  regulation: '규제',
};

const FinanceTimelineInner: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const filteredEvents = selectedCategory === 'all'
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter(e => e.category === selectedCategory);

  const groupedByDecade = filteredEvents.reduce((acc, event) => {
    const decade = Math.floor(event.year / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(event);
    return acc;
  }, {} as Record<number, TimelineEvent[]>);

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <h3 style={{ marginTop: 0 }}>한국 금융사 타임라인</h3>
      <p style={{ color: 'var(--ifm-color-emphasis-700)', marginBottom: '1.5rem' }}>
        1997년 IMF 외환위기부터 현재까지 한국 금융시장의 주요 이벤트
      </p>

      {/* 카테고리 필터 */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: selectedCategory === 'all' ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
            color: selectedCategory === 'all' ? 'white' : 'inherit',
          }}
        >
          전체
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: selectedCategory === key ? CATEGORY_COLORS[key].bg : 'var(--ifm-color-emphasis-200)',
              color: selectedCategory === key ? 'white' : 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 타임라인 */}
      <div style={{ position: 'relative', paddingLeft: '30px' }}>
        {/* 세로 선 */}
        <div style={{
          position: 'absolute',
          left: '10px',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: 'var(--ifm-color-emphasis-300)',
        }} />

        {Object.entries(groupedByDecade).sort(([a], [b]) => Number(a) - Number(b)).map(([decade, events]) => (
          <div key={decade} style={{ marginBottom: '2rem' }}>
            <h4 style={{
              backgroundColor: 'var(--ifm-color-primary)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              display: 'inline-block',
              marginBottom: '1rem',
              marginLeft: '-20px',
            }}>
              {decade}년대
            </h4>

            {events.sort((a, b) => a.year - b.year || (a.month || 0) - (b.month || 0)).map((event, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  marginBottom: '1rem',
                  paddingLeft: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => setExpandedYear(expandedYear === event.year ? null : event.year)}
              >
                {/* 점 */}
                <div style={{
                  position: 'absolute',
                  left: '-24px',
                  top: '5px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: CATEGORY_COLORS[event.category].bg,
                  border: '2px solid white',
                  boxShadow: '0 0 0 2px var(--ifm-color-emphasis-300)',
                }} />

                {/* 이벤트 카드 */}
                <div style={{
                  backgroundColor: 'var(--ifm-color-emphasis-100)',
                  padding: '1rem',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${CATEGORY_COLORS[event.category].bg}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <span style={{
                        fontSize: '0.8rem',
                        color: 'var(--ifm-color-emphasis-600)',
                      }}>
                        {event.year}년 {event.month ? `${event.month}월` : ''}
                      </span>
                      <h5 style={{ margin: '0.25rem 0', fontSize: '1rem' }}>{event.title}</h5>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{
                        ...CATEGORY_COLORS[event.category],
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}>
                        {CATEGORY_LABELS[event.category]}
                      </span>
                      {event.kospiChange && (
                        <span style={{
                          backgroundColor: event.kospiChange.startsWith('-') ? '#ff4d4f' : '#52c41a',
                          color: 'white',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                        }}>
                          KOSPI {event.kospiChange}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '0.9rem',
                    color: 'var(--ifm-color-emphasis-700)',
                  }}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '1rem' }}>
        * KOSPI 변동률은 해당 이벤트 발생 전후 최대 하락/상승폭 기준입니다.
      </p>
    </div>
  );
};

export default function FinanceTimeline() {
  return (
    <BrowserOnly fallback={<div>타임라인 로딩 중...</div>}>
      {() => <FinanceTimelineInner />}
    </BrowserOnly>
  );
}
