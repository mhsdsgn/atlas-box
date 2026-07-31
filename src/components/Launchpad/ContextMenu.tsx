import React, { useEffect, useRef } from 'react';
import { BookmarkItem } from '../../types/bookmarks';
import { ExternalLink, Edit3, Trash2, FolderPlus, Folder, Pin, PinOff } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  item: BookmarkItem;
  folders: BookmarkItem[];
  isSuperFavorite?: boolean;
  onClose: () => void;
  onOpen: (item: BookmarkItem) => void;
  onEdit: (item: BookmarkItem) => void;
  onDelete: (item: BookmarkItem) => void;
  onMoveToFolder: (item: BookmarkItem, folderId: string) => void;
  onToggleSuperFavorite?: (item: BookmarkItem) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  item,
  folders,
  isSuperFavorite = false,
  onClose,
  onOpen,
  onEdit,
  onDelete,
  onMoveToFolder,
  onToggleSuperFavorite
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleScroll = () => onClose();

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  // Prevent context menu from going offscreen
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - 300);

  const isFolder = !!item.children;

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 w-56 bg-[#28292a] border border-[#3c4043] rounded-2xl shadow-2xl p-1.5 text-[#e3e3e3] text-xs sm:text-sm animate-in fade-in zoom-in-95 duration-150 select-none"
    >
      <div className="px-3 py-1.5 font-semibold text-[#8e918f] text-[11px] uppercase tracking-wider truncate border-b border-[#3c4043] mb-1">
        {item.title}
      </div>

      {!isFolder && item.url && (
        <button
          onClick={() => {
            onOpen(item);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#333537] hover:text-white transition-colors text-left"
        >
          <ExternalLink size={15} />
          <span>Abrir link</span>
        </button>
      )}

      {onToggleSuperFavorite && (
        <button
          onClick={() => {
            onToggleSuperFavorite(item);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#333537] hover:text-white transition-colors text-left text-[#a8c7fa] font-medium"
        >
          {isSuperFavorite ? <PinOff size={15} /> : <Pin size={15} />}
          <span>{isSuperFavorite ? 'Remover dos Super Favoritos' : 'Fixar no Super Dock'}</span>
        </button>
      )}

      <button
        onClick={() => {
          onEdit(item);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#333537] hover:text-white transition-colors text-left"
      >
        <Edit3 size={15} />
        <span>Editar {isFolder ? 'pasta' : 'ícone & nome'}</span>
      </button>

      {!isFolder && folders.length > 0 && (
        <div className="relative group/sub">
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#333537] transition-colors text-left cursor-pointer">
            <span className="flex items-center gap-2">
              <FolderPlus size={15} />
              Mover para pasta
            </span>
            <span className="text-xs text-[#8e918f]">›</span>
          </div>

          <div className="hidden group-hover/sub:block absolute left-full top-0 ml-1 w-48 bg-[#28292a] border border-[#3c4043] rounded-2xl shadow-2xl p-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onMoveToFolder(item, f.id);
                  onClose();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#333537] text-left truncate text-xs"
              >
                <Folder size={13} />
                <span className="truncate">{f.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="my-1 border-t border-[#3c4043]" />

      <button
        onClick={() => {
          onDelete(item);
          onClose();
        }}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#ea4335]/20 hover:text-[#f28b82] text-[#f28b82] transition-colors text-left font-medium"
      >
        <Trash2 size={15} />
        <span>Excluir {isFolder ? 'pasta' : 'favorito'}</span>
      </button>
    </div>
  );
};
