var express = require('express');
var router = express.Router();
import { Router, Request, Response } from 'express';

/* GET home page. */
router.get('/', function (req: Request, res: Response) {
  return res.send({ 'home': 'Hello world' });
});

module.exports = router;
