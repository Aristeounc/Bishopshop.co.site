const store = {};

module.exports = {
  default: {
    getItem: (key) => Promise.resolve(store[key] || null),
    setItem: (key, value) => { store[key] = value; return Promise.resolve(); },
    removeItem: (key) => { delete store[key]; return Promise.resolve(); },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); return Promise.resolve(); },
    getAllKeys: () => Promise.resolve(Object.keys(store)),
    multiGet: (keys) => Promise.resolve(keys.map(k => [k, store[k] || null])),
    multiSet: (pairs) => { pairs.forEach(([k, v]) => { store[k] = v; }); return Promise.resolve(); },
    multiRemove: (keys) => { keys.forEach(k => delete store[k]); return Promise.resolve(); },
  },
};

module.exports.default = module.exports.default;
