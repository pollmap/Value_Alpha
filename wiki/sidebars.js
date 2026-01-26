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
        'technical/intro',
        'technical/candlestick',
        'technical/moving-average',
        'technical/trend',
        'technical/indicators',
        'technical/bollinger',
        'technical/volume',
        'technical/fibonacci',
        'technical/stochastic',
        'technical/adx',
        'technical/atr',
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
            'assets/real-estate/intro',
            'assets/real-estate/residential',
            'assets/real-estate/commercial',
          ],
        },
        {
          type: 'category',
          label: '암호화폐',
          items: [
            'assets/crypto/intro',
            'assets/crypto/bitcoin',
            'assets/crypto/ethereum',
            'assets/crypto/altcoins',
          ],
        },
        {
          type: 'category',
          label: '채권',
          items: [
            'assets/bonds/intro',
          ],
        },
        {
          type: 'category',
          label: '파생상품',
          items: [
            'assets/derivatives/options-basics',
            'assets/derivatives/greeks',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: '투자 대가',
      items: [
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
        'calculators/option-greeks',
        'calculators/bond',
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
