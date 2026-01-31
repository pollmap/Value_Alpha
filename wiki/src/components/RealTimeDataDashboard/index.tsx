import React, { useEffect, useRef, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

type TabType = 'overview' | 'korea' | 'us' | 'forex' | 'commodities' | 'crypto' | 'screener';

interface TickerTapeProps {
  symbols: Array<{ proName: string; title: string }>;
}

const TickerTape: React.FC<TickerTapeProps> = ({ symbols }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols,
      showSymbolLogo: true,
      colorTheme: isDarkMode ? 'dark' : 'light',
      isTransparent: false,
      displayMode: 'adaptive',
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
  }, [symbols]);

  return <div ref={containerRef} style={{ marginBottom: '1rem' }} />;
};

interface MiniChartProps {
  symbol: string;
  width?: string | number;
  height?: number;
}

const MiniChart: React.FC<MiniChartProps> = ({ symbol, width = '100%', height = 220 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: width,
      height: height,
      locale: 'kr',
      dateRange: '12M',
      colorTheme: isDarkMode ? 'dark' : 'light',
      isTransparent: false,
      autosize: true,
      largeChartUrl: '',
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
  }, [symbol, width, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
      }}
    />
  );
};

interface SymbolOverviewProps {
  symbols: string[][];
  height?: number;
}

const SymbolOverview: React.FC<SymbolOverviewProps> = ({ symbols, height = 500 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: symbols,
      chartOnly: false,
      width: '100%',
      height: height,
      locale: 'kr',
      colorTheme: isDarkMode ? 'dark' : 'light',
      autosize: true,
      showVolume: true,
      showMA: true,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      maLineColor: '#2962FF',
      maLineWidth: 1,
      maLength: 9,
      lineWidth: 2,
      lineType: 0,
      dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
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
  }, [symbols, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface MarketOverviewProps {
  tabs: Array<{
    title: string;
    symbols: Array<{ s: string; d?: string }>;
    originalTitle: string;
  }>;
  height?: number;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ tabs, height = 450 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: isDarkMode ? 'dark' : 'light',
      dateRange: '12M',
      showChart: true,
      locale: 'kr',
      width: '100%',
      height: height,
      largeChartUrl: '',
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
      plotLineColorFalling: 'rgba(255, 77, 92, 1)',
      gridLineColor: 'rgba(240, 243, 250, 0)',
      scaleFontColor: 'rgba(106, 109, 120, 1)',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorFalling: 'rgba(255, 77, 92, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
      belowLineFillColorFallingBottom: 'rgba(255, 77, 92, 0)',
      symbolActiveColor: 'rgba(41, 98, 255, 0.12)',
      tabs: tabs,
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
  }, [tabs, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface ScreenerProps {
  market: 'korea' | 'america' | 'crypto';
  height?: number;
}

const Screener: React.FC<ScreenerProps> = ({ market, height = 550 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: height,
      defaultColumn: 'overview',
      defaultScreen: 'most_capitalized',
      market: market,
      showToolbar: true,
      colorTheme: isDarkMode ? 'dark' : 'light',
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
  }, [market, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface HeatmapProps {
  dataSource: 'SPX500' | 'KOSPI';
  height?: number;
}

const Heatmap: React.FC<HeatmapProps> = ({ dataSource, height = 500 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: dataSource,
      grouping: 'sector',
      blockSize: 'market_cap_basic',
      blockColor: 'change',
      locale: 'kr',
      symbolUrl: '',
      colorTheme: isDarkMode ? 'dark' : 'light',
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: '100%',
      height: height,
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
  }, [dataSource, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface TechnicalAnalysisProps {
  symbol: string;
  height?: number;
}

const TechnicalAnalysis: React.FC<TechnicalAnalysisProps> = ({ symbol, height = 450 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      interval: '1D',
      width: '100%',
      isTransparent: false,
      height: height,
      symbol: symbol,
      showIntervalTabs: true,
      locale: 'kr',
      colorTheme: isDarkMode ? 'dark' : 'light',
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
  }, [symbol, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface ForexCrossRatesProps {
  currencies: string[];
  height?: number;
}

const ForexCrossRates: React.FC<ForexCrossRatesProps> = ({ currencies, height = 400 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: height,
      currencies: currencies,
      isTransparent: false,
      colorTheme: isDarkMode ? 'dark' : 'light',
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
  }, [currencies, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface ForexHeatmapProps {
  currencies: string[];
  height?: number;
}

const ForexHeatmap: React.FC<ForexHeatmapProps> = ({ currencies, height = 400 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: height,
      currencies: currencies,
      isTransparent: false,
      colorTheme: isDarkMode ? 'dark' : 'light',
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
  }, [currencies, height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

interface EconomicCalendarWidgetProps {
  height?: number;
}

const EconomicCalendarWidget: React.FC<EconomicCalendarWidgetProps> = ({ height = 450 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: isDarkMode ? 'dark' : 'light',
      isTransparent: false,
      width: '100%',
      height: height,
      locale: 'kr',
      importanceFilter: '-1,0,1',
      countryFilter: 'kr,us,cn,jp,eu',
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
  }, [height]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--ifm-color-emphasis-300)',
        marginBottom: '1rem',
      }}
    />
  );
};

const RealTimeDataDashboardInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tickerSymbols = [
    { proName: 'TVC:KOSPI', title: 'KOSPI' },
    { proName: 'KRX:KOSDAQ', title: 'KOSDAQ' },
    { proName: 'FX:USDKRW', title: 'USD/KRW' },
    { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
    { proName: 'NASDAQ:NDX', title: 'NASDAQ 100' },
    { proName: 'TVC:DJI', title: 'Dow Jones' },
    { proName: 'TVC:US10Y', title: 'US 10Y' },
    { proName: 'FOREXCOM:XAUUSD', title: 'Gold' },
    { proName: 'TVC:USOIL', title: 'WTI' },
    { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '종합 현황' },
    { id: 'korea', label: '한국 시장' },
    { id: 'us', label: '미국 시장' },
    { id: 'forex', label: '외환' },
    { id: 'commodities', label: '원자재' },
    { id: 'crypto', label: '암호화폐' },
    { id: 'screener', label: '스크리너' },
  ];

  const marketOverviewTabs = [
    {
      title: '주식',
      symbols: [
        { s: 'TVC:KOSPI', d: 'KOSPI' },
        { s: 'KRX:KOSDAQ', d: 'KOSDAQ' },
        { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
        { s: 'NASDAQ:NDX', d: 'NASDAQ 100' },
        { s: 'TVC:DJI', d: 'Dow Jones' },
        { s: 'TVC:NI225', d: 'Nikkei 225' },
        { s: 'TVC:HSI', d: 'Hang Seng' },
        { s: 'TVC:SHCOMP', d: 'Shanghai' },
      ],
      originalTitle: 'Indices',
    },
    {
      title: '외환',
      symbols: [
        { s: 'FX:USDKRW', d: 'USD/KRW' },
        { s: 'FX:EURUSD', d: 'EUR/USD' },
        { s: 'FX:USDJPY', d: 'USD/JPY' },
        { s: 'FX:GBPUSD', d: 'GBP/USD' },
        { s: 'FX:USDCNY', d: 'USD/CNY' },
        { s: 'TVC:DXY', d: 'Dollar Index' },
      ],
      originalTitle: 'Forex',
    },
    {
      title: '원자재',
      symbols: [
        { s: 'FOREXCOM:XAUUSD', d: 'Gold' },
        { s: 'FOREXCOM:XAGUSD', d: 'Silver' },
        { s: 'TVC:USOIL', d: 'WTI Oil' },
        { s: 'TVC:UKOIL', d: 'Brent Oil' },
        { s: 'TVC:NI1!', d: 'Nickel' },
        { s: 'TVC:COPPER', d: 'Copper' },
      ],
      originalTitle: 'Commodities',
    },
    {
      title: '채권',
      symbols: [
        { s: 'TVC:US10Y', d: 'US 10Y' },
        { s: 'TVC:US02Y', d: 'US 2Y' },
        { s: 'TVC:US30Y', d: 'US 30Y' },
        { s: 'TVC:DE10Y', d: 'Germany 10Y' },
        { s: 'TVC:JP10Y', d: 'Japan 10Y' },
        { s: 'TVC:KR10Y', d: 'Korea 10Y' },
      ],
      originalTitle: 'Bonds',
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>글로벌 시장 종합 현황</h3>
            <MarketOverview tabs={marketOverviewTabs} height={500} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>주요 지수 미니 차트</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <MiniChart symbol="TVC:KOSPI" />
              <MiniChart symbol="FOREXCOM:SPXUSD" />
              <MiniChart symbol="NASDAQ:NDX" />
              <MiniChart symbol="FX:USDKRW" />
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>경제 캘린더</h3>
            <EconomicCalendarWidget height={400} />
          </>
        );

      case 'korea':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>한국 시장 상세</h3>
            <SymbolOverview
              symbols={[
                ['TVC:KOSPI', 'KOSPI'],
                ['KRX:KOSDAQ', 'KOSDAQ'],
                ['KRX:005930', '삼성전자'],
                ['KRX:000660', 'SK하이닉스'],
              ]}
              height={500}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>KOSPI 기술적 분석</h3>
            <TechnicalAnalysis symbol="TVC:KOSPI" height={450} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>한국 시장 스크리너</h3>
            <Screener market="korea" height={500} />
          </>
        );

      case 'us':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>미국 시장 상세</h3>
            <SymbolOverview
              symbols={[
                ['FOREXCOM:SPXUSD', 'S&P 500'],
                ['NASDAQ:NDX', 'NASDAQ 100'],
                ['TVC:DJI', 'Dow Jones'],
                ['TVC:RUT', 'Russell 2000'],
              ]}
              height={500}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>S&P 500 히트맵</h3>
            <Heatmap dataSource="SPX500" height={500} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>S&P 500 기술적 분석</h3>
            <TechnicalAnalysis symbol="FOREXCOM:SPXUSD" height={450} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>미국 시장 스크리너</h3>
            <Screener market="america" height={500} />
          </>
        );

      case 'forex':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>외환 시장</h3>
            <SymbolOverview
              symbols={[
                ['FX:USDKRW', 'USD/KRW'],
                ['FX:EURUSD', 'EUR/USD'],
                ['FX:USDJPY', 'USD/JPY'],
                ['TVC:DXY', 'Dollar Index'],
              ]}
              height={500}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>통화 교차 환율표</h3>
            <ForexCrossRates currencies={['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'KRW', 'CNY']} height={400} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>외환 히트맵</h3>
            <ForexHeatmap currencies={['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'KRW', 'CNY']} height={400} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>USD/KRW 기술적 분석</h3>
            <TechnicalAnalysis symbol="FX:USDKRW" height={450} />
          </>
        );

      case 'commodities':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>원자재 시장</h3>
            <SymbolOverview
              symbols={[
                ['FOREXCOM:XAUUSD', 'Gold'],
                ['TVC:USOIL', 'WTI Crude'],
                ['TVC:UKOIL', 'Brent Crude'],
                ['TVC:COPPER', 'Copper'],
              ]}
              height={500}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>금 기술적 분석</h4>
                <TechnicalAnalysis symbol="FOREXCOM:XAUUSD" height={400} />
              </div>
              <div>
                <h4 style={{ marginBottom: '0.5rem' }}>WTI 기술적 분석</h4>
                <TechnicalAnalysis symbol="TVC:USOIL" height={400} />
              </div>
            </div>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>원자재 미니 차트</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <MiniChart symbol="FOREXCOM:XAUUSD" height={200} />
              <MiniChart symbol="FOREXCOM:XAGUSD" height={200} />
              <MiniChart symbol="TVC:USOIL" height={200} />
              <MiniChart symbol="TVC:UKOIL" height={200} />
              <MiniChart symbol="TVC:COPPER" height={200} />
              <MiniChart symbol="TVC:NATURALGAS" height={200} />
            </div>
          </>
        );

      case 'crypto':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>암호화폐 시장</h3>
            <SymbolOverview
              symbols={[
                ['BITSTAMP:BTCUSD', 'Bitcoin'],
                ['BITSTAMP:ETHUSD', 'Ethereum'],
                ['BINANCE:BNBUSDT', 'BNB'],
                ['BINANCE:SOLUSDT', 'Solana'],
              ]}
              height={500}
            />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Bitcoin 기술적 분석</h3>
            <TechnicalAnalysis symbol="BITSTAMP:BTCUSD" height={450} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>암호화폐 스크리너</h3>
            <Screener market="crypto" height={500} />

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>주요 암호화폐 미니 차트</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <MiniChart symbol="BITSTAMP:BTCUSD" height={200} />
              <MiniChart symbol="BITSTAMP:ETHUSD" height={200} />
              <MiniChart symbol="BINANCE:BNBUSDT" height={200} />
              <MiniChart symbol="BINANCE:SOLUSDT" height={200} />
            </div>
          </>
        );

      case 'screener':
        return (
          <>
            <h3 style={{ marginBottom: '1rem' }}>글로벌 주식 스크리너</h3>

            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>한국 시장</h4>
            <Screener market="korea" height={450} />

            <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>미국 시장</h4>
            <Screener market="america" height={450} />

            <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>암호화폐</h4>
            <Screener market="crypto" height={450} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '1rem 0' }}>
      {/* Ticker Tape */}
      <div style={{ marginBottom: '1.5rem' }}>
        <TickerTape symbols={tickerSymbols} />
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--ifm-color-emphasis-300)',
          paddingBottom: '0.5rem',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 400,
              backgroundColor: activeTab === tab.id ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-100)',
              color: activeTab === tab.id ? 'white' : 'var(--ifm-font-color-base)',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>

      {/* Footer */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--ifm-color-emphasis-100)',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: 'var(--ifm-color-emphasis-700)',
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>면책조항:</strong> 본 데이터는 TradingView에서 제공하며, 투자 참고용으로만 활용하시기 바랍니다.
          실제 투자 결정은 반드시 공인된 자료와 전문가의 조언을 참고하시기 바랍니다.
          데이터는 최대 15분 지연될 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default function RealTimeDataDashboard() {
  return (
    <BrowserOnly fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>실시간 데이터 대시보드 로딩 중...</div>}>
      {() => <RealTimeDataDashboardInner />}
    </BrowserOnly>
  );
}
