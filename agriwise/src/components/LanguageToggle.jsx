import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageToggle = ({ lang, setLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Defined languages with their codes matching your TRANSLATIONS object keys
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' }
  ];

  // Find the label corresponding to the currently active language code
  const currentLabel = languages.find(l => l.code === lang)?.label || 'English';

  const handleSelect = (languageCode) => {
    setLang(languageCode); // This updates the entire app
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide hover:bg-white/20 transition-all"
      >
        <Globe size={14} />
        {currentLabel}
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-32 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden z-50">
          {languages.map((item) => (
            <button
              key={item.code}
              onClick={() => handleSelect(item.code)}
              className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors
                ${lang === item.code 
                  ? 'bg-white/20 text-white' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;