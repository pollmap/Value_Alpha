import React, { useState, useMemo } from 'react';

interface FootballFieldInputs {
  currentPrice: number;
  sharesOutstanding: number;
  dcfLow: number;
  dcfMid: number;
  dcfHigh: number;
  forwardEPS: number;
  perLow: number;
  perMid: number;
  perHigh: number;
  bps: number;
  pbrLow: number;
  pbrMid: number;
  pbrHigh: number;
  evEbitdaLow: number;
  evEbitdaMid: number;
  evEbitdaHigh: number;
  week52Low: number;
  week52High: number;
}

interface ValuationRange {
  label: string;
  low: number;
  mid: number;
  high: number;
  color: string;
  bgColor: string;
}

interface PresetCompany {
  name: string;
  data: FootballFieldInputs;
}

const PRESETS: PresetCompany[] = [
  {
    name: '삼성전자',
    data: {
      currentPrice: 71000,
      sharesOutstanding: 5969.8,
      dcfLow: 58000, dcfMid: 72000, dcfHigh: 88000,
      forwardEPS: 4500, perLow: 8, perMid: 11, perHigh: 14,
      bps: 42000, pbrLow: 1.2, pbrMid: 1.6, pbrHigh: 2.0,
      evEbitdaLow: 55000, evEbitdaMid: 68000, evEbitdaHigh: 82000,
      week52Low: 52800, week52High: 88800,
    },
  },
  {
    name: 'SK하이닉스',
    data: {
      currentPrice: 178000,
      sharesOutstanding: 728,
      dcfLow: 140000, dcfMid: 195000, dcfHigh: 260000,
      forwardEPS: 25000, perLow: 7, perMid: 10, perHigh: 15,
      bps: 115000, pbrLow: 1.2, pbrMid: 1.5, pbrHigh: 2.0,
      evEbitdaLow: 150000, evEbitdaMid: 200000, evEbitdaHigh: 270000,
      week52Low: 100000, week52High: 235000,
    },
  },
  {
    name: '현대차',
    data: {
      currentPrice: 230000,
      sharesOutstanding: 210.7,
      dcfLow: 200000, dcfMid: 260000, dcfHigh: 320000,
      forwardEPS: 42000, perLow: 5, perMid: 6, perHigh: 8,
      bps: 310000, pbrLow: 0.5, pbrMid: 0.7, pbrHigh: 0.9,
      evEbitdaLow: 190000, evEbitdaMid: 250000, evEbitdaHigh: 310000,
      week52Low: 164500, week52High: 298000,
    },
  },
];

const DEFAULT_INPUTS: FootballFieldInputs = { ...PRESETS[0].data };

const formatKRW = (num: number): string => {
  return Math.round(num).toLocaleString();
};

const formatPercent = (num: number): string => {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const FootballFieldCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<FootballFieldInputs>(DEFAULT_INPUTS);

  const updateField = (field: keyof FootballFieldInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const applyPreset = (preset: PresetCompany) => {
    setInputs({ ...preset.data });
  };

  const valuationRanges = useMemo<ValuationRange[]>(() => {
    const { forwardEPS, perLow, perMid, perHigh, bps, pbrLow, pbrMid, pbrHigh } = inputs;

    return [
      {
        label: 'DCF',
        low: inputs.dcfLow,
        mid: inputs.dcfMid,
        high: inputs.dcfHigh,
        color: '#2563eb',
        bgColor: '#dbeafe',
      },
      {
        label: 'PER',
        low: forwardEPS * perLow,
        mid: forwardEPS * perMid,
        high: forwardEPS * perHigh,
        color: '#16a34a',
        bgColor: '#dcfce7',
      },
      {
        label: 'PBR',
        low: bps * pbrLow,
        mid: bps * pbrMid,
        high: bps * pbrHigh,
        color: '#9333ea',
        bgColor: '#f3e8ff',
      },
      {
        label: 'EV/EBITDA',
        low: inputs.evEbitdaLow,
        mid: inputs.evEbitdaMid,
        high: inputs.evEbitdaHigh,
        color: '#d97706',
        bgColor: '#fef3c7',
      },
      {
        label: '52주 범위',
        low: inputs.week52Low,
        mid: (inputs.week52Low + inputs.week52High) / 2,
        high: inputs.week52High,
        color: '#6b7280',
        bgColor: '#f3f4f6',
      },
    ];
  }, [inputs]);

  const { globalMin, globalMax } = useMemo(() => {
    const allValues = valuationRanges.flatMap(r => [r.low, r.high]);
    allValues.push(inputs.currentPrice);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.08;
    return { globalMin: Math.max(0, min - padding), globalMax: max + padding };
  }, [valuationRanges, inputs.currentPrice]);

  const consensus = useMemo(() => {
    const mids = valuationRanges.map(r => r.mid);
    const avgMid = mids.reduce((a, b) => a + b, 0) / mids.length;
    const overallLow = Math.min(...valuationRanges.map(r => r.low));
    const overallHigh = Math.max(...valuationRanges.map(r => r.high));
    const upside = ((avgMid - inputs.currentPrice) / inputs.currentPrice) * 100;
    return { avgMid, overallLow, overallHigh, upside };
  }, [valuationRanges, inputs.currentPrice]);

  const toPercent = (value: number): number => {
    const range = globalMax - globalMin;
    if (range === 0) return 0;
    return ((value - globalMin) / range) * 100;
  };

  const currentPricePercent = toPercent(inputs.currentPrice);

  // Axis tick generation
  const axisTicks = useMemo(() => {
    const range = globalMax - globalMin;
    const rawStep = range / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalized = rawStep / magnitude;
    let step: number;
    if (normalized <= 1.5) step = magnitude;
    else if (normalized <= 3.5) step = 2.5 * magnitude;
    else if (normalized <= 7.5) step = 5 * magnitude;
    else step = 10 * magnitude;

    const ticks: number[] = [];
    const start = Math.ceil(globalMin / step) * step;
    for (let v = start; v <= globalMax; v += step) {
      ticks.push(v);
    }
    return ticks;
  }, [globalMin, globalMax]);

  const inputFieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 500,
    marginBottom: '0.2rem',
    color: '#374151',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
    paddingBottom: '0.4rem',
    borderBottom: '2px solid #e5e7eb',
    color: '#111827',
  };

  const renderInput = (label: string, field: keyof FootballFieldInputs, unit?: string) => (
    <div style={{ flex: '1 1 auto', minWidth: '120px' }}>
      <label style={labelStyle}>{label}{unit ? ` (${unit})` : ''}</label>
      <input
        type="number"
        value={inputs[field]}
        onChange={(e) => updateField(field, e.target.value)}
        style={inputFieldStyle}
      />
    </div>
  );

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🏈</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
          복합 밸류에이션 (Football Field) 계산기
        </h2>
      </div>

      {/* Preset buttons */}
      <div style={{ marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', marginRight: '0.5rem' }}>
          프리셋:
        </span>
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            style={{
              padding: '0.35rem 0.9rem',
              marginRight: '0.5rem',
              marginBottom: '0.25rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: '#374151',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb';
            }}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Input sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {/* 기본 정보 */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={sectionTitleStyle}>기본 정보</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('현재 주가', 'currentPrice', '원')}
            {renderInput('발행주식수', 'sharesOutstanding', '백만주')}
          </div>
        </div>

        {/* DCF */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ ...sectionTitleStyle, color: '#2563eb' }}>DCF 밸류에이션</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('DCF 하단', 'dcfLow', '원/주')}
            {renderInput('DCF 중간', 'dcfMid', '원/주')}
            {renderInput('DCF 상단', 'dcfHigh', '원/주')}
          </div>
        </div>

        {/* PER */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ ...sectionTitleStyle, color: '#16a34a' }}>PER 밸류에이션</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('Forward EPS', 'forwardEPS', '원')}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {renderInput('PER 하단', 'perLow', '배')}
              {renderInput('PER 중간', 'perMid', '배')}
              {renderInput('PER 상단', 'perHigh', '배')}
            </div>
          </div>
        </div>

        {/* PBR */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ ...sectionTitleStyle, color: '#9333ea' }}>PBR 밸류에이션</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('BPS', 'bps', '원')}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {renderInput('PBR 하단', 'pbrLow', '배')}
              {renderInput('PBR 중간', 'pbrMid', '배')}
              {renderInput('PBR 상단', 'pbrHigh', '배')}
            </div>
          </div>
        </div>

        {/* EV/EBITDA */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ ...sectionTitleStyle, color: '#d97706' }}>EV/EBITDA 밸류에이션</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('주당 적용가 하단', 'evEbitdaLow', '원')}
            {renderInput('주당 적용가 중간', 'evEbitdaMid', '원')}
            {renderInput('주당 적용가 상단', 'evEbitdaHigh', '원')}
          </div>
        </div>

        {/* 52주 범위 */}
        <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.75rem', border: '1px solid #e5e7eb' }}>
          <div style={{ ...sectionTitleStyle, color: '#6b7280' }}>52주 가격범위</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {renderInput('52주 최저가', 'week52Low', '원')}
            {renderInput('52주 최고가', 'week52High', '원')}
          </div>
        </div>
      </div>

      {/* Football Field Chart */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
          Football Field Chart
        </h3>

        <div style={{ position: 'relative' }}>
          {/* Chart rows */}
          {valuationRanges.map((range) => {
            const barLeft = toPercent(range.low);
            const barRight = toPercent(range.high);
            const barWidth = barRight - barLeft;
            const midPos = toPercent(range.mid);

            return (
              <div
                key={range.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  height: '44px',
                }}
              >
                {/* Label */}
                <div style={{
                  width: '90px',
                  flexShrink: 0,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: range.color,
                  textAlign: 'right',
                  paddingRight: '12px',
                }}>
                  {range.label}
                </div>

                {/* Bar area */}
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '100%',
                  backgroundColor: '#fafafa',
                  borderRadius: '4px',
                  border: '1px solid #f0f0f0',
                }}>
                  {/* The range bar */}
                  <div style={{
                    position: 'absolute',
                    left: `${barLeft}%`,
                    width: `${barWidth}%`,
                    top: '6px',
                    bottom: '6px',
                    backgroundColor: range.bgColor,
                    border: `2px solid ${range.color}`,
                    borderRadius: '4px',
                    zIndex: 1,
                  }} />

                  {/* Mid dot */}
                  <div style={{
                    position: 'absolute',
                    left: `${midPos}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '12px',
                    height: '12px',
                    backgroundColor: range.color,
                    borderRadius: '50%',
                    zIndex: 3,
                    boxShadow: '0 0 0 2px #fff',
                  }} />

                  {/* Current price vertical line */}
                  <div style={{
                    position: 'absolute',
                    left: `${currentPricePercent}%`,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: '#ef4444',
                    zIndex: 2,
                    borderLeft: '1px dashed #ef4444',
                    borderRight: '1px dashed #ef4444',
                    opacity: 0.8,
                  }} />

                  {/* Low label */}
                  <div style={{
                    position: 'absolute',
                    left: `${barLeft}%`,
                    bottom: '-2px',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: '#9ca3af',
                    whiteSpace: 'nowrap',
                    zIndex: 4,
                  }}>
                    {formatKRW(range.low)}
                  </div>

                  {/* High label */}
                  <div style={{
                    position: 'absolute',
                    left: `${barRight}%`,
                    bottom: '-2px',
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: '#9ca3af',
                    whiteSpace: 'nowrap',
                    zIndex: 4,
                  }}>
                    {formatKRW(range.high)}
                  </div>
                </div>

                {/* Right value */}
                <div style={{
                  width: '110px',
                  flexShrink: 0,
                  paddingLeft: '10px',
                  fontSize: '0.78rem',
                  color: '#6b7280',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}>
                  중간: {formatKRW(range.mid)}
                </div>
              </div>
            );
          })}

          {/* Current price label row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            height: '24px',
          }}>
            <div style={{ width: '90px', flexShrink: 0 }} />
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: `${currentPricePercent}%`,
                transform: 'translateX(-50%)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#ef4444',
                whiteSpace: 'nowrap',
                top: '0px',
              }}>
                ▲ 현재가 {formatKRW(inputs.currentPrice)}
              </div>
            </div>
            <div style={{ width: '110px', flexShrink: 0 }} />
          </div>

          {/* X-axis ticks */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginTop: '12px',
          }}>
            <div style={{ width: '90px', flexShrink: 0 }} />
            <div style={{ flex: 1, position: 'relative', height: '24px', borderTop: '1px solid #e5e7eb' }}>
              {axisTicks.map((tick) => {
                const pos = toPercent(tick);
                return (
                  <div key={tick} style={{
                    position: 'absolute',
                    left: `${pos}%`,
                    transform: 'translateX(-50%)',
                    fontSize: '0.65rem',
                    color: '#9ca3af',
                    top: '4px',
                    whiteSpace: 'nowrap',
                  }}>
                    {formatKRW(tick)}
                  </div>
                );
              })}
            </div>
            <div style={{ width: '110px', flexShrink: 0 }} />
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        marginBottom: '1.5rem',
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
          밸류에이션 요약
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                {['방법론', '하단 (원)', '중간 (원)', '상단 (원)', '현재가 대비 (중간)'].map((h) => (
                  <th key={h} style={{
                    padding: '0.65rem 0.75rem',
                    textAlign: h === '방법론' ? 'left' : 'right',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: 600,
                    color: '#374151',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {valuationRanges.map((range) => {
                const upside = ((range.mid - inputs.currentPrice) / inputs.currentPrice) * 100;
                const isPositive = upside >= 0;
                return (
                  <tr key={range.label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{
                      padding: '0.6rem 0.75rem',
                      fontWeight: 700,
                      color: range.color,
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: range.color,
                        marginRight: '0.4rem',
                        verticalAlign: 'middle',
                      }} />
                      {range.label}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#6b7280' }}>
                      {formatKRW(range.low)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', fontWeight: 600, color: '#111827' }}>
                      {formatKRW(range.mid)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', color: '#6b7280' }}>
                      {formatKRW(range.high)}
                    </td>
                    <td style={{
                      padding: '0.6rem 0.75rem',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: isPositive ? '#16a34a' : '#ef4444',
                    }}>
                      {formatPercent(upside)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Consensus / 종합 판단 */}
      <div style={{
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '2px solid',
        borderColor: consensus.upside >= 0 ? '#bbf7d0' : '#fecaca',
        backgroundColor: consensus.upside >= 0 ? '#f0fdf4' : '#fef2f2',
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: consensus.upside >= 0 ? '#166534' : '#991b1b',
        }}>
          종합 판단
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>현재 주가</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              {formatKRW(inputs.currentPrice)}원
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>
              컨센서스 목표가 (중간 평균)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
              {formatKRW(consensus.avgMid)}원
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>
              업사이드 / 다운사이드
            </div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: consensus.upside >= 0 ? '#16a34a' : '#ef4444',
            }}>
              {formatPercent(consensus.upside)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>밸류에이션 범위</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#374151' }}>
              {formatKRW(consensus.overallLow)} ~ {formatKRW(consensus.overallHigh)}원
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: consensus.upside >= 0 ? '#dcfce7' : '#fee2e2',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#374151',
        }}>
          {consensus.upside >= 10 ? (
            <>
              <strong>저평가 판단:</strong> 5가지 밸류에이션 방법의 평균 목표가({formatKRW(consensus.avgMid)}원)가
              현재 주가({formatKRW(inputs.currentPrice)}원) 대비{' '}
              <strong style={{ color: '#16a34a' }}>{formatPercent(consensus.upside)}</strong> 상승 여력이
              있습니다. 복합 밸류에이션 기준으로 매력적인 가격 수준으로 판단됩니다.
            </>
          ) : consensus.upside >= 0 ? (
            <>
              <strong>적정가 부근:</strong> 5가지 밸류에이션 방법의 평균 목표가({formatKRW(consensus.avgMid)}원)가
              현재 주가({formatKRW(inputs.currentPrice)}원)와 유사한 수준입니다.
              현재 주가는 적정가 부근에서 거래되고 있는 것으로 판단됩니다.
            </>
          ) : (
            <>
              <strong>고평가 판단:</strong> 5가지 밸류에이션 방법의 평균 목표가({formatKRW(consensus.avgMid)}원)가
              현재 주가({formatKRW(inputs.currentPrice)}원) 대비{' '}
              <strong style={{ color: '#ef4444' }}>{formatPercent(consensus.upside)}</strong> 하락 가능성이
              있습니다. 복합 밸류에이션 기준으로 다소 고평가된 것으로 판단됩니다.
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: '1.25rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        color: '#9ca3af',
        lineHeight: 1.5,
      }}>
        * 본 계산기는 교육 목적으로 제작되었으며, 투자 권유가 아닙니다.
        실제 투자 결정 시에는 전문가 상담 및 추가 분석이 필요합니다.
        프리셋 데이터는 예시이며 실시간 시세와 다를 수 있습니다.
      </div>
    </div>
  );
};
