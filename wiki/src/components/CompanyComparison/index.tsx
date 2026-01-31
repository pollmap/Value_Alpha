import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface CompanyData {
  name: string;
  ticker: string;
  sector: string;
  // 밸류에이션
  per: number;
  pbr: number;
  evEbitda: number;
  // 수익성
  roe: number;
  roa: number;
  npm: number; // Net Profit Margin
  opm: number; // Operating Profit Margin
  // 성장성
  revenueGrowth: number;
  earningsGrowth: number;
  // 안정성
  debtRatio: number;
  currentRatio: number;
  interestCoverage: number;
  // 기타
  marketCap: number; // 억원
  dividend: number;
}

const SAMPLE_COMPANIES: CompanyData[] = [
  { name: '삼성전자', ticker: '005930', sector: 'IT/반도체', per: 15.2, pbr: 1.3, evEbitda: 5.8, roe: 8.5, roa: 6.2, npm: 12.5, opm: 15.8, revenueGrowth: -14.3, earningsGrowth: -72.1, debtRatio: 35.2, currentRatio: 2.58, interestCoverage: 45.2, marketCap: 4500000, dividend: 2.1 },
  { name: 'SK하이닉스', ticker: '000660', sector: 'IT/반도체', per: -15.8, pbr: 1.8, evEbitda: 12.5, roe: -8.2, roa: -4.5, npm: -15.2, opm: -12.8, revenueGrowth: -32.5, earningsGrowth: -145.2, debtRatio: 48.5, currentRatio: 1.85, interestCoverage: -3.2, marketCap: 1200000, dividend: 1.0 },
  { name: 'KB금융', ticker: '105560', sector: '금융/은행', per: 5.2, pbr: 0.45, evEbitda: 0, roe: 9.2, roa: 0.65, npm: 25.8, opm: 0, revenueGrowth: 8.5, earningsGrowth: 12.3, debtRatio: 1250, currentRatio: 0, interestCoverage: 0, marketCap: 280000, dividend: 4.5 },
  { name: '신한지주', ticker: '055550', sector: '금융/은행', per: 4.8, pbr: 0.42, evEbitda: 0, roe: 8.8, roa: 0.58, npm: 24.5, opm: 0, revenueGrowth: 6.2, earningsGrowth: 9.8, debtRatio: 1180, currentRatio: 0, interestCoverage: 0, marketCap: 240000, dividend: 5.2 },
  { name: '현대차', ticker: '005380', sector: '자동차', per: 5.8, pbr: 0.52, evEbitda: 3.2, roe: 9.5, roa: 4.2, npm: 6.8, opm: 8.5, revenueGrowth: 14.2, earningsGrowth: 52.8, debtRatio: 125, currentRatio: 1.12, interestCoverage: 8.5, marketCap: 450000, dividend: 3.2 },
  { name: '기아', ticker: '000270', sector: '자동차', per: 4.5, pbr: 0.85, evEbitda: 2.8, roe: 18.5, roa: 7.2, npm: 8.5, opm: 10.2, revenueGrowth: 18.5, earningsGrowth: 65.2, debtRatio: 85, currentRatio: 1.25, interestCoverage: 12.5, marketCap: 350000, dividend: 3.8 },
  { name: '네이버', ticker: '035420', sector: 'IT/인터넷', per: 32.5, pbr: 1.8, evEbitda: 15.2, roe: 5.8, roa: 3.2, npm: 8.5, opm: 12.5, revenueGrowth: 18.2, earningsGrowth: -25.8, debtRatio: 45, currentRatio: 1.85, interestCoverage: 15.2, marketCap: 380000, dividend: 0.4 },
  { name: '카카오', ticker: '035720', sector: 'IT/인터넷', per: 45.2, pbr: 1.2, evEbitda: 18.5, roe: 2.8, roa: 1.5, npm: 3.5, opm: 5.8, revenueGrowth: 12.5, earningsGrowth: -45.2, debtRatio: 52, currentRatio: 1.42, interestCoverage: 8.2, marketCap: 280000, dividend: 0 },
  { name: '삼성바이오로직스', ticker: '207940', sector: '헬스케어', per: 68.5, pbr: 5.8, evEbitda: 35.2, roe: 8.5, roa: 5.2, npm: 25.8, opm: 32.5, revenueGrowth: 25.8, earningsGrowth: 35.2, debtRatio: 28, currentRatio: 2.85, interestCoverage: 45.2, marketCap: 550000, dividend: 0 },
  { name: '셀트리온', ticker: '068270', sector: '헬스케어', per: 25.8, pbr: 2.5, evEbitda: 18.5, roe: 10.2, roa: 6.8, npm: 22.5, opm: 28.5, revenueGrowth: 15.2, earningsGrowth: 22.5, debtRatio: 35, currentRatio: 2.12, interestCoverage: 25.8, marketCap: 280000, dividend: 0.2 },
];

const CompanyComparisonInner: React.FC = () => {
  const [company1, setCompany1] = useState<string>('삼성전자');
  const [company2, setCompany2] = useState<string>('SK하이닉스');

  const data1 = SAMPLE_COMPANIES.find(c => c.name === company1);
  const data2 = SAMPLE_COMPANIES.find(c => c.name === company2);

  const formatNumber = (num: number, suffix: string = '') => {
    if (num === 0) return '-';
    return `${num.toFixed(2)}${suffix}`;
  };

  const formatMarketCap = (num: number) => {
    if (num >= 10000) return `${(num / 10000).toFixed(1)}조`;
    return `${num.toLocaleString()}억`;
  };

  const getComparisonColor = (val1: number, val2: number, higherIsBetter: boolean = true) => {
    if (val1 === val2) return 'inherit';
    const isBetter = higherIsBetter ? val1 > val2 : val1 < val2;
    return isBetter ? '#52c41a' : '#ff4d4f';
  };

  const renderRow = (label: string, val1: number, val2: number, suffix: string = '', higherIsBetter: boolean = true, skipComparison: boolean = false) => (
    <tr>
      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)', fontWeight: 500 }}>{label}</td>
      <td style={{
        padding: '0.75rem',
        borderBottom: '1px solid var(--ifm-color-emphasis-200)',
        textAlign: 'right',
        fontFamily: 'monospace',
        color: skipComparison ? 'inherit' : getComparisonColor(val1, val2, higherIsBetter),
        fontWeight: skipComparison ? 400 : 600,
      }}>
        {formatNumber(val1, suffix)}
      </td>
      <td style={{
        padding: '0.75rem',
        borderBottom: '1px solid var(--ifm-color-emphasis-200)',
        textAlign: 'right',
        fontFamily: 'monospace',
        color: skipComparison ? 'inherit' : getComparisonColor(val2, val1, higherIsBetter),
        fontWeight: skipComparison ? 400 : 600,
      }}>
        {formatNumber(val2, suffix)}
      </td>
    </tr>
  );

  return (
    <div style={{ padding: '1rem', backgroundColor: 'var(--ifm-background-surface-color)', borderRadius: '8px', border: '1px solid var(--ifm-color-emphasis-300)' }}>
      <h3 style={{ marginTop: 0 }}>기업 비교 도구</h3>

      {/* 기업 선택 */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>기업 1</label>
          <select
            value={company1}
            onChange={(e) => setCompany1(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)', minWidth: '150px' }}
          >
            {SAMPLE_COMPANIES.map(c => (
              <option key={c.ticker} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>기업 2</label>
          <select
            value={company2}
            onChange={(e) => setCompany2(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--ifm-color-emphasis-300)', minWidth: '150px' }}
          >
            {SAMPLE_COMPANIES.map(c => (
              <option key={c.ticker} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {data1 && data2 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ifm-color-emphasis-300)', width: '40%' }}>지표</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--ifm-color-emphasis-300)', width: '30%' }}>{data1.name}</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '2px solid var(--ifm-color-emphasis-300)', width: '30%' }}>{data2.name}</th>
              </tr>
            </thead>
            <tbody>
              {/* 기본 정보 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>기본 정보</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>섹터</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)', textAlign: 'right' }}>{data1.sector}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)', textAlign: 'right' }}>{data2.sector}</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)' }}>시가총액</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)', textAlign: 'right', fontFamily: 'monospace' }}>{formatMarketCap(data1.marketCap)}</td>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--ifm-color-emphasis-200)', textAlign: 'right', fontFamily: 'monospace' }}>{formatMarketCap(data2.marketCap)}</td>
              </tr>

              {/* 밸류에이션 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>밸류에이션</td>
              </tr>
              {renderRow('PER', data1.per, data2.per, 'x', false)}
              {renderRow('PBR', data1.pbr, data2.pbr, 'x', false)}
              {renderRow('EV/EBITDA', data1.evEbitda, data2.evEbitda, 'x', false)}

              {/* 수익성 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>수익성</td>
              </tr>
              {renderRow('ROE', data1.roe, data2.roe, '%', true)}
              {renderRow('ROA', data1.roa, data2.roa, '%', true)}
              {renderRow('순이익률', data1.npm, data2.npm, '%', true)}
              {renderRow('영업이익률', data1.opm, data2.opm, '%', true)}

              {/* 성장성 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>성장성</td>
              </tr>
              {renderRow('매출 성장률', data1.revenueGrowth, data2.revenueGrowth, '%', true)}
              {renderRow('이익 성장률', data1.earningsGrowth, data2.earningsGrowth, '%', true)}

              {/* 안정성 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>안정성</td>
              </tr>
              {renderRow('부채비율', data1.debtRatio, data2.debtRatio, '%', false)}
              {renderRow('유동비율', data1.currentRatio, data2.currentRatio, 'x', true)}
              {renderRow('이자보상배율', data1.interestCoverage, data2.interestCoverage, 'x', true)}

              {/* 배당 */}
              <tr style={{ backgroundColor: 'var(--ifm-color-emphasis-100)' }}>
                <td colSpan={3} style={{ padding: '0.5rem 0.75rem', fontWeight: 700 }}>배당</td>
              </tr>
              {renderRow('배당수익률', data1.dividend, data2.dividend, '%', true)}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '1rem' }}>
        * 녹색: 비교 우위, 빨간색: 비교 열위. 금융업종은 일부 지표가 적용되지 않습니다.
        <br />
        * 데이터는 예시용이며 실제 수치와 다를 수 있습니다.
      </p>
    </div>
  );
};

export default function CompanyComparison() {
  return (
    <BrowserOnly fallback={<div>비교 도구 로딩 중...</div>}>
      {() => <CompanyComparisonInner />}
    </BrowserOnly>
  );
}
