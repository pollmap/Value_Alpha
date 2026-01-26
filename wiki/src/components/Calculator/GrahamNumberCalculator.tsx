import React, { useState, useMemo } from 'react';

interface GrahamInputs {
  eps: number;
  bvps: number;
  currentPrice: number;
}

export const GrahamNumberCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<GrahamInputs>({
    eps: 5000,
    bvps: 30000,
    currentPrice: 50000,
  });

  const result = useMemo(() => {
    const { eps, bvps, currentPrice } = inputs;

    // 그레이엄 넘버 = √(22.5 × EPS × BVPS)
    // 22.5 = 15 (PER 상한) × 1.5 (PBR 상한)
    const grahamNumber = eps > 0 && bvps > 0
      ? Math.sqrt(22.5 * eps * bvps)
      : 0;

    // 안전마진 계산
    const marginOfSafety = grahamNumber > 0
      ? ((grahamNumber - currentPrice) / grahamNumber) * 100
      : 0;

    // 현재 PER, PBR
    const currentPER = eps > 0 ? currentPrice / eps : 0;
    const currentPBR = bvps > 0 ? currentPrice / bvps : 0;

    // 그레이엄 기준 충족 여부
    const perCriteria = currentPER > 0 && currentPER <= 15;
    const pbrCriteria = currentPBR > 0 && currentPBR <= 1.5;
    const combinedCriteria = currentPER * currentPBR <= 22.5;

    return {
      grahamNumber,
      marginOfSafety,
      currentPER,
      currentPBR,
      perCriteria,
      pbrCriteria,
      combinedCriteria,
      isUndervalued: currentPrice < grahamNumber && grahamNumber > 0,
    };
  }, [inputs]);

  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  return (
    <div className="calculator-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🧮</span>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>그레이엄 넘버 계산기</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {/* 입력 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>EPS (주당순이익)</label>
            <input
              type="number"
              value={inputs.eps}
              onChange={(e) => setInputs({ ...inputs, eps: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="원"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>BVPS (주당순자산)</label>
            <input
              type="number"
              value={inputs.bvps}
              onChange={(e) => setInputs({ ...inputs, bvps: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="원"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>현재 주가</label>
            <input
              type="number"
              value={inputs.currentPrice}
              onChange={(e) => setInputs({ ...inputs, currentPrice: parseFloat(e.target.value) || 0 })}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
              placeholder="원"
            />
          </div>

          {/* 공식 설명 */}
          <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>그레이엄 넘버 공식:</p>
            <div style={{ fontFamily: 'monospace', textAlign: 'center', padding: '0.5rem', backgroundColor: 'white', borderRadius: '0.25rem', border: '1px solid #e5e7eb' }}>
              √(22.5 × EPS × BVPS)
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.5rem' }}>
              * 22.5 = PER 15 × PBR 1.5 (그레이엄의 상한 기준)
            </p>
          </div>
        </div>

        {/* 결과 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 그레이엄 넘버 */}
          <div style={{
            padding: '1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: result.isUndervalued ? '#d1fae5' : '#fee2e2'
          }}>
            <p style={{ fontSize: '0.875rem', color: result.isUndervalued ? '#065f46' : '#991b1b' }}>
              그레이엄 넘버
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {result.grahamNumber > 0 ? `${formatNumber(result.grahamNumber)}원` : 'N/A'}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {result.grahamNumber > 0 && (
                result.isUndervalued ? (
                  <>
                    <span>✅</span>
                    <span style={{ color: '#065f46' }}>저평가 (안전마진 {result.marginOfSafety.toFixed(1)}%)</span>
                  </>
                ) : (
                  <>
                    <span>❌</span>
                    <span style={{ color: '#991b1b' }}>고평가 ({Math.abs(result.marginOfSafety).toFixed(1)}% 프리미엄)</span>
                  </>
                )
              )}
            </div>
          </div>

          {/* 현재 지표 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: result.perCriteria ? '#d1fae5' : '#fee2e2'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>현재 PER</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {result.currentPER > 0 ? `${result.currentPER.toFixed(1)}x` : 'N/A'}
              </p>
              <p style={{ fontSize: '0.75rem', color: result.perCriteria ? '#065f46' : '#991b1b' }}>
                기준: ≤15x {result.perCriteria ? '✓' : '✗'}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: result.pbrCriteria ? '#d1fae5' : '#fee2e2'
            }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>현재 PBR</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {result.currentPBR > 0 ? `${result.currentPBR.toFixed(2)}x` : 'N/A'}
              </p>
              <p style={{ fontSize: '0.75rem', color: result.pbrCriteria ? '#065f46' : '#991b1b' }}>
                기준: ≤1.5x {result.pbrCriteria ? '✓' : '✗'}
              </p>
            </div>
          </div>

          {/* 복합 기준 */}
          <div style={{
            padding: '1rem',
            borderRadius: '0.5rem',
            backgroundColor: result.combinedCriteria ? '#d1fae5' : '#fee2e2'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>PER × PBR</span>
              <span style={{ fontWeight: 'bold' }}>
                {result.currentPER > 0 && result.currentPBR > 0
                  ? (result.currentPER * result.currentPBR).toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: result.combinedCriteria ? '#065f46' : '#991b1b' }}>
              그레이엄 복합 기준: ≤22.5 {result.combinedCriteria ? '✓' : '✗'}
            </p>
          </div>

          {/* 가격 비교 */}
          {result.grahamNumber > 0 && (
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.75rem' }}>가격 비교</h4>
              <div style={{ position: 'relative', height: '2rem', backgroundColor: '#e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                {/* 그레이엄 넘버 위치 */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  backgroundColor: '#10b981',
                  transform: 'translateX(-50%)'
                }} />
                {/* 현재 주가 위치 */}
                <div style={{
                  position: 'absolute',
                  left: `${Math.min(Math.max((inputs.currentPrice / result.grahamNumber) * 50, 5), 95)}%`,
                  top: '50%',
                  width: '12px',
                  height: '12px',
                  backgroundColor: inputs.currentPrice < result.grahamNumber ? '#3b82f6' : '#ef4444',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid white'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <span>0</span>
                <span style={{ color: '#10b981' }}>그레이엄 넘버</span>
                <span>2x</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 벤자민 그레이엄 인용 */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        borderLeft: '4px solid #f59e0b',
        backgroundColor: '#fffbeb',
        borderRadius: '0 0.5rem 0.5rem 0'
      }}>
        <p style={{ fontStyle: 'italic', color: '#78350f' }}>
          "투자의 비결을 세 단어로 요약하면: 안전마진(Margin of Safety)."
        </p>
        <p style={{ fontWeight: '600', color: '#f59e0b', marginTop: '0.5rem', fontSize: '0.875rem' }}>
          — 벤자민 그레이엄
        </p>
      </div>
    </div>
  );
};

export default GrahamNumberCalculator;
