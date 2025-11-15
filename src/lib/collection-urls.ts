/**
 * Map collection slugs to external Brodo website URLs
 */
export function getCollectionUrl(slug: string): string {
  const urlMap: Record<string, string> = {
    'sneakers': 'https://bro.do/pages/sneakers',
    'formal-sandals': 'https://bro.do/pages/formal-sandals',
    'sandals': 'https://bro.do/pages/formal-sandals', // Alias
    'essentials': 'https://bro.do/collections/tops',
    'accessories': 'https://bro.do/pages/accessories',
  };

  return urlMap[slug] || `https://bro.do/collections/${slug}`;
}
