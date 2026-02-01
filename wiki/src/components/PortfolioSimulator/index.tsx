import React, { useState, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface AssetClass {
  id: string;
  name: string;
  color: string;
  category: string;
  annualReturn: number;
  annualVolatility: number;
  yearlyReturns: number[];
}

// 확장된 자산 클래스 (2014-2024 데이터, 11년간)
const ASSET_CLASSES: AssetClass[] = [
  { id: 'korea_stock', name: '한국 주식 (KOSPI)', category: '주식', color: '#1890ff', annualReturn: 5.2, annualVolatility: 18.5, yearlyReturns: [-4.8, 2.4, 3.3, 21.8, -17.3, 7.7, 30.8, -8.3, -24.9, 18.7, -9.6] },
  { id: 'us_stock', name: '미국 주식 (S&P500)', category: '주식', color: '#722ed1', annualReturn: 12.8, annualVolatility: 15.2, yearlyReturns: [11.4, -0.7, 9.5, 19.4, -6.2, 28.9, 16.3, 26.9, -19.4, 24.2, 23.3] },
  { id: 'nasdaq', name: '나스닥 (QQQ)', category: '주식', color: '#9254de', annualReturn: 16.5, annualVolatility: 20.8, yearlyReturns: [17.9, 5.9, 5.9, 31.5, -1.0, 37.8, 47.6, 26.6, -33.1, 53.8, 25.6] },
  { id: 'em_stock', name: '신흥국 주식 (EEM)', category: '주식', color: '#36cfc9', annualReturn: 3.8, annualVolatility: 19.5, yearlyReturns: [-4.6, -17.0, 8.6, 34.3, -16.6, 15.4, 14.5, -4.6, -22.4, 6.1, 4.8] },
  { id: 'korea_bond', name: '한국 국채', category: '채권', color: '#52c41a', annualReturn: 3.2, annualVolatility: 4.8, yearlyReturns: [5.2, 3.8, 2.1, 1.5, 3.5, 2.1, 4.8, -2.5, -8.5, 6.2, 5.1] },
  { id: 'us_bond', name: '미국 국채 (TLT)', category: '채권', color: '#13c2c2', annualReturn: 2.1, annualVolatility: 12.5, yearlyReturns: [27.3, -1.2, 1.0, 8.9, -1.7, 13.9, 18.0, -4.6, -31.2, 2.3, -3.5] },
  { id: 'tips', name: '물가연동채 (TIPS)', category: '채권', color: '#73d13d', annualReturn: 2.8, annualVolatility: 6.2, yearlyReturns: [4.5, -1.4, 4.8, 3.0, -1.3, 8.4, 11.0, 5.7, -12.0, 3.8, 1.2] },
  { id: 'gold', name: '금 (GLD)', category: '원자재', color: '#faad14', annualReturn: 5.8, annualVolatility: 14.8, yearlyReturns: [-1.5, -10.4, 8.1, 13.1, -1.6, 18.3, 24.6, -3.6, -0.3, 13.1, 27.2] },
  { id: 'silver', name: '은 (SLV)', category: '원자재', color: '#bfbfbf', annualReturn: 3.2, annualVolatility: 25.5, yearlyReturns: [-19.5, -11.7, 15.8, 7.2, -9.4, 15.3, 47.4, -11.7, -8.8, 2.1, 21.5] },
  { id: 'oil', name: '원유 (USO)', category: '원자재', color: '#595959', annualReturn: -2.5, annualVolatility: 35.2, yearlyReturns: [-46.1, -30.5, 45.0, 6.9, -24.8, 33.7, -67.7, 56.4, 28.5, -10.5, 5.8] },
  { id: 'reits', name: '미국 리츠 (VNQ)', category: '대체', color: '#eb2f96', annualReturn: 7.8, annualVolatility: 18.5, yearlyReturns: [30.4, 2.4, 8.5, 4.9, -6.0, 28.9, -5.3, 40.5, -26.3, 11.4, 4.2] },
  { id: 'korea_reits', name: '한국 리츠', category: '대체', color: '#f759ab', annualReturn: 4.5, annualVolatility: 15.2, yearlyReturns: [8.2, 5.1, 3.2, 15.3, -8.5, 12.4, -2.5, 18.6, -22.1, 8.3, 2.1] },
  { id: 'cash', name: '현금/MMF', category: '현금', color: '#8c8c8c', annualReturn: 2.2, annualVolatility: 0.3, yearlyReturns: [2.5, 1.8, 1.2, 1.0, 1.5, 1.8, 0.5, 0.3, 2.5, 3.5, 4.2] },
];

const YEARS = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

// 프리셋 포트폴리오
const PRESETS: Record<string, Record<string, number>> = {
  aggressive: { korea_stock: 20, us_stock: 35, nasdaq: 20, em_stock: 10, gold: 10, reits: 5, cash: 0, korea_bond: 0, us_bond: 0, tips: 0, silver: 0, oil: 0, korea_reits: 0 },
  balanced: { korea_stock: 15, us_stock: 25, nasdaq: 10, korea_bond: 15, us_bond: 10, gold: 10, reits: 10, cash: 5, em_stock: 0, tips: 0, silver: 0, oil: 0, korea_reits: 0 },
  conservative: { korea_bond: 30, us_bond: 25, tips: 15, korea_stock: 10, us_stock: 10, gold: 5, cash: 5, nasdaq: 0, em_stock: 0, reits: 0, silver: 0, oil: 0, korea_reits: 0 },
  allWeather: { us_stock: 30, us_bond: 40, gold: 15, oil: 7.5, cash: 7.5, korea_stock: 0, nasdaq: 0, em_stock: 0, korea_bond: 0, tips: 0, silver: 0, reits: 0, korea_reits: 0 },
  golden60: { us_stock: 40, korea_stock: 20, korea_bond: 15, us_bond: 10, gold: 10, reits: 5, cash: 0, nasdaq: 0, em_stock: 0, tips: 0, silver: 0, oil: 0, korea_reits: 0 },
};

const PortfolioSimulatorInner: React.FC = () => {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    korea_stock: 20,
    us_stock: 30,
    nasdaq: 10,
    em_stock: 5,
    korea_bond: 10,
    us_bond: 10,
    tips: 0,
    gold: 10,
    silver: 0,
    oil: 0,
    reits: 5,
    korea_reits: 0,
    cash: 0,
  });

  const [initialAmount, setInitialAmount] = useState(10000000);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const handleAllocationChange = (assetId: string, value: number) => {
    setAllocations(prev => ({
      ...prev,
      [assetId]: Math.max(0, Math.min(100, value)),
    }));
    setSelectedPreset(null);
  };

  const applyPreset = (presetName: string) => {
    setAllocations(PRESETS[presetName]);
    setSelectedPreset(presetName);
  };

  const portfolioMetrics = useMemo(() => {
    const weights = ASSET_CLASSES.map(a => allocations[a.id] / 100);

    // 기대수익률 (가중평균)
    const expectedReturn = ASSET_CLASSES.reduce((sum, asset, i) => {
      return sum + asset.annualReturn * weights[i];
    }, 0);

    // 변동성 (가중평균 + 상관관계 근사)
    const volatility = ASSET_CLASSES.reduce((sum, asset, i) => {
      return sum + asset.annualVolatility * weights[i];
    }, 0) * 0.85; // 분산효과 근사 적용

    // 연도별 포트폴리오 수익률
    const yearlyPortfolioReturns = YEARS.map((_, yearIndex) => {
      return ASSET_CLASSES.reduce((sum, asset, i) => {
        return sum + asset.yearlyReturns[yearIndex] * weights[i];
      }, 0);
    });

    // 누적 수익률 계산
    let cumulativeValue = initialAmount;
    const cumulativeValues = [cumulativeValue];
    yearlyPortfolioReturns.forEach(ret => {
      cumulativeValue = cumulativeValue * (1 + ret / 100);
      cumulativeValues.push(cumulativeValue);
    });

    // 최대낙폭 (MDD) 및 회복 기간
    let maxDrawdown = 0;
    let peak = cumulativeValues[0];
    let maxDrawdownYear = '';
    cumulativeValues.forEach((val, i) => {
      if (val > peak) peak = val;
      const drawdown = (peak - val) / peak * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownYear = YEARS[i - 1] || '';
      }
    });

    // CAGR (연평균 복합 수익률)
    const years = YEARS.length;
    const cagr = (Math.pow(cumulativeValue / initialAmount, 1 / years) - 1) * 100;

    // 무위험수익률 2.5% 가정
    const riskFreeRate = 2.5;
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

    // 하방편차 (연수익률 < 0인 경우만)
    const negativeReturns = yearlyPortfolioReturns.filter(r => r < 0);
    const downsideDeviation = negativeReturns.length > 0
      ? Math.sqrt(negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length)
      : 0.01;
    const sortinoRatio = (expectedReturn - riskFreeRate) / downsideDeviation;

    // 칼마비율
    const calmarRatio = maxDrawdown > 0 ? cagr / maxDrawdown : 0;

    // 승률
    const winRate = (yearlyPortfolioReturns.filter(r => r > 0).length / yearlyPortfolioReturns.length) * 100;

    // 평균 양의 수익 / 평균 음의 수익
    const avgPositive = yearlyPortfolioReturns.filter(r => r > 0).reduce((a, b) => a + b, 0) / Math.max(yearlyPortfolioReturns.filter(r => r > 0).length, 1);
    const avgNegative = negativeReturns.reduce((a, b) => a + b, 0) / Math.max(negativeReturns.length, 1);
    const gainLossRatio = avgNegative !== 0 ? Math.abs(avgPositive / avgNegative) : 0;

    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      yearlyPortfolioReturns,
      cumulativeValues,
      maxDrawdown,
      maxDrawdownYear,
      finalValue: cumulativeValue,
      totalReturn: (cumulativeValue / initialAmount - 1) * 100,
      cagr,
      winRate,
      gainLossRatio,
    };
  }, [allocations, initialAmount]);

  const categories = ['주식', '채권', '원자재', '대체', '현금'];

  return (
    <div style={{ padding: '1.5rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '12px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>포트폴리오 백테스트 시뮬레이터</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)' }}>
          2014~2024년 (11년) 데이터 기반
        </div>
      </div>

      {/* 프리셋 버튼 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--ifm-color-emphasis-700)' }}>빠른 시작: 포트폴리오 프리셋</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'aggressive', label: '공격형', desc: '주식 85%' },
            { key: 'balanced', label: '균형형', desc: '60/40' },
            { key: 'conservative', label: '보수형', desc: '채권 70%' },
            { key: 'allWeather', label: '올웨더', desc: '레이 달리오' },
            { key: 'golden60', label: '황금비율', desc: '60/40 변형' },
          ].map(preset => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset.key)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: selectedPreset === preset.key ? '2px solid var(--ifm-color-primary)' : '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: selectedPreset === preset.key ? 'var(--ifm-color-primary-contrast-background)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ fontWeight: 600 }}>{preset.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 초기 투자금 설정 */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.9rem' }}>초기 투자금:</label>
        <input
          type="number"
          value={initialAmount}
          onChange={(e) => setInitialAmount(Math.max(100000, Number(e.target.value)))}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid var(--ifm-color-emphasis-300)',
            width: '150px',
            fontFamily: 'monospace',
          }}
        />
        <span style={{ fontSize: '0.9rem' }}>원</span>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* 왼쪽: 자산배분 입력 */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: '0 0 1rem 0' }}>자산 배분</h4>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                border: '1px solid var(--ifm-color-emphasis-300)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {showAdvanced ? '기본 자산만' : '전체 자산 보기'}
            </button>
          </div>

          {/* 파이차트 대용 바 */}
          <div style={{
            display: 'flex',
            height: '24px',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '1rem',
          }}>
            {ASSET_CLASSES.map(asset => (
              allocations[asset.id] > 0 && (
                <div
                  key={asset.id}
                  style={{
                    width: `${allocations[asset.id]}%`,
                    backgroundColor: asset.color,
                    transition: 'width 0.3s',
                  }}
                  title={`${asset.name}: ${allocations[asset.id]}%`}
                />
              )
            ))}
          </div>

          {/* 자산별 슬라이더 (카테고리별 그룹화) */}
          {categories.map(category => {
            const categoryAssets = ASSET_CLASSES.filter(a => a.category === category);
            const visibleAssets = showAdvanced ? categoryAssets : categoryAssets.slice(0, 2);
            if (visibleAssets.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ifm-color-emphasis-600)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  {category}
                </div>
                {visibleAssets.map(asset => (
                  <div key={asset.id} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: asset.color }} />
                        {asset.name}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{allocations[asset.id]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={allocations[asset.id]}
                      onChange={(e) => handleAllocationChange(asset.id, Number(e.target.value))}
                      style={{ width: '100%', accentColor: asset.color }}
                    />
                  </div>
                ))}
              </div>
            );
          })}

          <div style={{
            padding: '0.75rem',
            borderRadius: '6px',
            backgroundColor: totalAllocation === 100 ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-warning-contrast-background)',
            marginTop: '1rem',
            textAlign: 'center',
          }}>
            <strong>총 배분: {totalAllocation}%</strong>
            {totalAllocation !== 100 && <span style={{ marginLeft: '0.5rem', color: 'var(--ifm-color-warning-dark)', fontSize: '0.85rem' }}>({totalAllocation < 100 ? `${100 - totalAllocation}% 남음` : `${totalAllocation - 100}% 초과`})</span>}
          </div>
        </div>

        {/* 오른쪽: 결과 */}
        <div style={{ flex: '1', minWidth: '320px' }}>
          <h4 style={{ margin: '0 0 1rem 0' }}>백테스트 결과</h4>

          {/* 핵심 지표 - 2x3 그리드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>CAGR</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: portfolioMetrics.cagr > 0 ? '#52c41a' : '#ff4d4f' }}>
                {portfolioMetrics.cagr.toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>변동성</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {portfolioMetrics.volatility.toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>MDD</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ff4d4f' }}>
                -{portfolioMetrics.maxDrawdown.toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>샤프</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: portfolioMetrics.sharpeRatio > 0.5 ? '#52c41a' : 'inherit' }}>
                {portfolioMetrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>소르티노</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {portfolioMetrics.sortinoRatio.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--ifm-color-emphasis-600)' }}>승률</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {portfolioMetrics.winRate.toFixed(0)}%
              </div>
            </div>
          </div>

          {/* 연도별 수익률 (간략화) */}
          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>연도별 성과</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
            {YEARS.map((year, i) => {
              const ret = portfolioMetrics.yearlyPortfolioReturns[i];
              const isPositive = ret >= 0;
              return (
                <div
                  key={year}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: isPositive ? 'rgba(82, 196, 26, 0.15)' : 'rgba(255, 77, 79, 0.15)',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: isPositive ? '#52c41a' : '#ff4d4f',
                  }}
                  title={`${year}: ${ret >= 0 ? '+' : ''}${ret.toFixed(1)}%`}
                >
                  {year.slice(2)}: {ret >= 0 ? '+' : ''}{ret.toFixed(0)}%
                </div>
              );
            })}
          </div>

          {/* 최종 결과 */}
          <div style={{
            padding: '1.25rem',
            background: portfolioMetrics.totalReturn >= 0
              ? 'linear-gradient(135deg, rgba(82, 196, 26, 0.1) 0%, rgba(82, 196, 26, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(255, 77, 79, 0.1) 0%, rgba(255, 77, 79, 0.2) 100%)',
            borderRadius: '12px',
            textAlign: 'center',
            border: `1px solid ${portfolioMetrics.totalReturn >= 0 ? 'rgba(82, 196, 26, 0.3)' : 'rgba(255, 77, 79, 0.3)'}`,
          }}>
            <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
              {(initialAmount / 10000).toLocaleString()}만원 → 11년 후
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              {Math.round(portfolioMetrics.finalValue / 10000).toLocaleString()}만원
            </div>
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              backgroundColor: portfolioMetrics.totalReturn >= 0 ? 'rgba(82, 196, 26, 0.2)' : 'rgba(255, 77, 79, 0.2)',
              color: portfolioMetrics.totalReturn >= 0 ? '#52c41a' : '#ff4d4f',
              fontWeight: 600,
            }}>
              {portfolioMetrics.totalReturn >= 0 ? '+' : ''}{portfolioMetrics.totalReturn.toFixed(1)}%
            </div>
          </div>

          {/* 추가 정보 */}
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>
            <div>• 최대낙폭 시점: {portfolioMetrics.maxDrawdownYear || 'N/A'}</div>
            <div>• 손익비: {portfolioMetrics.gainLossRatio.toFixed(2)} (양의 평균 / 음의 평균)</div>
            <div>• 칼마비율: {portfolioMetrics.calmarRatio.toFixed(2)} (CAGR / MDD)</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)' }}>
          <strong>참고사항</strong>
          <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem' }}>
            <li>과거 성과가 미래 수익을 보장하지 않습니다</li>
            <li>세금, 거래비용, 환율 변동, 리밸런싱 비용은 미반영</li>
            <li>데이터: 각 자산군 대표 지수/ETF 기준 (원화 환산)</li>
            <li>변동성은 분산효과를 반영한 근사치입니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function PortfolioSimulator() {
  return (
    <BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>포트폴리오 시뮬레이터 로딩 중...</div>}>
      {() => <PortfolioSimulatorInner />}
    </BrowserOnly>
  );
}
