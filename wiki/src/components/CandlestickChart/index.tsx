import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface CandlestickChartProps {
  symbol?: string;
  height?: number;
}

const CandlestickChartInner: React.FC<CandlestickChartProps> = ({
  symbol = 'KRX:005930',
  height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Asia/Seoul',
      theme: isDarkMode ? 'dark' : 'light',
      style: '1',
      locale: 'kr',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      studies: [
        'MASimple@tv-basicstudies',
        'RSI@tv-basicstudies',
        'Volume@tv-basicstudies',
      ],
      hide_side_toolbar: false,
      details: true,
      hotlist: true,
      withdateranges: true,
    });

    containerRef.current.innerHTML = '';
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container';
    widgetContainer.style.height = `${height}px`;
    widgetContainer.style.width = '100%';

    const widgetInner = document.createElement('div');
    widgetInner.className = 'tradingview-widget-container__widget';
    widgetInner.style.height = '100%';
    widgetInner.style.width = '100%';

    widgetContainer.appendChild(widgetInner);
    widgetContainer.appendChild(script);
    containerRef.current.appendChild(widgetContainer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, height]);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div
        ref={containerRef}
        style={{
          height: `${height}px`,
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid var(--ifm-color-emphasis-300)',
        }}
      />
      <p style={{ fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-600)', marginTop: '0.5rem' }}>
        * 차트 데이터는 TradingView 제공. 종목 검색 및 지표 추가가 가능합니다.
      </p>
    </div>
  );
};

export default function CandlestickChart(props: CandlestickChartProps) {
  return (
    <BrowserOnly fallback={<div>차트 로딩 중...</div>}>
      {() => <CandlestickChartInner {...props} />}
    </BrowserOnly>
  );
}
