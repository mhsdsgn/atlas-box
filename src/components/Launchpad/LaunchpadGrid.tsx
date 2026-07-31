import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem, AppSettings } from '../../types/bookmarks';
import { AppIcon } from './AppIcon';
import { FolderIcon } from './FolderIcon';
import { SearchBar } from './SearchBar';
import { ChevronLeft, ChevronRight, Plus, FolderPlus, Sparkles } from 'lucide-react';

interface LaunchpadGridProps {
  items: BookmarkItem[];
  folders: BookmarkItem[];
  searchQuery: string;
  isEditMode: boolean;
  settings: AppSettings;
  onOpenApp: (item: BookmarkItem) => void;
  onOpenFolder: (folder: BookmarkItem) => void;
  onEditItem: (item: BookmarkItem) => void;
  onDeleteItem: (item: BookmarkItem) => void;
  onContextMenu: (e: React.MouseEvent, item: BookmarkItem) => void;
  onDropItemIntoFolder: (draggedItemId: string, targetFolderId: string) => void;
  onNewAppClick: () => void;
  onNewFolderClick: () => void;
}

export const LaunchpadGrid: React.FC<LaunchpadGridProps> = ({
  items,
  folders,
  searchQuery,
  isEditMode,
  settings,
  onOpenApp,
  onOpenFolder,
  onEditItem,
  onDeleteItem,
  onContextMenu,
  onDropItemIntoFolder,
  onNewAppClick,
  onNewFolderClick
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [draggedItem, setDraggedItem] = useState<BookmarkItem | null>(null);

  // Items per page calculation based on selected grid columns (7 or 8 columns x 3 rows)
  const cols = settings.gridColumns === 8 ? 8 : 7;
  const ITEMS_PER_PAGE = cols * 3;

  // Filter items if searching
  const isSearching = searchQuery.trim().length > 0;
  const filteredItems = isSearching
    ? items.filter((item) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = (item.customTitle || item.title || '').toLowerCase().includes(query);
        const urlMatch = item.url ? item.url.toLowerCase().includes(query) : false;
        return titleMatch || urlMatch;
      })
    : items;

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const pageItems = isSearching
    ? filteredItems
    : filteredItems.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const handleDragStartApp = (e: React.DragEvent, item: BookmarkItem) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 z-10 relative">
      {/* Grid Canvas */}
      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[60vh] relative">
        <AnimatePresence mode="wait">
          {pageItems.length > 0 ? (
            <motion.div
              key={currentPage + (isSearching ? 'search' : 'page')}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.25 }}
              className={`w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 ${
                cols === 8 ? 'lg:grid-cols-8' : 'lg:grid-cols-7'
              } gap-y-6 gap-x-2 sm:gap-x-4 justify-items-center items-start my-auto`}
            >
              {pageItems.map((item) => {
                const isFolder = !!item.children;
                if (isFolder) {
                  return (
                    <FolderIcon
                      key={item.id}
                      folder={item}
                      customIcons={settings.customIcons}
                      customTitles={settings.customTitles}
                      folderTypes={settings.folderTypes}
                      folderColors={settings.folderColors}
                      isEditMode={isEditMode}
                      onOpenFolder={onOpenFolder}
                      onDeleteFolder={onDeleteItem}
                      onContextMenu={onContextMenu}
                      onDropItemIntoFolder={onDropItemIntoFolder}
                    />
                  );
                }
                return (
                  <AppIcon
                    key={item.id}
                    item={item}
                    customIcon={settings.customIcons[item.id]}
                    customTitle={settings.customTitles[item.id]}
                    isEditMode={isEditMode}
                    openInNewTab={settings.openInNewTab}
                    onOpen={onOpenApp}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    onContextMenu={onContextMenu}
                    onDragStart={handleDragStartApp}
                  />
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center p-8 bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/15 rounded-3xl max-w-md my-auto text-white shadow-2xl"
            >
              <Sparkles size={40} className="text-blue-400 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold">Nenhum aplicativo encontrado</h3>
              <p className="text-xs text-white/70 mt-1 mb-5">
                {isSearching
                  ? `Nenhum resultado para "${searchQuery}". Tente outro termo.`
                  : 'Sua tela de favoritos está vazia. Adicione seu primeiro aplicativo ou pasta!'}
              </p>

              {!isSearching && (
                <div className="flex gap-2">
                  <button
                    onClick={onNewAppClick}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus size={15} />
                    Adicionar App
                  </button>
                  <button
                    onClick={onNewFolderClick}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <FolderPlus size={15} />
                    Criar Pasta
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Dot Indicator (macOS Launchpad style) */}
      {!isSearching && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6 mb-2 py-1 px-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentPage === idx
                    ? 'w-2.5 h-2.5 bg-white shadow-md scale-110'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`Página ${idx + 1}`}
              />
            ))}
          </div>

          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            className="p-1 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
