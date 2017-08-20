// external dependencies
const express = require('express');
const router = express.Router();

// GET http://localhost:3001/ 
router.get('/',(req,res)=>{
  res.send('Hello Dev.to!');
});

module.exports = router;