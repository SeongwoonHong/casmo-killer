const extractCookie = (cookies = '') => {

  const obj = {};

  for (let cookie of cookies.split(/; */)) {

    const eqSign = cookie.indexOf('=');

    if (eqSign > 0) {

      const key = cookie.substr(0, eqSign).trim();
      const val = cookie.substr(eqSign + 1, cookie.length).trim().replace(/^"/g, '');

      if (obj[key] === undefined) {
        obj[key] = decodeURIComponent(val);
      }
    }

  }

  return obj;

};

module.exports = extractCookie;
