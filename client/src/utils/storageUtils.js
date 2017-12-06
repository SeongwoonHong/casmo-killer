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

export const get = (key) => {

  return new Promise((resolve, reject) => {

    try {

      const value = localStorage.getItem(key);
      resolve(JSON.parse(value));

    } catch (error) {

      reject(error);

    }

  });

};
