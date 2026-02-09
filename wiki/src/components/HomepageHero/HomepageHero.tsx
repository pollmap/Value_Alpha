import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const features = [
  {
    icon: '📊',
    title: '4-Layer 투자분석',
    desc: '기초 회계 → 재무분석 → 산업분석 → 기업분석',
    link: '/foundation/overview',
  },
  {
    icon: '💰',
    title: '밸류에이션',
    desc: 'DCF, 상대가치, LBO, 잔여이익모형',
    link: '/valuation/dcf/overview',
  },
  {
    icon: '🏢',
    title: '170+ 금융 기업',
    desc: '은행, 증권, 보험, 자산운용, VC/PE, 핀테크',
    link: '/companies',
  },
  {
    icon: '🎯',
    title: '취업 & 커리어',
    desc: '50+ 직무, 42+ 공모전, 로드맵',
    link: '/career',
  },
  {
    icon: '🧮',
    title: '인터랙티브 도구',
    desc: 'DCF 계산기, 투자 시뮬레이터, MBTI',
    link: '/calculators/dcf',
  },
  {
    icon: '📈',
    title: '매매 전략',
    desc: '가치투자, 모멘텀, 퀀트, 스윙 트레이딩',
    link: '/trading-strategies/overview',
  },
];

const stats = [
  { value: '259+', label: '문서' },
  { value: '15+', label: '인터랙티브 도구' },
  { value: '170+', label: '금융 기업' },
  { value: '50+', label: '금융 직무' },
];

export default function HomepageHero(): JSX.Element {
  const base = useBaseUrl('/');
  const resolve = (path: string) => {
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${b}${path}`;
  };

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--ifm-color-primary) 0%, #7c3aed 100%)',
          borderRadius: 16,
          padding: '48px 32px',
          textAlign: 'center',
          color: '#fff',
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 12px', color: '#fff' }}>
          Value Alpha
        </h1>
        <p style={{ fontSize: 18, opacity: 0.9, margin: '0 0 24px', color: '#f0f0f0' }}>
          투자분석부터 금융권 취업까지, 금융 학습의 모든 것
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {features.map((f) => (
          <a
            key={f.title}
            href={resolve(f.link)}
            style={{
              display: 'block',
              padding: '20px',
              borderRadius: 12,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'var(--ifm-card-background-color, #fff)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'none';
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-600)' }}>{f.desc}</div>
          </a>
        ))}
      </div>

      {/* Quick Start */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <a
          href={resolve('/foundation/overview')}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 8,
            background: 'var(--ifm-color-primary)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 15,
          }}
        >
          학습 시작하기
        </a>
        <a
          href={resolve('/finance-mbti')}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 8,
            border: '2px solid var(--ifm-color-primary)',
            color: 'var(--ifm-color-primary)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 15,
          }}
        >
          금융 성향 테스트
        </a>
        <a
          href={resolve('/market-survivor')}
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: 8,
            border: '2px solid var(--ifm-color-primary)',
            color: 'var(--ifm-color-primary)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 15,
          }}
        >
          투자 시뮬레이터
        </a>
      </div>

      {/* AI Disclaimer */}
      <div
        style={{
          marginTop: 32,
          padding: '20px 24px',
          borderRadius: 12,
          backgroundColor: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20 }}>✨</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--ifm-color-emphasis-800)' }}>
              데이터 출처 및 투명성
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.6 }}>
              Value Alpha의 콘텐츠는 아래 자료를 참고하여 <strong>AI 기반으로 생성·정리</strong>되었습니다.
              금융감독원, 한국은행, 금융투자협회 등 공공기관 발간물과 DART 전자공시시스템, 각 금융사 IR 자료,
              학술 문헌 등을 참고해 구조화한 것입니다.
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--ifm-color-emphasis-600)', lineHeight: 1.5 }}>
              <strong>주의:</strong> AI 생성 콘텐츠는 단순화, 편향, 부정확성을 포함할 수 있습니다.
              학술 연구나 실무 적용에는 반드시 원전과 전문 자료를 참조하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
