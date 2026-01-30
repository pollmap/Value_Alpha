import React, { useState, useMemo } from 'react';

interface PERBandInputs {
  currentPrice: number;
  currentEPS: number;
  forwardEPS: number;
  perHigh: number;
  perPlus1Sigma: number;
  perAvg: number;
  perMinus1Sigma: number;
  perLow: number;
}

interface PresetData {
  label: string;
  data: PERBandInputs;
}

const PRESETS: PresetData[] = [
  {
    label: '삼성전자',
    data: { currentPrice: 71000, currentEPS: 2130, forwardEPS: 4500, perHigh: 18, perPlus1Sigma: 14, perAvg: 11, perMinus1Sigma: 8, perLow: 6 },
  },
  {
    label: 'SK하이닉스',
    data: { currentPrice: 178000, currentEPS: 7610, forwardEPS: 25000, perHigh: 25, perPlus1Sigma: 15, perAvg: 10, perMinus1Sigma: 7, perLow: 4 },
  },
  {
    label: '현대차',
    data: { currentPrice: 230000, currentEPS: 38000, forwardEPS: 42000, perHigh: 9, perPlus1Sigma: 7, perAvg: 6, perMinus1Sigma: 5, perLow: 3.5 },
  },
  {
    label: 'NAVER',
    data: { currentPrice: 210000, currentEPS: 5500, forwardEPS: 8000, perHigh: 60, perPlus1Sigma: 40, perAvg: 30, perMinus1Sigma: 22, perLow: 15 },
  },
  {
    label: '셀트리온',
    data: { currentPrice: 185000, currentEPS: 3800, forwardEPS: 6500, perHigh: 80, perPlus1Sigma: 55, perAvg: 40, perMinus1Sigma: 28, perLow: 18 },
  },
];

const BAND_LABELS = [
  { key: 'high', label: '5년 최고 PER', color: '#ef4444', bgColor: '#fef2f2' },
  { key: 'plus1Sigma', label: '5년 평균+1\u03C3 PER', color: '#f97316', bgColor: '#fff7ed' },
  { key: 'avg', label: '5년 평균 PER', color: '#3b82f6', bgColor: '#eff6ff' },
  { key: 'minus1Sigma', label: '5년 평균-1\u03C3 PER', color: '#22c55e', bgColor: '#f0fdf4' },
  { key: 'low', label: '5년 최저 PER', color: '#15803d', bgColor: '#f0fdf4' },
] as const;

const formatNumber = (num: number): string => Math.round(num).toLocaleString();

const formatPrice = (num: number): string => `${formatNumber(num)}원`;

export const PERBandCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<PERBandInputs>(PRESETS[0].data);
  const [selectedPreset, setSelectedPreset] = useState<string>('삼성전자');

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPreset(value);
    if (value === 'custom') return;
    const preset = PRESETS.find(p => p.label === value);
    if (preset) setInputs(preset.data);
  };

  const handleInputChange = (field: keyof PERBandInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    setSelectedPreset('custom');
  };

  const result = useMemo(() => {
    const { currentPrice, currentEPS, forwardEPS, perHigh, perPlus1Sigma, perAvg, perMinus1Sigma, perLow } = inputs;

    if (currentEPS === 0 || forwardEPS === 0) return null;

    const currentPER = currentPrice / currentEPS;
    const forwardPER = currentPrice / forwardEPS;

    const perLevels = [perHigh, perPlus1Sigma, perAvg, perMinus1Sigma, perLow];
    const targetPrices = perLevels.map(per => forwardEPS * per);

    const lowestTarget = targetPrices[4];
    const highestTarget = targetPrices[0];
    const bandRange = highestTarget - lowestTarget;
    const positionPct = bandRange > 0
      ? ((currentPrice - lowestTarget) / bandRange) * 100
      : 50;

    const upsideDownside = targetPrices.map(tp => ((tp - currentPrice) / currentPrice) * 100);

    // 투자 판단
    let judgmentText: string;
    let judgmentColor: string;
    let judgmentBg: string;

    if (currentPrice < targetPrices[4]) {
      judgmentText = '극단적 저평가 구간';
      judgmentColor = '#15803d';
      judgmentBg = '#dcfce7';
    } else if (currentPrice < targetPrices[3]) {
      judgmentText = '저평가 구간';
      judgmentColor = '#22c55e';
      judgmentBg = '#f0fdf4';
    } else if (currentPrice < targetPrices[2]) {
      judgmentText = '적정가치 하단';
      judgmentColor = '#3b82f6';
      judgmentBg = '#eff6ff';
    } else if (currentPrice < targetPrices[1]) {
      judgmentText = '적정가치 상단';
      judgmentColor = '#ca8a04';
      judgmentBg = '#fefce8';
    } else if (currentPrice < targetPrices[0]) {
      judgmentText = '고평가 구간';
      judgmentColor = '#f97316';
      judgmentBg = '#fff7ed';
    } else {
      judgmentText = '극단적 고평가 구간';
      judgmentColor = '#ef4444';
      judgmentBg = '#fef2f2';
    }

    return {
      currentPER,
      forwardPER,
      perLevels,
      targetPrices,
      positionPct: Math.max(0, Math.min(100, positionPct)),
      upsideDownside,
      judgmentText,
      judgmentColor,
      judgmentBg,
      lowestTarget,
      highestTarget,
    };
  }, [inputs]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
    fontWeight: 500,
  };

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>📊</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>PER Band 계산기</h2>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        과거 PER 밴드를 기반으로 Forward EPS에 적용하여 적정 주가 범위를 산출합니다.
      </p>

      {/* Preset 선택 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={labelStyle}>프리셋 선택</label>
        <select
          value={selectedPreset}
          onChange={handlePresetChange}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {PRESETS.map(p => (
            <option key={p.label} value={p.label}>{p.label}</option>
          ))}
          <option value="custom">직접 입력</option>
        </select>
      </div>

      {/* 입력 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* 기본 정보 */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>기본 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>현재 주가 (원)</label>
              <input
                type="number"
                value={inputs.currentPrice}
                onChange={e => handleInputChange('currentPrice', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>현재 EPS (원)</label>
              <input
                type="number"
                value={inputs.currentEPS}
                onChange={e => handleInputChange('currentEPS', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Forward EPS (예상 EPS, 원)</label>
              <input
                type="number"
                value={inputs.forwardEPS}
                onChange={e => handleInputChange('forwardEPS', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* PER 범위 */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>과거 PER 범위 (5년)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {([
              { field: 'perHigh' as const, label: '5년 최고 PER' },
              { field: 'perPlus1Sigma' as const, label: '5년 평균+1\u03C3 PER' },
              { field: 'perAvg' as const, label: '5년 평균 PER' },
              { field: 'perMinus1Sigma' as const, label: '5년 평균-1\u03C3 PER' },
              { field: 'perLow' as const, label: '5년 최저 PER' },
            ]).map(({ field, label }) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs[field]}
                  onChange={e => handleInputChange(field, e.target.value)}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EPS 경고 */}
      {(inputs.currentEPS === 0 || inputs.forwardEPS === 0) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          <span>⚠️</span>
          <span style={{ color: '#b91c1c' }}>EPS가 0이면 PER을 계산할 수 없습니다.</span>
        </div>
      )}

      {/* 결과 섹션 */}
      {result && (
        <>
          {/* 요약 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1d4ed8', marginBottom: '0.25rem' }}>현재 PER</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{result.currentPER.toFixed(1)}x</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', marginBottom: '0.25rem' }}>Forward PER</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{result.forwardPER.toFixed(1)}x</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.25rem' }}>평균 PER 적정가</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{formatPrice(result.targetPrices[2])}</p>
            </div>
            <div style={{
              background: `linear-gradient(135deg, ${result.judgmentBg} 0%, ${result.judgmentBg} 100%)`,
              padding: '1rem',
              borderRadius: '0.75rem',
              border: `1px solid ${result.judgmentColor}33`,
            }}>
              <p style={{ fontSize: '0.875rem', color: result.judgmentColor, marginBottom: '0.25rem' }}>투자 판단</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: result.judgmentColor }}>{result.judgmentText}</p>
            </div>
          </div>

          {/* PER Band 시각화 */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>PER Band 차트</h3>
            <div style={{
              position: 'relative',
              padding: '1.5rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
            }}>
              {/* Band bars */}
              {BAND_LABELS.map((band, i) => {
                const targetPrice = result.targetPrices[i];
                const minPrice = result.lowestTarget * 0.8;
                const maxPrice = result.highestTarget * 1.1;
                const barWidth = ((targetPrice - minPrice) / (maxPrice - minPrice)) * 100;

                return (
                  <div key={band.key} style={{ marginBottom: i < 4 ? '0.75rem' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#4b5563', fontWeight: 500 }}>
                        {band.label} ({result.perLevels[i]}x)
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: band.color }}>
                        {formatPrice(targetPrice)}
                      </span>
                    </div>
                    <div style={{
                      position: 'relative',
                      height: '1.5rem',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${Math.max(2, Math.min(100, barWidth))}%`,
                        height: '100%',
                        backgroundColor: band.color,
                        borderRadius: '0.375rem',
                        opacity: 0.75,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                );
              })}

              {/* 현재 주가 마커 */}
              {(() => {
                const minPrice = result.lowestTarget * 0.8;
                const maxPrice = result.highestTarget * 1.1;
                const markerPct = ((inputs.currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
                const clampedPct = Math.max(1, Math.min(99, markerPct));

                return (
                  <div style={{ marginTop: '1.25rem', position: 'relative', height: '2.5rem' }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: '50%',
                      height: '2px',
                      backgroundColor: '#9ca3af',
                      transform: 'translateY(-50%)',
                    }} />
                    <div style={{
                      position: 'absolute',
                      left: `${clampedPct}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '10px solid #1f2937',
                        marginBottom: '2px',
                      }} />
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#1f2937',
                        whiteSpace: 'nowrap',
                        backgroundColor: '#fbbf24',
                        padding: '1px 6px',
                        borderRadius: '0.25rem',
                      }}>
                        현재가 {formatPrice(inputs.currentPrice)}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 밴드 내 위치 */}
              <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.8rem', color: '#6b7280' }}>
                밴드 내 위치: 하단 기준 {result.positionPct.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 결과 테이블 */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>PER Band 상세</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb', fontSize: '0.85rem' }}>구간</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb', fontSize: '0.85rem' }}>PER</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontSize: '0.85rem' }}>목표 주가</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #e5e7eb', fontSize: '0.85rem' }}>괴리율</th>
                  </tr>
                </thead>
                <tbody>
                  {BAND_LABELS.map((band, i) => {
                    const upside = result.upsideDownside[i];
                    return (
                      <tr key={band.key} style={{ backgroundColor: band.key === 'avg' ? '#eff6ff' : 'transparent' }}>
                        <td style={{
                          padding: '0.6rem 0.75rem',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '0.85rem',
                        }}>
                          <span style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: band.color,
                            marginRight: '0.5rem',
                            verticalAlign: 'middle',
                          }} />
                          {band.label}
                        </td>
                        <td style={{
                          padding: '0.6rem 0.75rem',
                          textAlign: 'center',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '0.85rem',
                          fontWeight: band.key === 'avg' ? 700 : 400,
                        }}>
                          {result.perLevels[i]}x
                        </td>
                        <td style={{
                          padding: '0.6rem 0.75rem',
                          textAlign: 'right',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}>
                          {formatPrice(result.targetPrices[i])}
                        </td>
                        <td style={{
                          padding: '0.6rem 0.75rem',
                          textAlign: 'right',
                          borderBottom: '1px solid #e5e7eb',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: upside >= 0 ? '#16a34a' : '#dc2626',
                        }}>
                          {upside >= 0 ? '+' : ''}{upside.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {/* 현재가 행 */}
                  <tr style={{ backgroundColor: '#fefce8' }}>
                    <td style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: 700 }}>
                      ▶ 현재 주가
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: 700 }}>
                      {result.forwardPER.toFixed(1)}x
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: 700 }}>
                      {formatPrice(inputs.currentPrice)}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.85rem', fontWeight: 700, color: '#6b7280' }}>
                      -
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 투자 판단 도우미 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>투자 판단 도우미</h3>
            <div style={{
              padding: '1.25rem',
              backgroundColor: result.judgmentBg,
              border: `1px solid ${result.judgmentColor}44`,
              borderRadius: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: result.judgmentColor,
                  color: '#ffffff',
                  borderRadius: '1rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}>
                  {result.judgmentText}
                </span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  현재 주가 <strong>{formatPrice(inputs.currentPrice)}</strong>는
                  Forward PER <strong>{result.forwardPER.toFixed(1)}x</strong> 수준으로,
                </p>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  5년 평균 PER({inputs.perAvg}x) 기준 적정가 <strong>{formatPrice(result.targetPrices[2])}</strong> 대비{' '}
                  <span style={{ fontWeight: 700, color: result.upsideDownside[2] >= 0 ? '#16a34a' : '#dc2626' }}>
                    {result.upsideDownside[2] >= 0 ? '+' : ''}{result.upsideDownside[2].toFixed(1)}%
                  </span>{' '}
                  {result.upsideDownside[2] >= 0 ? '상승 여력' : '하락 위험'}이 있습니다.
                </p>
              </div>

              {/* 구간 범례 */}
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                color: '#4b5563',
              }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>PER Band 구간 해석</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.25rem' }}>
                  {[
                    { color: '#15803d', text: '최고PER 초과: 극단적 고평가' },
                    { color: '#f97316', text: '+1\u03C3 ~ 최고PER: 고평가 구간' },
                    { color: '#ca8a04', text: '평균 ~ +1\u03C3: 적정가치 상단' },
                    { color: '#3b82f6', text: '-1\u03C3 ~ 평균: 적정가치 하단' },
                    { color: '#22c55e', text: '최저 ~ -1\u03C3: 저평가 구간' },
                    { color: '#15803d', text: '최저PER 미만: 극단적 저평가' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }} />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 참고사항 */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            fontSize: '0.8rem',
            color: '#6b7280',
            lineHeight: 1.6,
          }}>
            <strong>참고사항:</strong> PER Band 분석은 과거 밸류에이션 범위를 기반으로 하며,
            미래 이익 전망(Forward EPS)의 정확도에 크게 의존합니다.
            업종 변화, 성장률 변동, 시장 환경 변화 등으로 과거 PER 범위가 미래에도 유지되리라는 보장은 없습니다.
            투자 의사결정 시 다른 밸류에이션 지표(PBR, EV/EBITDA, DCF 등)와 함께 종합적으로 판단하시기 바랍니다.
          </div>
        </>
      )}
    </div>
  );
};

export default PERBandCalculator;
