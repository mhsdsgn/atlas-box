import { BookmarkItem, AppSettings } from '../types/bookmarks';
import { INITIAL_MOCK_BOOKMARKS } from '../data/mockBookmarks';

const LOCAL_STORAGE_KEY_BOOKMARKS = 'launchpad_mock_bookmarks_v1';
const LOCAL_STORAGE_KEY_SETTINGS = 'launchpad_app_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  wallpaper: 'gemini-material-dark',
  openInNewTab: true,
  gridColumns: 7,
  iconSize: 'normal',
  showFaviconIfNoCustom: true,
  customIcons: {},
  customTitles: {},
  customOrder: {},
  superFavorites: ['101', '102', '103', '104', '105', '106', '107']
};

export const isChromeExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.bookmarks && !!chrome.storage;
};

// Internal memory store for mock mode
let mockBookmarksTree: BookmarkItem[] = [];

// Initialize Mock Store from localStorage or defaults
const loadMockFromLocalStorage = (): BookmarkItem[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Erro ao carregar favoritos do localStorage:', err);
  }
  return INITIAL_MOCK_BOOKMARKS;
};

const saveMockToLocalStorage = (tree: BookmarkItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(tree));
    window.dispatchEvent(new Event('launchpad-bookmarks-updated'));
  } catch (err) {
    console.error('Erro ao salvar favoritos no localStorage:', err);
  }
};

mockBookmarksTree = loadMockFromLocalStorage();

// Settings Management
export const getAppSettings = async (): Promise<AppSettings> => {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['launchpadSettings'], (result) => {
        if (result && result.launchpadSettings) {
          resolve({ ...DEFAULT_SETTINGS, ...(result.launchpadSettings as Partial<AppSettings>) });
        } else {
          resolve(DEFAULT_SETTINGS);
        }
      });
    });
  } else {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (err) {
      console.error('Error loading settings from localStorage', err);
    }
    return DEFAULT_SETTINGS;
  }
};

export const saveAppSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const current = await getAppSettings();
  const updated = { ...current, ...settings };

  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ launchpadSettings: updated }, () => {
        resolve(updated);
      });
    });
  } else {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('launchpad-settings-updated', { detail: updated }));
    } catch (err) {
      console.error('Error saving settings to localStorage', err);
    }
    return updated;
  }
};

// Bookmarks Fetching
export const fetchBookmarks = async (): Promise<BookmarkItem[]> => {
  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.bookmarks.getTree((tree) => {
        resolve(tree as unknown as BookmarkItem[]);
      });
    });
  } else {
    return JSON.parse(JSON.stringify(mockBookmarksTree));
  }
};

// Create Bookmark
export const createBookmarkItem = async (
  title: string,
  url?: string,
  parentId: string = '1',
  customIcon?: string
): Promise<BookmarkItem> => {
  const settings = await getAppSettings();

  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.bookmarks.create(
        {
          parentId,
          title,
          url
        },
        async (newChromeBookmark) => {
          if (customIcon) {
            const newIcons = { ...settings.customIcons, [newChromeBookmark.id]: customIcon };
            await saveAppSettings({ customIcons: newIcons });
          }
          resolve(newChromeBookmark as unknown as BookmarkItem);
        }
      );
    });
  } else {
    const newItemId = Date.now().toString();
    const newItem: BookmarkItem = {
      id: newItemId,
      parentId,
      title,
      url,
      customIcon,
      dateAdded: Date.now()
    };

    const addToTree = (items: BookmarkItem[]): boolean => {
      for (const item of items) {
        if (item.id === parentId) {
          if (!item.children) item.children = [];
          item.children.push(newItem);
          return true;
        }
        if (item.children && addToTree(item.children)) {
          return true;
        }
      }
      return false;
    };

    // If parentId not found, add to root children of first folder
    if (!addToTree(mockBookmarksTree)) {
      if (mockBookmarksTree[0] && mockBookmarksTree[0].children) {
        mockBookmarksTree[0].children.push(newItem);
      } else {
        mockBookmarksTree.push(newItem);
      }
    }

    if (customIcon) {
      const newIcons = { ...settings.customIcons, [newItemId]: customIcon };
      await saveAppSettings({ customIcons: newIcons });
    }

    saveMockToLocalStorage(mockBookmarksTree);
    return newItem;
  }
};

// Create Folder
export const createFolderItem = async (
  title: string,
  parentId: string = '1',
  folderType: 'normal' | 'super' = 'normal',
  customIcon?: string,
  folderColor?: string
): Promise<BookmarkItem> => {
  const settings = await getAppSettings();

  if (isChromeExtension()) {
    return new Promise((resolve) => {
      chrome.bookmarks.create(
        {
          parentId,
          title
        },
        async (newFolder) => {
          const folderTypes = { ...(settings.folderTypes || {}), [newFolder.id]: folderType };
          const folderColors = { ...(settings.folderColors || {}), [newFolder.id]: folderColor || 'blue' };
          const customIcons = { ...settings.customIcons };
          if (customIcon) customIcons[newFolder.id] = customIcon;
          await saveAppSettings({ folderTypes, folderColors, customIcons });
          resolve({
            ...(newFolder as unknown as BookmarkItem),
            folderType,
            folderColor,
            customIcon
          });
        }
      );
    });
  } else {
    const newFolderId = 'folder_' + Date.now();
    const newFolder: BookmarkItem = {
      id: newFolderId,
      parentId,
      title,
      children: [],
      folderType,
      folderColor: folderColor || 'blue',
      customIcon,
      dateAdded: Date.now()
    };

    const addToTree = (items: BookmarkItem[]): boolean => {
      for (const item of items) {
        if (item.id === parentId) {
          if (!item.children) item.children = [];
          item.children.push(newFolder);
          return true;
        }
        if (item.children && addToTree(item.children)) {
          return true;
        }
      }
      return false;
    };

    if (!addToTree(mockBookmarksTree)) {
      if (mockBookmarksTree[0] && mockBookmarksTree[0].children) {
        mockBookmarksTree[0].children.push(newFolder);
      }
    }

    const folderTypes = { ...(settings.folderTypes || {}), [newFolderId]: folderType };
    const folderColors = { ...(settings.folderColors || {}), [newFolderId]: folderColor || 'blue' };
    const customIcons = { ...settings.customIcons };
    if (customIcon) customIcons[newFolderId] = customIcon;
    await saveAppSettings({ folderTypes, folderColors, customIcons });

    saveMockToLocalStorage(mockBookmarksTree);
    return newFolder;
  }
};

// Update Bookmark / Folder
export const updateBookmarkItem = async (
  id: string,
  changes: {
    title?: string;
    url?: string;
    customIcon?: string;
    customTitle?: string;
    folderType?: 'normal' | 'super';
    folderColor?: string;
  }
): Promise<void> => {
  const settings = await getAppSettings();

  // Save custom metadata in settings
  const customIcons = { ...settings.customIcons };
  const customTitles = { ...settings.customTitles };
  const folderTypes = { ...(settings.folderTypes || {}) };
  const folderColors = { ...(settings.folderColors || {}) };

  if (changes.customIcon !== undefined) {
    if (changes.customIcon.trim()) {
      customIcons[id] = changes.customIcon.trim();
    } else {
      delete customIcons[id];
    }
  }

  if (changes.customTitle !== undefined) {
    if (changes.customTitle.trim()) {
      customTitles[id] = changes.customTitle.trim();
    } else {
      delete customTitles[id];
    }
  }

  if (changes.folderType !== undefined) {
    folderTypes[id] = changes.folderType;
  }

  if (changes.folderColor !== undefined) {
    folderColors[id] = changes.folderColor;
  }

  await saveAppSettings({ customIcons, customTitles, folderTypes, folderColors });

  if (isChromeExtension()) {
    const updateObj: { title?: string; url?: string } = {};
    if (changes.title) updateObj.title = changes.title;
    if (changes.url) updateObj.url = changes.url;

    if (Object.keys(updateObj).length > 0) {
      await new Promise<void>((resolve) => {
        chrome.bookmarks.update(id, updateObj, () => resolve());
      });
    }
  } else {
    const updateInTree = (items: BookmarkItem[]): boolean => {
      for (const item of items) {
        if (item.id === id) {
          if (changes.title) item.title = changes.title;
          if (changes.url !== undefined) item.url = changes.url;
          if (changes.customIcon !== undefined) item.customIcon = changes.customIcon;
          if (changes.customTitle !== undefined) item.customTitle = changes.customTitle;
          if (changes.folderType !== undefined) item.folderType = changes.folderType;
          if (changes.folderColor !== undefined) item.folderColor = changes.folderColor;
          return true;
        }
        if (item.children && updateInTree(item.children)) {
          return true;
        }
      }
      return false;
    };

    updateInTree(mockBookmarksTree);
    saveMockToLocalStorage(mockBookmarksTree);
  }
};

// Delete Bookmark or Folder
export const deleteBookmarkItem = async (id: string): Promise<void> => {
  if (isChromeExtension()) {
    await new Promise<void>((resolve) => {
      chrome.bookmarks.removeTree(id, () => resolve());
    });
  } else {
    const deleteFromTree = (items: BookmarkItem[]): boolean => {
      const idx = items.findIndex((item) => item.id === id);
      if (idx !== -1) {
        items.splice(idx, 1);
        return true;
      }
      for (const item of items) {
        if (item.children && deleteFromTree(item.children)) {
          return true;
        }
      }
      return false;
    };

    deleteFromTree(mockBookmarksTree);
    saveMockToLocalStorage(mockBookmarksTree);
  }
};

// Move item (Drag and Drop)
export const moveBookmarkItem = async (id: string, destinationParentId: string, newIndex?: number): Promise<void> => {
  if (isChromeExtension()) {
    await new Promise<void>((resolve) => {
      chrome.bookmarks.move(id, { parentId: destinationParentId, index: newIndex }, () => resolve());
    });
  } else {
    let itemToMove: BookmarkItem | null = null;

    // Step 1: Remove from current location
    const removeFromTree = (items: BookmarkItem[]): boolean => {
      const idx = items.findIndex((i) => i.id === id);
      if (idx !== -1) {
        itemToMove = items.splice(idx, 1)[0];
        return true;
      }
      for (const i of items) {
        if (i.children && removeFromTree(i.children)) return true;
      }
      return false;
    };

    removeFromTree(mockBookmarksTree);

    if (itemToMove) {
      (itemToMove as BookmarkItem).parentId = destinationParentId;

      // Step 2: Insert into destination folder
      const insertIntoTree = (items: BookmarkItem[]): boolean => {
        for (const i of items) {
          if (i.id === destinationParentId) {
            if (!i.children) i.children = [];
            if (newIndex !== undefined && newIndex >= 0 && newIndex <= i.children.length) {
              i.children.splice(newIndex, 0, itemToMove!);
            } else {
              i.children.push(itemToMove!);
            }
            return true;
          }
          if (i.children && insertIntoTree(i.children)) return true;
        }
        return false;
      };

      if (!insertIntoTree(mockBookmarksTree)) {
        if (mockBookmarksTree[0] && mockBookmarksTree[0].children) {
          mockBookmarksTree[0].children.push(itemToMove);
        }
      }

      saveMockToLocalStorage(mockBookmarksTree);
    }
  }
};

// Reset Mock Data (for demo testing)
export const resetMockBookmarks = async (): Promise<void> => {
  if (!isChromeExtension()) {
    mockBookmarksTree = INITIAL_MOCK_BOOKMARKS;
    saveMockToLocalStorage(mockBookmarksTree);
    await saveAppSettings(DEFAULT_SETTINGS);
  }
};

// Listeners for live bookmark updates
export const subscribeToBookmarkEvents = (callback: () => void): (() => void) => {
  if (isChromeExtension()) {
    const listener = () => callback();
    chrome.bookmarks.onCreated.addListener(listener);
    chrome.bookmarks.onRemoved.addListener(listener);
    chrome.bookmarks.onChanged.addListener(listener);
    chrome.bookmarks.onMoved.addListener(listener);
    chrome.bookmarks.onChildrenReordered.addListener(listener);

    return () => {
      chrome.bookmarks.onCreated.removeListener(listener);
      chrome.bookmarks.onRemoved.removeListener(listener);
      chrome.bookmarks.onChanged.removeListener(listener);
      chrome.bookmarks.onMoved.removeListener(listener);
      chrome.bookmarks.onChildrenReordered.removeListener(listener);
    };
  } else {
    const handleUpdate = () => callback();
    window.addEventListener('launchpad-bookmarks-updated', handleUpdate);
    return () => {
      window.removeEventListener('launchpad-bookmarks-updated', handleUpdate);
    };
  }
};
