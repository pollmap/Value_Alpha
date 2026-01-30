import React, { useState, useMemo } from 'react';

interface DuPontInputs {
  revenue: number;
  netIncome: number;
  totalAssets: number;
  equity: number;
  ebt: number;
  ebit: number;
}

interface PresetCompany {
  name: string;
  industry: string;
  data: DuPontInputs;
}

interface IndustryBenchmark {
  label: string;
  netMargin: [number, number];
  assetTurnover: [number, number];
  leverage: [number, number];
}

const PRESETS: PresetCompany[] = [
  {
    name: '삼성전자 (2023)',
    industry: 'IT/반도체',
    data: { revenue: 258.9, netIncome: 15.5, totalAssets: 455.3, equity: 341.3, ebt: 8.5, ebit: 6.6 },
  },
  {
    name: 'NAVER (2023)',
    industry: '플랫폼',
    data: { revenue: 9.7, netIncome: 1.6, totalAssets: 26.1, equity: 17.5, ebt: 1.8, ebit: 1.5 },
  },
  {
    name: 'KB금융 (2023)',
    industry: '금융',
    data: { revenue: 44.8, netIncome: 4.4, totalAssets: 686.9, equity: 47.8, ebt: 5.7, ebit: 5.9 },
  },
  {
    name: '현대차 (2023)',
    industry: '제조업',
    data: { revenue: 162.7, netIncome: 12.3, totalAssets: 282.7, equity: 113.4, ebt: 16.1, ebit: 15.1 },
  },
];

const BENCHMARKS: IndustryBenchmark[] = [
  { label: 'IT/반도체', netMargin: [15, 25], assetTurnover: [0.5, 0.8], leverage: [1.2, 1.5] },
  { label: '제조업', netMargin: [3, 8], assetTurnover: [0.8, 1.2], leverage: [1.8, 2.5] },
  { label: '금융', netMargin: [15, 25], assetTurnover: [0.02, 0.05], leverage: [8, 15] },
  { label: '유통', netMargin: [1, 3], assetTurnover: [1.5, 3.0], leverage: [2.0, 3.0] },
  { label: '플랫폼', netMargin: [15, 30], assetTurnover: [0.4, 0.7], leverage: [1.1, 1.4] },
];

const DEFAULT_INPUTS: DuPontInputs = {
  revenue: 258.9,
  netIncome: 15.5,
  totalAssets: 455.3,
  equity: 341.3,
  ebt: 8.5,
  ebit: 6.6,
};

export const DuPontCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DuPontInputs>(DEFAULT_INPUTS);
  const [mode, setMode] = useState<'3factor' | '5factor'>('3factor');
  const [selectedPreset, setSelectedPreset] = useState<string>('삼성전자 (2023)');

  // 3-Factor 계산
  const threeFactorResult = useMemo(() => {
    const { revenue, netIncome, totalAssets, equity } = inputs;
    if (revenue === 0 || totalAssets === 0 || equity === 0) return null;

    const netProfitMargin = netIncome / revenue;
    const assetTurnover = revenue / totalAssets;
    const equityMultiplier = totalAssets / equity;
    const roe = netProfitMargin * assetTurnover * equityMultiplier;

    return { netProfitMargin, assetTurnover, equityMultiplier, roe };
  }, [inputs]);

  // 5-Factor 계산
  const fiveFactorResult = useMemo(() => {
    const { revenue, netIncome, totalAssets, equity, ebt, ebit } = inputs;
    if (revenue === 0 || totalAssets === 0 || equity === 0 || ebt === 0 || ebit === 0) return null;

    const taxBurden = netIncome / ebt;
    const interestBurden = ebt / ebit;
    const operatingMargin = ebit / revenue;
    const assetTurnover = revenue / totalAssets;
    const equityMultiplier = totalAssets / equity;
    const roe = taxBurden * interestBurden * operatingMargin * assetTurnover * equityMultiplier;

    return { taxBurden, interestBurden, operatingMargin, assetTurnover, equityMultiplier, roe };
  }, [inputs]);

  const handleChange = (field: keyof DuPontInputs, value: string) => {
    setInputs({ ...inputs, [field]: parseFloat(value) || 0 });
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setInputs(preset.data);
    }
  };

  const formatPercent = (num: number) => (num * 100).toFixed(2);
  const formatTimes = (num: number) => num.toFixed(2);

  // 벤치마크에서 위치를 퍼센트로 계산 (범위 대비)
  const getBenchmarkPosition = (value: number, range: [number, number]): number => {
    const rangeWidth = range[1] - range[0];
    const extendedMin = range[0] - rangeWidth * 0.5;
    const extendedMax = range[1] + rangeWidth * 0.5;
    const pos = ((value - extendedMin) / (extendedMax - extendedMin)) * 100;
    return Math.min(Math.max(pos, 2), 98);
  };

  const getBenchmarkColor = (value: number, range: [number, number]): string => {
    if (value >= range[0] && value <= range[1]) return '#10b981';
    if (value < range[0]) return '#f59e0b';
    return '#ef4444';
  };

  // 워터폴 차트용 데이터
  const waterfallData = useMemo(() => {
    if (mode === '3factor' && threeFactorResult) {
      const { netProfitMargin, assetTurnover, equityMultiplier } = threeFactorResult;
      return [
        { label: '순이익률', value: netProfitMargin * 100, color: '#3b82f6' },
        { label: '자산회전율', value: assetTurnover, color: '#10b981' },
        { label: '레버리지', value: equityMultiplier, color: '#8b5cf6' },
      ];
    }
    if (mode === '5factor' && fiveFactorResult) {
      const { taxBurden, interestBurden, operatingMargin, assetTurnover, equityMultiplier } = fiveFactorResult;
      return [
        { label: '세금부담률', value: taxBurden * 100, color: '#ef4444' },
        { label: '이자부담률', value: interestBurden * 100, color: '#f59e0b' },
        { label: '영업이익률', value: operatingMargin * 100, color: '#3b82f6' },
        { label: '자산회전율', value: assetTurnover, color: '#10b981' },
        { label: '레버리지', value: equityMultiplier, color: '#8b5cf6' },
      ];
    }
    return [];
  }, [mode, threeFactorResult, fiveFactorResult]);

  const maxWaterfallValue = useMemo(() => {
    if (waterfallData.length === 0) return 1;
    return Math.max(...waterfallData.map(d => Math.abs(d.value)));
  }, [waterfallData]);

  return (
    <div className="calculator-container">
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>듀퐁 분석 (DuPont Decomposition) 계산기</h2>
      </div>

      {/* 프리셋 선택 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
          기업 프리셋 선택
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            backgroundColor: 'white',
          }}
        >
          {PRESETS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({p.industry})
            </option>
          ))}
        </select>
      </div>

      {/* 모드 탭 */}
      <div style={{ display: 'flex', marginBottom: '1.5rem', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #d1d5db' }}>
        <button
          onClick={() => setMode('3factor')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            backgroundColor: mode === '3factor' ? '#2563eb' : '#f3f4f6',
            color: mode === '3factor' ? 'white' : '#374151',
            transition: 'all 0.2s',
          }}
        >
          3-Factor 분석
        </button>
        <button
          onClick={() => setMode('5factor')}
          style={{
            flex: 1,
            padding: '0.75rem',
            border: 'none',
            borderLeft: '1px solid #d1d5db',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.875rem',
            backgroundColor: mode === '5factor' ? '#2563eb' : '#f3f4f6',
            color: mode === '5factor' ? 'white' : '#374151',
            transition: 'all 0.2s',
          }}
        >
          5-Factor 분석
        </button>
      </div>

      {/* 입력 섹션 */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>재무 데이터 입력 (단위: 조원)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>매출액</label>
            <input
              type="number"
              step="0.1"
              value={inputs.revenue}
              onChange={(e) => handleChange('revenue', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>순이익</label>
            <input
              type="number"
              step="0.1"
              value={inputs.netIncome}
              onChange={(e) => handleChange('netIncome', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>총자산</label>
            <input
              type="number"
              step="0.1"
              value={inputs.totalAssets}
              onChange={(e) => handleChange('totalAssets', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>자기자본</label>
            <input
              type="number"
              step="0.1"
              value={inputs.equity}
              onChange={(e) => handleChange('equity', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
            />
          </div>
          {mode === '5factor' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>세전이익 (EBT)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.ebt}
                  onChange={(e) => handleChange('ebt', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>영업이익 (EBIT)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.ebit}
                  onChange={(e) => handleChange('ebit', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3-Factor 결과 */}
      {mode === '3factor' && threeFactorResult && (
        <>
          {/* 결과 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1d4ed8', marginBottom: '0.25rem' }}>순이익률</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatPercent(threeFactorResult.netProfitMargin)}%</p>
              <p style={{ fontSize: '0.75rem', color: '#3b82f6', marginTop: '0.25rem' }}>순이익 / 매출액</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.25rem' }}>총자산회전율</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTimes(threeFactorResult.assetTurnover)}x</p>
              <p style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.25rem' }}>매출액 / 총자산</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', marginBottom: '0.25rem' }}>재무레버리지</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatTimes(threeFactorResult.equityMultiplier)}x</p>
              <p style={{ fontSize: '0.75rem', color: '#8b5cf6', marginTop: '0.25rem' }}>총자산 / 자기자본</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#b45309', marginBottom: '0.25rem' }}>ROE</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatPercent(threeFactorResult.roe)}%</p>
              <p style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '0.25rem' }}>3요소의 곱</p>
            </div>
          </div>

          {/* 수식 표시 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>3-Factor DuPont 공식</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#475569', textAlign: 'center', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}>
              ROE = 순이익률 x 자산회전율 x 재무레버리지
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
              {formatPercent(threeFactorResult.netProfitMargin)}% x {formatTimes(threeFactorResult.assetTurnover)} x {formatTimes(threeFactorResult.equityMultiplier)} = {formatPercent(threeFactorResult.roe)}%
            </div>
          </div>
        </>
      )}

      {/* 5-Factor 결과 */}
      {mode === '5factor' && fiveFactorResult && (
        <>
          {/* 결과 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#b91c1c', marginBottom: '0.25rem' }}>세금부담률</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formatPercent(fiveFactorResult.taxBurden)}%</p>
              <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem' }}>순이익 / 세전이익</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fde68a 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#92400e', marginBottom: '0.25rem' }}>이자부담률</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formatPercent(fiveFactorResult.interestBurden)}%</p>
              <p style={{ fontSize: '0.7rem', color: '#b45309', marginTop: '0.25rem' }}>세전이익 / 영업이익</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#1d4ed8', marginBottom: '0.25rem' }}>영업이익률</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formatPercent(fiveFactorResult.operatingMargin)}%</p>
              <p style={{ fontSize: '0.7rem', color: '#3b82f6', marginTop: '0.25rem' }}>영업이익 / 매출액</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#15803d', marginBottom: '0.25rem' }}>총자산회전율</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formatTimes(fiveFactorResult.assetTurnover)}x</p>
              <p style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: '0.25rem' }}>매출액 / 총자산</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#7c3aed', marginBottom: '0.25rem' }}>재무레버리지</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{formatTimes(fiveFactorResult.equityMultiplier)}x</p>
              <p style={{ fontSize: '0.7rem', color: '#8b5cf6', marginTop: '0.25rem' }}>총자산 / 자기자본</p>
            </div>
          </div>

          {/* ROE 결과 카드 */}
          <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#b45309', marginBottom: '0.25rem' }}>ROE (5-Factor)</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>{formatPercent(fiveFactorResult.roe)}%</p>
            <p style={{ fontSize: '0.75rem', color: '#d97706', marginTop: '0.25rem' }}>5요소의 곱</p>
          </div>

          {/* 수식 표시 */}
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem', marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>5-Factor DuPont 공식</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569', textAlign: 'center', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}>
              ROE = 세금부담률 x 이자부담률 x 영업이익률 x 자산회전율 x 레버리지
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '0.5rem' }}>
              {formatPercent(fiveFactorResult.taxBurden)}% x {formatPercent(fiveFactorResult.interestBurden)}% x {formatPercent(fiveFactorResult.operatingMargin)}% x {formatTimes(fiveFactorResult.assetTurnover)} x {formatTimes(fiveFactorResult.equityMultiplier)} = {formatPercent(fiveFactorResult.roe)}%
            </div>
          </div>
        </>
      )}

      {/* 워터폴 분해 차트 */}
      {waterfallData.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>요소별 분해 시각화</h3>
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
            {waterfallData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: index < waterfallData.length - 1 ? '0.75rem' : 0 }}>
                <div style={{ width: '5.5rem', fontSize: '0.8rem', fontWeight: '500', color: '#374151', flexShrink: 0 }}>
                  {item.label}
                </div>
                <div style={{ flex: 1, height: '1.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.25rem', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      width: `${Math.max((Math.abs(item.value) / maxWaterfallValue) * 100, 3)}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '0.5rem',
                      transition: 'width 0.3s ease',
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>
                      {item.label.includes('회전율') || item.label.includes('레버리지')
                        ? `${formatTimes(item.value)}x`
                        : `${item.value.toFixed(1)}%`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 업종 벤치마크 비교 */}
      {threeFactorResult && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>업종 벤치마크 비교</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>업종</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb', color: '#1d4ed8' }}>순이익률</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb', color: '#15803d' }}>자산회전율</th>
                  <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '2px solid #e5e7eb', color: '#7c3aed' }}>레버리지</th>
                </tr>
              </thead>
              <tbody>
                {BENCHMARKS.map((bm, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '0.5rem 0.75rem', fontWeight: '500' }}>{bm.label}</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                      {bm.netMargin[0]}~{bm.netMargin[1]}%
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                      {bm.assetTurnover[0]}~{bm.assetTurnover[1]}x
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center' }}>
                      {bm.leverage[0]}~{bm.leverage[1]}x
                    </td>
                  </tr>
                ))}
                {/* 현재 기업 행 */}
                <tr style={{ backgroundColor: '#fffbeb', fontWeight: '600', borderTop: '2px solid #f59e0b' }}>
                  <td style={{ padding: '0.5rem 0.75rem' }}>현재 입력값</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', color: '#1d4ed8' }}>
                    {formatPercent(threeFactorResult.netProfitMargin)}%
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', color: '#15803d' }}>
                    {formatTimes(threeFactorResult.assetTurnover)}x
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'center', color: '#7c3aed' }}>
                    {formatTimes(threeFactorResult.equityMultiplier)}x
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 벤치마크 시각적 게이지 */}
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem', color: '#374151' }}>
              업종 범위 내 위치 (가장 유사한 업종 대비)
            </h4>
            {BENCHMARKS.map((bm, i) => {
              const netMarginValue = threeFactorResult.netProfitMargin * 100;
              const assetTurnoverValue = threeFactorResult.assetTurnover;
              const leverageValue = threeFactorResult.equityMultiplier;

              return (
                <div key={i} style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>{bm.label}</p>
                  {/* 순이익률 */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.15rem' }}>
                      <span>순이익률</span>
                      <span>{netMarginValue.toFixed(1)}% (범위: {bm.netMargin[0]}~{bm.netMargin[1]}%)</span>
                    </div>
                    <div style={{ position: 'relative', height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', overflow: 'visible' }}>
                      {/* 범위 표시 */}
                      <div style={{
                        position: 'absolute',
                        left: '25%',
                        width: '50%',
                        height: '100%',
                        backgroundColor: '#dbeafe',
                        borderRadius: '0.5rem',
                      }} />
                      {/* 현재값 마커 */}
                      <div style={{
                        position: 'absolute',
                        left: `${getBenchmarkPosition(netMarginValue, bm.netMargin)}%`,
                        top: '50%',
                        width: '10px',
                        height: '10px',
                        backgroundColor: getBenchmarkColor(netMarginValue, bm.netMargin),
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        zIndex: 1,
                      }} />
                    </div>
                  </div>
                  {/* 자산회전율 */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.15rem' }}>
                      <span>자산회전율</span>
                      <span>{assetTurnoverValue.toFixed(2)}x (범위: {bm.assetTurnover[0]}~{bm.assetTurnover[1]}x)</span>
                    </div>
                    <div style={{ position: 'relative', height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', overflow: 'visible' }}>
                      <div style={{
                        position: 'absolute',
                        left: '25%',
                        width: '50%',
                        height: '100%',
                        backgroundColor: '#dcfce7',
                        borderRadius: '0.5rem',
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: `${getBenchmarkPosition(assetTurnoverValue, bm.assetTurnover)}%`,
                        top: '50%',
                        width: '10px',
                        height: '10px',
                        backgroundColor: getBenchmarkColor(assetTurnoverValue, bm.assetTurnover),
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        zIndex: 1,
                      }} />
                    </div>
                  </div>
                  {/* 레버리지 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.15rem' }}>
                      <span>레버리지</span>
                      <span>{leverageValue.toFixed(2)}x (범위: {bm.leverage[0]}~{bm.leverage[1]}x)</span>
                    </div>
                    <div style={{ position: 'relative', height: '0.75rem', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', overflow: 'visible' }}>
                      <div style={{
                        position: 'absolute',
                        left: '25%',
                        width: '50%',
                        height: '100%',
                        backgroundColor: '#f3e8ff',
                        borderRadius: '0.5rem',
                      }} />
                      <div style={{
                        position: 'absolute',
                        left: `${getBenchmarkPosition(leverageValue, bm.leverage)}%`,
                        top: '50%',
                        width: '10px',
                        height: '10px',
                        backgroundColor: getBenchmarkColor(leverageValue, bm.leverage),
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        zIndex: 1,
                      }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.7rem', color: '#6b7280', marginTop: '0.5rem', justifyContent: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                범위 내
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                범위 하회
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                범위 상회
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 해석 가이드 */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        borderLeft: '4px solid #2563eb',
        backgroundColor: '#eff6ff',
        borderRadius: '0 0.5rem 0.5rem 0',
      }}>
        <p style={{ fontWeight: '600', color: '#1e40af', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
          듀퐁 분석 해석 가이드
        </p>
        <ul style={{ fontSize: '0.8rem', color: '#1e40af', margin: 0, paddingLeft: '1.25rem', lineHeight: '1.8' }}>
          <li><strong>순이익률</strong>이 높으면 → 가격 경쟁력 또는 비용 효율성이 뛰어남</li>
          <li><strong>자산회전율</strong>이 높으면 → 자산 활용 효율이 높음 (박리다매형)</li>
          <li><strong>재무레버리지</strong>가 높으면 → 부채를 활용한 수익 확대 (위험도 증가)</li>
          <li>동일 ROE라도 <strong>구성 요소</strong>에 따라 기업의 특성과 위험이 크게 다름</li>
        </ul>
      </div>
    </div>
  );
};

export default DuPontCalculator;
