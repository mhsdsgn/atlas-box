import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkItem, AppSettings } from './types/bookmarks';
import {
  fetchBookmarks,
  getAppSettings,
  saveAppSettings,
  createBookmarkItem,
  createFolderItem,
  updateBookmarkItem,
  deleteBookmarkItem,
  moveBookmarkItem,
  subscribeToBookmarkEvents,
  resetMockBookmarks
} from './services/bookmarkService';
import { WALLPAPER_OPTIONS } from './data/presetApps';

import { LaunchpadGrid } from './components/Launchpad/LaunchpadGrid';
import { FolderModal } from './components/Launchpad/FolderModal';
import { AppleDock } from './components/Launchpad/AppleDock';
import { SuperDock } from './components/Launchpad/SuperDock';
import { Sidebar } from './components/Launchpad/Sidebar';
import { EditAppModal } from './components/Launchpad/EditAppModal';
import { ContextMenu } from './components/Launchpad/ContextMenu';
import { SettingsModal } from './components/Launchpad/SettingsModal';
import { ExtensionGuideModal } from './components/Launchpad/ExtensionGuideModal';
import { POPULAR_PRESET_APPS } from './data/presetApps';

export default function App() {
  const [bookmarksTree, setBookmarksTree] = useState<BookmarkItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    wallpaper: 'sequoia-dark',
    openInNewTab: true,
    gridColumns: 7,
    iconSize: 'normal',
    showFaviconIfNoCustom: true,
    customIcons: {},
    customTitles: {},
    customOrder: {}
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFolderIdFilter, setSelectedFolderIdFilter] = useState<string | null>(null);

  // Modals state
  const [activeOpenFolder, setActiveOpenFolder] = useState<BookmarkItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<BookmarkItem | null>(null);
  const [parentFolderForNewApp, setParentFolderForNewApp] = useState<string>('1');

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);

  // Context Menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: BookmarkItem } | null>(null);

  // Load initial data & settings
  const reloadData = async () => {
    const tree = await fetchBookmarks();
    const currentSettings = await getAppSettings();
    setBookmarksTree(tree);
    setSettings(currentSettings);
  };

  useEffect(() => {
    reloadData();
    const unsubscribe = subscribeToBookmarkEvents(() => reloadData());
    return () => unsubscribe();
  }, []);

  // Update HTML document dark mode class & wallpaper background
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      // System mode
      const isSysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSysDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Extract primary root items and all folders
  const { rootItems, allFolders } = useMemo(() => {
    const foldersList: BookmarkItem[] = [];

    const traverseFolders = (items: BookmarkItem[]) => {
      for (const item of items) {
        if (item.children) {
          // Ignore top-level root wrapper if it's Chrome root ('0')
          if (item.id !== '0') {
            foldersList.push(item);
          }
          traverseFolders(item.children);
        }
      }
    };

    traverseFolders(bookmarksTree);

    // Determine target main bookmarks array
    let mainList: BookmarkItem[] = [];

    if (selectedFolderIdFilter) {
      const found = foldersList.find((f) => f.id === selectedFolderIdFilter);
      if (found && found.children) {
        mainList = found.children;
      }
    } else {
      // Find 'Barra de Favoritos' (id '1') or default first folder children
      const bookmarkBar = bookmarksTree.find((b) => b.id === '1' || b.id === '0');
      if (bookmarkBar && bookmarkBar.children) {
        // If '0' root, look for children of '1'
        if (bookmarkBar.id === '0' && bookmarkBar.children[0] && bookmarkBar.children[0].children) {
          mainList = bookmarkBar.children[0].children;
        } else {
          mainList = bookmarkBar.children;
        }
      } else if (bookmarksTree.length > 0) {
        mainList = bookmarksTree[0].children || bookmarksTree;
      }
    }

    return { rootItems: mainList, allFolders: foldersList };
  }, [bookmarksTree, selectedFolderIdFilter]);

  // Compute Super Favorite Items for macOS Dock
  const superFavoriteItems = useMemo(() => {
    const currentFavIds = settings.superFavorites || ['101', '102', '103', '104', '105', '106', '107'];
    const allItemsList: BookmarkItem[] = [];

    const extractItems = (items: BookmarkItem[]) => {
      for (const item of items) {
        if (!item.children) {
          allItemsList.push(item);
        } else {
          extractItems(item.children);
        }
      }
    };

    extractItems(bookmarksTree);

    const matchedItems: BookmarkItem[] = [];
    for (const favId of currentFavIds) {
      const found = allItemsList.find((i) => i.id === favId);
      if (found) {
        matchedItems.push(found);
      } else {
        const preset = POPULAR_PRESET_APPS.find(
          (p) => p.name.toLowerCase() === favId.toLowerCase() || p.url === favId
        );
        if (preset) {
          matchedItems.push({
            id: favId,
            title: preset.name,
            url: preset.url,
            customIcon: preset.icon
          });
        }
      }
    }

    return matchedItems;
  }, [bookmarksTree, settings.superFavorites]);

  const handleToggleSuperFavorite = async (item: BookmarkItem) => {
    const currentFavs = settings.superFavorites || ['101', '102', '103', '104', '105', '106', '107'];
    let updatedFavs: string[];
    if (currentFavs.includes(item.id)) {
      updatedFavs = currentFavs.filter((id) => id !== item.id);
    } else {
      updatedFavs = [...currentFavs, item.id];
    }
    await handleUpdateSettings({ superFavorites: updatedFavs });
  };

  const handleRemoveSuperFavorite = async (id: string) => {
    const currentFavs = settings.superFavorites || ['101', '102', '103', '104', '105', '106', '107'];
    const updatedFavs = currentFavs.filter((favId) => favId !== id);
    await handleUpdateSettings({ superFavorites: updatedFavs });
  };

  // Active wallpaper styling
  const currentWallpaperCss = useMemo(() => {
    const matched = WALLPAPER_OPTIONS.find((wp) => wp.id === settings.wallpaper);
    return matched ? matched.css : WALLPAPER_OPTIONS[0].css;
  }, [settings.wallpaper]);

  // Handlers
  const handleOpenApp = (item: BookmarkItem) => {
    if (!item.url) return;
    if (settings.openInNewTab) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = item.url;
    }
  };

  const handleOpenFolder = (folder: BookmarkItem) => {
    setActiveOpenFolder(folder);
  };

  const handleEditItem = (item: BookmarkItem) => {
    setItemToEdit(item);
    setEditModalOpen(true);
  };

  const handleDeleteItem = async (item: BookmarkItem) => {
    if (window.confirm(`Tem certeza que deseja excluir "${item.title}"?`)) {
      await deleteBookmarkItem(item.id);
      if (activeOpenFolder && activeOpenFolder.id === item.id) {
        setActiveOpenFolder(null);
      }
      await reloadData();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: BookmarkItem) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleDropItemIntoFolder = async (draggedItemId: string, targetFolderId: string) => {
    await moveBookmarkItem(draggedItemId, targetFolderId);
    await reloadData();
  };

  const handleSaveItemModal = async (
    id: string | null,
    data: {
      title: string;
      url?: string;
      customIcon?: string;
      customTitle?: string;
      parentId?: string;
      isFolder?: boolean;
      folderType?: 'normal' | 'super';
      folderColor?: string;
    }
  ) => {
    if (id) {
      // Update existing
      await updateBookmarkItem(id, {
        title: data.title,
        url: data.url,
        customIcon: data.customIcon,
        customTitle: data.customTitle,
        folderType: data.folderType,
        folderColor: data.folderColor
      });
    } else {
      // Create new
      if (data.isFolder) {
        await createFolderItem(
          data.title,
          data.parentId || '1',
          data.folderType || 'normal',
          data.customIcon,
          data.folderColor
        );
      } else {
        await createBookmarkItem(data.title, data.url, data.parentId || '1', data.customIcon);
      }
    }
    await reloadData();
  };

  const handleToggleFolderType = async (folderId: string, newType: 'normal' | 'super') => {
    await updateBookmarkItem(folderId, { folderType: newType });
    await reloadData();
    if (activeOpenFolder && activeOpenFolder.id === folderId) {
      setActiveOpenFolder((prev) => (prev ? { ...prev, folderType: newType } : null));
    }
  };

  const handleRenameFolder = async (folderId: string, newTitle: string) => {
    await updateBookmarkItem(folderId, { title: newTitle });
    await reloadData();
    if (activeOpenFolder && activeOpenFolder.id === folderId) {
      setActiveOpenFolder((prev) => (prev ? { ...prev, title: newTitle } : null));
    }
  };

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await saveAppSettings(newSettings);
    setSettings(updated);
  };

  const handleResetData = async () => {
    if (window.confirm('Deseja redefinir os favoritos de demonstração do preview?')) {
      await resetMockBookmarks();
      await reloadData();
      setSettingsModalOpen(false);
    }
  };

  return (
    <div
      style={{ background: currentWallpaperCss }}
      className="min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-white transition-all duration-700 relative font-sans"
    >
      {/* Background Ambient Blur Overlay */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 pointer-events-none" />

      {/* Top Apple Dock / Navigation */}
      <AppleDock
        isEditMode={isEditMode}
        theme={settings.theme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        onOpenSidebar={() => setSidebarOpen(true)}
        onNewApp={() => {
          setItemToEdit(null);
          setParentFolderForNewApp(selectedFolderIdFilter || '1');
          setEditModalOpen(true);
        }}
        onNewFolder={() => {
          setItemToEdit(null);
          setParentFolderForNewApp(selectedFolderIdFilter || '1');
          setEditModalOpen(true);
        }}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onToggleTheme={() =>
          handleUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
        }
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenGuide={() => setGuideModalOpen(true)}
      />

      {/* Active Edit / Organize Mode Pill Indicator */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-[#a8c7fa] text-[#040e29] px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-3 text-xs font-bold border border-white/20"
          >
            <span>Modo de Organização Ativo — Mova, edite ou exclua os ícones</span>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-3 py-1 rounded-full bg-[#040e29] text-[#a8c7fa] hover:bg-[#182038] transition-colors text-xs font-bold"
            >
              Concluir
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Launchpad Apps Grid */}
      <main className="flex-1 flex flex-col items-center justify-center w-full z-10">
        <LaunchpadGrid
          items={rootItems}
          folders={allFolders}
          searchQuery={searchQuery}
          isEditMode={isEditMode}
          settings={settings}
          onOpenApp={handleOpenApp}
          onOpenFolder={handleOpenFolder}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
          onContextMenu={handleContextMenu}
          onDropItemIntoFolder={handleDropItemIntoFolder}
          onNewAppClick={() => {
            setItemToEdit(null);
            setEditModalOpen(true);
          }}
          onNewFolderClick={() => {
            setItemToEdit(null);
            setEditModalOpen(true);
          }}
        />
      </main>

      {/* macOS Super Favoritos Dock */}
      <SuperDock
        superFavorites={superFavoriteItems}
        isEditMode={isEditMode}
        settings={settings}
        onOpenApp={handleOpenApp}
        onRemoveSuperFavorite={handleRemoveSuperFavorite}
        onAddSuperFavoriteClick={() => {
          setItemToEdit(null);
          setEditModalOpen(true);
        }}
        onContextMenu={handleContextMenu}
      />

      {/* Footer Branding */}
      <footer className="w-full text-center pb-16 pt-2 text-[11px] text-white/40 tracking-wider z-10 pointer-events-none">
        Atlas Box • macOS Launchpad & Super Dock
      </footer>

      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        folders={allFolders}
        selectedFolderId={selectedFolderIdFilter}
        isEditMode={isEditMode}
        settings={settings}
        onClose={() => setSidebarOpen(false)}
        onSelectFolder={(id) => setSelectedFolderIdFilter(id)}
        onOpenNewAppModal={() => {
          setItemToEdit(null);
          setEditModalOpen(true);
        }}
        onOpenNewFolderModal={() => {
          setItemToEdit(null);
          setEditModalOpen(true);
        }}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onToggleTheme={() =>
          handleUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })
        }
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenGuide={() => setGuideModalOpen(true)}
      />

      {/* Folder Zoom Popup Modal */}
      {activeOpenFolder && (
        <FolderModal
          folder={activeOpenFolder}
          customIcons={settings.customIcons}
          customTitles={settings.customTitles}
          folderTypes={settings.folderTypes}
          folderColors={settings.folderColors}
          isEditMode={isEditMode}
          openInNewTab={settings.openInNewTab}
          onClose={() => setActiveOpenFolder(null)}
          onOpenApp={handleOpenApp}
          onEditApp={handleEditItem}
          onDeleteApp={handleDeleteItem}
          onRenameFolder={handleRenameFolder}
          onAddAppToFolder={(folderId) => {
            setItemToEdit(null);
            setParentFolderForNewApp(folderId);
            setEditModalOpen(true);
          }}
          onContextMenu={handleContextMenu}
          onToggleFolderType={handleToggleFolderType}
          onEditFolderStyle={(folder) => {
            setItemToEdit(folder);
            setEditModalOpen(true);
          }}
        />
      )}

      {/* Create / Edit App & Icon Modal */}
      <EditAppModal
        item={itemToEdit}
        isOpen={editModalOpen}
        parentFolderId={parentFolderForNewApp}
        folders={allFolders}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveItemModal}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        settings={settings}
        isEditMode={isEditMode}
        onClose={() => setSettingsModalOpen(false)}
        onUpdateSettings={handleUpdateSettings}
        onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        onOpenGuide={() => setGuideModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Extension Install Guide Modal */}
      <ExtensionGuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          folders={allFolders}
          isSuperFavorite={(settings.superFavorites || ['101', '102', '103', '104', '105', '106', '107']).includes(
            contextMenu.item.id
          )}
          onClose={() => setContextMenu(null)}
          onOpen={handleOpenApp}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onMoveToFolder={(item, folderId) => handleDropItemIntoFolder(item.id, folderId)}
          onToggleSuperFavorite={handleToggleSuperFavorite}
        />
      )}
    </div>
  );
}
