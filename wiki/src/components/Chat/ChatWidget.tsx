import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, History, Search, Trash2, Plus, ChevronLeft } from 'lucide-react';
import * as Memory from './ChatMemoryService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  apiEndpoint?: string;
  systemPrompt?: string;
  placeholder?: string;
  title?: string;
  currentPage?: string;
}

type ViewMode = 'chat' | 'history' | 'search';

const defaultSystemPrompt = `당신은 밸류에이션 전문 AI 튜터입니다.
DCF, 상대가치평가, 기술적 분석 등 투자와 가치평가에 관한 질문에 친절하고 상세하게 답변해주세요.
한국어로 답변하며, 필요시 공식이나 예시를 포함해주세요.
투자자산운용사, CFA 등 자격증 관련 질문에도 도움을 줄 수 있습니다.`;

export default function ChatWidget({
  apiEndpoint = '/api/chat',
  systemPrompt = defaultSystemPrompt,
  placeholder = '밸류에이션에 관해 질문하세요...',
  title = 'AI 튜터',
  currentPage,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ReturnType<typeof Memory.getAllSessions>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof Memory.searchMemory>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 세션 초기화 - 활성 세션 복원 또는 새 세션 생성
  useEffect(() => {
    const session = Memory.getActiveSession(currentPage);
    setSessionId(session.id);
    const storedMessages = Memory.getSessionMessages(session.id);
    setMessages(
      storedMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp),
      })),
    );
  }, [currentPage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current && viewMode === 'chat') {
      inputRef.current.focus();
    }
  }, [isOpen, viewMode]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 컨텍스트가 주입된 시스템 프롬프트 생성
  const buildSystemPromptWithMemory = (): string => {
    const memoryContext = Memory.generateContextInjection();
    if (!memoryContext) return systemPrompt;

    return `${systemPrompt}

---
아래는 이 사용자와의 이전 대화 기록 및 학습 진도입니다. 이 컨텍스트를 참고하여 연속적이고 개인화된 답변을 제공하세요.

${memoryContext}`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 메모리에 사용자 메시지 저장
    Memory.addMessage(sessionId, userMessage);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt: buildSystemPromptWithMemory(),
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: data.content || data.message || '응답을 받지 못했습니다.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 메모리에 어시스턴트 메시지 저장
      Memory.addMessage(sessionId, assistantMessage);

      // 요약 필요 여부 확인 후 자동 요약 요청
      if (Memory.needsSummary(sessionId)) {
        requestSummary(sessionId);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '죄송합니다. 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // AI 요약 요청 (백그라운드)
  const requestSummary = async (sid: string) => {
    try {
      const sessionMessages = Memory.getSessionMessages(sid);
      const conversation = sessionMessages
        .map((m) => `${m.role === 'user' ? '사용자' : 'AI'}: ${m.content}`)
        .join('\n');

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `다음 대화를 2-3줄로 핵심 내용만 한국어로 요약해주세요. 주요 질문 주제와 결론만 포함하세요:\n\n${conversation}`,
            },
          ],
          systemPrompt: '대화 내용을 간결하게 요약하는 역할입니다. 2-3줄 이내로 요약하세요.',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const summary = data.content || data.message;
        if (summary) {
          Memory.saveSessionSummary(sid, summary);
        }
      }
    } catch {
      // 요약 실패는 무시 (메인 기능에 영향 없음)
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 새 세션 시작
  const startNewSession = () => {
    const session = Memory.createSession(currentPage);
    setSessionId(session.id);
    setMessages([]);
    setViewMode('chat');
  };

  // 기존 세션 로드
  const loadSession = (sid: string) => {
    const session = Memory.setActiveSession(sid);
    if (session) {
      setSessionId(session.id);
      const storedMessages = Memory.getSessionMessages(session.id);
      setMessages(
        storedMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        })),
      );
      setViewMode('chat');
    }
  };

  // 세션 삭제
  const handleDeleteSession = (sid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    Memory.deleteSession(sid);
    setSessions(Memory.getAllSessions());
    if (sid === sessionId) {
      startNewSession();
    }
  };

  // 히스토리 열기
  const openHistory = () => {
    setSessions(Memory.getAllSessions());
    setViewMode('history');
  };

  // 검색 실행
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(Memory.searchMemory(searchQuery.trim()));
    }
  };

  // 전체 메모리 초기화
  const handleClearAll = () => {
    if (window.confirm('모든 대화 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      Memory.clearAllMemory();
      startNewSession();
      setSessions([]);
      setSearchResults([]);
    }
  };

  // --- 스타일 ---
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const toggleButtonStyle: React.CSSProperties = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(26, 54, 93, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const chatWindowStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '70px',
    right: '0',
    width: '380px',
    height: '520px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    color: 'white',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    backgroundColor: '#f7fafc',
  };

  const messageStyle = (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '16px',
    flexDirection: isUser ? 'row-reverse' : 'row',
  });

  const avatarStyle = (isUser: boolean): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: isUser ? '#48bb78' : '#1a365d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  });

  const bubbleStyle = (isUser: boolean): React.CSSProperties => ({
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    backgroundColor: isUser ? '#1a365d' : '#ffffff',
    color: isUser ? '#ffffff' : '#2d3748',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  });

  const inputContainerStyle: React.CSSProperties = {
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    padding: '10px 14px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    resize: 'none',
    fontFamily: 'inherit',
    fontSize: '14px',
    lineHeight: '1.4',
    minHeight: '40px',
    maxHeight: '120px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const sendButtonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    backgroundColor: isLoading || !input.trim() ? '#cbd5e0' : '#1a365d',
    border: 'none',
    cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  const iconButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const welcomeStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#718096',
  };

  // --- 히스토리 뷰 렌더링 ---
  const renderHistoryView = () => (
    <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f7fafc' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#2d3748' }}>대화 기록 ({sessions.length})</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={startNewSession}
            style={{ ...iconButtonStyle, color: '#1a365d', background: '#e2e8f0', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}
            title="새 대화"
          >
            <Plus size={14} />
            <span style={{ marginLeft: '4px' }}>새 대화</span>
          </button>
          <button
            onClick={handleClearAll}
            style={{ ...iconButtonStyle, color: '#e53e3e', background: '#fed7d7', borderRadius: '8px', padding: '6px 10px', fontSize: '12px' }}
            title="전체 삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {sessions.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#a0aec0' }}>
          <History size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ margin: 0, fontSize: '14px' }}>대화 기록이 없습니다</p>
        </div>
      ) : (
        sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => loadSession(s.id)}
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #edf2f7',
              cursor: 'pointer',
              backgroundColor: s.id === sessionId ? '#ebf8ff' : 'transparent',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => { if (s.id !== sessionId) e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
            onMouseLeave={(e) => { if (s.id !== sessionId) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500, fontSize: '13px', color: '#2d3748', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.title}
                </div>
                <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '4px' }}>
                  {new Date(s.updatedAt).toLocaleDateString('ko-KR')} · {s.messageCount}개 메시지
                </div>
                {s.summary && (
                  <div style={{ fontSize: '11px', color: '#718096', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.summary.slice(0, 80)}...
                  </div>
                )}
              </div>
              <button
                onClick={(e) => handleDeleteSession(s.id, e)}
                style={{ ...iconButtonStyle, color: '#a0aec0', padding: '4px' }}
                title="삭제"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // --- 검색 뷰 렌더링 ---
  const renderSearchView = () => (
    <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f7fafc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
            placeholder="대화 내용 검색..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
            }}
            autoFocus
          />
          <button
            onClick={handleSearch}
            style={{ padding: '8px 12px', backgroundColor: '#1a365d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
          >
            검색
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {searchResults.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#a0aec0' }}>
            <Search size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              {searchQuery ? '검색 결과가 없습니다' : '키워드를 입력하세요'}
            </p>
          </div>
        ) : (
          <>
            <div style={{ padding: '8px 16px', fontSize: '12px', color: '#718096' }}>
              {searchResults.length}개 결과
            </div>
            {searchResults.map((r, i) => (
              <div
                key={`${r.sessionId}-${r.message.id}-${i}`}
                onClick={() => loadSession(r.sessionId)}
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid #edf2f7',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{ fontSize: '11px', color: '#a0aec0', marginBottom: '4px' }}>
                  {r.sessionTitle} · {r.message.role === 'user' ? '사용자' : 'AI'}
                </div>
                <div style={{ fontSize: '13px', color: '#2d3748', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {r.message.content}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

  // --- 채팅 뷰 렌더링 ---
  const renderChatView = () => (
    <>
      <div style={messagesContainerStyle}>
        {messages.length === 0 ? (
          <div style={welcomeStyle}>
            <Bot size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '15px' }}>
              안녕하세요! 밸류에이션 AI 튜터입니다.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '13px' }}>
              DCF, 상대가치평가, 투자 전략 등<br />
              궁금한 점을 질문해주세요.
            </p>
            {Memory.getMemoryStats().sessionCount > 0 && (
              <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#a0aec0' }}>
                이전 대화가 {Memory.getMemoryStats().sessionCount}개 저장되어 있습니다.
              </p>
            )}
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} style={messageStyle(message.role === 'user')}>
              <div style={avatarStyle(message.role === 'user')}>
                {message.role === 'user' ? (
                  <User size={16} color="white" />
                ) : (
                  <Bot size={16} color="white" />
                )}
              </div>
              <div style={bubbleStyle(message.role === 'user')}>{message.content}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div style={messageStyle(false)}>
            <div style={avatarStyle(false)}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ ...bubbleStyle(false), display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span>답변 생성 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={inputContainerStyle}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={textareaStyle}
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          style={sendButtonStyle}
        >
          {isLoading ? (
            <Loader2 size={18} color="white" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Send size={18} color="white" />
          )}
        </button>
      </div>
    </>
  );

  return (
    <div style={containerStyle}>
      {isOpen && (
        <div style={chatWindowStyle}>
          {/* 헤더 */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {viewMode !== 'chat' && (
                <button onClick={() => setViewMode('chat')} style={iconButtonStyle} title="채팅으로 돌아가기">
                  <ChevronLeft size={20} />
                </button>
              )}
              <Bot size={20} />
              <span style={{ fontWeight: 600, fontSize: '15px' }}>
                {viewMode === 'chat' ? title : viewMode === 'history' ? '대화 기록' : '검색'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {viewMode === 'chat' && (
                <>
                  <button onClick={() => { setSearchQuery(''); setSearchResults([]); setViewMode('search'); }} style={iconButtonStyle} title="검색">
                    <Search size={18} />
                  </button>
                  <button onClick={openHistory} style={iconButtonStyle} title="대화 기록">
                    <History size={18} />
                  </button>
                  <button onClick={startNewSession} style={iconButtonStyle} title="새 대화">
                    <Plus size={18} />
                  </button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} style={iconButtonStyle}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          {viewMode === 'chat' && renderChatView()}
          {viewMode === 'history' && renderHistoryView()}
          {viewMode === 'search' && renderSearchView()}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        style={toggleButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(26, 54, 93, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(26, 54, 93, 0.4)';
        }}
      >
        {isOpen ? <X size={28} color="white" /> : <MessageCircle size={28} color="white" />}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
