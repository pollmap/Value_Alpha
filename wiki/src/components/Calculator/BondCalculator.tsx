import React, { useState, useMemo } from 'react';

interface BondInputs {
  faceValue: number;
  couponRate: number;
  maturity: number;
  marketRate: number;
  frequency: number; // 1 = annual, 2 = semi, 4 = quarterly
}

interface CashFlowRow {
  period: number;
  coupon: number;
  principal: number;
  totalCF: number;
  pv: number;
  weightedPV: number;
}

interface BondResult {
  price: number;
  currentYield: number;
  macaulayDuration: number;
  modifiedDuration: number;
  convexity: number;
  status: '할인채' | '액면채' | '할증채';
  cashFlows: CashFlowRow[];
}

interface RateSimRow {
  delta: number;
  durationEstPrice: number;
  exactPrice: number;
  error: number;
}

const PRESETS: { label: string; inputs: BondInputs }[] = [
  {
    label: '국고채 3년',
    inputs: { faceValue: 10000, couponRate: 3.5, maturity: 3, marketRate: 3.2, frequency: 2 },
  },
  {
    label: '국고채 10년',
    inputs: { faceValue: 10000, couponRate: 3.0, maturity: 10, marketRate: 3.5, frequency: 2 },
  },
  {
    label: '회사채 AA-',
    inputs: { faceValue: 10000, couponRate: 4.5, maturity: 5, marketRate: 5.0, frequency: 2 },
  },
  {
    label: '회사채 BBB',
    inputs: { faceValue: 10000, couponRate: 6.0, maturity: 3, marketRate: 7.5, frequency: 2 },
  },
  {
    label: '제로쿠폰채',
    inputs: { faceValue: 10000, couponRate: 0, maturity: 5, marketRate: 4.0, frequency: 1 },
  },
];

const FREQ_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: '연 1회' },
  { value: 2, label: '반기' },
  { value: 4, label: '분기' },
];

function calcBondPrice(F: number, c: number, m: number, r: number, n: number): number {
  const couponPerPeriod = (F * c) / n;
  const totalPeriods = m * n;
  const ratePerPeriod = r / n;
  let price = 0;
  for (let t = 1; t <= totalPeriods; t++) {
    const cf = t === totalPeriods ? couponPerPeriod + F : couponPerPeriod;
    price += cf / Math.pow(1 + ratePerPeriod, t);
  }
  return price;
}

// ── Styles ──────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  maxWidth: '960px',
  margin: '0 auto',
  padding: '28px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#1a365d',
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '20px 24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  marginBottom: '20px',
};

const inputGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
  gap: '16px',
};

const inputGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#4a5568',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const radioGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '14px',
  paddingTop: '6px',
};

const radioLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#4a5568',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
};

const presetBarStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '20px',
  justifyContent: 'center',
};

const presetBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 14px',
  border: active ? '2px solid #2b6cb0' : '1px solid #cbd5e0',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: active ? 600 : 400,
  fontSize: '13px',
  backgroundColor: active ? '#ebf4ff' : '#ffffff',
  color: active ? '#2b6cb0' : '#4a5568',
  transition: 'all 0.15s',
});

const resultRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
  gap: '14px',
  marginBottom: '20px',
};

const makeCardGradient = (from: string, to: string): React.CSSProperties => ({
  background: `linear-gradient(135deg, ${from}, ${to})`,
  borderRadius: '12px',
  padding: '18px 20px',
  color: '#ffffff',
});

const cardLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  opacity: 0.85,
  marginBottom: '6px',
  fontWeight: 500,
};

const cardValueStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: 1.2,
};

const cardSubStyle: React.CSSProperties = {
  fontSize: '12px',
  opacity: 0.75,
  marginTop: '4px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
};

const thStyle: React.CSSProperties = {
  padding: '10px 8px',
  borderBottom: '2px solid #e2e8f0',
  textAlign: 'right',
  fontWeight: 600,
  color: '#2d3748',
  whiteSpace: 'nowrap',
};

const thLeftStyle: React.CSSProperties = { ...thStyle, textAlign: 'left' };

const tdStyle: React.CSSProperties = {
  padding: '8px',
  borderBottom: '1px solid #f1f5f9',
  textAlign: 'right',
  color: '#4a5568',
};

const tdLeftStyle: React.CSSProperties = { ...tdStyle, textAlign: 'left', fontWeight: 500 };

const totalRowBg: React.CSSProperties = {
  backgroundColor: '#f7fafc',
  fontWeight: 600,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: '16px',
  fontWeight: 700,
  color: '#2d3748',
};

// ── Component ───────────────────────────────────────────────────────────────

export const BondCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<BondInputs>({
    faceValue: 10000,
    couponRate: 3.0,
    maturity: 5,
    marketRate: 4.0,
    frequency: 2,
  });

  const [activePreset, setActivePreset] = useState<number | null>(null);

  const handleChange = (field: keyof BondInputs, value: string) => {
    const num = parseFloat(value);
    if (field === 'frequency') {
      setInputs((prev) => ({ ...prev, frequency: isNaN(num) ? 1 : num }));
    } else {
      setInputs((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
    }
    setActivePreset(null);
  };

  const applyPreset = (idx: number) => {
    setInputs({ ...PRESETS[idx].inputs });
    setActivePreset(idx);
  };

  // ── Core calculation ────────────────────────────────────────────────────

  const result = useMemo<BondResult | null>(() => {
    const { faceValue: F, couponRate, maturity: m, marketRate, frequency: n } = inputs;
    if (F <= 0 || m <= 0 || n <= 0) return null;

    const c = couponRate / 100;
    const r = marketRate / 100;
    const couponPerPeriod = (F * c) / n;
    const ratePerPeriod = r / n;
    const totalPeriods = Math.round(m * n);

    const cashFlows: CashFlowRow[] = [];
    let price = 0;
    let weightedPVSum = 0;
    let convexitySum = 0;

    for (let t = 1; t <= totalPeriods; t++) {
      const isLast = t === totalPeriods;
      const coupon = couponPerPeriod;
      const principal = isLast ? F : 0;
      const totalCF = coupon + principal;
      const discountFactor = Math.pow(1 + ratePerPeriod, t);
      const pv = totalCF / discountFactor;
      const timeInYears = t / n;
      const weightedPV = timeInYears * pv;

      price += pv;
      weightedPVSum += weightedPV;
      // convexity: Σ [ t(t+1) × CF_t / (1+r/n)^(t+2) ] — will divide by P×n² later
      convexitySum += (t * (t + 1) * totalCF) / Math.pow(1 + ratePerPeriod, t + 2);

      cashFlows.push({ period: t, coupon, principal, totalCF, pv, weightedPV });
    }

    const macaulayDuration = price > 0 ? weightedPVSum / price : 0;
    const modifiedDuration = macaulayDuration / (1 + ratePerPeriod);
    const convexity = price > 0 ? convexitySum / (price * n * n) : 0;
    const annualCoupon = F * c;
    const currentYield = price > 0 ? (annualCoupon / price) * 100 : 0;

    let status: '할인채' | '액면채' | '할증채';
    if (marketRate > couponRate) status = '할인채';
    else if (marketRate < couponRate) status = '할증채';
    else status = '액면채';

    return { price, currentYield, macaulayDuration, modifiedDuration, convexity, status, cashFlows };
  }, [inputs]);

  // ── Rate simulation ─────────────────────────────────────────────────────

  const simRows = useMemo<RateSimRow[]>(() => {
    if (!result) return [];
    const { faceValue: F, couponRate, maturity: m, marketRate, frequency: n } = inputs;
    const c = couponRate / 100;
    const r = marketRate / 100;
    const P = result.price;
    const D = result.modifiedDuration;
    const C = result.convexity;

    const deltas = [-2.0, -1.5, -1.0, -0.5, 0.5, 1.0, 1.5, 2.0];
    return deltas.map((deltaPct) => {
      const dr = deltaPct / 100; // decimal change
      // Duration + Convexity approximation: ΔP/P ≈ -D×Δr + 0.5×C×(Δr)²
      const approxRatio = -D * dr + 0.5 * C * dr * dr;
      const durationEstPrice = P * (1 + approxRatio);

      // Exact repricing
      const newR = r + dr;
      const exactPrice = calcBondPrice(F, c, m, newR, n);

      const error = durationEstPrice - exactPrice;

      return { delta: deltaPct, durationEstPrice, exactPrice, error };
    });
  }, [inputs, result]);

  // ── Formatters ──────────────────────────────────────────────────────────

  const fmt = (v: number, digits = 2) =>
    v.toLocaleString('ko-KR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

  const fmtPct = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={{ margin: '0 0 6px', fontSize: '22px' }}>채권 가격 계산기</h2>
        <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
          채권 가격, 듀레이션, 컨벡시티 및 금리 변동 시뮬레이션
        </p>
      </div>

      {/* Preset scenarios */}
      <div style={presetBarStyle}>
        {PRESETS.map((p, i) => (
          <button key={i} style={presetBtnStyle(activePreset === i)} onClick={() => applyPreset(i)}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Input section */}
      <div style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>입력값</h3>
        <div style={inputGridStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>액면가 (원)</label>
            <input
              type="number"
              value={inputs.faceValue}
              onChange={(e) => handleChange('faceValue', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>표면금리 (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.couponRate}
              onChange={(e) => handleChange('couponRate', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>만기 (년)</label>
            <input
              type="number"
              step="1"
              min="1"
              value={inputs.maturity}
              onChange={(e) => handleChange('maturity', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>시장금리 / 할인율 (%)</label>
            <input
              type="number"
              step="0.1"
              value={inputs.marketRate}
              onChange={(e) => handleChange('marketRate', e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Frequency radio buttons */}
        <div style={{ marginTop: '16px' }}>
          <label style={labelStyle}>이자지급 주기</label>
          <div style={radioGroupStyle}>
            {FREQ_OPTIONS.map((opt) => (
              <label key={opt.value} style={radioLabelStyle}>
                <input
                  type="radio"
                  name="bondFrequency"
                  value={opt.value}
                  checked={inputs.frequency === opt.value}
                  onChange={(e) => handleChange('frequency', e.target.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      {result && (
        <>
          {/* Top result cards */}
          <div style={resultRowStyle}>
            {/* Bond Price */}
            <div style={makeCardGradient('#2563eb', '#1e40af')}>
              <div style={cardLabelStyle}>채권 가격</div>
              <div style={cardValueStyle}>{fmt(result.price)} 원</div>
              <div style={cardSubStyle}>
                액면가 대비 {fmt((result.price / inputs.faceValue) * 100)}%
              </div>
            </div>

            {/* Current Yield */}
            <div style={makeCardGradient('#16a34a', '#15803d')}>
              <div style={cardLabelStyle}>경상수익률</div>
              <div style={cardValueStyle}>{fmt(result.currentYield)}%</div>
              <div style={cardSubStyle}>연간 이자 / 채권 가격</div>
            </div>

            {/* Modified Duration */}
            <div style={makeCardGradient('#7c3aed', '#6d28d9')}>
              <div style={cardLabelStyle}>수정 듀레이션</div>
              <div style={cardValueStyle}>{fmt(result.modifiedDuration)} 년</div>
              <div style={cardSubStyle}>
                맥컬레이 {fmt(result.macaulayDuration)} 년 | 컨벡시티 {fmt(result.convexity)}
              </div>
            </div>

            {/* Status badge */}
            <div
              style={{
                ...makeCardGradient(
                  result.status === '할인채' ? '#dc2626' : result.status === '할증채' ? '#ea580c' : '#6b7280',
                  result.status === '할인채' ? '#b91c1c' : result.status === '할증채' ? '#c2410c' : '#4b5563',
                ),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={cardLabelStyle}>할인/할증 상태</div>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{result.status}</div>
              <div style={cardSubStyle}>
                {result.status === '할인채'
                  ? '시장금리 > 표면금리'
                  : result.status === '할증채'
                    ? '시장금리 < 표면금리'
                    : '시장금리 = 표면금리'}
              </div>
            </div>
          </div>

          {/* ── Cash Flow Table ──────────────────────────────────────────── */}
          <div style={{ ...sectionCardStyle, overflowX: 'auto' }}>
            <h3 style={sectionTitleStyle}>현금흐름 분석표</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thLeftStyle}>기간</th>
                  <th style={thStyle}>이자</th>
                  <th style={thStyle}>원금</th>
                  <th style={thStyle}>현금흐름 합계</th>
                  <th style={thStyle}>현재가치</th>
                  <th style={thStyle}>가중현재가치</th>
                </tr>
              </thead>
              <tbody>
                {result.cashFlows.map((row) => (
                  <tr key={row.period}>
                    <td style={tdLeftStyle}>{row.period}</td>
                    <td style={tdStyle}>{fmt(row.coupon)}</td>
                    <td style={tdStyle}>{row.principal > 0 ? fmt(row.principal) : '-'}</td>
                    <td style={tdStyle}>{fmt(row.totalCF)}</td>
                    <td style={tdStyle}>{fmt(row.pv)}</td>
                    <td style={tdStyle}>{fmt(row.weightedPV)}</td>
                  </tr>
                ))}
                {/* Totals */}
                <tr style={totalRowBg}>
                  <td style={{ ...tdLeftStyle, fontWeight: 700 }}>합계</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {fmt(result.cashFlows.reduce((s, r) => s + r.coupon, 0))}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {fmt(result.cashFlows.reduce((s, r) => s + r.principal, 0))}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {fmt(result.cashFlows.reduce((s, r) => s + r.totalCF, 0))}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {fmt(result.cashFlows.reduce((s, r) => s + r.pv, 0))}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>
                    {fmt(result.cashFlows.reduce((s, r) => s + r.weightedPV, 0))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Rate Simulation ──────────────────────────────────────────── */}
          <div style={{ ...sectionCardStyle, overflowX: 'auto' }}>
            <h3 style={sectionTitleStyle}>금리 변동 시뮬레이션</h3>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#718096' }}>
              듀레이션 + 컨벡시티 근사: ΔP/P ≈ −D × Δr + 0.5 × C × (Δr)²
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thLeftStyle}>금리변동</th>
                  <th style={thStyle}>듀레이션 추정 가격</th>
                  <th style={thStyle}>정확한 가격</th>
                  <th style={thStyle}>오차</th>
                </tr>
              </thead>
              <tbody>
                {simRows.map((row) => {
                  const pctChange = ((row.exactPrice - result.price) / result.price) * 100;
                  return (
                    <tr key={row.delta}>
                      <td
                        style={{
                          ...tdLeftStyle,
                          color: row.delta < 0 ? '#16a34a' : '#dc2626',
                        }}
                      >
                        {row.delta > 0 ? '+' : ''}
                        {row.delta.toFixed(1)}%p
                      </td>
                      <td style={tdStyle}>{fmt(row.durationEstPrice)} 원</td>
                      <td style={tdStyle}>
                        {fmt(row.exactPrice)} 원
                        <span
                          style={{
                            marginLeft: '6px',
                            fontSize: '11px',
                            color: pctChange >= 0 ? '#16a34a' : '#dc2626',
                          }}
                        >
                          ({fmtPct(pctChange)})
                        </span>
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: Math.abs(row.error) < 1 ? '#6b7280' : '#b45309',
                        }}
                      >
                        {row.error >= 0 ? '+' : ''}
                        {fmt(row.error)} 원
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BondCalculator;
