import { siteUrl } from "./site-content";

export function shareLinks(title: string, path: string) {
  const url = new URL(path, siteUrl).href;
  const encodedUrl = encodeURIComponent(url);
  return {
    url,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}`,
  };
}
