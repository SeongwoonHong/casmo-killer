const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('This is working !!!');
});

module.exports = router;
