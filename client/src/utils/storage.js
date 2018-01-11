// TODO: might need a better way of error checking
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
  localStorage.removeItem(key);
};

export const get = (key) => {
  return JSON.parse(localStorage.getItem(key));
};
