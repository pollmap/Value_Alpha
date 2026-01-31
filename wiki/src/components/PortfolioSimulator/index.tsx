import React, { useState, useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface AssetClass {
  id: string;
  name: string;
  color: string;
  annualReturn: number;
  annualVolatility: number;
  // 연도별 수익률 (2019-2023)
  yearlyReturns: number[];
}

const ASSET_CLASSES: AssetClass[] = [
  { id: 'korea_stock', name: '한국 주식 (KOSPI)', color: '#1890ff', annualReturn: 8.5, annualVolatility: 22.5, yearlyReturns: [7.7, 30.8, -8.3, -24.9, 18.7] },
  { id: 'us_stock', name: '미국 주식 (S&P500)', color: '#722ed1', annualReturn: 10.5, annualVolatility: 18.5, yearlyReturns: [28.9, 16.3, 26.9, -19.4, 24.2] },
  { id: 'korea_bond', name: '한국 채권', color: '#52c41a', annualReturn: 3.5, annualVolatility: 4.5, yearlyReturns: [2.1, 4.8, -2.5, -8.5, 6.2] },
  { id: 'us_bond', name: '미국 채권', color: '#13c2c2', annualReturn: 2.8, annualVolatility: 6.5, yearlyReturns: [6.8, 7.5, -1.5, -13.0, 5.5] },
  { id: 'gold', name: '금', color: '#faad14', annualReturn: 6.5, annualVolatility: 15.5, yearlyReturns: [18.3, 24.6, -3.6, -0.3, 13.1] },
  { id: 'reits', name: '리츠 (부동산)', color: '#eb2f96', annualReturn: 7.5, annualVolatility: 20.5, yearlyReturns: [25.8, -8.0, 41.3, -26.2, 11.5] },
  { id: 'cash', name: '현금/예금', color: '#8c8c8c', annualReturn: 2.0, annualVolatility: 0.5, yearlyReturns: [1.8, 0.5, 0.3, 2.5, 3.5] },
];

const YEARS = ['2019', '2020', '2021', '2022', '2023'];

const PortfolioSimulatorInner: React.FC = () => {
  const [allocations, setAllocations] = useState<Record<string, number>>({
    korea_stock: 30,
    us_stock: 30,
    korea_bond: 15,
    us_bond: 10,
    gold: 10,
    reits: 5,
    cash: 0,
  });

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const handleAllocationChange = (assetId: string, value: number) => {
    setAllocations(prev => ({
      ...prev,
      [assetId]: Math.max(0, Math.min(100, value)),
    }));
  };

  const portfolioMetrics = useMemo(() => {
    const weights = ASSET_CLASSES.map(a => allocations[a.id] / 100);

    // 기대수익률 (가중평균)
    const expectedReturn = ASSET_CLASSES.reduce((sum, asset, i) => {
      return sum + asset.annualReturn * weights[i];
    }, 0);

    // 변동성 (단순화: 가중평균 변동성)
    const volatility = ASSET_CLASSES.reduce((sum, asset, i) => {
      return sum + asset.annualVolatility * weights[i];
    }, 0);

    // 샤프비율 (무위험수익률 2% 가정)
    const sharpeRatio = (expectedReturn - 2) / volatility;

    // 연도별 포트폴리오 수익률
    const yearlyPortfolioReturns = YEARS.map((_, yearIndex) => {
      return ASSET_CLASSES.reduce((sum, asset, i) => {
        return sum + asset.yearlyReturns[yearIndex] * weights[i];
      }, 0);
    });

    // 누적 수익률 계산 (100만원 시작)
    let cumulativeValue = 1000000;
    const cumulativeValues = [cumulativeValue];
    yearlyPortfolioReturns.forEach(ret => {
      cumulativeValue = cumulativeValue * (1 + ret / 100);
      cumulativeValues.push(cumulativeValue);
    });

    // 최대낙폭 (MDD)
    let maxDrawdown = 0;
    let peak = cumulativeValues[0];
    cumulativeValues.forEach(val => {
      if (val > peak) peak = val;
      const drawdown = (peak - val) / peak * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      yearlyPortfolioReturns,
      cumulativeValues,
      maxDrawdown,
      finalValue: cumulativeValue,
      totalReturn: (cumulativeValue / 1000000 - 1) * 100,
    };
  }, [allocations]);

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <h3 style={{ marginTop: 0 }}>포트폴리오 시뮬레이터</h3>
      <p style={{ color: 'var(--ifm-color-emphasis-700)', marginBottom: '1.5rem' }}>
        자산 비중을 조절하여 포트폴리오 성과를 백테스트하세요. (2019~2023년 데이터 기반)
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* 왼쪽: 자산배분 입력 */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h4>자산 배분</h4>

          {/* 파이차트 대용 바 */}
          <div style={{
            display: 'flex',
            height: '30px',
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

          {/* 자산별 슬라이더 */}
          {ASSET_CLASSES.map(asset => (
            <div key={asset.id} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: asset.color }} />
                  {asset.name}
                </span>
                <span style={{ fontFamily: 'monospace' }}>{allocations[asset.id]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={allocations[asset.id]}
                onChange={(e) => handleAllocationChange(asset.id, Number(e.target.value))}
                style={{ width: '100%', accentColor: asset.color }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>
                <span>기대수익률: {asset.annualReturn}%</span>
                <span>변동성: {asset.annualVolatility}%</span>
              </div>
            </div>
          ))}

          <div style={{
            padding: '0.75rem',
            borderRadius: '4px',
            backgroundColor: totalAllocation === 100 ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-warning-contrast-background)',
            marginTop: '1rem',
          }}>
            <strong>총 배분: {totalAllocation}%</strong>
            {totalAllocation !== 100 && <span style={{ marginLeft: '0.5rem', color: 'var(--ifm-color-warning-dark)' }}>({totalAllocation < 100 ? '100%를 채워주세요' : '100%를 초과했습니다'})</span>}
          </div>
        </div>

        {/* 오른쪽: 결과 */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h4>시뮬레이션 결과</h4>

          {/* 핵심 지표 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>기대수익률</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: portfolioMetrics.expectedReturn > 0 ? '#52c41a' : '#ff4d4f' }}>
                {portfolioMetrics.expectedReturn.toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>변동성</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {portfolioMetrics.volatility.toFixed(1)}%
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>샤프비율</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {portfolioMetrics.sharpeRatio.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-color-emphasis-100)', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)' }}>최대낙폭(MDD)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ff4d4f' }}>
                -{portfolioMetrics.maxDrawdown.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* 연도별 수익률 */}
          <h5>연도별 수익률</h5>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>연도</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>수익률</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>누적 자산</th>
              </tr>
            </thead>
            <tbody>
              {YEARS.map((year, i) => (
                <tr key={year}>
                  <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>{year}</td>
                  <td style={{
                    padding: '0.5rem',
                    textAlign: 'right',
                    borderBottom: '1px solid var(--ifm-color-emphasis-200)',
                    color: portfolioMetrics.yearlyPortfolioReturns[i] >= 0 ? '#52c41a' : '#ff4d4f',
                    fontFamily: 'monospace',
                  }}>
                    {portfolioMetrics.yearlyPortfolioReturns[i] >= 0 ? '+' : ''}{portfolioMetrics.yearlyPortfolioReturns[i].toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid var(--ifm-color-emphasis-200)', fontFamily: 'monospace' }}>
                    {Math.round(portfolioMetrics.cumulativeValues[i + 1]).toLocaleString()}원
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 최종 결과 */}
          <div style={{
            padding: '1rem',
            backgroundColor: portfolioMetrics.totalReturn >= 0 ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-danger-contrast-background)',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9rem' }}>5년간 100만원 투자 시</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {Math.round(portfolioMetrics.finalValue).toLocaleString()}원
            </div>
            <div style={{ color: portfolioMetrics.totalReturn >= 0 ? '#52c41a' : '#ff4d4f' }}>
              ({portfolioMetrics.totalReturn >= 0 ? '+' : ''}{portfolioMetrics.totalReturn.toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '1.5rem' }}>
        * 과거 성과가 미래 수익을 보장하지 않습니다. 세금, 거래비용, 환율 변동 등은 반영되지 않았습니다.
        <br />
        * 데이터 출처: 각 자산군의 대표 지수 기준 (KOSPI, S&P500, 국고채 등)
      </p>
    </div>
  );
};

export default function PortfolioSimulator() {
  return (
    <BrowserOnly fallback={<div>시뮬레이터 로딩 중...</div>}>
      {() => <PortfolioSimulatorInner />}
    </BrowserOnly>
  );
}
