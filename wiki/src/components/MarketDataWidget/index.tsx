import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface MarketDataWidgetProps {
  symbols?: string[];
  height?: number;
  colorTheme?: 'light' | 'dark';
}

const MarketDataWidgetInner: React.FC<MarketDataWidgetProps> = ({
  symbols = [
    'KRX:KOSPI',
    'KRX:KOSDAQ',
    'FX_IDC:USDKRW',
    'NASDAQ:QQQ',
    'SP:SPX',
    'TVC:US10Y',
  ],
  height = 400,
  colorTheme = 'light',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const theme = isDarkMode ? 'dark' : colorTheme;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: height,
      symbolsGroups: [
        {
          name: '한국 시장',
          symbols: [
            { name: 'TVC:KOSPI', displayName: 'KOSPI' },
            { name: 'KRX:KOSDAQ', displayName: 'KOSDAQ' },
            { name: 'FX:USDKRW', displayName: 'USD/KRW 환율' },
          ],
        },
        {
          name: '미국 시장',
          symbols: [
            { name: 'FOREXCOM:SPXUSD', displayName: 'S&P 500' },
            { name: 'NASDAQ:NDX', displayName: 'NASDAQ 100' },
            { name: 'TVC:DJI', displayName: 'Dow Jones' },
          ],
        },
        {
          name: '금리 & 원자재',
          symbols: [
            { name: 'TVC:US10Y', displayName: '미국 10년 금리' },
            { name: 'FOREXCOM:XAUUSD', displayName: '금 (XAUUSD)' },
            { name: 'TVC:USOIL', displayName: 'WTI 원유' },
          ],
        },
      ],
      showSymbolLogo: true,
      colorTheme: theme,
      isTransparent: false,
      locale: 'kr',
    });

    containerRef.current.innerHTML = '';
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [height, colorTheme]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        ref={containerRef}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--ifm-color-emphasis-300)',
        }}
      />
      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * 실시간 데이터는 TradingView 제공. 15분 지연될 수 있습니다.
      </p>
    </div>
  );
};

export default function MarketDataWidget(props: MarketDataWidgetProps) {
  return (
    <BrowserOnly fallback={<div>시장 데이터 로딩 중...</div>}>
      {() => <MarketDataWidgetInner {...props} />}
    </BrowserOnly>
  );
}
