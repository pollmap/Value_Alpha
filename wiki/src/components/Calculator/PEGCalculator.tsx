import React, { useState, useMemo } from 'react';

interface StockEntry {
  id: number;
  name: string;
  price: number;
  eps: number;
  growthRate: number;
}

type SortKey = 'per' | 'peg' | 'growthRate';
type SortDir = 'asc' | 'desc';

const DEFAULT_STOCKS: StockEntry[] = [
  { id: 1, name: '삼성전자', price: 71000, eps: 4500, growthRate: 35 },
  { id: 2, name: 'SK하이닉스', price: 178000, eps: 25000, growthRate: 200 },
  { id: 3, name: '현대차', price: 230000, eps: 42000, growthRate: 10 },
  { id: 4, name: 'NAVER', price: 210000, eps: 8000, growthRate: 45 },
  { id: 5, name: '셀트리온', price: 185000, eps: 6500, growthRate: 70 },
];

function getPER(price: number, eps: number): number | null {
  if (eps <= 0) return null;
  return price / eps;
}

function getPEG(per: number | null, growthRate: number): number | null {
  if (per === null || growthRate <= 0) return null;
  return per / growthRate;
}

function getPEGVerdict(peg: number | null): { label: string; color: string; bgColor: string } {
  if (peg === null) return { label: 'N/A', color: '#6b7280', bgColor: '#f3f4f6' };
  if (peg < 0.5) return { label: '매우 저평가', color: '#064e3b', bgColor: '#d1fae5' };
  if (peg < 1.0) return { label: '저평가', color: '#065f46', bgColor: '#dcfce7' };
  if (peg < 1.5) return { label: '적정', color: '#1e40af', bgColor: '#dbeafe' };
  if (peg < 2.0) return { label: '다소 고평가', color: '#9a3412', bgColor: '#ffedd5' };
  return { label: '고평가', color: '#991b1b', bgColor: '#fee2e2' };
}

function getBarColor(peg: number | null): string {
  if (peg === null) return '#d1d5db';
  if (peg < 0.5) return '#047857';
  if (peg < 1.0) return '#10b981';
  if (peg < 1.5) return '#3b82f6';
  if (peg < 2.0) return '#f97316';
  return '#ef4444';
}

export const PEGCalculator: React.FC = () => {
  const [stocks, setStocks] = useState<StockEntry[]>(DEFAULT_STOCKS);
  const [nextId, setNextId] = useState(6);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const computed = useMemo(() => {
    return stocks.map((s) => {
      const per = getPER(s.price, s.eps);
      const peg = getPEG(per, s.growthRate);
      const verdict = getPEGVerdict(peg);
      const isGARP = peg !== null && peg < 1.0 && s.growthRate > 10;
      return { ...s, per, peg, verdict, isGARP };
    });
  }, [stocks]);

  const sorted = useMemo(() => {
    if (!sortKey) return computed;
    const arr = [...computed];
    arr.sort((a, b) => {
      let va: number | null;
      let vb: number | null;
      if (sortKey === 'per') { va = a.per; vb = b.per; }
      else if (sortKey === 'peg') { va = a.peg; vb = b.peg; }
      else { va = a.growthRate; vb = b.growthRate; }
      if (va === null && vb === null) return 0;
      if (va === null) return 1;
      if (vb === null) return -1;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [computed, sortKey, sortDir]);

  const garpRanked = useMemo(() => {
    return [...computed]
      .filter((s) => s.peg !== null)
      .sort((a, b) => (a.peg ?? Infinity) - (b.peg ?? Infinity));
  }, [computed]);

  const maxPEG = useMemo(() => {
    const pegs = computed.map((s) => s.peg).filter((p): p is number => p !== null);
    if (pegs.length === 0) return 3;
    return Math.max(...pegs, 2.5);
  }, [computed]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ' \u2195';
    return sortDir === 'asc' ? ' \u2191' : ' \u2193';
  };

  const updateStock = (id: number, field: keyof Omit<StockEntry, 'id'>, value: string | number) => {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const addStock = () => {
    setStocks((prev) => [...prev, { id: nextId, name: '신규 종목', price: 0, eps: 0, growthRate: 0 }]);
    setNextId((n) => n + 1);
  };

  const removeStock = (id: number) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  };

  const formatNumber = (num: number) => Math.round(num).toLocaleString();

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.35rem 0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.85rem',
    boxSizing: 'border-box',
  };

  const thStyle: React.CSSProperties = {
    padding: '0.6rem 0.5rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    backgroundColor: '#f9fafb',
  };

  const thSortableStyle: React.CSSProperties = {
    ...thStyle,
    cursor: 'pointer',
    userSelect: 'none',
  };

  const tdStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderBottom: '1px solid #f3f4f6',
    fontSize: '0.85rem',
    verticalAlign: 'middle',
  };

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📊</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>PEG Ratio 스크리너</h2>
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        PEG(Price/Earnings to Growth) 비율로 성장주의 적정 가치를 비교하세요.
        피터 린치가 즐겨 사용한 GARP(Growth at Reasonable Price) 전략의 핵심 지표입니다.
      </p>

      {/* Editable Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={thStyle}>종목명</th>
              <th style={thStyle}>주가 (원)</th>
              <th style={thStyle}>EPS (원)</th>
              <th style={thSortableStyle} onClick={() => handleSort('growthRate')}>
                성장률 (%){sortIndicator('growthRate')}
              </th>
              <th style={thSortableStyle} onClick={() => handleSort('per')}>
                PER{sortIndicator('per')}
              </th>
              <th style={thSortableStyle} onClick={() => handleSort('peg')}>
                PEG{sortIndicator('peg')}
              </th>
              <th style={thStyle}>판정</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const verdict = s.verdict;
              return (
                <tr key={s.id} style={{ transition: 'background-color 0.15s' }}>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateStock(s.id, 'name', e.target.value)}
                      style={{ ...inputStyle, minWidth: '80px' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={s.price}
                      onChange={(e) => updateStock(s.id, 'price', parseFloat(e.target.value) || 0)}
                      style={{ ...inputStyle, minWidth: '90px' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={s.eps}
                      onChange={(e) => updateStock(s.id, 'eps', parseFloat(e.target.value) || 0)}
                      style={{ ...inputStyle, minWidth: '80px' }}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="number"
                      value={s.growthRate}
                      onChange={(e) => updateStock(s.id, 'growthRate', parseFloat(e.target.value) || 0)}
                      style={{ ...inputStyle, minWidth: '70px' }}
                    />
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 500, textAlign: 'center' }}>
                    {s.per !== null ? s.per.toFixed(1) + 'x' : 'N/A'}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, textAlign: 'center', color: getBarColor(s.peg) }}>
                    {s.peg !== null ? s.peg.toFixed(2) : 'N/A'}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: verdict.color,
                      backgroundColor: verdict.bgColor,
                    }}>
                      {verdict.label}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => removeStock(s.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #fca5a5',
                        borderRadius: '0.375rem',
                        backgroundColor: '#fff',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addStock}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #3b82f6',
          borderRadius: '0.5rem',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem',
          marginBottom: '2rem',
        }}
      >
        + 종목 추가
      </button>

      {/* PEG Bar Chart */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>PEG 비교 차트</h3>
        <div style={{ position: 'relative', paddingLeft: '90px' }}>
          {computed.map((s) => {
            const barWidth = s.peg !== null ? Math.min((s.peg / maxPEG) * 100, 100) : 0;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', height: '28px' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  width: '85px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#374151',
                  textAlign: 'right',
                  paddingRight: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {s.name}
                </div>
                <div style={{ flex: 1, position: 'relative', height: '22px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'visible' }}>
                  <div style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    backgroundColor: getBarColor(s.peg),
                    borderRadius: '4px',
                    transition: 'width 0.3s ease',
                    minWidth: s.peg !== null ? '2px' : '0',
                  }} />
                  {s.peg !== null && (
                    <span style={{
                      position: 'absolute',
                      left: `calc(${barWidth}% + 6px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#374151',
                      whiteSpace: 'nowrap',
                    }}>
                      {s.peg.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Reference lines */}
          {[1.0, 2.0].map((ref) => {
            const leftPct = (ref / maxPEG) * 100;
            if (leftPct > 100) return null;
            return (
              <div key={ref} style={{
                position: 'absolute',
                left: `calc(90px + ${leftPct}% * (100% - 90px) / 100%)`,
                top: 0,
                bottom: 0,
                width: 0,
                borderLeft: '2px dashed',
                borderColor: ref === 1.0 ? '#10b981' : '#ef4444',
                opacity: 0.6,
                pointerEvents: 'none',
              }}>
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: ref === 1.0 ? '#059669' : '#dc2626',
                  whiteSpace: 'nowrap',
                }}>
                  PEG={ref}
                </span>
              </div>
            );
          })}
        </div>
        {/* Chart legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.2rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: '#047857', marginRight: 4, verticalAlign: 'middle' }} />매우 저평가 (&lt;0.5)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: '#10b981', marginRight: 4, verticalAlign: 'middle' }} />저평가 (0.5~1.0)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: '#3b82f6', marginRight: 4, verticalAlign: 'middle' }} />적정 (1.0~1.5)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: '#f97316', marginRight: 4, verticalAlign: 'middle' }} />다소 고평가 (1.5~2.0)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: '#ef4444', marginRight: 4, verticalAlign: 'middle' }} />고평가 (&gt;2.0)</span>
        </div>
      </div>

      {/* GARP Scorecard */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>GARP 스코어카드</h3>
        <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
          PEG가 낮은 순서대로 정렬됩니다. PEG &lt; 1.0이면서 성장률 &gt; 10%인 종목에 GARP 추천 배지가 표시됩니다.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {garpRanked.map((s, idx) => (
            <div key={s.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: s.isGARP ? '#86efac' : '#e5e7eb',
              backgroundColor: s.isGARP ? '#f0fdf4' : '#fff',
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#fff',
                backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : '#d1d5db',
                flexShrink: 0,
              }}>
                <span style={{ color: idx < 3 ? '#fff' : '#6b7280' }}>{idx + 1}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</span>
                  {s.isGARP && (
                    <span style={{
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      border: '1px solid #86efac',
                    }}>
                      GARP 추천
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.15rem' }}>
                  주가 {formatNumber(s.price)}원 | EPS {formatNumber(s.eps)}원 | 성장률 {s.growthRate}%
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>PEG</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: getBarColor(s.peg) }}>
                  {s.peg !== null ? s.peg.toFixed(2) : 'N/A'}
                </div>
              </div>
              <div style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: s.verdict.color,
                backgroundColor: s.verdict.bgColor,
                flexShrink: 0,
              }}>
                {s.verdict.label}
              </div>
            </div>
          ))}
          {garpRanked.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
              유효한 PEG를 계산할 수 있는 종목이 없습니다. EPS와 성장률이 양수인지 확인하세요.
            </p>
          )}
        </div>
      </div>

      {/* PEG Guide Box */}
      <div style={{
        padding: '1.25rem',
        borderRadius: '0.75rem',
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        marginBottom: '1.5rem',
      }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0c4a6e', marginBottom: '0.75rem', marginTop: 0 }}>
          PEG 해석 가이드
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li style={{ fontSize: '0.85rem', color: '#1e3a5f' }}>
            <strong>PEG &lt; 1:</strong> 성장 대비 저평가 (피터 린치 매수 기준)
          </li>
          <li style={{ fontSize: '0.85rem', color: '#1e3a5f' }}>
            <strong>성장률 기준:</strong> 향후 3~5년 평균 EPS 성장률을 사용해야 합니다
          </li>
          <li style={{ fontSize: '0.85rem', color: '#1e3a5f' }}>
            <strong>주의:</strong> 적자 기업이나 성장률이 음수인 경우 PEG가 의미 없습니다
          </li>
        </ul>
      </div>

      {/* Peter Lynch Quote */}
      <div style={{
        padding: '1rem',
        borderLeft: '4px solid #8b5cf6',
        backgroundColor: '#f5f3ff',
        borderRadius: '0 0.5rem 0.5rem 0',
      }}>
        <p style={{ fontStyle: 'italic', color: '#4c1d95', margin: 0 }}>
          "PEG가 1 미만인 주식을 찾아라. 그것이 성장주를 싸게 사는 비결이다.
          어떤 기업의 PER이 성장률과 같다면 적정가치이고, PER이 성장률의 절반이라면 매우 매력적이다."
        </p>
        <p style={{ fontWeight: 600, color: '#8b5cf6', marginTop: '0.5rem', marginBottom: 0, fontSize: '0.875rem' }}>
          — 피터 린치 (Peter Lynch)
        </p>
      </div>
    </div>
  );
};

export default PEGCalculator;
