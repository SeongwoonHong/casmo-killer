export const set = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      resolve(JSON.parse(localStorage.getItem(key)));
    } catch (error) {
      reject(error);
    }
  });
};

export const remove = (key) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.removeItem(key);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const get = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
