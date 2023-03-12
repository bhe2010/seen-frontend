export const storage = {
  getItem<T = any>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item);
    } catch (error) {
      return item as T;
    }
  },
  setItem(key: string, data: any) {
    let value = typeof data === "object" ? JSON.stringify(data) : data;
    localStorage.setItem(key, value);
  },
  clearItem(key: string) {
    localStorage.removeItem(key);
  },
};
