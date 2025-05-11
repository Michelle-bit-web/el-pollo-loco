class StorageManager {
    static save(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static load(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    }
}