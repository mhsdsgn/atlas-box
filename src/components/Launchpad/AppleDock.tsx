import React from 'react';
import { motion } from 'motion/react';
import {
  Menu,
  Plus,
  Edit3,
  Check,
  Settings
} from 'lucide-react';
import { SearchBar } from './SearchBar';

interface AppleDockProps {
  isEditMode: boolean;
  theme: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  onOpenSidebar: () => void;
  onNewApp: () => void;
  onNewFolder: () => void;
  onToggleEditMode: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const AppleDock: React.FC<AppleDockProps> = ({
  isEditMode,
  theme,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onOpenSidebar,
  onNewApp,
  onNewFolder,
  onToggleEditMode,
  onToggleTheme,
  onOpenSettings,
  onOpenGuide
}) => {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 z-30 flex items-center justify-between gap-3 sm:gap-6">
      {/* Left controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Menu Icon Only */}
        <button
          onClick={onOpenSidebar}
          className="p-2.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] shadow-md transition-colors flex items-center justify-center"
          title="Abrir Menu de Pastas e Ações"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md mx-2">
        <SearchBar value={searchQuery} onChange={onSearchChange} onClear={onClearSearch} />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Quick Add App button */}
        <button
          onClick={onNewApp}
          className="px-3.5 py-2 rounded-full bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] font-medium text-xs shadow-md transition-all flex items-center gap-1.5"
          title="Adicionar Novo Aplicativo"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Novo App</span>
        </button>

        {/* Quick Organize Button (Icon Only) */}
        <button
          onClick={onToggleEditMode}
          className={`p-2.5 rounded-full shadow-md transition-all flex items-center justify-center ${
            isEditMode
              ? 'bg-[#a8c7fa] text-[#040e29] font-bold ring-2 ring-[#a8c7fa]/40'
              : 'bg-[#1e1f20] hover:bg-[#28292a] border border-[#3c4043] text-[#e3e3e3]'
          }`}
          title={isEditMode ? 'Concluir Organização' : 'Organizar e Editar Ícones'}
        >
          {isEditMode ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Edit3 size={18} />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] border border-[#3c4043] text-[#e3e3e3] shadow-md transition-colors flex items-center justify-center"
          title="Configurações e Opções"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};

