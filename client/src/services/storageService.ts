export const STORAGE_KEYS = {};

export const getStorage = (key: string): any => {
  if (!window || !window.localStorage) {
    return null;
  }

  try {
    return JSON.parse(<string>window.localStorage.getItem(key));
  } catch (e) {
    return window.localStorage.getItem(key);
  }
};

export const removeStorage = (key: string): void => {
  if (window && window.localStorage) {
    window.localStorage.removeItem(key);
  }
};

export const setStorage = (key: string, val: string | object): void => {
  if (window && window.localStorage) {
    window.localStorage.setItem(
      key,
      typeof val === 'object'
        ? JSON.stringify(val)
        : val,
    );
  }
};
