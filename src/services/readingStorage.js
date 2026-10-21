// localStorage-based reading storage
// Replaces the database for storing reading history

const READINGS_KEY = 'tarot_readings';
const FAVORITES_KEY = 'tarot_favorites';

function generateSlug() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function saveReading(readingData) {
  const readings = getReadings();
  const reading = {
    ...readingData,
    id: Date.now(),
    share_slug: generateSlug(),
    created_at: new Date().toISOString(),
    source: readingData.source || 'text',
  };
  readings.unshift(reading);
  localStorage.setItem(READINGS_KEY, JSON.stringify(readings));
  return reading;
}

export function getReadings() {
  try {
    const data = localStorage.getItem(READINGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getReadingBySlug(slug) {
  const readings = getReadings();
  return readings.find(r => r.share_slug === slug) || null;
}

export function toggleFavorite(readingId) {
  const favorites = getFavorites();
  const index = favorites.indexOf(readingId);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(readingId);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return index === -1; // returns true if now favorited
}

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isFavorited(readingId) {
  return getFavorites().includes(readingId);
}
