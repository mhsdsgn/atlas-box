import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookmarkItem } from '../../types/bookmarks';
import { getFaviconUrl } from '../../utils/favicon';
import { X, Globe } from 'lucide-react';

interface AppIconProps {
  item: BookmarkItem;
  customIcon?: string;
  customTitle?: string;
  isEditMode: boolean;
  openInNewTab: boolean;
  onOpen: (item: BookmarkItem) => void;
  onEdit: (item: BookmarkItem) => void;
  onDelete: (item: BookmarkItem) => void;
  onContextMenu: (e: React.MouseEvent, item: BookmarkItem) => void;
  onDragStart?: (e: React.DragEvent, item: BookmarkItem) => void;
  onDragOver?: (e: React.DragEvent, item: BookmarkItem) => void;
  onDrop?: (e: React.DragEvent, item: BookmarkItem) => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  item,
  customIcon,
  customTitle,
  isEditMode,
  openInNewTab,
  onOpen,
  onEdit,
  onDelete,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const [imgError, setImgError] = useState(false);

  const displayTitle = customTitle || item.customTitle || item.title;
  const iconUrl = customIcon || item.customIcon || getFaviconUrl(item.url);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      onEdit(item);
    } else {
      onOpen(item);
    }
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: isEditMode ? [0, -1.5, 1.5, -1.5, 0] : 0
      }}
      transition={
        isEditMode
          ? { repeat: Infinity, duration: 0.35, ease: 'easeInOut' }
          : { type: 'spring', stiffness: 300, damping: 25 }
      }
      whileHover={!isEditMode ? { scale: 1.08, y: -4 } : { scale: 1.02 }}
      whileTap={{ scale: 0.94 }}
      className="relative flex flex-col items-center justify-start group cursor-pointer select-none w-24 sm:w-28 m-2"
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, item)}
      draggable={!isEditMode}
      onDragStart={(e) => onDragStart && onDragStart(e, item)}
      onDragOver={(e) => onDragOver && onDragOver(e, item)}
      onDrop={(e) => onDrop && onDrop(e, item)}
    >
      {/* Delete badge button in Edit Mode */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className="absolute -top-1.5 -left-1.5 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-90"
          title="Excluir aplicativo"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      )}

      {/* Material Design App Squircle Icon Container */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[22%] bg-[#1e1f20] hover:bg-[#28292a] border border-[#3c4043] hover:border-[#8e918f] shadow-lg group-hover:shadow-xl transition-all duration-200 flex items-center justify-center overflow-hidden p-2.5">
        {iconUrl && !imgError ? (
          <img
            src={iconUrl}
            alt={displayTitle}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain drop-shadow-sm rounded-[16%] transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-[16%] bg-[#a8c7fa] flex items-center justify-center text-[#040e29] shadow-inner font-bold">
            <Globe size={28} className="opacity-90" />
          </div>
        )}
      </div>

      {/* App Label */}
      <span className="mt-2 text-xs sm:text-sm font-medium text-white/90 dark:text-white/90 text-center line-clamp-2 px-1 max-w-full tracking-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] group-hover:text-white transition-colors">
        {displayTitle}
      </span>
    </motion.div>
  );
};
