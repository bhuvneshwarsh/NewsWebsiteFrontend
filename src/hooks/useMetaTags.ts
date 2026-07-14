import { useEffect } from 'react';

interface MetaTagsOptions {
  title:       string;
  description: string;
  imageUrl?:   string | null;
  url?:        string;
  type?:       'article' | 'website';
  author?:     string;
  publishedAt?: string | null;
  category?:   string;
}

const SITE_NAME   = 'Prajatantr Ki Gunj';
const DEFAULT_IMG = '../public/logo.png'; // add a 1200x630 image here

function setMeta(property: string, content: string, useProperty = true) {
  const attr = useProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useMetaTags(options: MetaTagsOptions) {
  const {
    title, description, imageUrl, url, type = 'article',
    author, publishedAt, category
  } = options;

  useEffect(() => {
    const pageUrl  = url || window.location.href;
    const imgUrl   = (imageUrl && imageUrl.startsWith('http')) ? imageUrl : DEFAULT_IMG;
    const fullTitle = `${title} | ${SITE_NAME}`;
    // Strip HTML tags from description for clean preview text
    const cleanDesc = description.replace(/<[^>]*>/g, '').slice(0, 160);

    // ── Document title ─────────────────────────────────────────────────────
    document.title = fullTitle;

    // ── Canonical URL ──────────────────────────────────────────────────────
    setLink('canonical', pageUrl);

    // ── Standard meta tags ─────────────────────────────────────────────────
    setMeta('description',    cleanDesc, false);
    setMeta('author',         author || SITE_NAME, false);

    // ── Open Graph (Facebook, WhatsApp, LinkedIn, Telegram) ───────────────
    setMeta('og:type',              type);
    setMeta('og:url',               pageUrl);
    setMeta('og:title',             fullTitle);
    setMeta('og:description',       cleanDesc);
    setMeta('og:image',             imgUrl);
    setMeta('og:image:width',       '1200');
    setMeta('og:image:height',      '630');
    setMeta('og:image:alt',         title);
    setMeta('og:site_name',         SITE_NAME);
    setMeta('og:locale',            'hi_IN');

    // Article-specific OG tags
    if (type === 'article') {
      if (publishedAt) setMeta('article:published_time', publishedAt);
      if (author)      setMeta('article:author',         author);
      if (category)    setMeta('article:section',        category);
    }

    // ── Twitter Card ───────────────────────────────────────────────────────
    setMeta('twitter:card',        'summary_large_image', false);
    setMeta('twitter:title',        fullTitle,            false);
    setMeta('twitter:description',  cleanDesc,            false);
    setMeta('twitter:image',        imgUrl,               false);
    setMeta('twitter:site',        '@PrajatantrGunj',    false);

    // ── WhatsApp specific (uses og: tags but image must be accessible) ─────
    // WhatsApp reads og:image — no additional tags needed.
    // IMPORTANT: og:image URL must be publicly accessible (not behind auth)

    // ── Cleanup: restore defaults when navigating away ─────────────────────
    return () => {
      document.title = SITE_NAME;
      setMeta('og:type',        'website');
      setMeta('og:url',          window.location.origin);
      setMeta('og:title',        SITE_NAME);
      setMeta('og:description',  'आपका विश्वसनीय समाचार स्रोत');
      setMeta('og:image',        DEFAULT_IMG);
      setMeta('twitter:card',    'summary_large_image', false);
    };
  }, [title, description, imageUrl, url, author, publishedAt, category]);
}

// ── Also export a function to set meta tags for any page (non-hook usage) ────
export function setPageMeta(options: MetaTagsOptions) {
  const pageUrl   = options.url || window.location.href;
  const imgUrl    = (options.imageUrl && options.imageUrl.startsWith('http'))
    ? options.imageUrl : DEFAULT_IMG;
  const fullTitle = `${options.title} | ${SITE_NAME}`;
  const cleanDesc = options.description.replace(/<[^>]*>/g, '').slice(0, 160);

  document.title = fullTitle;
  setLink('canonical', pageUrl);
  setMeta('description',         cleanDesc, false);
  setMeta('og:type',             options.type || 'website');
  setMeta('og:url',              pageUrl);
  setMeta('og:title',            fullTitle);
  setMeta('og:description',      cleanDesc);
  setMeta('og:image',            imgUrl);
  setMeta('og:image:width',      '1200');
  setMeta('og:image:height',     '630');
  setMeta('og:site_name',        SITE_NAME);
  setMeta('twitter:card',        'summary_large_image', false);
  setMeta('twitter:title',        fullTitle, false);
  setMeta('twitter:description',  cleanDesc, false);
  setMeta('twitter:image',        imgUrl,    false);
}