
import { useEffect } from 'react';

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  structuredData?: object;
}

export const useSEO = (data: SEOData) => {
  useEffect(() => {
    // Update title
    document.title = `${data.title} | RP OS Cloud`;
    
    // Update meta description
    updateMetaTag('description', data.description);
    
    // Update keywords if provided
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords);
    }
    
    // Update Open Graph tags
    updateMetaProperty('og:title', data.title);
    updateMetaProperty('og:description', data.description);
    updateMetaProperty('og:image', data.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png');
    updateMetaProperty('og:url', window.location.href);
    
    // Update Twitter Card tags
    updateMetaProperty('twitter:title', data.title);
    updateMetaProperty('twitter:description', data.description);
    updateMetaProperty('twitter:image', data.ogImage || 'https://lovable.dev/opengraph-image-p98pqg.png');
    
    // Update canonical URL
    updateCanonical(data.canonical || window.location.href);
    
    // Add structured data if provided
    if (data.structuredData) {
      updateStructuredData(data.structuredData);
    }
  }, [data]);
};

const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const updateCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const updateStructuredData = (data: object) => {
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
