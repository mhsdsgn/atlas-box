import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem } from '../../types/bookmarks';
import { AppIcon } from './AppIcon';
import { FolderIcon } from './FolderIcon';
import { X, Plus, Edit2, Check, Zap, Layers, FolderPlus, Sparkles, Folder } from 'lucide-react';

interface FolderModalProps {
  folder: BookmarkItem | null;
  customIcons: Record<string, string>;
  customTitles: Record<string, string>;
  folderTypes?: Record<string, 'normal' | 'super'>;
  folderColors?: Record<string, string>;
  isEditMode: boolean;
  openInNewTab: boolean;
  onClose: () => void;
  onOpenApp: (item: BookmarkItem) => void;
  onEditApp: (item: BookmarkItem) => void;
  onDeleteApp: (item: BookmarkItem) => void;
  onRenameFolder: (folderId: string, newTitle: string) => void;
  onAddAppToFolder: (folderId: string) => void;
  onContextMenu: (e: React.MouseEvent, item: BookmarkItem) => void;
  onDragStartApp?: (e: React.DragEvent, item: BookmarkItem) => void;
  onToggleFolderType?: (folderId: string, newType: 'normal' | 'super') => void;
  onEditFolderStyle?: (folder: BookmarkItem) => void;
}

export const FolderModal: React.FC<FolderModalProps> = ({
  folder,
  customIcons,
  customTitles,
  folderTypes = {},
  folderColors = {},
  isEditMode,
  openInNewTab,
  onClose,
  onOpenApp,
  onEditApp,
  onDeleteApp,
  onRenameFolder,
  onAddAppToFolder,
  onContextMenu,
  onDragStartApp,
  onToggleFolderType,
  onEditFolderStyle
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [folderTitle, setFolderTitle] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all'); // 'all' or sub-folder ID

  useEffect(() => {
    if (folder) {
      setFolderTitle(folder.title);
      setIsEditingTitle(false);
      setActiveTab('all');
    }
  }, [folder]);

  if (!folder) return null;

  const children = folder.children || [];
  const subFolders = children.filter((c) => !!c.children);
  const directApps = children.filter((c) => !c.children);

  const isSuperPasta = (folderTypes[folder.id] || folder.folderType) === 'super';
  const customIcon = customIcons[folder.id] || folder.customIcon;
  const isEmoji = customIcon && customIcon.length <= 4 && !customIcon.startsWith('http');

  const handleSaveTitle = () => {
    if (folderTitle.trim() && folderTitle.trim() !== folder.title) {
      onRenameFolder(folder.id, folderTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleToggleType = () => {
    const nextType = isSuperPasta ? 'normal' : 'super';
    if (onToggleFolderType) {
      onToggleFolderType(folder.id, nextType);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="relative w-full max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Super Pasta Toggle Button Floating Outside Top Left */}
          <button
            onClick={handleToggleType}
            className={`absolute -top-9 left-2 sm:left-4 z-30 px-3.5 py-1 rounded-t-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 border-t border-x shadow-lg ${
              isSuperPasta
                ? 'bg-[#1e1f20] text-amber-300 border-amber-500/60 shadow-amber-500/10'
                : 'bg-[#28292a] text-[#8e918f] border-[#3c4043] hover:text-[#e3e3e3]'
            }`}
            title="Clique para alternar entre Pasta Normal e SUPER PASTA"
          >
            {isSuperPasta ? (
              <>
                <Zap size={13} className="fill-amber-300 text-amber-300" />
                <span>SUPER PASTA</span>
              </>
            ) : (
              <>
                <Folder size={13} />
                <span>PASTA NORMAL</span>
              </>
            )}
          </button>

          {/* Modal Main Content Box */}
          <div
            className={`relative w-full max-h-[85vh] bg-[#1e1f20] border ${
              isSuperPasta ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-[#3c4043]'
            } rounded-3xl p-5 sm:p-8 shadow-2xl overflow-y-auto custom-scrollbar flex flex-col items-center text-[#e3e3e3]`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#28292a] hover:bg-[#333537] text-[#e3e3e3] border border-[#3c4043] flex items-center justify-center transition-colors shadow"
              title="Fechar pasta (Esc)"
            >
              <X size={18} />
            </button>

            {/* Folder Header */}
            <div className="flex flex-col items-center gap-2 mb-6 max-w-2xl w-full text-center">
            {/* Folder Icon & Title */}
            <div className="flex items-center justify-center gap-3 mt-1">
              {isEmoji ? (
                <span className="text-3xl sm:text-4xl">{customIcon}</span>
              ) : customIcon ? (
                <img src={customIcon} alt="" className="w-9 h-9 object-contain rounded-xl" />
              ) : null}

              {isEditingTitle ? (
                <div className="flex items-center gap-2 w-full max-w-md">
                  <input
                    type="text"
                    value={folderTitle}
                    onChange={(e) => setFolderTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    autoFocus
                    className="w-full bg-[#28292a] text-[#e3e3e3] text-2xl font-semibold text-center px-4 py-1.5 rounded-xl border border-[#3c4043] focus:outline-none focus:border-[#a8c7fa]"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] font-medium"
                    title="Salvar nome"
                  >
                    <Check size={18} />
                  </button>
                </div>
              ) : (
                <div className="group flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#e3e3e3] tracking-tight">
                    {folder.title}
                  </h2>
                  <Edit2 size={16} className="text-[#8e918f] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>

          {/* SUPER PASTA Sub-pages / Sub-folders Tab Bar */}
          {isSuperPasta && (
            <div className="w-full flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6 border-b border-[#3c4043]">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  activeTab === 'all'
                    ? 'bg-amber-400 text-black font-bold shadow-md'
                    : 'bg-[#28292a] text-[#8e918f] hover:text-[#e3e3e3] border border-[#3c4043]'
                }`}
              >
                <Layers size={14} />
                <span>📌 Visão Geral ({children.length})</span>
              </button>

              {/* Sub-folder Tabs */}
              {subFolders.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveTab(sub.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium text-xs transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    activeTab === sub.id
                      ? 'bg-[#a8c7fa] text-[#040e29] font-bold shadow-md'
                      : 'bg-[#28292a] text-[#8e918f] hover:text-[#e3e3e3] border border-[#3c4043]'
                  }`}
                >
                  <span>📁</span>
                  <span>{customTitles[sub.id] || sub.title}</span>
                  <span className="text-[10px] opacity-75">({(sub.children || []).length})</span>
                </button>
              ))}

              {/* Add Sub-folder / Sub-page inside Super Pasta button */}
              <button
                onClick={() => onAddAppToFolder(folder.id)}
                className="px-3 py-1.5 rounded-xl bg-[#28292a] hover:bg-[#333537] border border-dashed border-[#444746] text-[#a8c7fa] text-xs font-semibold flex items-center gap-1 flex-shrink-0 transition-colors ml-auto"
                title="Adicionar sub-pasta ou aplicativo nesta Super Pasta"
              >
                <FolderPlus size={14} />
                <span>+ Criar Sub-página</span>
              </button>
            </div>
          )}

          {/* Content View: Sub-tab Active vs Overview */}
          {isSuperPasta && activeTab !== 'all' ? (
            /* Selected Sub-folder View */
            <div className="w-full">
              {(() => {
                const selectedSub = subFolders.find((s) => s.id === activeTab);
                if (!selectedSub) return null;
                const subChildren = selectedSub.children || [];

                return (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-between bg-[#28292a] p-3 rounded-2xl border border-[#3c4043]">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📁</span>
                        <h3 className="font-bold text-sm text-[#e3e3e3]">{selectedSub.title}</h3>
                        <span className="text-xs text-[#8e918f]">({subChildren.length} itens)</span>
                      </div>
                      <button
                        onClick={() => onAddAppToFolder(selectedSub.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#a8c7fa] hover:bg-[#8ab4f8] text-[#040e29] text-xs font-semibold flex items-center gap-1 shadow"
                      >
                        <Plus size={14} />
                        <span>Adicionar nesta Sub-pasta</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center min-h-[140px]">
                      {subChildren.map((child) => (
                        <AppIcon
                          key={child.id}
                          item={child}
                          customIcon={customIcons[child.id]}
                          customTitle={customTitles[child.id]}
                          isEditMode={isEditMode}
                          openInNewTab={openInNewTab}
                          onOpen={onOpenApp}
                          onEdit={onEditApp}
                          onDelete={onDeleteApp}
                          onContextMenu={onContextMenu}
                          onDragStart={onDragStartApp}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : isSuperPasta && subFolders.length > 0 ? (
            /* Super Pasta Overview: Grouped Sub-cards + Direct Apps */
            <div className="w-full space-y-6">
              {/* Cards for each Sub-folder */}
              {subFolders.map((sub) => {
                const subChildren = sub.children || [];
                return (
                  <div
                    key={sub.id}
                    className="w-full p-4 rounded-2xl bg-[#28292a]/80 border border-[#3c4043] shadow-md"
                  >
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#3c4043]/60">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📁</span>
                        <h3 className="font-bold text-sm text-[#e3e3e3]">{customTitles[sub.id] || sub.title}</h3>
                        <span className="text-xs text-[#8e918f]">({subChildren.length})</span>
                      </div>
                      <button
                        onClick={() => setActiveTab(sub.id)}
                        className="text-xs font-semibold text-[#a8c7fa] hover:underline"
                      >
                        Expandir sub-página →
                      </button>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 justify-items-center">
                      {subChildren.map((child) => (
                        <AppIcon
                          key={child.id}
                          item={child}
                          customIcon={customIcons[child.id]}
                          customTitle={customTitles[child.id]}
                          isEditMode={isEditMode}
                          openInNewTab={openInNewTab}
                          onOpen={onOpenApp}
                          onEdit={onEditApp}
                          onDelete={onDeleteApp}
                          onContextMenu={onContextMenu}
                          onDragStart={onDragStartApp}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Direct Apps in Super Pasta */}
              {directApps.length > 0 && (
                <div className="w-full p-4 rounded-2xl bg-[#28292a]/50 border border-[#3c4043]">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#8e918f] mb-3">
                    Aplicativos Diretos
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 justify-items-center">
                    {directApps.map((child) => (
                      <AppIcon
                        key={child.id}
                        item={child}
                        customIcon={customIcons[child.id]}
                        customTitle={customTitles[child.id]}
                        isEditMode={isEditMode}
                        openInNewTab={openInNewTab}
                        onOpen={onOpenApp}
                        onEdit={onEditApp}
                        onDelete={onDeleteApp}
                        onContextMenu={onContextMenu}
                        onDragStart={onDragStartApp}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Add App button */}
              <div className="flex justify-center pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddAppToFolder(folder.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#28292a] hover:bg-[#333537] border border-dashed border-[#444746] text-[#e3e3e3] text-xs font-semibold transition-colors shadow-md"
                >
                  <Plus size={16} />
                  <span>Adicionar Novo App nesta Super Pasta</span>
                </motion.button>
              </div>
            </div>
          ) : (
            /* Normal Folder / Single Grid Layout */
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 sm:gap-6 justify-items-center min-h-[160px]">
              {children.map((child) => {
                const isSubFolder = !!child.children;
                if (isSubFolder) {
                  return (
                    <FolderIcon
                      key={child.id}
                      folder={child}
                      customIcons={customIcons}
                      customTitles={customTitles}
                      folderTypes={folderTypes}
                      folderColors={folderColors}
                      isEditMode={isEditMode}
                      onOpenFolder={(f) => {
                        // Could open subfolder
                      }}
                      onDeleteFolder={onDeleteApp}
                      onContextMenu={onContextMenu}
                    />
                  );
                }
                return (
                  <AppIcon
                    key={child.id}
                    item={child}
                    customIcon={customIcons[child.id]}
                    customTitle={customTitles[child.id]}
                    isEditMode={isEditMode}
                    openInNewTab={openInNewTab}
                    onOpen={onOpenApp}
                    onEdit={onEditApp}
                    onDelete={onDeleteApp}
                    onContextMenu={onContextMenu}
                    onDragStart={onDragStartApp}
                  />
                );
              })}

              {/* Quick Add App inside folder button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAddAppToFolder(folder.id)}
                className="flex flex-col items-center justify-center w-24 sm:w-28 m-2 group cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22%] bg-[#28292a] hover:bg-[#333537] border border-dashed border-[#444746] flex items-center justify-center text-[#e3e3e3] transition-colors shadow-md">
                  <Plus size={32} />
                </div>
                <span className="mt-2 text-xs font-medium text-[#c4c7c5] group-hover:text-[#e3e3e3]">
                  Adicionar App
                </span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
