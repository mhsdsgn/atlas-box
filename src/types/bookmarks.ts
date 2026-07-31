export interface BookmarkItem {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: BookmarkItem[];
  dateAdded?: number;
  dateGroupModified?: number;
  index?: number;
  customIcon?: string;
  customTitle?: string;
  folderType?: 'normal' | 'super';
  folderColor?: string;
}

export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  wallpaper: string;
  openInNewTab: boolean;
  gridColumns: number;
  iconSize: 'normal' | 'large';
  showFaviconIfNoCustom: boolean;
  customIcons: Record<string, string>; // bookmarkId -> icon URL or emoji
  customTitles: Record<string, string>; // bookmarkId -> custom name
  customOrder: Record<string, string[]>; // folderId/root -> array of bookmarkIds
  superFavorites?: string[]; // list of bookmark IDs or URLs pinned in macOS dock
  folderTypes?: Record<string, 'normal' | 'super'>; // folderId -> type
  folderColors?: Record<string, string>; // folderId -> accent color
}

export interface PresetApp {
  name: string;
  url: string;
  icon: string;
  category: string;
}
