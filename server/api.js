const router = require('express').Router();

router.get('/test', (req, res) => {
  res.send('This is working !!!');
});
router.get('/login', (req, res) => {
  res.send('testing');
});
module.exports = router;
