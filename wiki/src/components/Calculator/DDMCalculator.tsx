import React, { useState, useMemo } from 'react';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type TabKey = 'gordon' | 'twostage' | 'hmodel';

interface GordonInputs {
  dps: number;
  g: number;
  ke: number;
}

interface TwoStageInputs {
  dps: number;
  g1: number;
  n: number;
  g2: number;
  ke: number;
}

interface HModelInputs {
  dps: number;
  ga: number;
  gn: number;
  H: number;
  ke: number;
}

interface PresetCompany {
  name: string;
  dps: number;
  g: number;
  ke: number;
}

// ──────────────────────────────────────────────
// Presets
// ──────────────────────────────────────────────

const PRESETS: PresetCompany[] = [
  { name: 'KB금융', dps: 3060, g: 8, ke: 12 },
  { name: '삼성전자', dps: 1444, g: 5, ke: 10 },
  { name: 'POSCO홀딩스', dps: 12000, g: 3, ke: 11 },
  { name: 'KT&G', dps: 5200, g: 2, ke: 9 },
  { name: '하나금융', dps: 4500, g: 7, ke: 11 },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const formatNumber = (num: number): string => Math.round(num).toLocaleString();

const formatWon = (num: number): string => `${formatNumber(num)}원`;

// ──────────────────────────────────────────────
// Styles (inline, consistent with DCF/WACC)
// ──────────────────────────────────────────────

const styles = {
  tab: (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.625rem 0.5rem',
    fontSize: '0.875rem',
    fontWeight: active ? '600' : '400',
    color: active ? '#1d4ed8' : '#6b7280',
    backgroundColor: active ? '#eff6ff' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid #2563eb' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center' as const,
  }),
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
    fontWeight: '500' as const,
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    boxSizing: 'border-box' as const,
  },
  hint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.125rem',
  },
  card: (gradient: string): React.CSSProperties => ({
    background: gradient,
    padding: '1rem',
    borderRadius: '0.75rem',
  }),
  cardLabel: (color: string): React.CSSProperties => ({
    fontSize: '0.875rem',
    color,
    marginBottom: '0.25rem',
  }),
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold' as const,
    margin: 0,
  },
  thCell: {
    padding: '0.5rem',
    border: '1px solid #e5e7eb',
    fontSize: '0.8125rem',
    fontWeight: '600' as const,
  },
  tdCell: {
    padding: '0.5rem',
    border: '1px solid #e5e7eb',
    textAlign: 'center' as const,
    fontSize: '0.8125rem',
  },
  warningBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
  },
};

// ──────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────

export const DDMCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('gordon');

  // --- Gordon Growth Model state ---
  const [gordon, setGordon] = useState<GordonInputs>({ dps: 3060, g: 8, ke: 12 });

  // --- Two-Stage DDM state ---
  const [twoStage, setTwoStage] = useState<TwoStageInputs>({ dps: 3060, g1: 12, n: 5, g2: 4, ke: 10 });

  // --- H-Model state ---
  const [hModel, setHModel] = useState<HModelInputs>({ dps: 3060, ga: 15, gn: 4, H: 5, ke: 10 });

  // ──────────────────────────────────────────
  // Preset handler
  // ──────────────────────────────────────────

  const applyPreset = (preset: PresetCompany) => {
    setGordon({ dps: preset.dps, g: preset.g, ke: preset.ke });
    setTwoStage({ ...twoStage, dps: preset.dps, g1: preset.g + 4, g2: preset.g - 2 > 0 ? preset.g - 2 : 2, ke: preset.ke });
    setHModel({ ...hModel, dps: preset.dps, ga: preset.g + 7, gn: preset.g - 1 > 0 ? preset.g - 1 : 2, ke: preset.ke });
  };

  // ──────────────────────────────────────────
  // Gordon Growth calculation
  // ──────────────────────────────────────────

  const gordonResult = useMemo(() => {
    const { dps, g, ke } = gordon;
    const gDec = g / 100;
    const keDec = ke / 100;
    if (keDec <= gDec) return null;
    const intrinsic = (dps * (1 + gDec)) / (keDec - gDec);
    const dividendYield = dps / intrinsic;
    return { intrinsic, dividendYield };
  }, [gordon]);

  // ──────────────────────────────────────────
  // Two-Stage DDM calculation
  // ──────────────────────────────────────────

  const twoStageResult = useMemo(() => {
    const { dps, g1, n, g2, ke } = twoStage;
    const g1Dec = g1 / 100;
    const g2Dec = g2 / 100;
    const keDec = ke / 100;
    if (keDec <= g2Dec) return null;
    if (n < 1) return null;

    // Stage 1: PV of each year's dividend
    let pvStage1 = 0;
    let lastDividend = dps;
    const stage1Dividends: { year: number; dividend: number; pv: number }[] = [];

    for (let t = 1; t <= n; t++) {
      const div_t = dps * Math.pow(1 + g1Dec, t);
      const pv_t = div_t / Math.pow(1 + keDec, t);
      pvStage1 += pv_t;
      stage1Dividends.push({ year: t, dividend: div_t, pv: pv_t });
      if (t === n) lastDividend = div_t;
    }

    // Terminal value at year n
    const terminalValue = (lastDividend * (1 + g2Dec)) / (keDec - g2Dec);
    const pvTerminal = terminalValue / Math.pow(1 + keDec, n);

    const intrinsic = pvStage1 + pvTerminal;
    const dividendYield = dps / intrinsic;
    const tvWeight = pvTerminal / intrinsic;

    return { intrinsic, dividendYield, pvStage1, terminalValue, pvTerminal, tvWeight, stage1Dividends };
  }, [twoStage]);

  // ──────────────────────────────────────────
  // H-Model calculation
  // ──────────────────────────────────────────

  const hModelResult = useMemo(() => {
    const { dps, ga, gn, H, ke } = hModel;
    const gaDec = ga / 100;
    const gnDec = gn / 100;
    const keDec = ke / 100;
    if (keDec <= gnDec) return null;

    const stableComponent = (dps * (1 + gnDec)) / (keDec - gnDec);
    const growthPremium = (dps * H * (gaDec - gnDec)) / (keDec - gnDec);
    const intrinsic = stableComponent + growthPremium;
    const dividendYield = dps / intrinsic;

    return { intrinsic, dividendYield, stableComponent, growthPremium };
  }, [hModel]);

  // ──────────────────────────────────────────
  // Active model result (for shared sections)
  // ──────────────────────────────────────────

  const activeResult = useMemo(() => {
    if (activeTab === 'gordon') return gordonResult ? { intrinsic: gordonResult.intrinsic, dividendYield: gordonResult.dividendYield } : null;
    if (activeTab === 'twostage') return twoStageResult ? { intrinsic: twoStageResult.intrinsic, dividendYield: twoStageResult.dividendYield } : null;
    return hModelResult ? { intrinsic: hModelResult.intrinsic, dividendYield: hModelResult.dividendYield } : null;
  }, [activeTab, gordonResult, twoStageResult, hModelResult]);

  const activeDps = activeTab === 'gordon' ? gordon.dps : activeTab === 'twostage' ? twoStage.dps : hModel.dps;
  const activeKe = activeTab === 'gordon' ? gordon.ke : activeTab === 'twostage' ? twoStage.ke : hModel.ke;
  const activeG = activeTab === 'gordon' ? gordon.g : activeTab === 'twostage' ? twoStage.g2 : hModel.gn;

  // ──────────────────────────────────────────
  // Sensitivity: Ke (rows) vs g (columns)
  // ──────────────────────────────────────────

  const sensitivityData = useMemo(() => {
    const keBase = activeKe;
    const gBase = activeG;
    const dps = activeDps;

    const keDeltas = [-2, -1, 0, 1, 2];
    const gDeltas = [-2, -1, 0, 1, 2];
    const gValues = gDeltas.map(d => gBase + d);

    const rows = keDeltas.map(keDelta => {
      const keVal = keBase + keDelta;
      const cells = gValues.map(gVal => {
        const keDec = keVal / 100;
        const gDec = gVal / 100;
        if (keDec <= gDec || keDec <= 0) return 'N/A';
        return Math.round((dps * (1 + gDec)) / (keDec - gDec));
      });
      return { ke: keVal, cells };
    });

    return { gValues, rows };
  }, [activeKe, activeG, activeDps]);

  // ──────────────────────────────────────────
  // Dividend growth simulation (10 years)
  // ──────────────────────────────────────────

  const growthSimulation = useMemo(() => {
    const years: { year: number; dividend: number }[] = [];
    let div = activeDps;

    if (activeTab === 'gordon') {
      const gDec = gordon.g / 100;
      for (let y = 1; y <= 10; y++) {
        div = activeDps * Math.pow(1 + gDec, y);
        years.push({ year: y, dividend: div });
      }
    } else if (activeTab === 'twostage') {
      const g1Dec = twoStage.g1 / 100;
      const g2Dec = twoStage.g2 / 100;
      const n = twoStage.n;
      for (let y = 1; y <= 10; y++) {
        const rate = y <= n ? g1Dec : g2Dec;
        if (y <= n) {
          div = activeDps * Math.pow(1 + g1Dec, y);
        } else {
          const divAtN = activeDps * Math.pow(1 + g1Dec, n);
          div = divAtN * Math.pow(1 + g2Dec, y - n);
        }
        years.push({ year: y, dividend: div });
      }
    } else {
      // H-Model: linear fade from ga to gn over 2H years
      const gaDec = hModel.ga / 100;
      const gnDec = hModel.gn / 100;
      const halfLife = hModel.H;
      const fadeYears = 2 * halfLife;
      div = activeDps;
      for (let y = 1; y <= 10; y++) {
        const t = y;
        const rate = t < fadeYears
          ? gaDec - (gaDec - gnDec) * (t / fadeYears)
          : gnDec;
        div = div * (1 + rate);
        years.push({ year: y, dividend: div });
      }
    }

    return years;
  }, [activeTab, activeDps, gordon, twoStage, hModel]);

  // ──────────────────────────────────────────
  // Validation flag
  // ──────────────────────────────────────────

  const validationError = useMemo(() => {
    if (activeTab === 'gordon' && gordon.ke <= gordon.g) {
      return `요구수익률(${gordon.ke}%)이 성장률(${gordon.g}%)보다 커야 합니다.`;
    }
    if (activeTab === 'twostage' && twoStage.ke <= twoStage.g2) {
      return `요구수익률(${twoStage.ke}%)이 영구성장률(${twoStage.g2}%)보다 커야 합니다.`;
    }
    if (activeTab === 'hmodel' && hModel.ke <= hModel.gn) {
      return `요구수익률(${hModel.ke}%)이 안정성장률(${hModel.gn}%)보다 커야 합니다.`;
    }
    return null;
  }, [activeTab, gordon, twoStage, hModel]);

  // ──────────────────────────────────────────
  // Render helpers
  // ──────────────────────────────────────────

  const renderInput = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    opts?: { step?: number; suffix?: string; hint?: string },
  ) => (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type="number"
        step={opts?.step ?? 0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        style={styles.input}
      />
      {opts?.hint && <span style={styles.hint}>{opts.hint}</span>}
    </div>
  );

  // ──────────────────────────────────────────
  // Tab content
  // ──────────────────────────────────────────

  const renderGordon = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      {renderInput('현재 배당금 DPS (원)', gordon.dps, v => setGordon({ ...gordon, dps: v }), { step: 100, hint: '직전 연간 주당 배당금' })}
      {renderInput('배당 성장률 g (%)', gordon.g, v => setGordon({ ...gordon, g: v }), { hint: '기대 영구 성장률' })}
      {renderInput('요구수익률 Ke (%)', gordon.ke, v => setGordon({ ...gordon, ke: v }), { hint: 'CAPM 기반 자기자본비용' })}
    </div>
  );

  const renderTwoStage = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
      {renderInput('현재 배당금 DPS (원)', twoStage.dps, v => setTwoStage({ ...twoStage, dps: v }), { step: 100 })}
      {renderInput('1단계 성장률 g1 (%)', twoStage.g1, v => setTwoStage({ ...twoStage, g1: v }), { hint: '고성장 구간' })}
      {renderInput('1단계 기간 n (년)', twoStage.n, v => setTwoStage({ ...twoStage, n: Math.max(1, Math.round(v)) }), { step: 1, hint: '고성장 지속 연수' })}
      {renderInput('2단계 성장률 g2 (%)', twoStage.g2, v => setTwoStage({ ...twoStage, g2: v }), { hint: '영구 성장률' })}
      {renderInput('요구수익률 Ke (%)', twoStage.ke, v => setTwoStage({ ...twoStage, ke: v }))}
    </div>
  );

  const renderHModel = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
      {renderInput('현재 배당금 DPS (원)', hModel.dps, v => setHModel({ ...hModel, dps: v }), { step: 100 })}
      {renderInput('초기 성장률 ga (%)', hModel.ga, v => setHModel({ ...hModel, ga: v }), { hint: '초기 고성장률' })}
      {renderInput('안정 성장률 gn (%)', hModel.gn, v => setHModel({ ...hModel, gn: v }), { hint: '장기 안정 성장률' })}
      {renderInput('반감기 H (년)', hModel.H, v => setHModel({ ...hModel, H: Math.max(1, Math.round(v)) }), { step: 1, hint: '성장률 반감 시점' })}
      {renderInput('요구수익률 Ke (%)', hModel.ke, v => setHModel({ ...hModel, ke: v }))}
    </div>
  );

  // ──────────────────────────────────────────
  // Main render
  // ──────────────────────────────────────────

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>배당할인모델 (DDM) 계산기</h2>
      </div>

      {/* Preset selector */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: '500', marginRight: '0.5rem' }}>프리셋 기업:</label>
        <select
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            if (!isNaN(idx) && PRESETS[idx]) applyPreset(PRESETS[idx]);
          }}
          defaultValue=""
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled>기업 선택...</option>
          {PRESETS.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name} (DPS {p.dps.toLocaleString()}원, g {p.g}%, Ke {p.ke}%)
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <button style={styles.tab(activeTab === 'gordon')} onClick={() => setActiveTab('gordon')}>
          Gordon Growth (단일 성장률)
        </button>
        <button style={styles.tab(activeTab === 'twostage')} onClick={() => setActiveTab('twostage')}>
          2단계 DDM
        </button>
        <button style={styles.tab(activeTab === 'hmodel')} onClick={() => setActiveTab('hmodel')}>
          H-Model
        </button>
      </div>

      {/* Tab inputs */}
      <div style={{ marginBottom: '1.5rem' }}>
        {activeTab === 'gordon' && renderGordon()}
        {activeTab === 'twostage' && renderTwoStage()}
        {activeTab === 'hmodel' && renderHModel()}
      </div>

      {/* Formula display */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.375rem', marginTop: 0 }}>적용 공식</h4>
        {activeTab === 'gordon' && (
          <code style={{ display: 'block', fontSize: '0.8125rem', color: '#475569' }}>
            P = DPS x (1 + g) / (Ke - g) = {gordon.dps.toLocaleString()} x (1 + {gordon.g}%) / ({gordon.ke}% - {gordon.g}%)
          </code>
        )}
        {activeTab === 'twostage' && (
          <>
            <code style={{ display: 'block', fontSize: '0.8125rem', color: '#475569' }}>
              P = SUM[ DPS x (1+g1)^t / (1+Ke)^t ] + TV_n / (1+Ke)^n
            </code>
            <code style={{ display: 'block', fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>
              TV_n = DPS_n x (1+g2) / (Ke - g2)
            </code>
          </>
        )}
        {activeTab === 'hmodel' && (
          <code style={{ display: 'block', fontSize: '0.8125rem', color: '#475569' }}>
            P = DPS x (1+gn) / (Ke-gn) + DPS x H x (ga-gn) / (Ke-gn)
          </code>
        )}
      </div>

      {/* Validation warning */}
      {validationError && (
        <div style={styles.warningBox}>
          <span>&#9888;&#65039;</span>
          <span style={{ color: '#b91c1c', fontSize: '0.875rem' }}>{validationError}</span>
        </div>
      )}

      {/* ──── Result cards ──── */}
      {activeResult && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {/* 내재가치 */}
            <div style={styles.card('linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)')}>
              <p style={styles.cardLabel('#15803d')}>내재가치</p>
              <p style={styles.cardValue}>{formatWon(activeResult.intrinsic)}</p>
            </div>

            {/* 배당수익률 */}
            <div style={styles.card('linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)')}>
              <p style={styles.cardLabel('#1d4ed8')}>배당수익률</p>
              <p style={styles.cardValue}>{(activeResult.dividendYield * 100).toFixed(2)}%</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>DPS / 내재가치</p>
            </div>

            {/* TV 비중 (only for two-stage) */}
            {activeTab === 'twostage' && twoStageResult && (
              <div style={styles.card('linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)')}>
                <p style={styles.cardLabel('#b45309')}>TV 비중</p>
                <p style={styles.cardValue}>{(twoStageResult.tvWeight * 100).toFixed(1)}%</p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  PV(TV) / 총 내재가치
                </p>
              </div>
            )}

            {/* H-Model breakdown */}
            {activeTab === 'hmodel' && hModelResult && (
              <>
                <div style={styles.card('linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)')}>
                  <p style={styles.cardLabel('#7c3aed')}>안정가치 비중</p>
                  <p style={styles.cardValue}>
                    {((hModelResult.stableComponent / hModelResult.intrinsic) * 100).toFixed(1)}%
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    안정성장 구성요소
                  </p>
                </div>
              </>
            )}
          </div>

          {/* ──── Two-stage detail table ──── */}
          {activeTab === 'twostage' && twoStageResult && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>2단계 DDM 상세</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>항목</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>배당금</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>현재가치</th>
                    </tr>
                  </thead>
                  <tbody>
                    {twoStageResult.stage1Dividends.map(d => (
                      <tr key={d.year}>
                        <td style={{ padding: '0.375rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>Year {d.year} (g1={twoStage.g1}%)</td>
                        <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatWon(d.dividend)}</td>
                        <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatWon(d.pv)}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <td style={{ padding: '0.375rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>1단계 PV 합계</td>
                      <td style={{ padding: '0.375rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}></td>
                      <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '600' }}>{formatWon(twoStageResult.pvStage1)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.375rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>터미널 가치 (TV)</td>
                      <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatWon(twoStageResult.terminalValue)}</td>
                      <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatWon(twoStageResult.pvTerminal)}</td>
                    </tr>
                    <tr style={{ fontWeight: 'bold', backgroundColor: '#f0fdf4' }}>
                      <td style={{ padding: '0.375rem 0.75rem' }}>총 내재가치</td>
                      <td style={{ padding: '0.375rem 0.75rem' }}></td>
                      <td style={{ padding: '0.375rem 0.75rem', textAlign: 'right' }}>{formatWon(twoStageResult.intrinsic)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ──── H-Model detail ──── */}
          {activeTab === 'hmodel' && hModelResult && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>H-Model 구성요소</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>안정 성장 구성요소</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>DPS x (1+gn) / (Ke-gn)</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{formatWon(hModelResult.stableComponent)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>성장 프리미엄</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>DPS x H x (ga-gn) / (Ke-gn)</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{formatWon(hModelResult.growthPremium)}</td>
                  </tr>
                  <tr style={{ fontWeight: 'bold', backgroundColor: '#f0fdf4' }}>
                    <td style={{ padding: '0.5rem 0.75rem' }}>총 내재가치</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}></td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>{formatWon(hModelResult.intrinsic)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* ──── Sensitivity table ──── */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>민감도 분석</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              요구수익률(Ke)과 성장률(g) 변화에 따른 내재가치 (원) &mdash; Gordon Growth 기준
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ ...styles.thCell, textAlign: 'left' }}>Ke \ g</th>
                    {sensitivityData.gValues.map(g => (
                      <th key={g} style={styles.thCell}>{g.toFixed(1)}%</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sensitivityData.rows.map((row, ri) => {
                    const isBaseRow = row.ke === activeKe;
                    return (
                      <tr key={row.ke} style={{ backgroundColor: isBaseRow ? '#eff6ff' : 'transparent' }}>
                        <td style={{ ...styles.tdCell, textAlign: 'left', fontWeight: '500' }}>{row.ke.toFixed(1)}%</td>
                        {row.cells.map((cell, ci) => {
                          const isBaseCell = isBaseRow && sensitivityData.gValues[ci] === activeG;
                          return (
                            <td
                              key={ci}
                              style={{
                                ...styles.tdCell,
                                backgroundColor: isBaseCell ? '#dbeafe' : 'transparent',
                                fontWeight: isBaseCell ? 'bold' : 'normal',
                              }}
                            >
                              {typeof cell === 'number' ? formatNumber(cell) : cell}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ──── Dividend growth simulation ──── */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>배당 성장 시뮬레이션</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              향후 10년간 예상 주당 배당금 (DPS) 추이
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ ...styles.thCell, textAlign: 'left' }}>연도</th>
                    <th style={{ ...styles.thCell, textAlign: 'left' }}>현재</th>
                    {growthSimulation.map(row => (
                      <th key={row.year} style={styles.thCell}>+{row.year}년</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...styles.tdCell, textAlign: 'left', fontWeight: '500' }}>DPS (원)</td>
                    <td style={{ ...styles.tdCell, textAlign: 'left', fontWeight: '500' }}>{formatNumber(activeDps)}</td>
                    {growthSimulation.map(row => (
                      <td key={row.year} style={styles.tdCell}>{formatNumber(row.dividend)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td style={{ ...styles.tdCell, textAlign: 'left', fontWeight: '500' }}>성장률</td>
                    <td style={{ ...styles.tdCell, textAlign: 'left' }}>-</td>
                    {growthSimulation.map((row, i) => {
                      const prevDiv = i === 0 ? activeDps : growthSimulation[i - 1].dividend;
                      const yoyGrowth = prevDiv > 0 ? ((row.dividend / prevDiv - 1) * 100) : 0;
                      return (
                        <td key={row.year} style={{ ...styles.tdCell, fontSize: '0.75rem', color: '#6b7280' }}>
                          {yoyGrowth.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DDMCalculator;
