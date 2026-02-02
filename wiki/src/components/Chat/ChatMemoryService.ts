/**
 * ChatMemoryService - claude-mem 영감의 영구 메모리 시스템
 *
 * localStorage 기반으로 대화 세션을 영속화하고,
 * AI 요약을 통해 컨텍스트를 압축하여 새 세션에 주입합니다.
 */

interface StoredMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface StoredSession {
  id: string;
  title: string;
  messages: StoredMessage[];
  summary?: string;
  createdAt: string;
  updatedAt: string;
  currentPage?: string;
  messageCount: number;
}

interface MemoryState {
  sessions: StoredSession[];
  activeSessionId: string | null;
  totalMessages: number;
  lastActivity: string;
}

const STORAGE_KEY = 'value-alpha-chat-memory';
const MAX_SESSIONS = 50;
const MAX_MESSAGES_PER_SESSION = 100;
const SUMMARY_THRESHOLD = 10; // 이 메시지 수 이후 요약 생성

function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getInitialState(): MemoryState {
  return {
    sessions: [],
    activeSessionId: null,
    totalMessages: 0,
    lastActivity: new Date().toISOString(),
  };
}

function loadState(): MemoryState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('[ChatMemory] Failed to load state:', e);
  }
  return getInitialState();
}

function saveState(state: MemoryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('[ChatMemory] Failed to save state:', e);
    // 저장 공간 부족 시 오래된 세션 정리 후 재시도
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      pruneOldSessions(state);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        console.error('[ChatMemory] Still unable to save after pruning');
      }
    }
  }
}

function pruneOldSessions(state: MemoryState): void {
  // 가장 오래된 세션부터 절반 제거
  const half = Math.ceil(state.sessions.length / 2);
  state.sessions = state.sessions.slice(half);
  state.totalMessages = state.sessions.reduce((sum, s) => sum + s.messageCount, 0);
}

/** 새 세션 생성 */
export function createSession(currentPage?: string): StoredSession {
  const state = loadState();
  const now = new Date().toISOString();

  const session: StoredSession = {
    id: generateId(),
    title: '새 대화',
    messages: [],
    createdAt: now,
    updatedAt: now,
    currentPage,
    messageCount: 0,
  };

  state.sessions.push(session);
  state.activeSessionId = session.id;
  state.lastActivity = now;

  // 최대 세션 수 제한
  if (state.sessions.length > MAX_SESSIONS) {
    state.sessions = state.sessions.slice(-MAX_SESSIONS);
  }

  saveState(state);
  return session;
}

/** 현재 활성 세션 가져오기 (없으면 생성) */
export function getActiveSession(currentPage?: string): StoredSession {
  const state = loadState();

  if (state.activeSessionId) {
    const session = state.sessions.find((s) => s.id === state.activeSessionId);
    if (session) return session;
  }

  return createSession(currentPage);
}

/** 메시지 추가 */
export function addMessage(
  sessionId: string,
  message: { id: string; role: 'user' | 'assistant'; content: string },
): void {
  const state = loadState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return;

  const storedMsg: StoredMessage = {
    id: message.id,
    role: message.role,
    content: message.content,
    timestamp: new Date().toISOString(),
  };

  session.messages.push(storedMsg);
  session.messageCount = session.messages.length;
  session.updatedAt = new Date().toISOString();
  state.totalMessages += 1;
  state.lastActivity = session.updatedAt;

  // 첫 사용자 메시지로 세션 제목 설정
  if (message.role === 'user' && session.title === '새 대화') {
    session.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
  }

  // 메시지 수 제한 (오래된 메시지는 요약으로 압축)
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    const overflow = session.messages.length - MAX_MESSAGES_PER_SESSION;
    const removed = session.messages.splice(0, overflow);
    // 제거된 메시지 내용을 기존 요약에 추가
    const removedSummary = removed
      .map((m) => `${m.role}: ${m.content.slice(0, 100)}`)
      .join('\n');
    session.summary = session.summary
      ? `${session.summary}\n---\n${removedSummary}`
      : removedSummary;
  }

  saveState(state);
}

/** 세션의 메시지 목록 가져오기 */
export function getSessionMessages(
  sessionId: string,
): StoredMessage[] {
  const state = loadState();
  const session = state.sessions.find((s) => s.id === sessionId);
  return session?.messages || [];
}

/** 모든 세션 목록 가져오기 (최신순) */
export function getAllSessions(): StoredSession[] {
  const state = loadState();
  return [...state.sessions].reverse();
}

/** 세션 삭제 */
export function deleteSession(sessionId: string): void {
  const state = loadState();
  state.sessions = state.sessions.filter((s) => s.id !== sessionId);
  if (state.activeSessionId === sessionId) {
    state.activeSessionId = state.sessions.length > 0 ? state.sessions[state.sessions.length - 1].id : null;
  }
  state.totalMessages = state.sessions.reduce((sum, s) => sum + s.messageCount, 0);
  saveState(state);
}

/** 전체 메모리 초기화 */
export function clearAllMemory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** 활성 세션 변경 */
export function setActiveSession(sessionId: string): StoredSession | null {
  const state = loadState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (session) {
    state.activeSessionId = sessionId;
    saveState(state);
  }
  return session || null;
}

/** 세션 요약 저장 */
export function saveSessionSummary(sessionId: string, summary: string): void {
  const state = loadState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (session) {
    session.summary = summary;
    saveState(state);
  }
}

/** 메모리 요약이 필요한지 확인 */
export function needsSummary(sessionId: string): boolean {
  const state = loadState();
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) return false;
  return session.messageCount >= SUMMARY_THRESHOLD && !session.summary;
}

/**
 * 컨텍스트 주입용 요약 생성
 * 최근 세션들의 요약 + 학습 진도를 결합하여
 * 시스템 프롬프트에 주입할 컨텍스트 문자열을 반환
 */
export function generateContextInjection(): string {
  const state = loadState();
  const parts: string[] = [];

  // 최근 3개 세션의 요약 포함
  const recentSessions = state.sessions.slice(-3);
  const sessionSummaries = recentSessions
    .filter((s) => s.summary || s.messageCount > 0)
    .map((s) => {
      const date = new Date(s.updatedAt).toLocaleDateString('ko-KR');
      if (s.summary) {
        return `[${date}] ${s.title}: ${s.summary}`;
      }
      // 요약이 없으면 마지막 몇 개 메시지로 컨텍스트 생성
      const lastMsgs = s.messages.slice(-3);
      const brief = lastMsgs.map((m) => `${m.role}: ${m.content.slice(0, 80)}`).join(' | ');
      return `[${date}] ${s.title}: ${brief}`;
    });

  if (sessionSummaries.length > 0) {
    parts.push('## 이전 대화 요약\n' + sessionSummaries.join('\n'));
  }

  // 학습 진도 컨텍스트
  try {
    const progressData = localStorage.getItem('value-alpha-progress');
    if (progressData) {
      const completed = JSON.parse(progressData) as string[];
      if (completed.length > 0) {
        parts.push(`## 학습 진도\n완료한 학습 항목: ${completed.join(', ')} (${completed.length}개 완료)`);
      }
    }
  } catch {
    // 진도 데이터 로드 실패 무시
  }

  // 통계
  parts.push(
    `## 통계\n총 대화 세션: ${state.sessions.length}개, 총 메시지: ${state.totalMessages}개`,
  );

  return parts.join('\n\n');
}

/**
 * 키워드로 과거 대화 검색
 */
export function searchMemory(query: string): { sessionId: string; sessionTitle: string; message: StoredMessage }[] {
  const state = loadState();
  const results: { sessionId: string; sessionTitle: string; message: StoredMessage }[] = [];
  const lowerQuery = query.toLowerCase();

  for (const session of state.sessions) {
    for (const msg of session.messages) {
      if (msg.content.toLowerCase().includes(lowerQuery)) {
        results.push({
          sessionId: session.id,
          sessionTitle: session.title,
          message: msg,
        });
      }
    }
  }

  return results.slice(-20); // 최근 20개 결과만
}

/** 메모리 통계 */
export function getMemoryStats(): {
  sessionCount: number;
  totalMessages: number;
  oldestSession: string | null;
  newestSession: string | null;
  storageSize: string;
} {
  const state = loadState();
  const raw = localStorage.getItem(STORAGE_KEY) || '';
  const sizeKB = (new Blob([raw]).size / 1024).toFixed(1);

  return {
    sessionCount: state.sessions.length,
    totalMessages: state.totalMessages,
    oldestSession: state.sessions.length > 0 ? state.sessions[0].createdAt : null,
    newestSession: state.sessions.length > 0 ? state.sessions[state.sessions.length - 1].createdAt : null,
    storageSize: `${sizeKB} KB`,
  };
}
