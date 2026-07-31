import { BookmarkItem } from '../types/bookmarks';

export const INITIAL_MOCK_BOOKMARKS: BookmarkItem[] = [
  {
    id: '1',
    title: 'Barra de Favoritos',
    children: [
      {
        id: '10',
        title: 'Apple Ecosystem',
        children: [
          {
            id: '101',
            title: 'iCloud Web',
            url: 'https://www.icloud.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/ICloud_logo.svg'
          },
          {
            id: '102',
            title: 'Apple Music',
            url: 'https://music.apple.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Apple_Music_icon.svg'
          },
          {
            id: '103',
            title: 'Apple TV+',
            url: 'https://tv.apple.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Apple_TV_plus_logo.svg'
          },
          {
            id: '104',
            title: 'App Store',
            url: 'https://www.apple.com/app-store/',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg'
          },
          {
            id: '105',
            title: 'Apple Developer',
            url: 'https://developer.apple.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
          }
        ]
      },
      {
        id: '20',
        title: 'Desenvolvimento',
        children: [
          {
            id: '201',
            title: 'GitHub',
            url: 'https://github.com',
            customIcon: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971111e0b.png'
          },
          {
            id: '202',
            title: 'Figma App',
            url: 'https://figma.com',
            customIcon: 'https://cdn.sanity.io/images/599r6htc/localized/46a764802108955529e241488d11d74b5627d3e0-1024x1024.png?w=1024&h=1024&q=80&fit=max&auto=format'
          },
          {
            id: '203',
            title: 'ChatGPT',
            url: 'https://chatgpt.com',
            customIcon: 'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.800a2f3c.png'
          },
          {
            id: '204',
            title: 'Tailwind CSS',
            url: 'https://tailwindcss.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg'
          },
          {
            id: '205',
            title: 'Vercel Dashboard',
            url: 'https://vercel.com',
            customIcon: 'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png'
          }
        ]
      },
      {
        id: '30',
        title: 'Produtividade',
        children: [
          {
            id: '301',
            title: 'Notion Workspace',
            url: 'https://notion.so',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Notion-logo.svg'
          },
          {
            id: '302',
            title: 'Google Docs',
            url: 'https://docs.google.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg'
          },
          {
            id: '303',
            title: 'Gmail',
            url: 'https://mail.google.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg'
          },
          {
            id: '304',
            title: 'Canva Studio',
            url: 'https://canva.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg'
          }
        ]
      },
      {
        id: '40',
        title: 'Mídias e Redes',
        children: [
          {
            id: '401',
            title: 'YouTube',
            url: 'https://youtube.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'
          },
          {
            id: '402',
            title: 'Spotify Web',
            url: 'https://spotify.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg'
          },
          {
            id: '403',
            title: 'Netflix',
            url: 'https://netflix.com',
            customIcon: 'https://assets.nflxext.com/us/fuji/360/01.png'
          },
          {
            id: '404',
            title: 'WhatsApp Web',
            url: 'https://web.whatsapp.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
          },
          {
            id: '405',
            title: 'Instagram',
            url: 'https://instagram.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'
          },
          {
            id: '406',
            title: 'X / Twitter',
            url: 'https://x.com',
            customIcon: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg'
          }
        ]
      },
      {
        id: '1001',
        title: 'Google',
        url: 'https://google.com'
      },
      {
        id: '1002',
        title: 'Wikipedia',
        url: 'https://wikipedia.org'
      },
      {
        id: '1003',
        title: 'Canaltech',
        url: 'https://canaltech.com.br'
      },
      {
        id: '1004',
        title: 'Mercado Livre',
        url: 'https://mercadolivre.com.br'
      },
      {
        id: '1005',
        title: 'G1 Notícias',
        url: 'https://g1.globo.com'
      }
    ]
  }
];
