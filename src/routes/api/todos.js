const express = require('express');
const router = express.Router();

const inMemoryTodoDB = [
  {id:0,name:'Part I',description:'Write Part I', done:true},
  {id:1,name:'Part II',description:'Write Part II', done:false}
];

router.get('/',async (req,res)=>{
  res.status(200)
    .json(inMemoryTodoDB);
});

router.get('/:id',(req,res)=>{
  
  const { id } = req.params;
  
  const todoItem = inMemoryTodoDB.filter((todo)=> todo.id==id)[0];
  
  if(!todoItem){
    res.sendStatus(404);
  }
  else{
    res.status(200).json(todoItem);
  }
});

router.post('/',(req,res)=>{
  
  const { name,description,done } = req.body;
  
  // getting last used id from our Mock DB 
  const lastId = inMemoryTodoDB[inMemoryTodoDB.length-1].id;
  const id = lastId + 1;
  
  const newTodo = { id,name,description,done };
  
  inMemoryTodoDB.push(newTodo);
  
  res.status(201)
    .location(`/api/todos/${id}`)
    .json(newTodo);
  
});

router.put('/:id/done',(req,res)=>{
  
  let  { done }  = req.body;
  const {id} = req.params;
  
  // check if its a boolean 
  if(typeof(done) != 'boolean' )
  {
    res.sendStatus(400);
    return;
  }
  
  const exists = inMemoryTodoDB.filter((todo)=> todo.id==id).length > 0;    
  
  if(!exists){
    res.sendStatus(404);
    return;
  }
  
  inMemoryTodoDB.map((todo)=>{
    if(todo.id == id) {
      todo.done = done;
    }
  });
  
  res.sendStatus(200);
});

router.delete('/:id',(req,res)=>{
  
  const {id} = req.params;
  
  const todoItem = inMemoryTodoDB.filter((todo)=> todo.id==id)[0];
  
  if(!todoItem)
  {
    res.sendStatus(404);
    return;
  }
  inMemoryTodoDB.splice(inMemoryTodoDB.indexOf((todo)=>todo.id==id),1);
  
  res.sendStatus(200);
  
});


module.exports = router;