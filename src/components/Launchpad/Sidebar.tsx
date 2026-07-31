import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem, AppSettings } from '../../types/bookmarks';
import { isChromeExtension } from '../../services/bookmarkService';
import {
  LayoutGrid,
  Folder,
  Plus,
  FolderPlus,
  Settings,
  X,
  HelpCircle,
  Box
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  folders: BookmarkItem[];
  selectedFolderId: string | null;
  isEditMode: boolean;
  settings: AppSettings;
  onClose: () => void;
  onSelectFolder: (folderId: string | null) => void;
  onOpenNewAppModal: () => void;
  onOpenNewFolderModal: () => void;
  onToggleEditMode: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  folders,
  selectedFolderId,
  isEditMode,
  settings,
  onClose,
  onSelectFolder,
  onOpenNewAppModal,
  onOpenNewFolderModal,
  onToggleEditMode,
  onToggleTheme,
  onOpenSettings,
  onOpenGuide
}) => {
  const isExtension = isChromeExtension();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#1e1f20] border-r border-[#3c4043] p-5 shadow-2xl flex flex-col justify-between text-[#e3e3e3] overflow-y-auto custom-scrollbar select-none"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
                    <Box size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold tracking-tight text-white leading-tight">Atlas Box</h2>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Action Buttons */}
              <div className="mt-5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2 block mb-1">
                  Ações Rápidas
                </span>

                <button
                  onClick={() => {
                    onOpenNewAppModal();
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-md"
                >
                  <Plus size={16} />
                  <span>Novo Aplicativo / Link</span>
                </button>

                <button
                  onClick={() => {
                    onOpenNewFolderModal();
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                >
                  <FolderPlus size={16} />
                  <span>Nova Pasta (Grupo)</span>
                </button>
              </div>

              {/* Folder Navigation Tree */}
              <div className="mt-6 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2 block mb-1">
                  Pastas & Categorias
                </span>

                <button
                  onClick={() => {
                    onSelectFolder(null);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedFolderId === null
                      ? 'bg-white/20 text-white font-bold shadow-inner'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={15} />
                  <span>Todos os Favoritos</span>
                </button>

                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFolder(f.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedFolderId === f.id
                        ? 'bg-white/20 text-white font-bold shadow-inner'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Folder size={15} className="text-amber-400 flex-shrink-0" />
                      <span className="truncate">{f.title}</span>
                    </div>
                    {f.children && (
                      <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white/50">
                        {f.children.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onOpenGuide();
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs transition-colors"
              >
                <HelpCircle size={15} />
                <span>Instalar Extensão</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs transition-colors"
              >
                <Settings size={15} />
                <span>Configurações & Visual</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
