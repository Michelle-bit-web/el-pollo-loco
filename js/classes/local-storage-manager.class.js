/**
 * Utility class for managing localStorage data.
 *
 * The `StorageManager` provides static methods to save and load data
 * to and from the browser's localStorage in JSON format.
 */
class StorageManager {
  /**
   * Saves a value in localStorage under the given key.
   * The value is stringified to JSON.
   *
   * @param {string} key - The key under which the value is stored.
   * @param {*} value - The value to store (can be any serializable object).
   */
    static save(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }

  /**
   * Loads a value from localStorage by key.
   * The stored JSON is parsed back into its original form.
   *
   * @param {string} key - The key of the stored item.
   * @returns {*} The parsed value, or `null` if the key does not exist.
   */
  static load(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}