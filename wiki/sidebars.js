/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    'intro',
    'curriculum',
    'certifications',
    {
      type: 'category',
      label: '기업 밸류에이션',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'DCF 분석',
          items: [
            'valuation/dcf/overview',
            'valuation/dcf/fcff-fcfe',
            'valuation/dcf/wacc',
            'valuation/dcf/terminal-value',
            'valuation/dcf/sensitivity',
          ],
        },
        {
          type: 'category',
          label: '상대가치평가',
          items: [
            'valuation/relative/overview',
            'valuation/relative/per',
            'valuation/relative/pbr',
            'valuation/relative/ev-ebitda',
            'valuation/relative/psr',
          ],
        },
        'valuation/residual-income',
        'valuation/lbo',
      ],
    },
    {
      type: 'category',
      label: '기술적 분석',
      items: [
        'technical/overview',
        {
          type: 'category',
          label: '기술적 지표',
          items: [
            'technical/indicators/rsi',
            'technical/indicators/macd',
            'technical/indicators/bollinger',
            'technical/indicators/stochastic',
            'technical/indicators/volume',
          ],
        },
        {
          type: 'category',
          label: '차트 패턴',
          items: [
            'technical/patterns/head-shoulders',
            'technical/patterns/triangles',
            'technical/patterns/double-top-bottom',
            'technical/patterns/flags-pennants',
          ],
        },
        'technical/elliott-wave',
      ],
    },
    {
      type: 'category',
      label: '자산별 분석',
      items: [
        {
          type: 'category',
          label: '부동산',
          items: [
            'assets/real-estate/income-approach',
            'assets/real-estate/cost-approach',
            'assets/real-estate/comparison-approach',
            'assets/real-estate/reits',
          ],
        },
        {
          type: 'category',
          label: '디지털자산',
          items: [
            'assets/crypto/on-chain',
            'assets/crypto/tokenomics',
            'assets/crypto/nvt-ratio',
            'assets/crypto/defi-metrics',
          ],
        },
        {
          type: 'category',
          label: '채권',
          items: [
            'assets/bonds/pricing',
            'assets/bonds/duration',
            'assets/bonds/convexity',
            'assets/bonds/spreads',
          ],
        },
        {
          type: 'category',
          label: '파생상품',
          items: [
            'assets/derivatives/options-basics',
            'assets/derivatives/greeks',
            'assets/derivatives/black-scholes',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '투자 거장',
      items: [
        'masters/overview',
        'masters/graham',
        'masters/buffett',
        'masters/lynch',
        'masters/fisher',
        'masters/dalio',
        'masters/marks',
        'masters/greenblatt',
        'masters/livermore',
      ],
    },
    {
      type: 'category',
      label: '계산기',
      items: [
        'calculators/dcf',
        'calculators/wacc',
        'calculators/graham-number',
        'calculators/peg-screener',
        'calculators/duration',
        'calculators/option-greeks',
      ],
    },
    {
      type: 'category',
      label: '용어 사전',
      items: [
        'glossary/a-c',
        'glossary/d-f',
        'glossary/g-l',
        'glossary/m-r',
        'glossary/s-z',
      ],
    },
  ],
};

module.exports = sidebars;
