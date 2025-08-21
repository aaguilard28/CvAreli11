import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, MapPin, Building } from 'lucide-react';

interface CollapsibleExperienceProps {
  date: string;
  title: string;
  company?: string;
  location?: string;
  description: string[];
  isOpen?: boolean;
}

export default function CollapsibleExperience({ 
  date, 
  title, 
  company, 
  location, 
  description = [],
  isOpen = false 
}: CollapsibleExperienceProps) {
  const [expanded, setExpanded] = useState(isOpen);

  const hasDescription = Array.isArray(description) && description.length > 0;

  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border-l-4 border-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
      <div className="absolute -left-2 top-6 w-4 h-4 bg-teal-500 rounded-full shadow-lg"></div>
      
      <div 
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center space-x-2 text-teal-600 font-semibold">
            <Calendar size={16} />
            <span className="text-sm uppercase tracking-wide">{date}</span>
          </div>
          {location && (
            <div className="flex items-center space-x-2 text-gray-500">
              <MapPin size={16} />
              <span className="text-sm">{location}</span>
            </div>
          )}
          <div className="ml-auto">
            {expanded ? (
              <ChevronUp className="text-teal-600" size={20} />
            ) : (
              <ChevronDown className="text-teal-600" size={20} />
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2 pr-8">{title}</h3>
        
        {company && (
          <div className="flex items-center space-x-2 text-gray-600 italic mb-4 font-medium">
            <Building size={16} />
            <span>{company}</span>
          </div>
        )}
      </div>

      {hasDescription && (
        <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="space-y-3 mt-4">
            {description.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
