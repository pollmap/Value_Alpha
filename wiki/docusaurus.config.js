// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Valuation Academy Wiki',
  tagline: 'DCF부터 디지털자산까지, 모든 밸류에이션의 시작',
  favicon: 'img/favicon.ico',

  url: 'https://pollmap.github.io',
  baseUrl: '/Value_Alpha/',

  organizationName: 'pollmap',
  projectName: 'Value_Alpha',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/pollmap/Value_Alpha/tree/main/wiki/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/valuation-academy-social.png',
      navbar: {
        title: 'Valuation Academy',
        items: [
          {
            type: 'dropdown',
            label: '밸류에이션',
            position: 'left',
            items: [
              { to: '/valuation/dcf/overview', label: 'DCF 분석' },
              { to: '/valuation/relative/overview', label: '상대가치평가' },
              { to: '/valuation/lbo', label: 'LBO 모델링' },
              { to: '/valuation/residual-income', label: '잔여이익모형' },
            ],
          },
          {
            type: 'dropdown',
            label: '기술적 분석',
            position: 'left',
            items: [
              { to: '/technical/intro', label: '개요' },
              { to: '/technical/candlestick', label: '캔들차트' },
              { to: '/technical/moving-average', label: '이동평균선' },
              { to: '/technical/trend', label: '추세 분석' },
            ],
          },
          {
            type: 'dropdown',
            label: '자산별 분석',
            position: 'left',
            items: [
              { to: '/assets/real-estate/intro', label: '부동산' },
              { to: '/assets/crypto/intro', label: '암호화폐' },
              { to: '/assets/bonds/intro', label: '채권' },
              { to: '/assets/derivatives/options-basics', label: '파생상품' },
            ],
          },
          {
            type: 'dropdown',
            label: '투자 대가',
            position: 'left',
            items: [
              { to: '/masters/graham', label: '벤자민 그레이엄' },
              { to: '/masters/buffett', label: '워렌 버핏' },
              { to: '/masters/lynch', label: '피터 린치' },
              { to: '/masters/dalio', label: '레이 달리오' },
              { to: '/masters/marks', label: '하워드 막스' },
            ],
          },
          { to: '/calculators/dcf', label: '계산기', position: 'left' },
          { to: '/glossary/a-c', label: '용어사전', position: 'left' },
          {
            href: 'https://github.com/pollmap/Value_Alpha',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '학습',
            items: [
              { label: '시작하기', to: '/intro' },
              { label: '커리큘럼', to: '/curriculum' },
              { label: '자격증 가이드', to: '/certifications' },
            ],
          },
          {
            title: '도구',
            items: [
              { label: 'DCF 계산기', to: '/calculators/dcf' },
              { label: 'WACC 계산기', to: '/calculators/wacc' },
              { label: '그레이엄 넘버', to: '/calculators/graham-number' },
            ],
          },
          {
            title: '커뮤니티',
            items: [
              { label: 'GitHub', href: 'https://github.com/pollmap/Value_Alpha' },
              { label: '금융자격증 카페', href: 'https://cafe.naver.com/dokkm' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} 이찬희 (Chanhee Lee). Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['python', 'bash', 'json'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
