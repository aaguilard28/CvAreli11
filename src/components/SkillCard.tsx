import React from 'react';

interface SkillCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function SkillCard({ title, children, icon }: SkillCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-green-50 p-6 rounded-xl border-t-4 border-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center space-x-3 mb-4">
        {icon && <div className="text-teal-600">{icon}</div>}
        <h3 className="text-xl font-bold text-teal-800">{title}</h3>
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}