import React, { useState, useEffect } from 'react';

interface MarketIndex {
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}

// Client-side fetch from Yahoo Finance (public API, no key needed)
const SYMBOLS = [
  { symbol: '^KS11', name: 'KOSPI' },
  { symbol: '^KQ11', name: 'KOSDAQ' },
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: 'KRW=X', name: 'USD/KRW' },
  { symbol: 'GC=F', name: 'Gold' },
  { symbol: 'CL=F', name: 'WTI Oil' },
  { symbol: 'BTC-USD', name: 'Bitcoin' },
];

async function fetchMarketData(): Promise<MarketIndex[]> {
  try {
    const symbolList = SYMBOLS.map((s) => s.symbol).join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolList)}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('fetch failed');
    const json = await resp.json();
    const quotes = json?.quoteResponse?.result || [];

    return SYMBOLS.map((s) => {
      const q = quotes.find((qq: any) => qq.symbol === s.symbol);
      if (!q) return { name: s.name, symbol: s.symbol, price: '-', change: '-', changePercent: '-', isPositive: true };
      const price = q.regularMarketPrice?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || '-';
      const change = q.regularMarketChange?.toFixed(2) || '0';
      const pct = q.regularMarketChangePercent?.toFixed(2) || '0';
      const isPositive = (q.regularMarketChange || 0) >= 0;
      return {
        name: s.name, symbol: s.symbol, price,
        change: `${isPositive ? '+' : ''}${change}`,
        changePercent: `${isPositive ? '+' : ''}${pct}%`,
        isPositive,
      };
    });
  } catch {
    // Return fallback static data if API fails (CORS etc.)
    return SYMBOLS.map((s) => ({
      name: s.name, symbol: s.symbol,
      price: '-', change: '-', changePercent: '-', isPositive: true,
    }));
  }
}

export default function MarketOverviewWidget(): JSX.Element {
  const [data, setData] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchMarketData().then((result) => {
      if (!mounted) return;
      setData(result);
      setLoading(false);
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
      if (result.every((r) => r.price === '-')) setError(true);
    });
    return () => { mounted = false; };
  }, []);

  const refresh = () => {
    setLoading(true);
    setError(false);
    fetchMarketData().then((result) => {
      setData(result);
      setLoading(false);
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
      if (result.every((r) => r.price === '-')) setError(true);
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>글로벌 시장 현황</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {lastUpdate && (
            <span style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)' }}>
              {lastUpdate} 기준
            </span>
          )}
          <button
            onClick={refresh}
            disabled={loading}
            style={{
              padding: '4px 12px', borderRadius: 6, fontSize: 12,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'transparent', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '로딩...' : '새로고침'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          padding: 12, borderRadius: 8, marginBottom: 16,
          background: 'var(--ifm-color-warning-contrast-background)',
          border: '1px solid var(--ifm-color-warning)',
          fontSize: 13,
        }}>
          실시간 데이터를 가져올 수 없습니다 (CORS 제한). GitHub Pages 정적 호스팅 환경에서는 일부 외부 API가 차단될 수 있습니다.
          실시간 시세는 <a href="https://finance.yahoo.com" target="_blank" rel="noopener">Yahoo Finance</a>에서 확인하세요.
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 10,
      }}>
        {(loading ? SYMBOLS.map((s) => ({ name: s.name, symbol: s.symbol, price: '-', change: '-', changePercent: '-', isPositive: true })) : data).map((item) => (
          <div
            key={item.symbol}
            style={{
              padding: '14px 16px',
              borderRadius: 10,
              border: '1px solid var(--ifm-color-emphasis-200)',
              background: 'var(--ifm-card-background-color, #fff)',
            }}
          >
            <div style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-600)', marginBottom: 4 }}>{item.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: 60, height: 20, background: 'var(--ifm-color-emphasis-200)', borderRadius: 4, animation: 'pulse 1.5s ease infinite' }} />
              ) : item.price}
            </div>
            {!loading && item.change !== '-' && (
              <div style={{ fontSize: 13, fontWeight: 600, color: item.isPositive ? 'var(--ifm-color-success-dark)' : 'var(--ifm-color-danger-dark)' }}>
                {item.change} ({item.changePercent})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
