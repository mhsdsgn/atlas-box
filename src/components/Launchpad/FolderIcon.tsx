import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookmarkItem } from '../../types/bookmarks';
import { getFaviconUrl } from '../../utils/favicon';
import { Folder, X, Globe } from 'lucide-react';

interface FolderIconProps {
  folder: BookmarkItem;
  customIcons?: Record<string, string>;
  customTitles?: Record<string, string>;
  folderTypes?: Record<string, 'normal' | 'super'>;
  folderColors?: Record<string, string>;
  isEditMode: boolean;
  onOpenFolder: (folder: BookmarkItem) => void;
  onDeleteFolder: (folder: BookmarkItem) => void;
  onContextMenu: (e: React.MouseEvent, folder: BookmarkItem) => void;
  onDropItemIntoFolder?: (draggedItemId: string, targetFolderId: string) => void;
}

export const FolderIcon: React.FC<FolderIconProps> = ({
  folder,
  customIcons = {},
  customTitles = {},
  folderTypes = {},
  folderColors = {},
  isEditMode,
  onOpenFolder,
  onDeleteFolder,
  onContextMenu,
  onDropItemIntoFolder
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const children = folder.children || [];
  const previewChildren = children.slice(0, 4);

  const displayTitle = customTitles[folder.id] || folder.title;
  const customIcon = customIcons[folder.id] || folder.customIcon;
  const isSuperPasta = (folderTypes[folder.id] || folder.folderType) === 'super';
  const folderColor = folderColors[folder.id] || folder.folderColor || '#a8c7fa';

  // Check if customIcon is a short string (emoji) vs image URL
  const isEmoji = customIcon && customIcon.length <= 4 && !customIcon.startsWith('http');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const draggedItemId = e.dataTransfer.getData('text/plain');
    if (draggedItemId && draggedItemId !== folder.id && onDropItemIntoFolder) {
      onDropItemIntoFolder(draggedItemId, folder.id);
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
      onClick={() => onOpenFolder(folder)}
      onContextMenu={(e) => onContextMenu(e, folder)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Delete button in Edit Mode */}
      {isEditMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteFolder(folder);
          }}
          className="absolute -top-1.5 -left-1.5 z-20 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 active:scale-90"
          title="Excluir pasta"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      )}

      {/* Folder Squircle Container */}
      <div
        style={{
          borderColor: isDragOver ? '#a8c7fa' : undefined
        }}
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-[22%] bg-[#1e1f20] hover:bg-[#28292a] border border-[#3c4043] hover:border-[#8e918f] shadow-lg group-hover:shadow-xl ${
          isDragOver ? 'scale-105 shadow-xl ring-2 ring-[#a8c7fa]/50 bg-[#28292a]' : ''
        } transition-all duration-200 p-2 flex items-center justify-center overflow-hidden`}
      >
        {/* Render Custom Emoji/Icon or 4-tile Preview */}
        {isEmoji ? (
          <div className="flex flex-col items-center justify-center text-2xl sm:text-3xl filter drop-shadow">
            <span>{customIcon}</span>
          </div>
        ) : customIcon && !isEmoji ? (
          <div className="w-full h-full p-1 flex items-center justify-center">
            <img
              src={customIcon}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : previewChildren.length > 0 ? (
          <div className="w-full h-full grid grid-cols-2 gap-1.5 items-center justify-items-center">
            {previewChildren.map((child) => {
              const iconUrl = customIcons[child.id] || child.customIcon || getFaviconUrl(child.url);
              return (
                <div
                  key={child.id}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#28292a] border border-[#3c4043] flex items-center justify-center p-0.5 overflow-hidden shadow-xs"
                >
                  {iconUrl ? (
                    <img
                      src={iconUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe size={10} className="text-white/80" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center text-white/60">
            <Folder size={26} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Folder Name Label */}
      <span className="mt-2 text-xs sm:text-sm font-medium text-white/90 text-center line-clamp-2 px-1 max-w-full tracking-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.8)] group-hover:text-white transition-colors">
        {displayTitle}
      </span>
    </motion.div>
  );
};
