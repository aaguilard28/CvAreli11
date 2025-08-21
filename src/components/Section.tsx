import React, { forwardRef } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, title, children, className = '' },
  ref
) {
  return (
    <section
      ref={ref}
      id={id}
      className={`
        bg-white rounded-2xl shadow-xl p-8 mb-8 scroll-mt-20
        hover:shadow-2xl transition-all duration-300 border border-gray-100
        ${className}
      `}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-gradient-to-r from-indigo-500 to-purple-500 relative">
        {title}
        <div className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-teal-500 to-green-500 rounded-full"></div>
      </h2>
      {children}
    </section>
  );
});

export default Section;
