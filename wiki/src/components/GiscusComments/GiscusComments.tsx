import React, { useEffect, useState } from 'react';

interface Issue {
  number: number;
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  user: { login: string; avatar_url: string };
  comments: number;
  labels: { name: string; color: string }[];
}

const REPO = 'pollmap/Value_Alpha';
const LABEL_MAP: Record<string, { label: string; color: string }> = {
  'question': { label: 'Q&A', color: '#d876e3' },
  'discussion': { label: '토론', color: '#0075ca' },
  'career': { label: '취업정보', color: '#e4e669' },
  'feedback': { label: '피드백', color: '#a2eeef' },
  'resource': { label: '자료공유', color: '#7057ff' },
};

const CATEGORIES = [
  { key: 'question', icon: '?', title: 'Q&A', desc: '학습 관련 질문' },
  { key: 'discussion', icon: '>', title: '시장 토론', desc: '시장 전망, 분석' },
  { key: 'career', icon: '!', title: '취업 정보', desc: '채용, 면접, 커리어' },
  { key: 'feedback', icon: '*', title: '위키 피드백', desc: '오류 제보, 기능 제안' },
  { key: 'resource', icon: '+', title: '자료 공유', desc: '유용한 자료, 도구' },
];

export default function GiscusComments(): JSX.Element {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/issues?state=open&per_page=20&sort=created&direction=desc`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setIssues(data.filter((d: Issue) => !('pull_request' in d)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? issues
    : issues.filter((i) => i.labels.some((l) => l.name === filter));

  const newIssueUrl = (label?: string) => {
    const base = `https://github.com/${REPO}/issues/new`;
    if (!label) return base;
    return `${base}?labels=${encodeURIComponent(label)}&template=community.md`;
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;
    return `${Math.floor(days / 30)}개월 전`;
  };

  return (
    <div>
      {/* Category buttons */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid var(--ifm-color-emphasis-300)',
            background: filter === 'all' ? 'var(--ifm-color-primary)' : 'transparent',
            color: filter === 'all' ? '#fff' : 'inherit',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          전체
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: filter === c.key ? 'var(--ifm-color-primary)' : 'transparent',
              color: filter === c.key ? '#fff' : 'inherit',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* New post button */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <a
            key={c.key}
            href={newIssueUrl(c.key)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '2px solid var(--ifm-color-primary)',
              color: 'var(--ifm-color-primary)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            + {c.title}
          </a>
        ))}
      </div>

      {/* Issues list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--ifm-color-emphasis-500)' }}>
          불러오는 중...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--ifm-color-emphasis-500)', marginBottom: 12 }}>
            아직 글이 없습니다.
          </p>
          <a
            href={newIssueUrl(filter !== 'all' ? filter : undefined)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              background: 'var(--ifm-color-primary)',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            첫 번째 글 작성하기
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((issue) => (
            <a
              key={issue.number}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '14px 16px',
                borderRadius: 8,
                border: '1px solid var(--ifm-color-emphasis-200)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.15s',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'var(--ifm-color-emphasis-100)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 15, flex: 1 }}>
                  {issue.title}
                </span>
                {issue.comments > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--ifm-color-emphasis-500)' }}>
                    {issue.comments} replies
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ifm-color-emphasis-500)' }}>
                <span>{issue.user.login}</span>
                <span>{timeAgo(issue.created_at)}</span>
                {issue.labels.map((l) => (
                  <span
                    key={l.name}
                    style={{
                      padding: '1px 6px',
                      borderRadius: 4,
                      background: `#${l.color}33`,
                      color: `#${l.color}`,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {LABEL_MAP[l.name]?.label || l.name}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer link */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <a
          href={`https://github.com/${REPO}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13, color: 'var(--ifm-color-emphasis-500)' }}
        >
          GitHub에서 전체 보기 &rarr;
        </a>
      </div>
    </div>
  );
}
