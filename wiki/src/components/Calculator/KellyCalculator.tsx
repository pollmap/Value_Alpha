import React, { useState, useMemo } from 'react';

type KellyFraction = 'full' | 'half' | 'quarter';

interface KellyInputs {
  winProb: number;
  avgWin: number;
  avgLoss: number;
  capital: number;
  fraction: KellyFraction;
}

interface Preset {
  label: string;
  description: string;
  inputs: Omit<KellyInputs, 'fraction'>;
}

const PRESETS: Preset[] = [
  {
    label: '가치투자 (보수적)',
    description: '높은 승률, 안정적 손익비',
    inputs: { winProb: 60, avgWin: 25, avgLoss: 15, capital: 10000 },
  },
  {
    label: '모멘텀 전략',
    description: '낮은 승률, 높은 수익률',
    inputs: { winProb: 45, avgWin: 40, avgLoss: 12, capital: 10000 },
  },
  {
    label: '트레이딩',
    description: '빈번한 거래, 소폭 손익',
    inputs: { winProb: 55, avgWin: 8, avgLoss: 5, capital: 5000 },
  },
  {
    label: '고확률 배당투자',
    description: '높은 승률, 낮은 변동성',
    inputs: { winProb: 75, avgWin: 10, avgLoss: 8, capital: 20000 },
  },
];

const DEFAULT_INPUTS: KellyInputs = {
  winProb: 60,
  avgWin: 25,
  avgLoss: 15,
  capital: 10000,
  fraction: 'half',
};

export const KellyCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<KellyInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => {
    const p = inputs.winProb / 100;
    const q = 1 - p;
    const W = inputs.avgWin / 100;
    const L = inputs.avgLoss / 100;

    if (W <= 0 || L <= 0) return null;

    const b = W / L; // win/loss ratio
    // Kelly: f* = (b*p - q) / b = p - q/b = p - (1-p)*L/W
    const fullKelly = (b * p - q) / b;
    const halfKelly = fullKelly / 2;
    const quarterKelly = fullKelly / 4;

    const selectedKelly =
      inputs.fraction === 'full'
        ? fullKelly
        : inputs.fraction === 'half'
          ? halfKelly
          : quarterKelly;

    const investAmount = inputs.capital * Math.max(0, selectedKelly);

    // Expected return per trade
    const expectedReturn = p * inputs.avgWin - q * inputs.avgLoss;

    // Edge: expected return per unit risked = p * (W/L) - (1-p)
    const edge = p * b - q;

    // Growth rate simulation at various Kelly multiples
    const kellyMultiples = [0.25, 0.5, 1.0, 1.5, 2.0];
    const growthTable = kellyMultiples.map((mult) => {
      const f = fullKelly * mult;
      let growthRate: number | null = null;
      let viable = true;

      if (f <= 0) {
        growthRate = 0;
        viable = false;
      } else if (f * L >= 1) {
        // Total ruin on a loss
        growthRate = -Infinity;
        viable = false;
      } else {
        // Expected log growth: E[g] = p * ln(1 + f*W) + q * ln(1 - f*L)
        growthRate = p * Math.log(1 + f * W) + q * Math.log(1 - f * L);
      }

      return {
        multiple: mult,
        fraction: f,
        growthRate,
        viable,
        label: mult === 1.0 ? 'Full Kelly' : mult === 0.5 ? 'Half Kelly' : mult === 0.25 ? 'Quarter Kelly' : `${mult}x Kelly`,
      };
    });

    return {
      fullKelly,
      halfKelly,
      quarterKelly,
      selectedKelly,
      investAmount,
      expectedReturn,
      edge,
      b,
      growthTable,
    };
  }, [inputs]);

  const formatPercent = (val: number, decimals = 2) => {
    return (val * 100).toFixed(decimals) + '%';
  };

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  const applyPreset = (preset: Preset) => {
    setInputs({ ...preset.inputs, fraction: inputs.fraction });
  };

  const updateInput = (field: keyof KellyInputs, value: number | KellyFraction) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Styles
  const cardBase: React.CSSProperties = {
    padding: '1.25rem',
    borderRadius: '0.75rem',
    textAlign: 'center' as const,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    boxSizing: 'border-box' as const,
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    margin: '0.25rem 0',
    cursor: 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    color: '#374151',
  };

  const sublabelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginBottom: '0.5rem',
  };

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🎯</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>Kelly Criterion 포지션 사이징 계산기</h2>
      </div>

      {/* Preset Scenarios */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
          프리셋 시나리오
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: '500',
                color: '#374151',
                transition: 'all 0.15s',
              }}
              title={preset.description}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Win Probability */}
        <div>
          <label style={labelStyle}>승률 (Win Probability)</label>
          <p style={sublabelStyle}>전략의 예상 승률 (%)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="range"
              min={1}
              max={99}
              step={1}
              value={inputs.winProb}
              onChange={(e) => updateInput('winProb', parseFloat(e.target.value))}
              style={{ ...sliderStyle, flex: 1 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '5rem' }}>
              <input
                type="number"
                min={1}
                max={99}
                step={1}
                value={inputs.winProb}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) updateInput('winProb', Math.max(1, Math.min(99, v)));
                }}
                style={{ ...inputStyle, width: '4rem', textAlign: 'right' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>%</span>
            </div>
          </div>
        </div>

        {/* Average Win Return */}
        <div>
          <label style={labelStyle}>평균 수익률 (Average Win)</label>
          <p style={sublabelStyle}>승리 시 평균 수익률 (%)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="range"
              min={1}
              max={200}
              step={1}
              value={inputs.avgWin}
              onChange={(e) => updateInput('avgWin', parseFloat(e.target.value))}
              style={{ ...sliderStyle, flex: 1 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '5rem' }}>
              <input
                type="number"
                min={1}
                max={500}
                step={1}
                value={inputs.avgWin}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) updateInput('avgWin', Math.max(1, v));
                }}
                style={{ ...inputStyle, width: '4rem', textAlign: 'right' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>%</span>
            </div>
          </div>
        </div>

        {/* Average Loss Return */}
        <div>
          <label style={labelStyle}>평균 손실률 (Average Loss)</label>
          <p style={sublabelStyle}>패배 시 평균 손실률 (%, 양수로 입력)</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={inputs.avgLoss}
              onChange={(e) => updateInput('avgLoss', parseFloat(e.target.value))}
              style={{ ...sliderStyle, flex: 1 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', minWidth: '5rem' }}>
              <input
                type="number"
                min={1}
                max={100}
                step={1}
                value={inputs.avgLoss}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) updateInput('avgLoss', Math.max(1, Math.min(100, v)));
                }}
                style={{ ...inputStyle, width: '4rem', textAlign: 'right' }}
              />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>%</span>
            </div>
          </div>
        </div>

        {/* Total Capital */}
        <div>
          <label style={labelStyle}>총 투자 가능 자금</label>
          <p style={sublabelStyle}>단위: 만원</p>
          <input
            type="number"
            min={0}
            step={100}
            value={inputs.capital}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) updateInput('capital', Math.max(0, v));
            }}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Kelly Fraction Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
          Kelly 비율 적용
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {([
            { key: 'full' as KellyFraction, label: 'Full Kelly', desc: '최대 성장률, 최대 변동성' },
            { key: 'half' as KellyFraction, label: 'Half Kelly (권장)', desc: '성장률 75%, 변동성 50%' },
            { key: 'quarter' as KellyFraction, label: 'Quarter Kelly', desc: '보수적 접근' },
          ]).map((opt) => (
            <label
              key={opt.key}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: inputs.fraction === opt.key ? '2px solid #2563eb' : '1px solid #d1d5db',
                backgroundColor: inputs.fraction === opt.key ? '#eff6ff' : '#fff',
                cursor: 'pointer',
                flex: '1 1 160px',
                minWidth: '160px',
              }}
            >
              <input
                type="radio"
                name="kellyFraction"
                checked={inputs.fraction === opt.key}
                onChange={() => updateInput('fraction', opt.key)}
                style={{ marginTop: '0.2rem' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{opt.label}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{opt.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Warning Messages */}
      {results && results.fullKelly < 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🚫</span>
          <span style={{ color: '#b91c1c', fontWeight: '600' }}>
            기대값이 음수입니다. 이 전략에 투자하지 마십시오.
          </span>
        </div>
      )}
      {results && results.fullKelly > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <span style={{ color: '#b91c1c', fontWeight: '600' }}>
            레버리지가 필요한 수준입니다. 실전에서는 권장하지 않습니다.
          </span>
        </div>
      )}
      {results && results.fullKelly >= 0.5 && results.fullKelly <= 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <span style={{ color: '#92400e', fontWeight: '600' }}>
            Kelly 비율이 매우 높습니다. Half Kelly 이하를 권장합니다.
          </span>
        </div>
      )}

      {/* Result Cards */}
      {results && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {/* Full Kelly */}
            <div
              style={{
                ...cardBase,
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '0.25rem', fontWeight: '500' }}>
                Full Kelly
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#92400e', margin: '0.25rem 0' }}>
                {results.fullKelly >= 0 ? formatPercent(results.fullKelly) : '해당 없음'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#a16207' }}>최대 기하 성장률</p>
            </div>

            {/* Selected Kelly + Investment Amount */}
            <div
              style={{
                ...cardBase,
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: '#15803d', marginBottom: '0.25rem', fontWeight: '500' }}>
                {inputs.fraction === 'full' ? 'Full' : inputs.fraction === 'half' ? 'Half' : 'Quarter'} Kelly 적용
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#166534', margin: '0.25rem 0' }}>
                {results.selectedKelly >= 0 ? formatPercent(results.selectedKelly) : '0%'}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>
                최적 투자금액: {formatNumber(results.investAmount)}만원
              </p>
            </div>

            {/* Expected Return */}
            <div
              style={{
                ...cardBase,
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: '#1d4ed8', marginBottom: '0.25rem', fontWeight: '500' }}>
                기대수익률
              </p>
              <p
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 'bold',
                  color: results.expectedReturn >= 0 ? '#1e40af' : '#b91c1c',
                  margin: '0.25rem 0',
                }}
              >
                {results.expectedReturn >= 0 ? '+' : ''}
                {results.expectedReturn.toFixed(2)}%
              </p>
              <p style={{ fontSize: '0.7rem', color: '#3b82f6' }}>거래당 기대 수익</p>
            </div>

            {/* Win/Loss Ratio */}
            <div
              style={{
                ...cardBase,
                background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
              }}
            >
              <p style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.25rem', fontWeight: '500' }}>
                손익비 (W/L)
              </p>
              <p style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#6d28d9', margin: '0.25rem 0' }}>
                {results.b.toFixed(2)}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#8b5cf6' }}>
                Edge: {results.edge >= 0 ? '+' : ''}
                {results.edge.toFixed(3)}
              </p>
            </div>
          </div>

          {/* Growth Rate Simulation Table */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
              파산 확률 시뮬레이션
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              Kelly 배수에 따른 기대 기하 성장률 비교 (거래당 로그 성장률)
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderBottom: '2px solid #d1d5db', fontSize: '0.8rem' }}>
                      Kelly 배수
                    </th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '2px solid #d1d5db', fontSize: '0.8rem' }}>
                      배팅 비율
                    </th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '2px solid #d1d5db', fontSize: '0.8rem' }}>
                      투자금액 (만원)
                    </th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right', borderBottom: '2px solid #d1d5db', fontSize: '0.8rem' }}>
                      기대 성장률
                    </th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', borderBottom: '2px solid #d1d5db', fontSize: '0.8rem' }}>
                      평가
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.growthTable.map((row) => {
                    const isOptimal = row.multiple === 1.0;
                    const isSelected =
                      (inputs.fraction === 'full' && row.multiple === 1.0) ||
                      (inputs.fraction === 'half' && row.multiple === 0.5) ||
                      (inputs.fraction === 'quarter' && row.multiple === 0.25);

                    let assessment: string;
                    let assessmentColor: string;

                    if (!row.viable || results.fullKelly <= 0) {
                      assessment = '투자 부적합';
                      assessmentColor = '#b91c1c';
                    } else if (row.growthRate !== null && row.growthRate === -Infinity) {
                      assessment = '파산 위험';
                      assessmentColor = '#b91c1c';
                    } else if (row.multiple > 1.0) {
                      assessment = '과도한 위험';
                      assessmentColor = '#dc2626';
                    } else if (row.multiple === 1.0) {
                      assessment = '최대 성장';
                      assessmentColor = '#d97706';
                    } else if (row.multiple === 0.5) {
                      assessment = '권장 (안정적)';
                      assessmentColor = '#16a34a';
                    } else {
                      assessment = '보수적';
                      assessmentColor = '#2563eb';
                    }

                    const fractionVal = results.fullKelly > 0 ? row.fraction : 0;
                    const investAmt = inputs.capital * Math.max(0, fractionVal);

                    return (
                      <tr
                        key={row.multiple}
                        style={{
                          backgroundColor: isSelected
                            ? '#eff6ff'
                            : isOptimal
                              ? '#fffbeb'
                              : 'transparent',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        <td style={{ padding: '0.5rem 0.75rem', fontWeight: isSelected ? '700' : '500', fontSize: '0.85rem' }}>
                          {row.label}
                          {isSelected && ' ✔'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.85rem' }}>
                          {fractionVal > 0 ? formatPercent(fractionVal) : '-'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.85rem' }}>
                          {fractionVal > 0 ? formatNumber(investAmt) : '-'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontSize: '0.85rem' }}>
                          {row.growthRate !== null && row.growthRate !== -Infinity && results.fullKelly > 0
                            ? (row.growthRate * 100).toFixed(4) + '%'
                            : row.growthRate === -Infinity
                              ? '-∞'
                              : '-'}
                        </td>
                        <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', fontSize: '0.8rem' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '9999px',
                              backgroundColor:
                                assessmentColor === '#16a34a'
                                  ? '#dcfce7'
                                  : assessmentColor === '#2563eb'
                                    ? '#dbeafe'
                                    : assessmentColor === '#d97706'
                                      ? '#fef3c7'
                                      : '#fee2e2',
                              color: assessmentColor,
                              fontWeight: '600',
                              fontSize: '0.75rem',
                            }}
                          >
                            {assessment}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 실전 가이드 */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📘</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0c4a6e' }}>실전 가이드</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: '#1e3a5f', lineHeight: '1.75' }}>
              <li>
                실전에서는 <strong>Half Kelly를 초과하지 않는 것</strong>이 일반적입니다.
              </li>
              <li>
                추정 승률과 손익비에 불확실성이 있으므로,{' '}
                <strong>보수적으로 Quarter Kelly부터 시작</strong>하십시오.
              </li>
              <li>
                Kelly 공식은 <strong>독립적인 반복 베팅</strong>을 가정합니다. 상관관계가 있는 포지션에는 조정이 필요합니다.
              </li>
              <li>
                실제 승률과 손익비는 <strong>과거 데이터의 표본 추정치</strong>이므로, 과적합(overfitting)에 주의하십시오.
              </li>
            </ul>
          </div>

          {/* Kelly Formula Explanation */}
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem' }}>📐</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#374151' }}>수식 설명</h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Kelly Criterion:</strong>{' '}
                <code style={{ backgroundColor: '#e5e7eb', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                  f* = (b × p - q) / b
                </code>
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                <li>
                  <code>b</code> = 손익비 (W/L) = 평균 수익률 / 평균 손실률
                </li>
                <li>
                  <code>p</code> = 승률 (승리 확률)
                </li>
                <li>
                  <code>q</code> = 1 - p (패배 확률)
                </li>
                <li>
                  <code>f*</code> = 최적 투자 비율 (전체 자본 대비)
                </li>
              </ul>
              <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <strong>기대 기하 성장률:</strong>{' '}
                <code style={{ backgroundColor: '#e5e7eb', padding: '0.15rem 0.4rem', borderRadius: '0.25rem' }}>
                  g = p × ln(1 + f × W) + q × ln(1 - f × L)
                </code>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KellyCalculator;
