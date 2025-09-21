const INVALID_IMAGE_VALUES = new Set(['', '#', 'n/a', 'na', 'null', 'undefined']);

function sanitizeImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return null;
  }

  if (INVALID_IMAGE_VALUES.has(trimmed.toLowerCase())) {
    return null;
  }

  return trimmed;
}

function buildKeywordString({
  name,
  description,
  category,
}: {
  name: string;
  description?: string;
  category?: string;
}): string {
  const rawKeywords = [category, name, description]
    .filter(Boolean)
    .join(' ')
    .replace(/[\n\r]+/g, ' ')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map(keyword => keyword.toLowerCase());

  const uniqueKeywords = Array.from(new Set(['glass', ...rawKeywords]));

  return uniqueKeywords.join(',');
}

export function generateProductPlaceholderImage({
  name,
  description,
  category,
}: {
  name: string;
  description?: string;
  category?: string;
}): string {
  const keywords = buildKeywordString({ name, description, category });
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(keywords)}`;
}

export function resolveProductImage({
  image,
  name,
  description,
  category,
}: {
  image?: string | null;
  name: string;
  description?: string;
  category?: string;
}): { src: string; placeholder: string } {
  const placeholder = generateProductPlaceholderImage({ name, description, category });
  const sanitized = sanitizeImageUrl(image);

  return {
    src: sanitized ?? placeholder,
    placeholder,
  };
}
