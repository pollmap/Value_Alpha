import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface LearningSection {
  id: string;
  title: string;
  items: {
    id: string;
    title: string;
    path: string;
  }[];
}

const LEARNING_SECTIONS: LearningSection[] = [
  {
    id: 'layer1',
    title: 'Layer 1: 기초 회계',
    items: [
      { id: 'accounting-basics', title: '회계 기초', path: '/foundation/accounting-basics/intro' },
      { id: 'balance-sheet', title: '재무상태표', path: '/foundation/balance-sheet/intro' },
      { id: 'income-statement', title: '손익계산서', path: '/foundation/income-statement/intro' },
      { id: 'cash-flow', title: '현금흐름표', path: '/foundation/cash-flow/intro' },
      { id: 'three-statement', title: '3표 연결', path: '/foundation/three-statement-link/intro' },
    ],
  },
  {
    id: 'layer2',
    title: 'Layer 2: 재무제표 분석',
    items: [
      { id: 'profitability', title: '수익성 분석', path: '/financial-analysis/profitability/margin-analysis' },
      { id: 'growth', title: '성장성 분석', path: '/financial-analysis/growth/revenue-growth' },
      { id: 'stability', title: '안정성 분석', path: '/financial-analysis/stability/debt-ratio' },
      { id: 'efficiency', title: '효율성 분석', path: '/financial-analysis/efficiency/asset-turnover' },
      { id: 'multiples', title: '밸류에이션 멀티플', path: '/financial-analysis/valuation-multiples/overview' },
    ],
  },
  {
    id: 'layer3',
    title: 'Layer 3: 산업분석',
    items: [
      { id: 'it', title: 'IT/반도체', path: '/industry-analysis/it/intro' },
      { id: 'healthcare', title: '헬스케어', path: '/industry-analysis/healthcare/intro' },
      { id: 'financials', title: '금융', path: '/industry-analysis/financials/intro' },
      { id: 'consumer', title: '소비재', path: '/industry-analysis/consumer-discretionary/intro' },
      { id: 'industrials', title: '산업재', path: '/industry-analysis/industrials/intro' },
    ],
  },
  {
    id: 'layer4',
    title: 'Layer 4: 기업분석',
    items: [
      { id: 'business-model', title: '비즈니스 모델', path: '/company-analysis/qualitative/business-model' },
      { id: 'competitive-advantage', title: '경쟁 우위', path: '/company-analysis/qualitative/competitive-advantage' },
      { id: 'financial-modeling', title: '재무 모델링', path: '/company-analysis/quantitative/financial-modeling' },
      { id: 'dcf-practice', title: 'DCF 실전', path: '/company-analysis/valuation-practice/dcf-practice' },
      { id: 'report-writing', title: '보고서 작성', path: '/company-analysis/report-writing/equity-research' },
    ],
  },
  {
    id: 'valuation',
    title: '밸류에이션',
    items: [
      { id: 'dcf-overview', title: 'DCF 개요', path: '/valuation/dcf/overview' },
      { id: 'wacc', title: 'WACC', path: '/valuation/dcf/wacc' },
      { id: 'terminal-value', title: '터미널 가치', path: '/valuation/dcf/terminal-value' },
      { id: 'relative-valuation', title: '상대가치 평가', path: '/valuation/relative/overview' },
    ],
  },
  {
    id: 'trading',
    title: '매매 전략',
    items: [
      { id: 'value-investing', title: '가치투자', path: '/trading-strategies/value-investing' },
      { id: 'momentum', title: '모멘텀', path: '/trading-strategies/momentum' },
      { id: 'quant', title: '퀀트', path: '/trading-strategies/quant' },
      { id: 'risk-management', title: '리스크 관리', path: '/risk-management/overview' },
    ],
  },
];

const STORAGE_KEY = 'value-alpha-progress';

const ProgressTrackerInner: React.FC = () => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // localStorage에서 진도 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompletedItems(new Set(JSON.parse(saved)));
      }
    } catch (e) {
      console.error('Failed to load progress:', e);
    }
  }, []);

  // 진도 저장
  const saveProgress = (newCompleted: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...newCompleted]));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
    saveProgress(newCompleted);
  };

  const resetProgress = () => {
    if (window.confirm('모든 진도를 초기화하시겠습니까?')) {
      setCompletedItems(new Set());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // 전체 진도 계산
  const totalItems = LEARNING_SECTIONS.reduce((sum, section) => sum + section.items.length, 0);
  const completedCount = completedItems.size;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  // 섹션별 진도 계산
  const getSectionProgress = (section: LearningSection) => {
    const completed = section.items.filter(item => completedItems.has(item.id)).length;
    return {
      completed,
      total: section.items.length,
      percent: Math.round((completed / section.items.length) * 100),
    };
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0 }}>학습 진도 추적</h3>
        <button
          onClick={resetProgress}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid var(--ifm-color-emphasis-300)',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          초기화
        </button>
      </div>

      {/* 전체 진도 */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600 }}>전체 진도</span>
          <span style={{ fontFamily: 'monospace' }}>{completedCount} / {totalItems} ({progressPercent}%)</span>
        </div>
        <div style={{
          height: '20px',
          backgroundColor: 'var(--ifm-color-emphasis-200)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: progressPercent === 100 ? '#52c41a' : 'var(--ifm-color-primary)',
            transition: 'width 0.3s ease',
            borderRadius: '10px',
          }} />
        </div>
        {progressPercent === 100 && (
          <p style={{ color: '#52c41a', marginTop: '0.5rem', fontWeight: 600 }}>
            축하합니다! 모든 학습을 완료했습니다!
          </p>
        )}
      </div>

      {/* 섹션별 진도 */}
      {LEARNING_SECTIONS.map(section => {
        const progress = getSectionProgress(section);
        return (
          <div key={section.id} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>{section.title}</span>
              <span style={{
                fontSize: '0.8rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: progress.percent === 100 ? '#52c41a' : 'var(--ifm-color-emphasis-200)',
                color: progress.percent === 100 ? 'white' : 'inherit',
              }}>
                {progress.completed}/{progress.total}
              </span>
            </div>

            {/* 진도 바 */}
            <div style={{
              height: '8px',
              backgroundColor: 'var(--ifm-color-emphasis-200)',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '0.75rem',
            }}>
              <div style={{
                height: '100%',
                width: `${progress.percent}%`,
                backgroundColor: progress.percent === 100 ? '#52c41a' : 'var(--ifm-color-primary)',
                transition: 'width 0.3s ease',
              }} />
            </div>

            {/* 체크리스트 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {section.items.map(item => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: completedItems.has(item.id) ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-emphasis-100)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={completedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    style={{ accentColor: 'var(--ifm-color-primary)' }}
                  />
                  <span style={{
                    textDecoration: completedItems.has(item.id) ? 'line-through' : 'none',
                    color: completedItems.has(item.id) ? 'var(--ifm-color-emphasis-600)' : 'inherit',
                  }}>
                    {item.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '1rem' }}>
        * 진도는 브라우저에 저장됩니다. 다른 기기에서는 동기화되지 않습니다.
      </p>
    </div>
  );
};

export default function ProgressTracker() {
  return (
    <BrowserOnly fallback={<div>진도 추적기 로딩 중...</div>}>
      {() => <ProgressTrackerInner />}
    </BrowserOnly>
  );
}
