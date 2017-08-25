const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', { id: Number , name:String, description:String, done:Boolean });

module.exports = Todo;