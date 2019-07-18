const fs = require('fs');
const { generateKeyPairSync } = require('crypto');
const jwt = require('jsonwebtoken');

const keyHash = {};

const generate = () => {
  return generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: {
      format: 'pem',
      type: 'pkcs8',
    },
    publicKeyEncoding: {
      format: 'pem',
      type: 'spki',
    },
  });
};

// for (let i = 0; i < 30; i++) {
//   const {
//     privateKey,
//     publicKey,
//   } = generate();
//
//   // fs.writeFileSync(`./src/lib/rsa-keys/private-${String(i)}.key`, privateKey);
//   // fs.writeFileSync(`./src/lib/rsa-keys/public-${String(i)}.key`, publicKey);
//
//   keyHash[String(i)] = keyHash[String(i)] ? keyHash[String(i)] : {};
//   keyHash[String(i)].private = privateKey;
//   keyHash[String(i)].public = publicKey;
// }
//
// fs.writeFileSync('./shit.json', JSON.stringify(keyHash));

const { privateKey, publicKey } = generate();
const { publicKey: publicKeyTwo } = generate();

const token = jwt.sign({a: 'b'}, privateKey, { algorithm: 'RS256' });
console.log(token);
console.log(jwt.verify(token, publicKey));
console.log(jwt.verify(token, publicKeyTwo));
