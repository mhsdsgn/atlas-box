export function getDomainFromUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    return url.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

export function getFaviconUrl(url?: string, customIcon?: string): string {
  if (customIcon && customIcon.trim().length > 0) {
    return customIcon.trim();
  }

  if (!url) {
    return '';
  }

  const domain = getDomainFromUrl(url);
  if (!domain) {
    return 'https://www.google.com/s2/favicons?domain=example.com&sz=128';
  }

  // Use Google High-Resolution Favicon service (128px)
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function ensureHttpUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('chrome://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
