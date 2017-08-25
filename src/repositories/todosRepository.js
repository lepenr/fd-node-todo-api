const Todo = require('../models/todoModel');


const todoRepository = function(){

  const _getAll = async function(filter){

    const {done,name,description} = filter;

    const mongoDbFilter = {done,name,description};

    Object.keys(mongoDbFilter).forEach(function(key) {
      if(!mongoDbFilter[key])
        delete mongoDbFilter[key];
    });

    const todos = await Todo.find(mongoDbFilter);

    return todos;
  };

  const _getById = async function(id){
    const todo = await Todo.find({id});
    return todo;
  };

  const _insert = async function(todo){
     
    const newTodo = await new Todo(todo).save();

    return newTodo;

  };

  return {
    getAll:_getAll,
    getById:_getById,
    insert:_insert

  };
};

module.exports = todoRepository();