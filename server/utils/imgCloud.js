const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.REACT_APP_cloudinaryCloudName,
  api_key: process.env.REACT_APP_cloudinaryApiKey,
  api_secret: process.env.REACT_APP_cloudinaryApiSecret
});

const imgCloud = {

  upload: (file, username) => {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(file, {
        public_id: username,
        discard_original_filename: true,
        eager: [
          {
            width: 100,
            height: 100,
            crop: 'fill'
          }
        ]
      }, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result.eager[0].secure_url);
      });
    });
  }

};

module.exports = imgCloud;
