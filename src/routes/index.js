const express = require('express');
const router = express.Router();

const homeRoute = require('./home');
const todosRoute = require('./api/todos');

router.use('/', homeRoute);
router.use('/api/todos', todosRoute);

module.exports = router;