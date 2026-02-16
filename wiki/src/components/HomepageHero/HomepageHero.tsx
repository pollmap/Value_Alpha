import React, { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const features = [
  {
    icon: '📊',
    title: '4-Layer 투자분석',
    desc: '기초 회계 → 재무분석 → 산업분석 → 기업분석',
    link: '/foundation/overview',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    icon: '💰',
    title: '밸류에이션',
    desc: 'DCF, 상대가치, LBO, 잔여이익모형',
    link: '/valuation/dcf/overview',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    icon: '🏢',
    title: '170+ 금융 기업',
    desc: '은행, 증권, 보험, 자산운용, VC/PE, 핀테크',
    link: '/companies',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    icon: '🎯',
    title: '취업 & 커리어',
    desc: '50+ 직무, 42+ 공모전, 로드맵',
    link: '/career',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
  {
    icon: '🧮',
    title: '인터랙티브 도구',
    desc: 'DCF 계산기, 투자 시뮬레이터, MBTI',
    link: '/calculators/dcf',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    icon: '📈',
    title: '매매 전략',
    desc: '가치투자, 모멘텀, 퀀트, 스윙 트레이딩',
    link: '/trading-strategies/overview',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
];

const stats = [
  { value: '259+', label: '문서', icon: '📚' },
  { value: '15+', label: '인터랙티브 도구', icon: '🛠️' },
  { value: '170+', label: '금융 기업', icon: '🏦' },
  { value: '50+', label: '금융 직무', icon: '💼' },
];

export default function HomepageHero(): JSX.Element {
  const base = useBaseUrl('/');
  const resolve = (path: string) => {
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${b}${path}`;
  };

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{ marginBottom: 40 }}>
      {/* Hero Section - Modern Glassmorphism */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          borderRadius: 24,
          padding: '64px 40px',
          textAlign: 'center',
          color: '#fff',
          marginBottom: 40,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Animated Background Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-20%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            animation: 'float 6s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 800,
              margin: '0 0 16px',
              color: '#fff',
              letterSpacing: '-0.02em',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Value Alpha
            </span>
          </h1>
          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              opacity: isVisible ? 0.9 : 0,
              margin: '0 0 32px',
              color: '#e2e8f0',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s',
            }}
          >
            투자분석부터 금융권 취업까지, 금융 학습의 모든 것
          </p>

          {/* Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 16,
              maxWidth: 700,
              margin: '0 auto',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
            }}
          >
            {stats.map((s, index) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  borderRadius: 16,
                  padding: '20px 16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s, background 0.2s',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: '0.02em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards - Modern Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}
      >
        {features.map((f, index) => (
          <a
            key={f.title}
            href={resolve(f.link)}
            style={{
              display: 'block',
              padding: '24px',
              borderRadius: 20,
              border: '1px solid var(--ifm-color-emphasis-200)',
              background: 'var(--ifm-card-background-color, #fff)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: `${0.3 + index * 0.05}s`,
            }}
            onMouseOver={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
              el.style.transform = 'translateY(-8px)';
              el.style.borderColor = 'var(--ifm-color-primary-lightest)';
            }}
            onMouseOut={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow = 'none';
              el.style.transform = 'translateY(0)';
              el.style.borderColor = 'var(--ifm-color-emphasis-200)';
            }}
          >
            {/* Gradient top border */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: f.gradient,
                borderRadius: '20px 20px 0 0',
              }}
            />
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: f.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              {f.icon}
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
                color: 'var(--ifm-color-content)',
              }}
            >
              {f.title}
            </div>
            <div
              style={{
                fontSize: 14,
                color: 'var(--ifm-color-emphasis-600)',
                lineHeight: 1.5,
              }}
            >
              {f.desc}
            </div>
            {/* Arrow indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                opacity: 0.4,
                fontSize: 20,
                transition: 'transform 0.2s, opacity 0.2s',
              }}
            >
              →
            </div>
          </a>
        ))}
      </div>

      {/* Quick Start - Enhanced CTA Section */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: 24,
          padding: '32px',
          background: 'var(--ifm-card-background-color)',
          borderRadius: 20,
          border: '1px solid var(--ifm-color-emphasis-200)',
        }}
      >
        <a
          href={resolve('/foundation/overview')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 28px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1a56db 0%, #7c3aed 100%)',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 16,
            boxShadow: '0 4px 14px rgba(26, 86, 219, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = '0 8px 20px rgba(26, 86, 219, 0.4)';
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = '0 4px 14px rgba(26, 86, 219, 0.3)';
          }}
        >
          <span>🚀</span> 학습 시작하기
        </a>
        <a
          href={resolve('/finance-mbti')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 28px',
            borderRadius: 12,
            border: '2px solid var(--ifm-color-primary)',
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 16,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-2px)';
            el.style.background = 'var(--ifm-color-primary)';
            el.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.background = 'transparent';
            el.style.color = 'var(--ifm-color-primary)';
          }}
        >
          <span>🧠</span> 금융 성향 테스트
        </a>
        <a
          href={resolve('/market-survivor')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 28px',
            borderRadius: 12,
            border: '2px solid var(--ifm-color-primary)',
            background: 'transparent',
            color: 'var(--ifm-color-primary)',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: 16,
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-2px)';
            el.style.background = 'var(--ifm-color-primary)';
            el.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0)';
            el.style.background = 'transparent';
            el.style.color = 'var(--ifm-color-primary)';
          }}
        >
          <span>📊</span> 투자 시뮬레이터
        </a>
      </div>

      {/* AI Disclaimer - Modern Card */}
      <div
        style={{
          marginTop: 24,
          padding: '24px 28px',
          borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 4,
            height: '100%',
            background: 'linear-gradient(180deg, #f59e0b 0%, #fbbf24 100%)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, paddingLeft: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
            }}
          >
            ✨
          </div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 10, color: 'var(--ifm-color-emphasis-900)', fontSize: 16 }}>
              데이터 출처 및 투명성
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.7 }}>
              Value Alpha의 콘텐츠는 아래 자료를 참고하여 <strong style={{ color: 'var(--ifm-color-emphasis-800)' }}>AI 기반으로 생성·정리</strong>되었습니다.
              금융감독원, 한국은행, 금융투자협회 등 공공기관 발간물과 DART 전자공시시스템, 각 금융사 IR 자료,
              학술 문헌 등을 참고해 구조화한 것입니다.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: 'var(--ifm-color-emphasis-600)',
                lineHeight: 1.6,
                padding: '10px 14px',
                background: 'rgba(251, 191, 36, 0.1)',
                borderRadius: 8,
              }}
            >
              <strong>⚠️ 주의:</strong> AI 생성 콘텐츠는 단순화, 편향, 부정확성을 포함할 수 있습니다.
              학술 연구나 실무 적용에는 반드시 원전과 전문 자료를 참조하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
