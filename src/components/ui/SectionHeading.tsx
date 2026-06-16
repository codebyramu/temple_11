import React from 'react';

export function SectionHeading({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`section-heading ${className}`}>
      {children}
    </h2>
  );
}
