import { PresetApp } from '../types/bookmarks';

export const POPULAR_PRESET_APPS: PresetApp[] = [
  {
    name: 'Apple Music',
    url: 'https://music.apple.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg',
    category: 'Apple & Mídia'
  },
  {
    name: 'Apple TV+',
    url: 'https://tv.apple.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Apple_TV_plus_logo.svg',
    category: 'Apple & Mídia'
  },
  {
    name: 'iCloud',
    url: 'https://www.icloud.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg',
    category: 'Apple & Mídia'
  },
  {
    name: 'App Store',
    url: 'https://www.apple.com/app-store/',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg',
    category: 'Apple & Mídia'
  },
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971111e0b.png',
    category: 'Desenvolvimento'
  },
  {
    name: 'Figma',
    url: 'https://figma.com',
    icon: 'https://cdn.sanity.io/images/599r6htc/localized/46a764802108955529e241488d11d74b5627d3e0-1024x1024.png?w=1024&h=1024&q=80&fit=max&auto=format',
    category: 'Design & Dev'
  },
  {
    name: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.800a2f3c.png',
    category: 'IA & Ferramentas'
  },
  {
    name: 'Notion',
    url: 'https://notion.so',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg',
    category: 'Produtividade'
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
    category: 'Mídia'
  },
  {
    name: 'Spotify',
    url: 'https://spotify.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
    category: 'Mídia'
  },
  {
    name: 'Netflix',
    url: 'https://netflix.com',
    icon: 'https://assets.nflxext.com/us/fuji/360/01.png',
    category: 'Mídia'
  },
  {
    name: 'Google Docs',
    url: 'https://docs.google.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg',
    category: 'Produtividade'
  },
  {
    name: 'Gmail',
    url: 'https://mail.google.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    category: 'Produtividade'
  },
  {
    name: 'WhatsApp Web',
    url: 'https://web.whatsapp.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    category: 'Comunicação'
  },
  {
    name: 'Canva',
    url: 'https://canva.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
    category: 'Design'
  },
  {
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
    category: 'Desenvolvimento'
  },
  {
    name: 'Vercel',
    url: 'https://vercel.com',
    icon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
    category: 'Desenvolvimento'
  },
  {
    name: 'Twitter / X',
    url: 'https://x.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg',
    category: 'Redes Sociais'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg',
    category: 'Redes Sociais'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
    category: 'Redes Sociais'
  }
];

export interface WallpaperOption {
  id: string;
  name: string;
  css: string;
  preview: string;
  type: 'dark' | 'light' | 'dynamic';
}

export const WALLPAPER_OPTIONS: WallpaperOption[] = [
  {
    id: 'gemini-material-dark',
    name: 'Google Gemini Dark',
    css: 'radial-gradient(circle at 15% 20%, rgba(66, 133, 244, 0.45), transparent 45%), radial-gradient(circle at 85% 25%, rgba(171, 71, 188, 0.45), transparent 40%), radial-gradient(circle at 50% 80%, rgba(234, 67, 53, 0.35), transparent 50%), linear-gradient(135deg, #131314 0%, #1e1f20 50%, #0e0e10 100%)',
    preview: 'bg-gradient-to-br from-blue-900 via-purple-950 to-slate-950',
    type: 'dark'
  },
  {
    id: 'gemini-material-light',
    name: 'Google Gemini Light',
    css: 'radial-gradient(circle at 20% 20%, rgba(66, 133, 244, 0.25), transparent 45%), radial-gradient(circle at 80% 30%, rgba(171, 71, 188, 0.25), transparent 45%), radial-gradient(circle at 50% 85%, rgba(52, 168, 83, 0.2), transparent 50%), linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 50%, #e8eaed 100%)',
    preview: 'bg-gradient-to-br from-blue-100 via-purple-100 to-emerald-100',
    type: 'light'
  },
  {
    id: 'google-material-expressive',
    name: 'Google Material You',
    css: 'radial-gradient(circle at 10% 10%, rgba(26, 115, 232, 0.35), transparent 50%), radial-gradient(circle at 90% 90%, rgba(217, 48, 37, 0.3), transparent 50%), radial-gradient(circle at 90% 10%, rgba(249, 171, 0, 0.3), transparent 50%), radial-gradient(circle at 10% 90%, rgba(30, 142, 62, 0.3), transparent 50%), linear-gradient(135deg, #202124 0%, #171717 100%)',
    preview: 'bg-gradient-to-br from-blue-950 via-slate-900 to-neutral-900',
    type: 'dark'
  },
  {
    id: 'sequoia-dark',
    name: 'macOS Sequoia Dark',
    css: 'radial-gradient(ellipse at top left, #2b1055, #11101d, #000000), linear-gradient(to bottom right, #200938, #0d0f18, #050508)',
    preview: 'bg-gradient-to-br from-purple-950 via-slate-900 to-black',
    type: 'dark'
  },
  {
    id: 'sonoma-dusk',
    name: 'macOS Sonoma Dusk',
    css: 'radial-gradient(circle at 50% 20%, rgba(120, 40, 180, 0.4), transparent 60%), radial-gradient(circle at 80% 80%, rgba(220, 80, 120, 0.3), transparent 50%), linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    preview: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950',
    type: 'dark'
  },
  {
    id: 'ventura-sunset',
    name: 'macOS Ventura Orange',
    css: 'radial-gradient(circle at 20% 30%, rgba(255, 120, 50, 0.35), transparent 50%), radial-gradient(circle at 80% 70%, rgba(180, 40, 140, 0.35), transparent 50%), linear-gradient(135deg, #181024 0%, #08050e 100%)',
    preview: 'bg-gradient-to-br from-amber-950 via-purple-950 to-neutral-950',
    type: 'dark'
  },
  {
    id: 'deep-space',
    name: 'Deep Space Pure Black',
    css: 'radial-gradient(circle at 50% 50%, #12131c, #090a0f, #000000)',
    preview: 'bg-black',
    type: 'dark'
  },
  {
    id: 'apple-light-aurora',
    name: 'Apple Light Aurora',
    css: 'radial-gradient(circle at 10% 20%, rgba(200, 230, 255, 0.8), transparent 50%), radial-gradient(circle at 90% 80%, rgba(240, 210, 255, 0.7), transparent 50%), linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
    preview: 'bg-gradient-to-br from-blue-100 via-indigo-50 to-slate-200',
    type: 'light'
  },
  {
    id: 'clean-minimal-light',
    name: 'Apple Clean Light',
    css: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
    preview: 'bg-slate-100',
    type: 'light'
  }
];
