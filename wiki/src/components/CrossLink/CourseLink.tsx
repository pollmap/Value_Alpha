import React from 'react';

interface CourseLinkProps {
  courseId: string;
  moduleId?: string;
  title: string;
  duration?: string;
  description?: string;
}

export const CourseLink: React.FC<CourseLinkProps> = ({
  courseId,
  moduleId,
  title,
  duration,
  description,
}) => {
  const lmsUrl = typeof window !== 'undefined'
    ? (window as any).__LMS_URL__ || 'https://lms.valuation-academy.com'
    : 'https://lms.valuation-academy.com';

  const courseUrl = moduleId
    ? `${lmsUrl}/courses/${courseId}/jump_to_id/${moduleId}`
    : `${lmsUrl}/courses/${courseId}`;

  return (
    <a
      href={courseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="course-link-box"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(90deg, #dbeafe 0%, #ede9fe 100%)',
        borderRadius: '8px',
        margin: '1.5rem 0',
        textDecoration: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        color: 'inherit',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontSize: '2rem' }}>📚</span>
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontWeight: 600,
          color: '#1f2937',
          margin: 0,
          marginBottom: description ? '0.25rem' : 0
        }}>
          {title}
        </h4>
        {description && (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, marginTop: '0.25rem' }}>
            {description}
          </p>
        )}
        {duration && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            <span>⏱️</span>
            <span>{duration}</span>
          </div>
        )}
      </div>
      <div style={{ color: '#9ca3af' }}>
        →
      </div>
    </a>
  );
};

export default CourseLink;
