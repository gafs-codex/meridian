const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 4;

export function getRecentlyViewed() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addRecentlyViewed(productId) {
    const current = getRecentlyViewed();
    const updated = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}