/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    // ─────────────────────────────────────────────
    // 시작하기
    // ─────────────────────────────────────────────
    'intro',
    'curriculum',
    'tools/tools-hub',

    // ═════════════════════════════════════════════
    // 대 카테고리 1: 투자분석 체계
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '투자분석 체계',
      collapsed: true,
      items: [
        // Layer 1: 기초 회계
        {
          type: 'category',
          label: 'Layer 1 · 기초 회계',
          collapsed: true,
          items: [
            'foundation/overview',
            {
              type: 'category',
              label: '회계 기초',
              items: [
                'foundation/accounting-basics/intro',
                'foundation/accounting-basics/accrual-vs-cash',
                'foundation/accounting-basics/accounting-equation',
                'foundation/accounting-basics/double-entry',
                'foundation/accounting-basics/k-gaap-vs-ifrs',
              ],
            },
            {
              type: 'category',
              label: '재무상태표',
              items: [
                'foundation/balance-sheet/intro',
                {
                  type: 'category',
                  label: '자산',
                  items: [
                    'foundation/balance-sheet/assets/current-assets',
                    'foundation/balance-sheet/assets/non-current-assets',
                    'foundation/balance-sheet/assets/intangibles',
                    'foundation/balance-sheet/assets/investment-property',
                  ],
                },
                {
                  type: 'category',
                  label: '부채',
                  items: [
                    'foundation/balance-sheet/liabilities/current-liabilities',
                    'foundation/balance-sheet/liabilities/non-current-liabilities',
                    'foundation/balance-sheet/liabilities/provisions',
                    'foundation/balance-sheet/liabilities/lease-liabilities',
                  ],
                },
                {
                  type: 'category',
                  label: '자본',
                  items: [
                    'foundation/balance-sheet/equity/components',
                    'foundation/balance-sheet/equity/retained-earnings',
                    'foundation/balance-sheet/equity/treasury-stock',
                  ],
                },
              ],
            },
            {
              type: 'category',
              label: '손익계산서',
              items: [
                'foundation/income-statement/intro',
                'foundation/income-statement/operating-income',
              ],
            },
            {
              type: 'category',
              label: '현금흐름표',
              items: [
                'foundation/cash-flow/intro',
                'foundation/cash-flow/fcf-derivation',
              ],
            },
            {
              type: 'category',
              label: '3표 연결',
              items: [
                'foundation/three-statement-link/intro',
              ],
            },
          ],
        },

        // Layer 2: 재무제표 분석
        {
          type: 'category',
          label: 'Layer 2 · 재무제표 분석',
          collapsed: true,
          items: [
            'financial-analysis/overview',
            {
              type: 'category',
              label: '수익성 분석',
              items: [
                'financial-analysis/profitability/margin-analysis',
                'financial-analysis/profitability/return-analysis',
                'financial-analysis/profitability/dupont',
              ],
            },
            {
              type: 'category',
              label: '성장성 분석',
              items: [
                'financial-analysis/growth/revenue-growth',
                'financial-analysis/growth/earnings-growth',
                'financial-analysis/growth/sustainable-growth',
              ],
            },
            {
              type: 'category',
              label: '안정성 분석',
              items: [
                'financial-analysis/stability/debt-ratio',
                'financial-analysis/stability/liquidity',
              ],
            },
            {
              type: 'category',
              label: '효율성 분석',
              items: [
                'financial-analysis/efficiency/asset-turnover',
              ],
            },
            {
              type: 'category',
              label: '밸류에이션 멀티플',
              items: [
                'financial-analysis/valuation-multiples/overview',
              ],
            },
          ],
        },

        // Layer 3: 산업분석
        {
          type: 'category',
          label: 'Layer 3 · 산업분석',
          collapsed: true,
          items: [
            'industry-analysis/overview',
            {
              type: 'category', label: 'IT/반도체', collapsed: true,
              items: ['industry-analysis/it/intro', 'industry-analysis/it/key-metrics', 'industry-analysis/it/value-chain'],
            },
            {
              type: 'category', label: '헬스케어', collapsed: true,
              items: ['industry-analysis/healthcare/intro', 'industry-analysis/healthcare/key-metrics', 'industry-analysis/healthcare/value-chain'],
            },
            {
              type: 'category', label: '금융', collapsed: true,
              items: ['industry-analysis/financials/intro', 'industry-analysis/financials/key-metrics', 'industry-analysis/financials/value-chain'],
            },
            {
              type: 'category', label: '경기소비재', collapsed: true,
              items: ['industry-analysis/consumer-discretionary/intro', 'industry-analysis/consumer-discretionary/key-metrics', 'industry-analysis/consumer-discretionary/value-chain'],
            },
            {
              type: 'category', label: '필수소비재', collapsed: true,
              items: ['industry-analysis/consumer-staples/intro', 'industry-analysis/consumer-staples/key-metrics', 'industry-analysis/consumer-staples/value-chain'],
            },
            {
              type: 'category', label: '산업재', collapsed: true,
              items: ['industry-analysis/industrials/intro', 'industry-analysis/industrials/key-metrics', 'industry-analysis/industrials/value-chain'],
            },
            {
              type: 'category', label: '소재', collapsed: true,
              items: ['industry-analysis/materials/intro', 'industry-analysis/materials/key-metrics', 'industry-analysis/materials/value-chain'],
            },
            {
              type: 'category', label: '에너지', collapsed: true,
              items: ['industry-analysis/energy/intro', 'industry-analysis/energy/key-metrics', 'industry-analysis/energy/value-chain'],
            },
            {
              type: 'category', label: '유틸리티', collapsed: true,
              items: ['industry-analysis/utilities/intro', 'industry-analysis/utilities/key-metrics', 'industry-analysis/utilities/value-chain'],
            },
            {
              type: 'category', label: '부동산', collapsed: true,
              items: ['industry-analysis/real-estate-sector/intro', 'industry-analysis/real-estate-sector/key-metrics', 'industry-analysis/real-estate-sector/value-chain'],
            },
            {
              type: 'category', label: '커뮤니케이션', collapsed: true,
              items: ['industry-analysis/communication-services/intro', 'industry-analysis/communication-services/key-metrics', 'industry-analysis/communication-services/value-chain'],
            },
          ],
        },

        // Layer 4: 기업분석 + 케이스 스터디
        {
          type: 'category',
          label: 'Layer 4 · 기업분석',
          collapsed: true,
          items: [
            'company-analysis/overview',
            {
              type: 'category',
              label: '정성적 분석',
              items: [
                'company-analysis/qualitative/business-model',
                'company-analysis/qualitative/competitive-advantage',
                'company-analysis/qualitative/management',
                'company-analysis/qualitative/governance',
              ],
            },
            {
              type: 'category',
              label: '정량적 분석',
              items: [
                'company-analysis/quantitative/financial-modeling',
                'company-analysis/quantitative/scenario-analysis',
              ],
            },
            {
              type: 'category',
              label: '밸류에이션 실전',
              items: [
                'company-analysis/valuation-practice/dcf-practice',
                'company-analysis/valuation-practice/sotp',
              ],
            },
            {
              type: 'category',
              label: '보고서 작성',
              items: [
                'company-analysis/report-writing/equity-research',
              ],
            },
            'company-analysis/dart-guide',
            {
              type: 'category',
              label: '케이스 스터디',
              items: [
                'case-studies/samsung-electronics',
                'case-studies/sk-hynix',
                'case-studies/hyundai-motor',
                'case-studies/naver',
                'case-studies/celltrion',
              ],
            },
          ],
        },

        // 밸류에이션
        {
          type: 'category',
          label: '밸류에이션',
          collapsed: true,
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
      ],
    },

    // ═════════════════════════════════════════════
    // 대 카테고리 2: 자산 & 시장
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '자산 & 시장',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '거시경제',
          items: [
            'macroeconomics/overview',
            'macroeconomics/economic-indicators',
            'macroeconomics/central-banks',
            'macroeconomics/fiscal-policy',
            'macroeconomics/money-and-currency',
            'macroeconomics/business-cycles',
          ],
        },
        {
          type: 'category',
          label: '채권',
          items: [
            'assets/bonds/intro',
            'assets/bonds/government-bonds',
            'assets/bonds/credit-analysis',
            'assets/bonds/corporate-bonds',
            'assets/bonds/bond-strategies',
            'assets/bonds/bond-math',
            'assets/bonds/repo-money-market',
            'assets/bonds/inflation-linked',
            'assets/bonds/emerging-market-bonds',
            'assets/bonds/structured-credit',
          ],
        },
        {
          type: 'category',
          label: '파생상품',
          items: [
            'assets/derivatives/options-basics',
            'assets/derivatives/greeks',
            'assets/derivatives/futures',
            'assets/derivatives/options-pricing',
            'assets/derivatives/options-strategies',
            'assets/derivatives/volatility',
            'assets/derivatives/exotic-options',
            'assets/derivatives/swaps',
            'assets/derivatives/credit-derivatives',
            'assets/derivatives/commodity-derivatives',
            'assets/derivatives/structured-products',
            'assets/derivatives/risk-management-derivatives',
          ],
        },
        {
          type: 'category',
          label: '부동산',
          items: [
            'assets/real-estate/intro',
            'assets/real-estate/housing-types',
            'assets/real-estate/registration',
            'assets/real-estate/transactions',
            'assets/real-estate/subscription',
            'assets/real-estate/presale',
            'assets/real-estate/mortgage',
            'assets/real-estate/taxes',
            'assets/real-estate/land',
            'assets/real-estate/auction',
            'assets/real-estate/development',
            'assets/real-estate/rental-business',
            'assets/real-estate/market-analysis',
            'assets/real-estate/practical-guide',
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
            'assets/crypto/defi',
            'assets/crypto/layer2-scaling',
            'assets/crypto/staking-yield',
            'assets/crypto/nft-tokenization',
            'assets/crypto/crypto-trading',
            'assets/crypto/crypto-security',
            'assets/crypto/crypto-regulation',
            'assets/crypto/crypto-macro',
          ],
        },
        {
          type: 'category',
          label: '매매 전략',
          items: [
            'trading-strategies/overview',
            'trading-strategies/value-investing',
            'trading-strategies/momentum',
            'trading-strategies/swing-trading',
            'trading-strategies/quant',
            'trading-strategies/event-driven',
            'trading-strategies/market-microstructure',
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════
    // 대 카테고리 3: 리스크 & 포트폴리오
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '리스크 & 포트폴리오',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '리스크 관리',
          items: [
            'risk-management/overview',
            'risk-management/position-sizing',
            'risk-management/portfolio-construction',
            'risk-management/var-risk-metrics',
            'risk-management/stop-loss',
            'risk-management/hedging',
            'risk-management/behavioral-finance',
            'risk-management/drawdown-management',
            'risk-management/correlation-diversification',
            'risk-management/risk-adjusted-returns',
            'risk-management/stress-testing',
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
      ],
    },

    // ═════════════════════════════════════════════
    // 대 카테고리 4: 금융권 커리어
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '금융권 커리어',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '산업 가이드',
          items: [
            'banking-industry/index',
            'securities-industry/index',
            'insurance-industry/index',
            'card-capital-industry/index',
            'asset-management-industry/index',
            'crypto-industry/index',
            {
              type: 'category',
              label: '보험 계리',
              items: [
                'actuarial/overview',
                'actuarial/ifrs17',
                'actuarial/risk-capital',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: '기업 총람',
          items: [
            'companies/index',
            'companies/banks',
            'companies/securities',
            'companies/insurance',
            'companies/cards-capital',
            'companies/savings-asset',
            'companies/vc-fintech',
            'companies/public-infra',
            'companies/crypto',
          ],
        },
        {
          type: 'category',
          label: '취업 가이드',
          items: [
            'career/index',
            'career/job-categories',
            'career/requirements',
            'career/competitions',
            'career/roadmap',
            'certifications',
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════
    // 대 카테고리 5: 도구 & 계산기
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '도구 & 계산기',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '밸류에이션 계산기',
          items: [
            'calculators/dcf',
            'calculators/guided-dcf',
            'calculators/wacc',
            'calculators/graham-number',
            'calculators/dupont',
            'calculators/roic',
            'calculators/ddm',
            'calculators/per-band',
            'calculators/football-field',
            'calculators/peg-screener',
          ],
        },
        {
          type: 'category',
          label: '리스크 & 채권 계산기',
          items: [
            'calculators/kelly',
            'calculators/bond',
            'calculators/option-greeks',
          ],
        },
        {
          type: 'category',
          label: '모델링 도구',
          items: [
            'modeling-tools/overview',
            'modeling-tools/excel-financial-modeling',
            'modeling-tools/python-for-finance',
            'modeling-tools/professional-analysis',
          ],
        },
        {
          type: 'category',
          label: '분석 도구',
          items: [
            'tools/market-overview',
            'tools/economic-calendar',
            'tools/company-comparison',
            'tools/portfolio-simulator',
            'tools/finance-timeline',
            'tools/progress-tracker',
            'tools/stats',
          ],
        },
      ],
    },

    // ═════════════════════════════════════════════
    // 대 카테고리 6: 학습 자료
    // ═════════════════════════════════════════════
    {
      type: 'category',
      label: '학습 자료',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '학습 퀴즈',
          items: [
            'quiz/accounting-basics',
            'quiz/financial-analysis',
            'quiz/valuation',
            'quiz/risk-management',
            'quiz/derivatives',
            'quiz/bonds',
            'quiz/macroeconomics',
            'quiz/industry-analysis',
          ],
        },
        {
          type: 'category',
          label: '투자 대가',
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
            'masters/screening-criteria',
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
        'finance-mbti',
        'market-survivor',
      ],
    },

    // ─────────────────────────────────────────────
    // 커뮤니티
    // ─────────────────────────────────────────────
    'community',
  ],
};

module.exports = sidebars;
