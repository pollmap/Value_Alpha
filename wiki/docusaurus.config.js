// @ts-check
const { themes } = require('prism-react-renderer');

/** @type {() => Promise<import('@docusaurus/types').Config>} */
module.exports = async function createConfigAsync() {
  const math = (await import('remark-math')).default;
  const katex = (await import('rehype-katex')).default;

  return {
    title: '금융 위키',
    tagline: '투자분석부터 금융권 취업까지, 금융 학습의 모든 것',
    favicon: 'img/favicon.ico',

    url: process.env.SITE_URL || 'https://pollmap.github.io',
    baseUrl: process.env.BASE_URL || '/Value_Alpha/',

    organizationName: 'pollmap',
    projectName: 'Value_Alpha',
    trailingSlash: false,
    deploymentBranch: 'gh-pages',

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    markdown: {
      format: 'detect',
    },

    i18n: {
      defaultLocale: 'ko',
      locales: ['ko'],
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
            remarkPlugins: [math],
            rehypePlugins: [katex],
          },
          blog: false,
          theme: {
            customCss: './src/css/custom.css',
          },
        }),
      ],
    ],

    themes: [
      [
        '@easyops-cn/docusaurus-search-local',
        /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
        ({
          hashed: true,
          language: ['ko'],
          highlightSearchTermsOnTargetPage: true,
          explicitSearchResultPath: true,
          docsRouteBasePath: '/',
          indexBlog: false,
          searchBarShortcutHint: true,
          searchBarPosition: 'right',
          searchResultLimits: 12,
          searchResultContextMaxLength: 80,
          removeDefaultStemmer: true,
        }),
      ],
    ],

    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
        type: 'text/css',
        integrity: 'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
        crossorigin: 'anonymous',
      },
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        image: 'img/valuation-academy-social.png',
        navbar: {
          title: '금융 위키',
          logo: {
            alt: 'Value Alpha',
            src: 'img/VA-LOGO.png',
            width: 32,
            height: 32,
          },
          items: [
            {
              type: 'dropdown',
              label: '투자분석 체계',
              position: 'left',
              items: [
                { to: '/foundation/overview', label: 'Layer 1 · 기초 회계' },
                { to: '/financial-analysis/overview', label: 'Layer 2 · 재무제표 분석' },
                { to: '/industry-analysis/overview', label: 'Layer 3 · 산업분석' },
                { to: '/company-analysis/overview', label: 'Layer 4 · 기업분석' },
              ],
            },
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
              label: '거시경제',
              position: 'left',
              items: [
                { to: '/macroeconomics/overview', label: '거시경제 개요' },
                { to: '/macroeconomics/economic-indicators', label: '경제 지표' },
                { to: '/macroeconomics/central-banks', label: '중앙은행 & 통화정책' },
                { to: '/macroeconomics/fiscal-policy', label: '재정정책 & 정부' },
                { to: '/macroeconomics/money-and-currency', label: '화폐 & 환율' },
                { to: '/macroeconomics/business-cycles', label: '경기 순환 & 투자' },
              ],
            },
            {
              type: 'dropdown',
              label: '금융 산업 & 기업',
              position: 'left',
              items: [
                { to: '/banking-industry/', label: '은행 산업 가이드' },
                { to: '/securities-industry/', label: '증권 산업 가이드' },
                { to: '/insurance-industry/', label: '보험 산업 가이드' },
                { to: '/card-capital-industry/', label: '여신금융 산업 가이드' },
                { to: '/asset-management-industry/', label: '자산운용 산업 가이드' },
                { to: '/actuarial/overview', label: '보험 계리' },
                { to: '/companies', label: '금융권 기업 총람' },
                { to: '/companies/banks', label: '은행' },
                { to: '/companies/securities', label: '증권사' },
                { to: '/companies/insurance', label: '보험사' },
              ],
            },
            {
              type: 'dropdown',
              label: '취업 & 커리어',
              position: 'left',
              items: [
                { to: '/career', label: '취업 종합 가이드' },
                { to: '/career/job-categories', label: '직무 종류 및 특성' },
                { to: '/career/requirements', label: '합격 요건 분석' },
                { to: '/career/competitions', label: '대회 & 포트폴리오' },
                { to: '/career/roadmap', label: '취업 로드맵' },
                { to: '/certifications', label: '자격증 가이드' },
                { to: '/finance-mbti', label: '금융 성향 테스트' },
                { to: '/market-survivor', label: '투자 시뮬레이션' },
              ],
            },
            {
              type: 'dropdown',
              label: '분석 도구',
              position: 'left',
              items: [
                { to: '/technical/intro', label: '기술적 분석' },
                { to: '/calculators/dcf', label: 'DCF 계산기' },
                { to: '/calculators/wacc', label: 'WACC 계산기' },
                { to: '/calculators/graham-number', label: '그레이엄 넘버' },
                { to: '/modeling-tools/overview', label: '모델링 도구' },
              ],
            },
            {
              type: 'dropdown',
              label: '실전 & 참고',
              position: 'left',
              items: [
                { to: '/case-studies/samsung-electronics', label: '기업 케이스 스터디' },
                { to: '/risk-management/overview', label: '리스크 관리' },
                { to: '/trading-strategies/overview', label: '매매 전략' },
                { to: '/assets/real-estate/intro', label: '부동산 투자 가이드' },
                { to: '/assets/real-estate/practical-guide', label: '방 구하기 실전 가이드' },
                { to: '/assets/crypto/intro', label: '암호화폐' },
                { to: '/assets/bonds/intro', label: '채권' },
                { to: '/masters/graham', label: '투자 대가' },
                { to: '/glossary/a-c', label: '용어사전' },
                { to: '/quiz/accounting-basics', label: '학습 퀴즈' },
              ],
            },
            {
              to: '/community',
              label: '커뮤니티',
              position: 'right',
            },
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
                { label: '시작하기', to: '/' },
                { label: '커리큘럼', to: '/curriculum' },
                { label: '자격증 가이드', to: '/certifications' },
                { label: '금융 성향 테스트', to: '/finance-mbti' },
              ],
            },
            {
              title: '취업 & 커리어',
              items: [
                { label: '취업 종합 가이드', to: '/career' },
                { label: '금융권 기업 총람', to: '/companies' },
                { label: '직무 종류', to: '/career/job-categories' },
                { label: '취업 로드맵', to: '/career/roadmap' },
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
                { label: '토론 게시판', to: '/community' },
                { label: 'GitHub', href: 'https://github.com/pollmap/Value_Alpha' },
                { label: '금융자격증 카페', href: 'https://cafe.naver.com/dokkm' },
              ],
            },
          ],
          copyright: `Copyright © ${new Date().getFullYear()} Value Alpha. Built with Docusaurus.`,
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
};
