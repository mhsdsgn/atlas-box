import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem, AppSettings } from '../../types/bookmarks';
import { getFaviconUrl } from '../../utils/favicon';
import { Plus, Minus } from 'lucide-react';

interface SuperDockProps {
  superFavorites: BookmarkItem[];
  isEditMode: boolean;
  settings: AppSettings;
  onOpenApp: (item: BookmarkItem) => void;
  onRemoveSuperFavorite: (id: string) => void;
  onAddSuperFavoriteClick: () => void;
  onContextMenu: (e: React.MouseEvent, item: BookmarkItem) => void;
}

export const SuperDock: React.FC<SuperDockProps> = ({
  superFavorites,
  isEditMode,
  settings,
  onOpenApp,
  onRemoveSuperFavorite,
  onAddSuperFavoriteClick,
  onContextMenu
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[98vw] select-none">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative flex items-center gap-1.5 sm:gap-2.5 px-4 py-2.5 rounded-2xl bg-[#1e1f20] border border-[#3c4043] shadow-[0_12px_32px_rgba(0,0,0,0.6)] transition-all"
      >
        {/* Dock App Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap py-1">
          {superFavorites.map((item, index) => {
            const customIcon = settings.customIcons[item.id] || item.customIcon;
            const customTitle = settings.customTitles[item.id] || item.customTitle || item.title;
            const favicon = item.url ? getFaviconUrl(item.url) : '';
            const iconUrl = customIcon || (settings.showFaviconIfNoCustom ? favicon : '');

            const isHovered = hoveredIndex === index;

            return (
              <div key={item.id} className="relative group flex flex-col items-center">
                {/* Tooltip on Hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="absolute -top-11 px-3.5 py-1 rounded-full bg-[#28292a] text-[#e3e3e3] text-[12px] font-medium border border-[#3c4043] shadow-xl whitespace-nowrap z-50 pointer-events-none"
                    >
                      {customTitle}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dock Icon Button */}
                <motion.button
                  onClick={() => onOpenApp(item)}
                  onContextMenu={(e) => onContextMenu(e, item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl p-2 flex items-center justify-center bg-[#28292a] hover:bg-[#333537] border border-[#3c4043] hover:border-[#8e918f] shadow-md transition-colors ${
                    isEditMode ? 'animate-jiggle' : ''
                  }`}
                >
                  {/* Remove Button in Edit Mode */}
                  {isEditMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSuperFavorite(item.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#ea4335] hover:bg-red-500 text-white flex items-center justify-center shadow-md border border-[#3c4043] z-20"
                      title="Remover da Dock"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                  )}

                  {/* Icon Rendering */}
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt={customTitle}
                      className="w-full h-full object-contain rounded-xl drop-shadow-sm pointer-events-none"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-[#a8c7fa] flex items-center justify-center text-[#040e29] font-bold text-sm shadow-inner">
                      {customTitle.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.button>

                {/* Material Indicator Dot beneath pinned apps */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#a8c7fa] mt-1 shadow-sm transition-all" />
              </div>
            );
          })}
        </div>

        {/* Add Super Favorite Button (only visible in Edit Mode) */}
        {isEditMode && (
          <>
            <div className="h-8 w-px bg-[#3c4043] mx-1 flex-shrink-0" />
            <motion.button
              onClick={onAddSuperFavoriteClick}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#28292a] hover:bg-[#333537] border border-[#3c4043] text-[#e3e3e3] flex items-center justify-center transition-all shadow-md group"
              title="Adicionar App aos Super Favoritos"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
};

