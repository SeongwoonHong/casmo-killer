const fs = require('fs');
const uuid = require('uuid');
const { generateKeyPairSync } = require('crypto');

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

for (let i = 0; i < 30; i++) {
  const {
    privateKey,
    publicKey,
  } = generate();

  const secretKey = uuid.v4();

  keyHash[secretKey] = keyHash[secretKey]
    ? keyHash[secretKey]
    : {};
  keyHash[secretKey].private = privateKey;
  keyHash[secretKey].public = publicKey;
}

fs.writeFileSync(
  './key-pairs.json',
  JSON.stringify(keyHash),
);
