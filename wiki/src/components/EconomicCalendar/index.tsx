import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface EconomicEvent {
  date: string;
  time: string;
  country: '🇰🇷' | '🇺🇸' | '🇪🇺' | '🇯🇵' | '🇨🇳';
  event: string;
  importance: 'high' | 'medium' | 'low';
  previous?: string;
  forecast?: string;
  category: 'monetary' | 'employment' | 'inflation' | 'gdp' | 'trade' | 'other';
}

const ECONOMIC_EVENTS: EconomicEvent[] = [
  // 2024년 주요 경제 이벤트 (예시)
  { date: '2024-01-31', time: '22:00', country: '🇺🇸', event: 'FOMC 금리 결정', importance: 'high', previous: '5.50%', forecast: '5.50%', category: 'monetary' },
  { date: '2024-02-01', time: '09:00', country: '🇰🇷', event: '한국은행 금통위', importance: 'high', previous: '3.50%', forecast: '3.50%', category: 'monetary' },
  { date: '2024-02-02', time: '22:30', country: '🇺🇸', event: '비농업 고용지표', importance: 'high', previous: '216K', forecast: '180K', category: 'employment' },
  { date: '2024-02-13', time: '22:30', country: '🇺🇸', event: 'CPI (소비자물가)', importance: 'high', previous: '3.4%', forecast: '3.0%', category: 'inflation' },
  { date: '2024-02-22', time: '09:00', country: '🇰🇷', event: 'GDP 속보치', importance: 'high', previous: '1.4%', forecast: '2.0%', category: 'gdp' },
  { date: '2024-02-29', time: '22:30', country: '🇺🇸', event: 'PCE 물가지수', importance: 'high', previous: '2.9%', forecast: '2.8%', category: 'inflation' },
  { date: '2024-03-01', time: '09:00', country: '🇰🇷', event: '수출입 동향', importance: 'medium', previous: '-5.1%', forecast: '+2.0%', category: 'trade' },
  { date: '2024-03-08', time: '22:30', country: '🇺🇸', event: '비농업 고용지표', importance: 'high', previous: '180K', forecast: '200K', category: 'employment' },
  { date: '2024-03-12', time: '22:30', country: '🇺🇸', event: 'CPI (소비자물가)', importance: 'high', previous: '3.0%', forecast: '2.9%', category: 'inflation' },
  { date: '2024-03-20', time: '03:00', country: '🇺🇸', event: 'FOMC 금리 결정', importance: 'high', previous: '5.50%', forecast: '5.50%', category: 'monetary' },
  { date: '2024-04-11', time: '09:00', country: '🇰🇷', event: '한국은행 금통위', importance: 'high', previous: '3.50%', forecast: '3.50%', category: 'monetary' },
  { date: '2024-04-26', time: '09:00', country: '🇰🇷', event: 'GDP 속보치', importance: 'high', previous: '2.0%', forecast: '2.2%', category: 'gdp' },
  { date: '2024-05-01', time: '03:00', country: '🇺🇸', event: 'FOMC 금리 결정', importance: 'high', previous: '5.50%', forecast: '5.25%', category: 'monetary' },
  { date: '2024-05-23', time: '09:00', country: '🇰🇷', event: '한국은행 금통위', importance: 'high', previous: '3.50%', forecast: '3.50%', category: 'monetary' },
  { date: '2024-06-12', time: '03:00', country: '🇺🇸', event: 'FOMC 금리 결정 + 점도표', importance: 'high', previous: '5.25%', forecast: '5.25%', category: 'monetary' },
];

const CATEGORY_LABELS: Record<string, string> = {
  monetary: '통화정책',
  employment: '고용',
  inflation: '물가',
  gdp: 'GDP',
  trade: '무역',
  other: '기타',
};

const COUNTRY_NAMES: Record<string, string> = {
  '🇰🇷': '한국',
  '🇺🇸': '미국',
  '🇪🇺': 'EU',
  '🇯🇵': '일본',
  '🇨🇳': '중국',
};

const EconomicCalendarInner: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImportance, setSelectedImportance] = useState<string>('all');

  const filteredEvents = ECONOMIC_EVENTS.filter((event) => {
    if (selectedCountry !== 'all' && event.country !== selectedCountry) return false;
    if (selectedCategory !== 'all' && event.category !== selectedCategory) return false;
    if (selectedImportance !== 'all' && event.importance !== selectedImportance) return false;
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getImportanceStyle = (importance: string) => {
    switch (importance) {
      case 'high':
        return { backgroundColor: '#ff4d4f', color: 'white' };
      case 'medium':
        return { backgroundColor: '#faad14', color: 'white' };
      case 'low':
        return { backgroundColor: '#52c41a', color: 'white' };
      default:
        return {};
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}/${day} (${weekday})`;
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <h3 style={{ marginTop: 0 }}>경제 캘린더</h3>

      {/* 필터 */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
        >
          <option value="all">모든 국가</option>
          <option value="🇰🇷">🇰🇷 한국</option>
          <option value="🇺🇸">🇺🇸 미국</option>
          <option value="🇪🇺">🇪🇺 EU</option>
          <option value="🇯🇵">🇯🇵 일본</option>
          <option value="🇨🇳">🇨🇳 중국</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
        >
          <option value="all">모든 카테고리</option>
          <option value="monetary">통화정책</option>
          <option value="employment">고용</option>
          <option value="inflation">물가</option>
          <option value="gdp">GDP</option>
          <option value="trade">무역</option>
        </select>

        <select
          value={selectedImportance}
          onChange={(e) => setSelectedImportance(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)' }}
        >
          <option value="all">모든 중요도</option>
          <option value="high">높음</option>
          <option value="medium">중간</option>
          <option value="low">낮음</option>
        </select>
      </div>

      {/* 이벤트 목록 */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>날짜</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>시간</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>국가</th>
              <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>이벤트</th>
              <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>중요도</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>이전</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>예상</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                <td style={{ padding: '0.75rem' }}>{formatDate(event.date)}</td>
                <td style={{ padding: '0.75rem' }}>{event.time}</td>
                <td style={{ padding: '0.75rem' }}>{event.country}</td>
                <td style={{ padding: '0.75rem', fontWeight: event.importance === 'high' ? 600 : 400 }}>{event.event}</td>
                <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                  <span style={{
                    ...getImportanceStyle(event.importance),
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}>
                    {event.importance === 'high' ? '높음' : event.importance === 'medium' ? '중간' : '낮음'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontFamily: 'monospace' }}>{event.previous || '-'}</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontFamily: 'monospace' }}>{event.forecast || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '1rem' }}>
        * 시간은 한국 시간(KST) 기준입니다. 실제 발표 시간은 변경될 수 있습니다.
      </p>
    </div>
  );
};

export default function EconomicCalendar() {
  return (
    <BrowserOnly fallback={<div>캘린더 로딩 중...</div>}>
      {() => <EconomicCalendarInner />}
    </BrowserOnly>
  );
}
