import React, { useState, useMemo } from 'react';

interface DCFInputs {
  fcf: number[];
  wacc: number;
  terminalGrowth: number;
  sharesOutstanding: number;
  netDebt: number;
}

interface DCFResult {
  pvFCF: number[];
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  intrinsicPrice: number;
}

const DEFAULT_INPUTS: DCFInputs = {
  fcf: [1000, 1100, 1210, 1331, 1464],
  wacc: 10,
  terminalGrowth: 3,
  sharesOutstanding: 100,
  netDebt: 2000,
};

export const DCFCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DCFInputs>(DEFAULT_INPUTS);
  const [showSensitivity, setShowSensitivity] = useState(false);

  // DCF 계산 로직
  const result = useMemo<DCFResult | null>(() => {
    const { fcf, wacc, terminalGrowth, sharesOutstanding, netDebt } = inputs;

    if (wacc <= terminalGrowth) return null;

    const waccDecimal = wacc / 100;
    const growthDecimal = terminalGrowth / 100;

    // 1. 각 연도 FCF의 현재가치
    const pvFCF = fcf.map((cf, i) => cf / Math.pow(1 + waccDecimal, i + 1));

    // 2. 터미널 가치 (Gordon Growth Model)
    const lastFCF = fcf[fcf.length - 1];
    const terminalValue = (lastFCF * (1 + growthDecimal)) / (waccDecimal - growthDecimal);

    // 3. 터미널 가치의 현재가치
    const pvTerminalValue = terminalValue / Math.pow(1 + waccDecimal, fcf.length);

    // 4. 기업가치 = PV(FCF) + PV(TV)
    const sumPvFCF = pvFCF.reduce((a, b) => a + b, 0);
    const enterpriseValue = sumPvFCF + pvTerminalValue;

    // 5. 자기자본가치 = EV - 순부채
    const equityValue = enterpriseValue - netDebt;

    // 6. 주당 내재가치
    const intrinsicPrice = equityValue / sharesOutstanding;

    return {
      pvFCF,
      terminalValue,
      pvTerminalValue,
      enterpriseValue,
      equityValue,
      intrinsicPrice,
    };
  }, [inputs]);

  // 민감도 분석 데이터
  const sensitivityData = useMemo(() => {
    if (!result) return [];

    const waccRange = [-2, -1, 0, 1, 2];
    const growthRange = [-1, -0.5, 0, 0.5, 1];

    return waccRange.map(waccDelta => {
      const row: Record<string, number | string> = {
        wacc: `${(inputs.wacc + waccDelta).toFixed(1)}%`,
      };

      growthRange.forEach(growthDelta => {
        const newWacc = (inputs.wacc + waccDelta) / 100;
        const newGrowth = (inputs.terminalGrowth + growthDelta) / 100;
        const lastFCF = inputs.fcf[inputs.fcf.length - 1];

        if (newWacc <= newGrowth) {
          row[`g${(inputs.terminalGrowth + growthDelta).toFixed(1)}`] = 'N/A';
        } else {
          const tv = (lastFCF * (1 + newGrowth)) / (newWacc - newGrowth);
          const pvTV = tv / Math.pow(1 + newWacc, inputs.fcf.length);
          const pvFCF = inputs.fcf.reduce((sum, cf, i) => sum + cf / Math.pow(1 + newWacc, i + 1), 0);
          const ev = pvFCF + pvTV;
          const equity = ev - inputs.netDebt;
          const price = equity / inputs.sharesOutstanding;
          row[`g${(inputs.terminalGrowth + growthDelta).toFixed(1)}`] = Math.round(price);
        }
      });

      return row;
    });
  }, [inputs, result]);

  // FCF 입력 핸들러
  const handleFCFChange = (index: number, value: string) => {
    const newFCF = [...inputs.fcf];
    newFCF[index] = parseFloat(value) || 0;
    setInputs({ ...inputs, fcf: newFCF });
  };

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  return (
    <div className="calculator-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>DCF 계산기</h2>
      </div>

      {/* 입력 섹션 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* FCF 입력 */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>예상 잉여현금흐름 (FCF)</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>향후 5년간 FCF 예측 (단위: 억원)</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {inputs.fcf.map((fcf, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ width: '4rem', fontSize: '0.875rem' }}>Year {i + 1}:</label>
                <input
                  type="number"
                  value={fcf}
                  onChange={(e) => handleFCFChange(i, e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 기타 입력 */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>할인율 및 가정</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>WACC (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.wacc}
                onChange={(e) => setInputs({ ...inputs, wacc: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>영구성장률 (%)</label>
              <input
                type="number"
                step="0.1"
                value={inputs.terminalGrowth}
                onChange={(e) => setInputs({ ...inputs, terminalGrowth: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>발행주식수 (백만주)</label>
              <input
                type="number"
                value={inputs.sharesOutstanding}
                onChange={(e) => setInputs({ ...inputs, sharesOutstanding: parseFloat(e.target.value) || 1 })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>순부채 (억원)</label>
              <input
                type="number"
                value={inputs.netDebt}
                onChange={(e) => setInputs({ ...inputs, netDebt: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 경고: WACC < Growth */}
      {inputs.wacc <= inputs.terminalGrowth && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <span>⚠️</span>
          <span style={{ color: '#b91c1c' }}>
            WACC({inputs.wacc}%)가 영구성장률({inputs.terminalGrowth}%)보다 작거나 같으면 계산이 불가능합니다.
          </span>
        </div>
      )}

      {/* 결과 섹션 */}
      {result && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1d4ed8', marginBottom: '0.25rem' }}>기업가치 (EV)</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatNumber(result.enterpriseValue)}억</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.25rem' }}>자기자본가치</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatNumber(result.equityValue)}억</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', marginBottom: '0.25rem' }}>주당 내재가치</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatNumber(result.intrinsicPrice)}원</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', padding: '1rem', borderRadius: '0.75rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#b45309', marginBottom: '0.25rem' }}>TV 비중</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {Math.round((result.pvTerminalValue / result.enterpriseValue) * 100)}%
              </p>
            </div>
          </div>

          {/* 상세 내역 */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>계산 상세</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>항목</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>금액 (억원)</th>
                </tr>
              </thead>
              <tbody>
                {inputs.fcf.map((fcf, i) => (
                  <tr key={i}>
                    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>Year {i + 1} PV(FCF)</td>
                    <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.pvFCF[i])}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>PV(FCF) 합계</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.pvFCF.reduce((a, b) => a + b, 0))}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>터미널 가치 (TV)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.terminalValue)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>PV(TV)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.pvTerminalValue)}</td>
                </tr>
                <tr style={{ fontWeight: 'bold' }}>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>기업가치 (EV)</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(result.enterpriseValue)}</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #e5e7eb' }}>(-) 순부채</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>{formatNumber(inputs.netDebt)}</td>
                </tr>
                <tr style={{ fontWeight: 'bold', backgroundColor: '#f0fdf4' }}>
                  <td style={{ padding: '0.5rem 0.75rem' }}>자기자본가치</td>
                  <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>{formatNumber(result.equityValue)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 민감도 분석 토글 */}
          <div>
            <button
              onClick={() => setShowSensitivity(!showSensitivity)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#2563eb',
                fontWeight: '500',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>📊</span>
              {showSensitivity ? '민감도 분석 숨기기' : '민감도 분석 보기'}
            </button>

            {showSensitivity && (
              <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  WACC와 영구성장률 변화에 따른 주당 내재가치 (원)
                </p>
                <table style={{ minWidth: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>WACC \ g</th>
                      {[-1, -0.5, 0, 0.5, 1].map(delta => (
                        <th key={delta} style={{ padding: '0.5rem', border: '1px solid #e5e7eb' }}>
                          {(inputs.terminalGrowth + delta).toFixed(1)}%
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityData.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i === 2 ? '#eff6ff' : 'transparent' }}>
                        <td style={{ padding: '0.5rem', border: '1px solid #e5e7eb', fontWeight: '500' }}>{row.wacc}</td>
                        {[-1, -0.5, 0, 0.5, 1].map(delta => (
                          <td
                            key={delta}
                            style={{
                              padding: '0.5rem',
                              border: '1px solid #e5e7eb',
                              textAlign: 'center',
                              backgroundColor: i === 2 && delta === 0 ? '#dbeafe' : 'transparent',
                              fontWeight: i === 2 && delta === 0 ? 'bold' : 'normal'
                            }}
                          >
                            {typeof row[`g${(inputs.terminalGrowth + delta).toFixed(1)}`] === 'number'
                              ? formatNumber(row[`g${(inputs.terminalGrowth + delta).toFixed(1)}`] as number)
                              : row[`g${(inputs.terminalGrowth + delta).toFixed(1)}`]
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DCFCalculator;
