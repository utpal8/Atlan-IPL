const store = {};

/**
 * Made this to have a global instance of worker,
 * this was intially developed to contain whole app state but idea changed.
 */

export default {
  setItem(key, value, key2) {
    if (key2) {
      store[key] = store[key] || {};
      store[key2] = value;
    } else {
      store[key] = value;
    }
  },
  getItem(key) {
    return store[key];
  }
};