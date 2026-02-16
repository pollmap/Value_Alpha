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
      <div
        style={{
          background: '#000',
          padding: '80px 48px',
          textAlign: 'center',
          color: '#fff',
          marginBottom: 48,
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(48px, 10vw, 96px)',
            fontWeight: 800,
            margin: '0 0 16px',
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
          }}
        >
          VALUE ALPHA
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            margin: '0 0 48px',
            color: '#888',
            fontWeight: 400,
            letterSpacing: '0.05em',
          }}
        >
          투자분석부터 금융권 취업까지
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 0,
            borderTop: '1px solid #222',
            borderBottom: '1px solid #222',
            maxWidth: 600,
            margin: '0 auto',
          }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                padding: '24px 16px',
                borderRight: i < stats.length - 1 ? '1px solid #222' : 'none',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Grid - Terminal Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 0,
          border: '1px solid var(--va-border, #e5e5e5)',
        }}
      >
        {features.map((f) => (
          <a
            key={f.title}
            href={resolve(f.link)}
            style={{
              display: 'block',
              padding: '32px 24px',
              borderRight: '1px solid var(--va-border, #e5e5e5)',
              borderBottom: '1px solid var(--va-border, #e5e5e5)',
              background: 'var(--ifm-background-color, #fff)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background 150ms ease',
              position: 'relative',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--va-surface, #fafafa)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'var(--ifm-background-color, #fff)';
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: 'var(--va-border, #e5e5e5)',
                marginBottom: 16,
                fontFamily: 'monospace',
              }}
            >
              {f.num}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: 'var(--va-text-primary, #000)',
              }}
            >
              {f.title}
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'var(--va-text-secondary, #666)',
                lineHeight: 1.5,
              }}
            >
              {f.desc}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                color: 'var(--va-text-muted, #999)',
                fontSize: 18,
              }}
            >
              →
            </div>
          </a>
        ))}
      </div>

      {/* CTA Section */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginTop: 48,
          border: '1px solid var(--va-border, #e5e5e5)',
        }}
      >
        <a
          href={resolve('/foundation/overview')}
          style={{
            flex: 1,
            padding: '20px 24px',
            background: 'var(--va-text-primary, #000)',
            color: 'var(--va-bg, #fff)',
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
            fontSize: 14,
            letterSpacing: '0.05em',
            transition: 'opacity 150ms ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '0.8';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = '1';
          }}
        >
          학습 시작하기 →
        </a>
        <a
          href={resolve('/finance-mbti')}
          style={{
            flex: 1,
            padding: '20px 24px',
            background: 'transparent',
            color: 'var(--va-text-primary, #000)',
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
            fontSize: 14,
            borderLeft: '1px solid var(--va-border, #e5e5e5)',
            letterSpacing: '0.05em',
            transition: 'background 150ms ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--va-surface, #fafafa)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          금융 성향 테스트
        </a>
        <a
          href={resolve('/market-survivor')}
          style={{
            flex: 1,
            padding: '20px 24px',
            background: 'transparent',
            color: 'var(--va-text-primary, #000)',
            fontWeight: 600,
            textDecoration: 'none',
            textAlign: 'center',
            fontSize: 14,
            borderLeft: '1px solid var(--va-border, #e5e5e5)',
            letterSpacing: '0.05em',
            transition: 'background 150ms ease',
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--va-surface, #fafafa)';
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          투자 시뮬레이터
        </a>
      </div>

      {/* AI Disclaimer - Minimal */}
      <div
        style={{
          marginTop: 48,
          padding: '24px',
          border: '1px solid var(--va-border, #e5e5e5)',
          borderLeft: '2px solid var(--va-text-primary, #000)',
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
          데이터 출처 및 투명성
        </div>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--va-text-secondary, #666)', lineHeight: 1.7 }}>
          Value Alpha의 콘텐츠는 금융감독원, 한국은행, 금융투자협회 등 공공기관 발간물과
          DART 전자공시시스템, 각 금융사 IR 자료를 참고하여 AI 기반으로 생성·정리되었습니다.
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--va-text-muted, #999)', lineHeight: 1.6 }}>
          주의: AI 생성 콘텐츠는 단순화, 편향, 부정확성을 포함할 수 있습니다.
          학술 연구나 실무 적용에는 반드시 원전과 전문 자료를 참조하세요.
        </p>
      </div>
    </div>
  );
}
