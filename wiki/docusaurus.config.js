// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Valuation Academy Wiki',
  tagline: 'DCF부터 디지털자산까지, 모든 밸류에이션의 시작',
  favicon: 'img/favicon.ico',

  url: 'https://wiki.valuation-academy.com',
  baseUrl: '/',

  organizationName: 'valuation-academy',
  projectName: 'wiki',

  onBrokenLinks: 'throw',
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
          editUrl: 'https://github.com/valuation-academy/wiki/tree/main/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
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
        logo: {
          alt: 'VA Logo',
          src: 'img/logo.svg',
        },
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
              { to: '/technical/overview', label: '개요' },
              { to: '/technical/indicators/rsi', label: '기술적 지표' },
              { to: '/technical/patterns/head-shoulders', label: '차트 패턴' },
              { to: '/technical/elliott-wave', label: '엘리엇 파동' },
            ],
          },
          {
            type: 'dropdown',
            label: '자산별 분석',
            position: 'left',
            items: [
              { to: '/assets/real-estate/income-approach', label: '부동산' },
              { to: '/assets/crypto/on-chain', label: '디지털자산' },
              { to: '/assets/bonds/pricing', label: '채권' },
              { to: '/assets/derivatives/options-basics', label: '파생상품' },
            ],
          },
          {
            type: 'dropdown',
            label: '투자 거장',
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
          {
            href: 'https://lms.valuation-academy.com',
            label: '코스 학습',
            position: 'right',
          },
          {
            type: 'search',
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
              { label: 'GitHub', href: 'https://github.com/valuation-academy' },
              { label: 'Discord', href: 'https://discord.gg/valuation' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Valuation Academy. Built with Docusaurus.`,
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
