/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    // ─────────────────────────────────────────────
    // 시작하기
    // ─────────────────────────────────────────────
    'intro',
    'curriculum',

    // ─────────────────────────────────────────────
    // 대 카테고리 1: 투자분석 체계 (4-Layer)
    // ─────────────────────────────────────────────
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
            'industry-analysis/it/intro',
            'industry-analysis/healthcare/intro',
            'industry-analysis/financials/intro',
            'industry-analysis/consumer-discretionary/intro',
            'industry-analysis/consumer-staples/intro',
            'industry-analysis/industrials/intro',
            'industry-analysis/materials/intro',
            'industry-analysis/energy/intro',
            'industry-analysis/utilities/intro',
            'industry-analysis/real-estate-sector/intro',
            'industry-analysis/communication-services/intro',
          ],
        },

        // Layer 4: 기업분석
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
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 2: 밸류에이션
    // ─────────────────────────────────────────────
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

    // ─────────────────────────────────────────────
    // 대 카테고리 3: 매매 전략 & 리스크 관리
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '매매 전략 & 리스크 관리',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '매매 전략',
          items: [
            'trading-strategies/overview',
            'trading-strategies/value-investing-strategies',
            'trading-strategies/momentum-strategies',
            'trading-strategies/swing-trading',
            'trading-strategies/quant-strategies',
            'trading-strategies/event-driven',
            'trading-strategies/market-microstructure',
          ],
        },
        {
          type: 'category',
          label: '리스크 관리',
          items: [
            'risk-management/overview',
            'risk-management/position-sizing',
            'risk-management/portfolio-construction',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 4: 기업 케이스 스터디
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '기업 케이스 스터디',
      collapsed: true,
      items: [
        'case-studies/samsung-electronics',
        'case-studies/sk-hynix',
        'case-studies/hyundai-motor',
        'case-studies/naver',
        'case-studies/celltrion',
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 5: 금융 산업 & 기업
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '금융 산업 & 기업',
      collapsed: true,
      items: [
        {
          type: 'category',
          label: '산업 가이드',
          items: [
            'banking-industry/banking-industry',
            'securities-industry/securities-industry',
            'insurance-industry/insurance-industry',
            'card-capital-industry/card-capital-industry',
            'asset-management-industry/asset-management-industry',
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
            'companies/companies-overview',
            'companies/companies-banks',
            'companies/companies-securities',
            'companies/companies-insurance',
            'companies/companies-cards-capital',
            'companies/companies-savings-asset',
            'companies/companies-vc-fintech',
            'companies/companies-public-infra',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 6: 금융권 취업 & 커리어
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '금융권 취업 & 커리어',
      collapsed: true,
      items: [
        'career/career-overview',
        'career/career-job-categories',
        'career/career-requirements',
        'career/career-competitions',
        'career/career-roadmap',
        'certifications',
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 7: 분석 & 모델링 도구
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '분석 & 모델링 도구',
      collapsed: true,
      items: [
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
          label: '밸류에이션 계산기',
          items: [
            'calculators/dcf',
            'calculators/wacc',
            'calculators/graham-number',
            'calculators/dupont-calculator',
            'calculators/roic-calculator',
            'calculators/ddm-calculator',
            'calculators/per-band-calculator',
            'calculators/football-field-calculator',
            'calculators/peg-screener',
          ],
        },
        {
          type: 'category',
          label: '리스크 & 채권 계산기',
          items: [
            'calculators/kelly-calculator',
            'calculators/bond-calculator',
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
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 8: 인터랙티브
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '인터랙티브',
      collapsed: true,
      items: [
        'finance-mbti',
        'market-survivor',
        {
          type: 'category',
          label: '학습 퀴즈',
          items: [
            'quiz/accounting-basics',
            'quiz/financial-analysis',
            'quiz/valuation',
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // 대 카테고리 9: 참고 자료
    // ─────────────────────────────────────────────
    {
      type: 'category',
      label: '참고 자료',
      collapsed: true,
      items: [
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
    },
  ],
};

module.exports = sidebars;
