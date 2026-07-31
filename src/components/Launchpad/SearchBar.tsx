import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD+F, CTRL+F, or pressing '/' opens search bar focus
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && value) {
        onClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onClear]);

  return (
    <div className="relative w-full z-20">
      <div className="relative flex items-center w-full bg-[#1e1f20] border border-[#3c4043] hover:border-[#8e918f] focus-within:border-[#a8c7fa] focus-within:bg-[#28292a] rounded-full shadow-md hover:shadow-lg transition-all duration-200">
        <Search size={16} className="ml-3.5 text-[#8e918f] flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar favoritos, sites ou pastas... (⌘F ou /)"
          className="w-full py-2 pl-2.5 pr-8 text-xs sm:text-sm font-normal text-[#e3e3e3] placeholder-[#8e918f] bg-transparent border-none focus:outline-none"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-full text-[#8e918f] hover:text-[#e3e3e3] bg-[#28292a] hover:bg-[#333537] transition-colors"
            title="Limpar busca"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
};
