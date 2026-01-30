import React, { useState, useMemo } from 'react';

interface ROICInputs {
  revenue: number;
  ebit: number;
  taxRate: number;
  totalAssets: number;
  currentLiabilities: number;
  cash: number;
  wacc: number;
  shares: number;
}

interface PresetCompany {
  name: string;
  inputs: ROICInputs;
}

const PRESETS: PresetCompany[] = [
  {
    name: '삼성전자 (2023)',
    inputs: {
      revenue: 2589000,
      ebit: 66000,
      taxRate: 22,
      totalAssets: 4553000,
      currentLiabilities: 680000,
      cash: 650000,
      wacc: 9.5,
      shares: 5969.8,
    },
  },
  {
    name: 'SK하이닉스 (2023)',
    inputs: {
      revenue: 327000,
      ebit: -77000,
      taxRate: 22,
      totalAssets: 757000,
      currentLiabilities: 147000,
      cash: 47000,
      wacc: 10.2,
      shares: 728.0,
    },
  },
  {
    name: '현대차 (2023)',
    inputs: {
      revenue: 1627000,
      ebit: 151000,
      taxRate: 23,
      totalAssets: 2827000,
      currentLiabilities: 830000,
      cash: 130000,
      wacc: 9.0,
      shares: 210.7,
    },
  },
  {
    name: 'NAVER (2023)',
    inputs: {
      revenue: 97000,
      ebit: 15000,
      taxRate: 24,
      totalAssets: 261000,
      currentLiabilities: 63000,
      cash: 42000,
      wacc: 9.8,
      shares: 163.7,
    },
  },
  {
    name: 'LG에너지솔루션 (2023)',
    inputs: {
      revenue: 338000,
      ebit: 20000,
      taxRate: 22,
      totalAssets: 478000,
      currentLiabilities: 109000,
      cash: 55000,
      wacc: 10.0,
      shares: 234.0,
    },
  },
];

const DEFAULT_INPUTS: ROICInputs = {
  revenue: 2589000,
  ebit: 66000,
  taxRate: 22,
  totalAssets: 4553000,
  currentLiabilities: 680000,
  cash: 650000,
  wacc: 9.5,
  shares: 5969.8,
};

export const ROICCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROICInputs>(DEFAULT_INPUTS);
  const [selectedPreset, setSelectedPreset] = useState<string>('삼성전자 (2023)');

  const handleChange = (field: keyof ROICInputs, value: string) => {
    setInputs({ ...inputs, [field]: parseFloat(value) || 0 });
    setSelectedPreset('');
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedPreset(name);
    if (name === '') return;
    const preset = PRESETS.find((p) => p.name === name);
    if (preset) {
      setInputs({ ...preset.inputs });
    }
  };

  const result = useMemo(() => {
    const { revenue, ebit, taxRate, totalAssets, currentLiabilities, cash, wacc, shares } = inputs;
    const taxDecimal = taxRate / 100;
    const waccDecimal = wacc / 100;

    // Core calculations
    const nopat = ebit * (1 - taxDecimal);
    const investedCapital = totalAssets - currentLiabilities - cash;
    const roic = investedCapital !== 0 ? (nopat / investedCapital) * 100 : 0;
    const evaSpread = roic - wacc;
    const eva = (roic / 100 - waccDecimal) * investedCapital;

    // ROIC Tree
    const nopatMargin = revenue !== 0 ? (nopat / revenue) * 100 : 0;
    const capitalTurnover = investedCapital !== 0 ? revenue / investedCapital : 0;

    // EVA Valuation Bridge
    const pvEVA = waccDecimal > 0 ? eva / waccDecimal : 0;
    const firmValue = investedCapital + pvEVA;
    // Simplified: Net Debt = Total Assets - Invested Capital (rough proxy)
    // More precisely: Equity portion ~ Invested Capital (since IC = Assets - non-IB CL - Cash)
    // Firm Value = IC + PV(EVA), Equity Value ~ Firm Value + Cash - Debt
    // Simplified: Equity Value = Firm Value (since IC already excludes excess cash, add it back)
    const equityValue = firmValue + cash;
    const valuePerShare = shares > 0 ? equityValue / shares : 0;

    // Investment judgment
    let judgment: { label: string; sublabel: string; color: string; bgColor: string };
    if (evaSpread > 5) {
      judgment = { label: '탁월한 경쟁우위', sublabel: 'Outstanding Moat', color: '#065f46', bgColor: '#d1fae5' };
    } else if (evaSpread > 2) {
      judgment = { label: '양호한 경쟁우위', sublabel: 'Good Competitive Advantage', color: '#166534', bgColor: '#dcfce7' };
    } else if (evaSpread > 1) {
      judgment = { label: '소폭 가치 창출', sublabel: 'Marginal Value Creation', color: '#3b82f6', bgColor: '#dbeafe' };
    } else if (evaSpread >= -1) {
      judgment = { label: '자본비용 수준 (No Moat)', sublabel: 'Cost of Capital Level', color: '#92400e', bgColor: '#fef3c7' };
    } else {
      judgment = { label: '가치 파괴 (Value Destruction)', sublabel: 'ROIC < WACC', color: '#991b1b', bgColor: '#fee2e2' };
    }

    return {
      nopat,
      investedCapital,
      roic,
      eva,
      evaSpread,
      nopatMargin,
      capitalTurnover,
      pvEVA,
      firmValue,
      equityValue,
      valuePerShare,
      judgment,
    };
  }, [inputs]);

  const formatNumber = (num: number) => Math.round(num).toLocaleString();
  const formatDecimal = (num: number, digits: number = 2) => num.toFixed(digits);

  const isPositive = result.evaSpread > 0;

  return (
    <div className="calculator-container">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>ROIC / EVA 계산기</h2>
      </div>

      {/* Preset dropdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          프리셋 기업 선택
        </label>
        <select
          value={selectedPreset}
          onChange={handlePresetChange}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
          }}
        >
          <option value="">-- 직접 입력 --</option>
          {PRESETS.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Input section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* 손익 항목 */}
        <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e40af', marginBottom: '0.75rem' }}>
            손익 항목
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>매출액 (억원)</label>
              <input
                type="number"
                value={inputs.revenue}
                onChange={(e) => handleChange('revenue', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>영업이익 (EBIT, 억원)</label>
              <input
                type="number"
                value={inputs.ebit}
                onChange={(e) => handleChange('ebit', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>법인세율 (%)</label>
              <input
                type="number"
                step="1"
                value={inputs.taxRate}
                onChange={(e) => handleChange('taxRate', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #bfdbfe', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        </div>

        {/* 재무상태표 항목 */}
        <div style={{ backgroundColor: '#fffbeb', padding: '1rem', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#92400e', marginBottom: '0.75rem' }}>
            재무상태표 항목
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>총자산 (억원)</label>
              <input
                type="number"
                value={inputs.totalAssets}
                onChange={(e) => handleChange('totalAssets', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #fcd34d', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>유동부채 (비이자부, 억원)</label>
              <input
                type="number"
                value={inputs.currentLiabilities}
                onChange={(e) => handleChange('currentLiabilities', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #fcd34d', borderRadius: '0.5rem' }}
              />
              <p style={{ fontSize: '0.625rem', color: '#b45309', marginTop: '0.25rem' }}>매입채무, 미지급금 등</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>현금및현금성자산 (초과현금, 억원)</label>
              <input
                type="number"
                value={inputs.cash}
                onChange={(e) => handleChange('cash', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #fcd34d', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        </div>

        {/* 할인율 및 주식 */}
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
            할인율 / 주식수
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem' }}>WACC (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.wacc}
                onChange={(e) => handleChange('wacc', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#374151', marginBottom: '0.25rem' }}>발행주식수 (백만주)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.shares}
                onChange={(e) => handleChange('shares', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
          {/* IC summary */}
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}>
            <span style={{ fontSize: '0.8rem', color: '#374151' }}>
              투하자본(IC) = {formatNumber(inputs.totalAssets)} - {formatNumber(inputs.currentLiabilities)} - {formatNumber(inputs.cash)} ={' '}
              <strong>{formatNumber(result.investedCapital)}억원</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {/* ROIC card */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          padding: '1rem',
          borderRadius: '0.75rem',
          color: 'white',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#bfdbfe', marginBottom: '0.25rem' }}>ROIC</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>{formatDecimal(result.roic)}%</p>
          <p style={{ fontSize: '0.625rem', color: '#93c5fd', marginTop: '0.25rem' }}>투하자본수익률</p>
        </div>

        {/* WACC card */}
        <div style={{
          background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          padding: '1rem',
          borderRadius: '0.75rem',
          color: 'white',
        }}>
          <p style={{ fontSize: '0.75rem', color: '#d1d5db', marginBottom: '0.25rem' }}>WACC</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>{formatDecimal(inputs.wacc)}%</p>
          <p style={{ fontSize: '0.625rem', color: '#9ca3af', marginTop: '0.25rem' }}>가중평균자본비용</p>
        </div>

        {/* EVA Spread card */}
        <div style={{
          background: isPositive
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          padding: '1rem',
          borderRadius: '0.75rem',
          color: 'white',
        }}>
          <p style={{ fontSize: '0.75rem', color: isPositive ? '#a7f3d0' : '#fecaca', marginBottom: '0.25rem' }}>EVA Spread</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>
            {result.evaSpread > 0 ? '+' : ''}{formatDecimal(result.evaSpread)}%p
          </p>
          <p style={{ fontSize: '0.625rem', color: isPositive ? '#6ee7b7' : '#fca5a5', marginTop: '0.25rem' }}>ROIC - WACC</p>
        </div>

        {/* EVA card */}
        <div style={{
          background: result.eva >= 0
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
          padding: '1rem',
          borderRadius: '0.75rem',
          color: result.eva >= 0 ? '#166534' : '#991b1b',
        }}>
          <p style={{ fontSize: '0.75rem', color: result.eva >= 0 ? '#15803d' : '#b91c1c', marginBottom: '0.25rem' }}>EVA</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{formatNumber(result.eva)}억원</p>
          <p style={{ fontSize: '0.625rem', color: result.eva >= 0 ? '#22c55e' : '#ef4444', marginTop: '0.25rem' }}>경제적부가가치</p>
        </div>
      </div>

      {/* ROIC vs WACC comparison bar */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>ROIC vs WACC 비교</h3>
        <div style={{ position: 'relative', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', padding: '1rem' }}>
          {(() => {
            const maxVal = Math.max(Math.abs(result.roic), inputs.wacc, 1);
            const roicWidth = Math.min(Math.abs(result.roic) / maxVal * 100, 100);
            const waccWidth = Math.min(inputs.wacc / maxVal * 100, 100);
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '500' }}>ROIC</span>
                    <span style={{ fontWeight: '600', color: result.roic >= 0 ? '#1d4ed8' : '#dc2626' }}>{formatDecimal(result.roic)}%</span>
                  </div>
                  <div style={{ height: '1.5rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{
                      width: `${roicWidth}%`,
                      height: '100%',
                      background: result.roic >= 0
                        ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                        : 'linear-gradient(90deg, #ef4444, #dc2626)',
                      borderRadius: '0.375rem',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '500' }}>WACC</span>
                    <span style={{ fontWeight: '600', color: '#6b7280' }}>{formatDecimal(inputs.wacc)}%</span>
                  </div>
                  <div style={{ height: '1.5rem', backgroundColor: '#e5e7eb', borderRadius: '0.375rem', overflow: 'hidden' }}>
                    <div style={{
                      width: `${waccWidth}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #9ca3af, #6b7280)',
                      borderRadius: '0.375rem',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ROIC Tree Decomposition */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>ROIC 트리 분해 (DuPont Decomposition)</h3>
        <div style={{
          backgroundColor: isPositive ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${isPositive ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: '0.75rem',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '1rem' }}>
            {/* NOPAT Margin */}
            <div style={{ textAlign: 'center', padding: '0.75rem 1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', minWidth: '120px' }}>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.25rem' }}>NOPAT Margin</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1d4ed8', margin: 0 }}>{formatDecimal(result.nopatMargin)}%</p>
              <p style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '0.25rem' }}>NOPAT / 매출액</p>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280' }}>x</span>

            {/* Capital Turnover */}
            <div style={{ textAlign: 'center', padding: '0.75rem 1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb', minWidth: '120px' }}>
              <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.25rem' }}>Capital Turnover</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>{formatDecimal(result.capitalTurnover)}x</p>
              <p style={{ fontSize: '0.6rem', color: '#9ca3af', marginTop: '0.25rem' }}>매출액 / 투하자본</p>
            </div>

            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6b7280' }}>=</span>

            {/* ROIC */}
            <div style={{
              textAlign: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
              borderRadius: '0.5rem',
              border: `2px solid ${isPositive ? '#22c55e' : '#ef4444'}`,
              minWidth: '120px',
            }}>
              <p style={{ fontSize: '0.7rem', color: isPositive ? '#166534' : '#991b1b', marginBottom: '0.25rem' }}>ROIC</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isPositive ? '#166534' : '#991b1b', margin: 0 }}>{formatDecimal(result.roic)}%</p>
              <p style={{ fontSize: '0.6rem', color: isPositive ? '#15803d' : '#b91c1c', marginTop: '0.25rem' }}>
                {isPositive ? '가치 창출' : '가치 파괴'}
              </p>
            </div>
          </div>

          {/* Detail formula */}
          <div style={{ marginTop: '1rem', padding: '0.5rem 0.75rem', backgroundColor: 'white', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
            <code style={{ fontSize: '0.75rem', color: '#475569' }}>
              NOPAT = {formatNumber(inputs.ebit)} x (1 - {inputs.taxRate}%) = {formatNumber(result.nopat)}억원
            </code>
            <br />
            <code style={{ fontSize: '0.75rem', color: '#475569' }}>
              IC = {formatNumber(inputs.totalAssets)} - {formatNumber(inputs.currentLiabilities)} - {formatNumber(inputs.cash)} = {formatNumber(result.investedCapital)}억원
            </code>
          </div>
        </div>
      </div>

      {/* Investment Judgment Box */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>투자 판단</h3>
        <div style={{
          backgroundColor: result.judgment.bgColor,
          border: `2px solid ${result.judgment.color}`,
          borderRadius: '0.75rem',
          padding: '1.25rem',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: result.judgment.color, margin: 0 }}>
            {result.judgment.label}
          </p>
          <p style={{ fontSize: '0.875rem', color: result.judgment.color, marginTop: '0.25rem', opacity: 0.8 }}>
            {result.judgment.sublabel}
          </p>
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            fontSize: '0.875rem',
            color: result.judgment.color,
          }}>
            <span>ROIC: <strong>{formatDecimal(result.roic)}%</strong></span>
            <span>WACC: <strong>{formatDecimal(inputs.wacc)}%</strong></span>
            <span>Spread: <strong>{result.evaSpread > 0 ? '+' : ''}{formatDecimal(result.evaSpread)}%p</strong></span>
          </div>
          {/* Judgment scale */}
          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#6b7280' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '500px', margin: '0 auto' }}>
              <span style={{ color: '#991b1b' }}>가치 파괴</span>
              <span style={{ color: '#92400e' }}>No Moat</span>
              <span style={{ color: '#3b82f6' }}>소폭 창출</span>
              <span style={{ color: '#166534' }}>양호</span>
              <span style={{ color: '#065f46' }}>탁월</span>
            </div>
            <div style={{ position: 'relative', height: '8px', background: 'linear-gradient(90deg, #ef4444, #f59e0b, #3b82f6, #22c55e, #059669)', borderRadius: '4px', maxWidth: '500px', margin: '0.25rem auto 0' }}>
              {(() => {
                // Place marker: map spread to 0-100% range. -10 -> 0%, 0 -> 30%, +5 -> 80%, +10 -> 100%
                const clampedSpread = Math.max(-10, Math.min(10, result.evaSpread));
                const pct = ((clampedSpread + 10) / 20) * 100;
                return (
                  <div style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '-4px',
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'white',
                    border: '3px solid #1f2937',
                    borderRadius: '50%',
                  }} />
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* EVA Valuation Bridge */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>EVA 기업가치 Bridge</h3>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontSize: '0.875rem' }}>항목</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid #cbd5e1', fontSize: '0.875rem' }}>금액 (억원)</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #cbd5e1', fontSize: '0.875rem' }}>산출 근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>투하자본 (IC)</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{formatNumber(result.investedCapital)}</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>총자산 - 비이자부 유동부채 - 초과현금</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>EVA (연간)</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500', color: result.eva >= 0 ? '#166534' : '#991b1b' }}>{formatNumber(result.eva)}</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>(ROIC - WACC) x IC</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>(+) PV(EVA) 영구가치</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500', color: result.pvEVA >= 0 ? '#166534' : '#991b1b' }}>{formatNumber(result.pvEVA)}</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>EVA / WACC (영구가치 가정)</td>
              </tr>
              <tr style={{ fontWeight: '600' }}>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>= 기업가치 (Firm Value)</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.firmValue)}</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>IC + PV(EVA)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>(+) 초과현금</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{formatNumber(inputs.cash)}</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}>영업에 불필요한 현금</td>
              </tr>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f0fdf4' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>= 자기자본가치 (Equity Value)</td>
                <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(result.equityValue)}</td>
                <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Firm Value + 초과현금</td>
              </tr>
              <tr>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>(/) 발행주식수</td>
                <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>{inputs.shares.toLocaleString()}백만주</td>
                <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280' }}></td>
              </tr>
              <tr style={{ fontWeight: 'bold', backgroundColor: '#eff6ff' }}>
                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>= 주당 가치</td>
                <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '1.125rem', color: '#1d4ed8' }}>{formatNumber(result.valuePerShare)}원</td>
                <td style={{ padding: '0.75rem', fontSize: '0.75rem', color: '#6b7280' }}>Equity Value / 주식수</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula reference */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>주요 공식</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>NOPAT = EBIT x (1 - Tax Rate)</code>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>투하자본(IC) = 총자산 - 비이자부 유동부채 - 초과현금</code>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>ROIC = NOPAT / IC</code>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>EVA = (ROIC - WACC) x IC</code>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>ROIC = NOPAT Margin x Capital Turnover</code>
          <code style={{ fontSize: '0.75rem', color: '#475569' }}>Firm Value = IC + EVA / WACC (perpetuity)</code>
        </div>
      </div>
    </div>
  );
};

export default ROICCalculator;
