import React, { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'va-reading-progress';

interface ProgressData {
  readPages: string[];
  lastUpdated: string;
}

function getProgress(): ProgressData {
  if (typeof window === 'undefined') return { readPages: [], lastUpdated: '' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { readPages: [], lastUpdated: '' };
}

function saveProgress(data: ProgressData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Categories with their doc paths for tracking
const categories = [
  {
    name: 'Layer 1: 기초 회계',
    color: '#2563eb',
    paths: [
      '/foundation/overview', '/foundation/balance-sheet/intro',
      '/foundation/balance-sheet/assets/current', '/foundation/balance-sheet/assets/non-current',
      '/foundation/balance-sheet/liabilities/current', '/foundation/balance-sheet/liabilities/non-current',
      '/foundation/balance-sheet/liabilities/provisions', '/foundation/balance-sheet/equity/overview',
      '/foundation/income-statement/intro', '/foundation/income-statement/revenue',
      '/foundation/income-statement/operating-income', '/foundation/income-statement/non-operating',
      '/foundation/cash-flow/intro', '/foundation/cash-flow/operating',
      '/foundation/cash-flow/investing', '/foundation/cash-flow/financing',
      '/foundation/notes-analysis/overview', '/foundation/notes-analysis/accounting-policies',
      '/foundation/notes-analysis/related-party', '/foundation/notes-analysis/segment',
      '/foundation/notes-analysis/fair-value', '/foundation/notes-analysis/contingencies',
      '/foundation/consolidated',
    ],
  },
  {
    name: 'Layer 2: 재무분석',
    color: '#059669',
    paths: [
      '/financial-analysis/overview', '/financial-analysis/profitability',
      '/financial-analysis/growth', '/financial-analysis/stability',
      '/financial-analysis/efficiency', '/financial-analysis/dupont',
      '/financial-analysis/peer-comparison', '/financial-analysis/trend-analysis',
      '/financial-analysis/quality-of-earnings', '/financial-analysis/red-flags',
      '/financial-analysis/checklist',
    ],
  },
  {
    name: 'Layer 3: 산업분석',
    color: '#d97706',
    paths: [
      '/industry-analysis/overview', '/industry-analysis/porter-five-forces',
      '/industry-analysis/market-structure', '/industry-analysis/value-chain',
      '/industry-analysis/lifecycle', '/industry-analysis/regulatory',
      '/industry-analysis/competitive-dynamics', '/industry-analysis/key-metrics',
      '/industry-analysis/global-trends', '/industry-analysis/disruption',
      '/industry-analysis/esg', '/industry-analysis/checklist',
    ],
  },
  {
    name: 'Layer 4: 기업분석',
    color: '#dc2626',
    paths: [
      '/company-analysis/overview', '/company-analysis/business-model',
      '/company-analysis/competitive-advantage', '/company-analysis/management',
      '/company-analysis/growth-strategy', '/company-analysis/risk-assessment',
      '/company-analysis/esg', '/company-analysis/ownership',
      '/company-analysis/valuation-bridge', '/company-analysis/checklist',
    ],
  },
  {
    name: '밸류에이션',
    color: '#7c3aed',
    paths: [
      '/valuation/dcf/overview', '/valuation/dcf/fcf',
      '/valuation/dcf/wacc', '/valuation/dcf/terminal-value',
      '/valuation/dcf/sensitivity', '/valuation/relative/overview',
      '/valuation/relative/per', '/valuation/relative/pbr',
      '/valuation/relative/ev-ebitda', '/valuation/rim/overview',
      '/valuation/lbo/overview', '/valuation/nav',
    ],
  },
];

/**
 * Mark as Read button — place at the bottom of any doc page.
 */
export function MarkAsRead(): JSX.Element {
  const [isRead, setIsRead] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.replace(/\/Value_Alpha/, '').replace(/\/$/, '') || '/';
    setCurrentPath(path);
    const progress = getProgress();
    setIsRead(progress.readPages.includes(path));
  }, []);

  const toggleRead = useCallback(() => {
    const progress = getProgress();
    if (isRead) {
      progress.readPages = progress.readPages.filter((p) => p !== currentPath);
    } else {
      if (!progress.readPages.includes(currentPath)) {
        progress.readPages.push(currentPath);
      }
    }
    progress.lastUpdated = new Date().toISOString();
    saveProgress(progress);
    setIsRead(!isRead);
  }, [isRead, currentPath]);

  return (
    <div style={{ margin: '32px 0 16px', textAlign: 'center' }}>
      <button
        onClick={toggleRead}
        style={{
          padding: '10px 24px',
          borderRadius: 8,
          border: isRead ? '2px solid var(--ifm-color-success)' : '2px solid var(--ifm-color-emphasis-300)',
          background: isRead ? 'var(--ifm-color-success-contrast-background)' : 'transparent',
          color: isRead ? 'var(--ifm-color-success-dark)' : 'var(--ifm-color-emphasis-600)',
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {isRead ? '✓ 읽음 완료' : '읽음으로 표시'}
      </button>
    </div>
  );
}

/**
 * Learning progress dashboard — shows completion per category.
 */
export default function ReadingProgress(): JSX.Element {
  const [progress, setProgress] = useState<ProgressData>({ readPages: [], lastUpdated: '' });

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const totalDocs = categories.reduce((sum, c) => sum + c.paths.length, 0);
  const totalRead = categories.reduce((sum, c) => {
    return sum + c.paths.filter((p) => progress.readPages.includes(p)).length;
  }, 0);
  const overallPct = totalDocs > 0 ? Math.round((totalRead / totalDocs) * 100) : 0;

  const resetProgress = () => {
    if (typeof window !== 'undefined' && window.confirm('학습 진도를 초기화하시겠습니까?')) {
      saveProgress({ readPages: [], lastUpdated: '' });
      setProgress({ readPages: [], lastUpdated: '' });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Overall Progress */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, #7c3aed 100%)',
          borderRadius: 16,
          padding: '32px',
          color: '#fff',
          textAlign: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 48, fontWeight: 800 }}>{overallPct}%</div>
        <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>
          전체 학습 진도 ({totalRead} / {totalDocs} 문서)
        </div>
        <div
          style={{
            height: 8,
            background: 'rgba(255,255,255,0.3)',
            borderRadius: 4,
            overflow: 'hidden',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${overallPct}%`,
              background: '#fff',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Per-Category Progress */}
      <div style={{ display: 'grid', gap: 12 }}>
        {categories.map((cat) => {
          const catRead = cat.paths.filter((p) => progress.readPages.includes(p)).length;
          const catPct = cat.paths.length > 0 ? Math.round((catRead / cat.paths.length) * 100) : 0;
          return (
            <div
              key={cat.name}
              style={{
                padding: '16px 20px',
                borderRadius: 10,
                border: '1px solid var(--ifm-color-emphasis-200)',
                background: 'var(--ifm-card-background-color, #fff)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</span>
                <span style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)' }}>
                  {catRead}/{cat.paths.length} ({catPct}%)
                </span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'var(--ifm-color-emphasis-200)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${catPct}%`,
                    background: cat.color,
                    borderRadius: 3,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset button */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button
          onClick={resetProgress}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid var(--ifm-color-emphasis-300)',
            background: 'transparent',
            color: 'var(--ifm-color-emphasis-600)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          진도 초기화
        </button>
        {progress.lastUpdated && (
          <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)', marginTop: 8 }}>
            마지막 업데이트: {new Date(progress.lastUpdated).toLocaleDateString('ko-KR')}
          </div>
        )}
      </div>
    </div>
  );
}
