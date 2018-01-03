const chalk = require('chalk');

module.exports.server = (res, error, message = 'Internal Server Error.') => {
  console.log(chalk.bgRed(message));
  console.log(chalk.bgRed(error));
  res.status(500).send({ error, message });
};

module.exports.validation = (res, error) => {

  console.log(chalk.bgRed(error));

  const type = error.details[0].type.indexOf('required') > -1
    ? 'required'
    : 'invalid';

  const message = `The ${error.details[0].path[0]} is ${type}.`;

  res.status(400).send({ error, message });

};
