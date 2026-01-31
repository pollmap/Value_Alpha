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
  { year: 1997, month: 11, title: 'IMF 외환위기', description: '외환보유고 고갈로 IMF 구제금융 신청. 원/달러 환율 급등, 대기업 연쇄 부도, 금융기관 대규모 구조조정', category: 'crisis', impact: 'high', kospiChange: '-42%' },
  { year: 1998, month: 6, title: '금융지주회사법 제정', description: '금융산업 구조조정의 일환으로 금융지주회사 설립 근거 마련', category: 'regulation', impact: 'medium' },
  { year: 1999, month: 1, title: '외국인 투자 전면 개방', description: '외국인 주식 투자한도 완전 폐지. 국제 자본시장 편입 가속화', category: 'policy', impact: 'high' },
  { year: 2000, month: 3, title: 'IT 버블 정점', description: 'KOSDAQ 사상 최고치(2,834pt) 기록 후 폭락. 닷컴 버블 붕괴', category: 'crisis', impact: 'high', kospiChange: '-51%' },
  { year: 2001, month: 1, title: '금융지주회사 출범', description: '우리금융지주 출범. 이후 신한, KB, 하나금융지주 설립', category: 'institution', impact: 'medium' },
  { year: 2003, month: 3, title: '카드 사태', description: 'LG카드 유동성 위기. 신용카드 연체율 급등, 소비자 신용 위기', category: 'crisis', impact: 'medium' },
  { year: 2005, month: 1, title: 'KOSPI 1,000pt 회복', description: '외환위기 이후 7년 만에 KOSPI 1,000pt 회복', category: 'market', impact: 'low' },
  { year: 2007, month: 10, title: 'KOSPI 사상 최고치', description: 'KOSPI 2,064pt로 사상 최고치 경신. 글로벌 유동성 장세', category: 'market', impact: 'medium' },
  { year: 2008, month: 9, title: '글로벌 금융위기', description: '리먼브라더스 파산. 전 세계 금융시장 붕괴. 한국 KOSPI 900pt대 폭락', category: 'crisis', impact: 'high', kospiChange: '-54%' },
  { year: 2009, month: 3, title: '양적완화 시작', description: '미국 Fed 양적완화(QE1) 시작. 글로벌 유동성 공급 확대', category: 'policy', impact: 'high' },
  { year: 2011, month: 2, title: '저축은행 사태', description: '부산저축은행 등 대규모 부실 사태. 16개 저축은행 영업정지', category: 'crisis', impact: 'medium' },
  { year: 2013, month: 5, title: '테이퍼 탠트럼', description: 'Fed 양적완화 축소 시사에 신흥국 자금 이탈. 원화 약세', category: 'policy', impact: 'medium', kospiChange: '-10%' },
  { year: 2015, month: 8, title: '중국 위안화 절하', description: '중국 위안화 평가절하로 글로벌 금융시장 혼란', category: 'crisis', impact: 'medium', kospiChange: '-15%' },
  { year: 2016, month: 11, title: '트럼프 당선', description: '트럼프 미국 대통령 당선. 보호무역주의 우려', category: 'policy', impact: 'medium' },
  { year: 2017, month: 5, title: '문재인 정부 출범', description: '문재인 정부 출범. 소득주도성장, 금융규제 강화 정책', category: 'policy', impact: 'low' },
  { year: 2018, month: 10, title: '미중 무역전쟁 심화', description: '미중 무역분쟁 격화. 반도체 업종 타격', category: 'crisis', impact: 'medium', kospiChange: '-17%' },
  { year: 2020, month: 3, title: '코로나19 팬데믹', description: '코로나19 팬데믹으로 KOSPI 1,400pt대 폭락. 서킷브레이커 발동', category: 'crisis', impact: 'high', kospiChange: '-35%' },
  { year: 2020, month: 5, title: '동학개미운동', description: '개인투자자 대규모 순매수. KOSPI V자 반등 주도', category: 'market', impact: 'medium' },
  { year: 2021, month: 1, title: 'KOSPI 3,000pt 돌파', description: 'KOSPI 사상 첫 3,000pt 돌파. 유동성 장세 정점', category: 'market', impact: 'medium' },
  { year: 2022, month: 3, title: '금리 인상 사이클 시작', description: '미국 Fed 금리 인상 시작. 긴축 사이클 돌입', category: 'policy', impact: 'high', kospiChange: '-24%' },
  { year: 2022, month: 10, title: '레고랜드 사태', description: '강원도 레고랜드 ABCP 디폴트. 채권시장 경색', category: 'crisis', impact: 'medium' },
  { year: 2023, month: 1, title: 'IFRS17 시행', description: '보험업 새 회계기준 IFRS17 시행. 보험사 재무제표 대변혁', category: 'regulation', impact: 'medium' },
  { year: 2023, month: 3, title: 'SVB 사태', description: '미국 실리콘밸리은행 파산. 은행 위기 우려 확산', category: 'crisis', impact: 'medium' },
  { year: 2024, month: 1, title: '밸류업 프로그램', description: '한국거래소 기업 밸류업 프로그램 발표. 주주환원 정책 강화', category: 'policy', impact: 'medium' },
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
