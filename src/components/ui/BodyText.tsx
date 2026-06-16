import React from 'react';

export function BodyText({ children, italic = false, className = '' }: { children: React.ReactNode, italic?: boolean, className?: string }) {
  return (
    <p className={`body-text ${italic ? 'body-text-italic' : ''} ${className}`}>
      {children}
    </p>
  );
}
