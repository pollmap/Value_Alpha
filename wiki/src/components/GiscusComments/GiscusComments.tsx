import React from 'react';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

interface GiscusCommentsProps {
  category?: string;
  categoryId?: string;
  mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
  term?: string;
}

export default function GiscusComments({
  category = 'General',
  categoryId = 'DIC_kwDON7TJYs4CmZxz', // TODO: GitHub Discussions 설정 후 교체
  mapping = 'pathname',
  term,
}: GiscusCommentsProps): JSX.Element {
  const { colorMode } = useColorMode();

  return (
    <div style={{ marginTop: '2rem' }}>
      <Giscus
        repo="pollmap/Value_Alpha" // GitHub 저장소
        repoId="R_kgDON7TJYg" // TODO: 실제 repo ID로 교체
        category={category}
        categoryId={categoryId}
        mapping={mapping}
        term={term}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === 'dark' ? 'dark' : 'light'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
