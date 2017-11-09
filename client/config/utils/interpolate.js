const fs = require('fs');
const path = require('path');

const escapeStringRegexp = require('escape-string-regexp');

const interpolate = (srcObj, prevHtml, newHtml, scriptName) => {

  let template = fs.readFileSync(prevHtml, 'utf8');

  Object.keys(srcObj).forEach(key => {
    const value = srcObj[key];
    template = template.replace(
      new RegExp('%' + escapeStringRegexp(key) + '%', 'g'),
      value
    );
  });

  template = template.replace('</body>', `<script type="text/javascript" src="/${scriptName}"></script></body>`);

  fs.writeFileSync(path.join(path.parse(prevHtml).dir, newHtml), template);

  console.log('index.dev.html has been created.');

};

module.exports = interpolate;
