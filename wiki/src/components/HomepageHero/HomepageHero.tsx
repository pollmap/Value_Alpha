import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const features = [
  {
    num: '01',
    title: '4-Layer 투자분석',
    desc: '기초 회계 → 재무분석 → 산업분석 → 기업분석',
    link: '/foundation/overview',
  },
  {
    num: '02',
    title: '밸류에이션',
    desc: 'DCF, 상대가치, LBO, 잔여이익모형',
    link: '/valuation/dcf/overview',
  },
  {
    num: '03',
    title: '170+ 금융 기업',
    desc: '은행, 증권, 보험, 자산운용, VC/PE, 핀테크',
    link: '/companies',
  },
  {
    num: '04',
    title: '취업 & 커리어',
    desc: '50+ 직무, 42+ 공모전, 로드맵',
    link: '/career',
  },
  {
    num: '05',
    title: '인터랙티브 도구',
    desc: 'DCF 계산기, 투자 시뮬레이터, MBTI',
    link: '/calculators/dcf',
  },
  {
    num: '06',
    title: '매매 전략',
    desc: '가치투자, 모멘텀, 퀀트, 스윙 트레이딩',
    link: '/trading-strategies/overview',
  },
];

const stats = [
  { value: '259+', label: '문서' },
  { value: '15+', label: '도구' },
  { value: '170+', label: '기업' },
  { value: '50+', label: '직무' },
];

export default function HomepageHero(): JSX.Element {
  const base = useBaseUrl('/');
  const resolve = (path: string) => {
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${b}${path}`;
  };

  return (
    <div style={{ marginBottom: 48 }}>
      {/* Hero Section - Minimal Dark */}
      <div className="va-hero">
        <h1 className="va-hero__title">
          VALUE ALPHA
        </h1>
        <p className="va-hero__subtitle">
          투자분석부터 금융권 취업까지
        </p>

        {/* Stats Row */}
        <div className="va-hero__stats">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="va-hero__stat"
              style={{
                borderRight: i < stats.length - 1 ? '1px solid #333' : 'none',
              }}
            >
              <div className="va-hero__stat-value">{s.value}</div>
              <div className="va-hero__stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid - Terminal Style */}
      <div className="va-feature-grid">
        {features.map((f) => (
          <a
            key={f.title}
            href={resolve(f.link)}
            className="va-feature-card"
          >
            <div className="va-feature-card__num">{f.num}</div>
            <div className="va-feature-card__title">{f.title}</div>
            <div className="va-feature-card__desc">{f.desc}</div>
            <div className="va-feature-card__arrow">→</div>
          </a>
        ))}
      </div>

      {/* CTA Section */}
      <div className="va-cta">
        <a href={resolve('/foundation/overview')} className="va-cta__link va-cta__link--primary">
          학습 시작하기 →
        </a>
        <a href={resolve('/finance-mbti')} className="va-cta__link va-cta__link--ghost">
          금융 성향 테스트
        </a>
        <a href={resolve('/market-survivor')} className="va-cta__link va-cta__link--ghost">
          투자 시뮬레이터
        </a>
      </div>

      {/* AI Disclaimer - Minimal */}
      <div className="va-disclaimer">
        <div className="va-disclaimer__title">
          데이터 출처 및 투명성
        </div>
        <p className="va-disclaimer__body">
          Value Alpha의 콘텐츠는 금융감독원, 한국은행, 금융투자협회 등 공공기관 발간물과
          DART 전자공시시스템, 각 금융사 IR 자료를 참고하여 AI 기반으로 생성·정리되었습니다.
        </p>
        <p className="va-disclaimer__note">
          주의: AI 생성 콘텐츠는 단순화, 편향, 부정확성을 포함할 수 있습니다.
          학술 연구나 실무 적용에는 반드시 원전과 전문 자료를 참조하세요.
        </p>
      </div>
    </div>
  );
}
