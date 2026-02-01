import React, { useState, useMemo } from 'react';

interface StepData {
  revenue: number;
  revenueGrowth: number;
  operatingMargin: number;
  taxRate: number;
  capexRatio: number;
  nwcChange: number;
  daRatio: number;
  wacc: number;
  terminalGrowth: number;
  sharesOutstanding: number;
  netDebt: number;
}

const defaultData: StepData = {
  revenue: 0,
  revenueGrowth: 5,
  operatingMargin: 15,
  taxRate: 22,
  capexRatio: 5,
  nwcChange: 1,
  daRatio: 4,
  wacc: 10,
  terminalGrowth: 2,
  sharesOutstanding: 100,
  netDebt: 0,
};

const presets: Record<string, { name: string; data: Partial<StepData> }> = {
  samsung: {
    name: '삼성전자 (예시)',
    data: {
      revenue: 2589000, revenueGrowth: 8, operatingMargin: 18, taxRate: 22,
      capexRatio: 12, nwcChange: 2, daRatio: 8, wacc: 9.5, terminalGrowth: 2,
      sharesOutstanding: 59269, netDebt: -100000,
    },
  },
  hyundai: {
    name: '현대자동차 (예시)',
    data: {
      revenue: 1627000, revenueGrowth: 5, operatingMargin: 9, taxRate: 22,
      capexRatio: 6, nwcChange: 3, daRatio: 5, wacc: 10, terminalGrowth: 2,
      sharesOutstanding: 2136, netDebt: 20000,
    },
  },
  custom: { name: '직접 입력', data: {} },
};

const steps = [
  {
    title: 'Step 1: 매출액 추정',
    desc: '분석 대상 기업의 직전 연도 매출액(억원)과 향후 5년간 예상 매출 성장률을 입력합니다. 성장률은 과거 3-5년 평균 성장률, 산업 전망, 경쟁 구도를 고려하여 보수적으로 추정합니다.',
    fields: [
      { key: 'revenue', label: '직전 연도 매출액 (억원)', min: 0, max: 100000000, step: 100 },
      { key: 'revenueGrowth', label: '연간 매출 성장률 (%)', min: -20, max: 50, step: 0.5 },
    ],
  },
  {
    title: 'Step 2: 수익성 가정',
    desc: '영업이익률은 기업의 수익 창출 능력을 나타냅니다. 과거 추이, 경쟁사 비교, 규모의 경제 효과를 고려하세요. 법인세율은 한국 기준 22% (과세표준 200억 초과 시 25%)가 일반적입니다.',
    fields: [
      { key: 'operatingMargin', label: '영업이익률 (%)', min: -10, max: 60, step: 0.5 },
      { key: 'taxRate', label: '법인세율 (%)', min: 0, max: 40, step: 1 },
    ],
  },
  {
    title: 'Step 3: 투자 및 운전자본',
    desc: 'CAPEX 비율은 매출 대비 설비투자 비중입니다. 제조업은 5-15%, IT는 2-5%가 일반적입니다. 감가상각비 비율은 CAPEX의 상당 부분을 상쇄합니다. 순운전자본 변동은 매출 증가에 따른 추가 운전자본 소요입니다.',
    fields: [
      { key: 'capexRatio', label: 'CAPEX / 매출 (%)', min: 0, max: 30, step: 0.5 },
      { key: 'daRatio', label: '감가상각비 / 매출 (%)', min: 0, max: 20, step: 0.5 },
      { key: 'nwcChange', label: '순운전자본 변동 / 매출 (%)', min: -5, max: 10, step: 0.5 },
    ],
  },
  {
    title: 'Step 4: 할인율 (WACC)',
    desc: 'WACC는 기업의 자본비용으로, FCF를 현재가치로 할인하는 데 사용합니다. 한국 대기업 기준 8-12%가 일반적입니다. 높은 WACC → 보수적 밸류에이션, 낮은 WACC → 공격적 밸류에이션.',
    fields: [
      { key: 'wacc', label: 'WACC (%)', min: 3, max: 20, step: 0.5 },
    ],
  },
  {
    title: 'Step 5: 터미널 밸류',
    desc: '영구 성장률은 예측 기간 이후 기업이 영구적으로 성장하는 비율입니다. GDP 성장률(2-3%) 이하로 설정하는 것이 보수적입니다. 주식 수와 순차입금을 입력하면 주당 내재가치가 산출됩니다.',
    fields: [
      { key: 'terminalGrowth', label: '영구 성장률 (%)', min: 0, max: 5, step: 0.25 },
      { key: 'sharesOutstanding', label: '발행주식수 (만주)', min: 1, max: 10000000, step: 1 },
      { key: 'netDebt', label: '순차입금 (억원, 현금>부채면 음수)', min: -10000000, max: 10000000, step: 100 },
    ],
  },
];

function formatNum(n: number): string {
  if (Math.abs(n) >= 10000) return `${(n / 10000).toFixed(1)}조`;
  return `${n.toLocaleString()}억`;
}

export default function GuidedDCF(): JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<StepData>({ ...defaultData });
  const [selectedPreset, setSelectedPreset] = useState('custom');

  const handlePreset = (key: string) => {
    setSelectedPreset(key);
    if (key !== 'custom') {
      setData({ ...defaultData, ...presets[key].data });
    }
    setCurrentStep(0);
  };

  const updateField = (key: string, value: number) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  // DCF Calculation
  const result = useMemo(() => {
    const years = 5;
    const projections: { year: number; revenue: number; fcf: number; pvFcf: number }[] = [];
    let totalPvFcf = 0;

    for (let i = 1; i <= years; i++) {
      const rev = data.revenue * Math.pow(1 + data.revenueGrowth / 100, i);
      const ebit = rev * (data.operatingMargin / 100);
      const nopat = ebit * (1 - data.taxRate / 100);
      const da = rev * (data.daRatio / 100);
      const capex = rev * (data.capexRatio / 100);
      const nwc = rev * (data.nwcChange / 100);
      const fcf = nopat + da - capex - nwc;
      const pvFcf = fcf / Math.pow(1 + data.wacc / 100, i);
      totalPvFcf += pvFcf;
      projections.push({ year: i, revenue: Math.round(rev), fcf: Math.round(fcf), pvFcf: Math.round(pvFcf) });
    }

    const lastFcf = projections[years - 1]?.fcf || 0;
    const terminalValue = (lastFcf * (1 + data.terminalGrowth / 100)) / (data.wacc / 100 - data.terminalGrowth / 100);
    const pvTerminal = terminalValue / Math.pow(1 + data.wacc / 100, years);
    const enterpriseValue = totalPvFcf + pvTerminal;
    const equityValue = enterpriseValue - data.netDebt;
    const pricePerShare = data.sharesOutstanding > 0 ? (equityValue * 100000000) / (data.sharesOutstanding * 10000) : 0;

    return { projections, totalPvFcf, terminalValue, pvTerminal, enterpriseValue, equityValue, pricePerShare };
  }, [data]);

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Preset Selection */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>기업 선택</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(presets).map(([key, p]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: selectedPreset === key ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
                background: selectedPreset === key ? 'var(--ifm-color-primary-contrast-background)' : 'transparent',
                fontWeight: selectedPreset === key ? 700 : 400,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Step Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => setCurrentStep(i)}
            style={{
              flex: 1, height: 6, borderRadius: 3, cursor: 'pointer',
              background: i <= currentStep ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-200)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>

      {/* Step Content */}
      <div style={{
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
        background: 'var(--ifm-card-background-color, #fff)',
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{step.title}</h3>
        <p style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.7, margin: '0 0 20px' }}>
          {step.desc}
        </p>

        <div style={{ display: 'grid', gap: 16 }}>
          {step.fields.map((f) => (
            <div key={f.key}>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                {f.label}
              </label>
              <input
                type="number"
                value={data[f.key as keyof StepData]}
                onChange={(e) => updateField(f.key, parseFloat(e.target.value) || 0)}
                min={f.min}
                max={f.max}
                step={f.step}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid var(--ifm-color-emphasis-300)',
                  fontSize: 15, fontWeight: 600,
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            style={{
              padding: '10px 20px', borderRadius: 8,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'transparent', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 0 ? 0.4 : 1,
            }}
          >
            이전
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={isLastStep}
            style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: isLastStep ? 'var(--ifm-color-emphasis-300)' : 'var(--ifm-color-primary)',
              color: '#fff', fontWeight: 700, cursor: isLastStep ? 'not-allowed' : 'pointer',
            }}
          >
            {isLastStep ? '완료' : '다음'}
          </button>
        </div>
      </div>

      {/* Live Result Panel */}
      {data.revenue > 0 && (
        <div style={{
          border: '2px solid var(--ifm-color-primary)',
          borderRadius: 12,
          padding: 24,
          background: 'var(--ifm-color-primary-contrast-background)',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>DCF 밸류에이션 결과</h3>

          {/* FCF Projection Table */}
          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>연도</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>매출</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>FCF</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>PV(FCF)</th>
                </tr>
              </thead>
              <tbody>
                {result.projections.map((p) => (
                  <tr key={p.year} style={{ borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>
                    <td style={{ padding: '6px 8px' }}>Year {p.year}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{formatNum(p.revenue)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{formatNum(p.fcf)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{formatNum(p.pvFcf)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {[
              { label: 'PV(FCF) 합계', value: formatNum(Math.round(result.totalPvFcf)) },
              { label: 'PV(터미널밸류)', value: formatNum(Math.round(result.pvTerminal)) },
              { label: '기업가치 (EV)', value: formatNum(Math.round(result.enterpriseValue)) },
              { label: '주주가치', value: formatNum(Math.round(result.equityValue)) },
              { label: '주당 내재가치', value: `${Math.round(result.pricePerShare).toLocaleString()}원` },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: 12, borderRadius: 8, textAlign: 'center',
                  background: 'var(--ifm-card-background-color, #fff)',
                  border: '1px solid var(--ifm-color-emphasis-200)',
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ifm-color-primary)' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
