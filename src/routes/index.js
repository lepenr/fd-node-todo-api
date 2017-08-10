const express = require('express');
const router = express.Router();

const homeRoute = require('./home');
const todosRoute = require('./v1/todos');

router.use('/', homeRoute);
router.use('/v1/todos', todosRoute);

module.exports = router;