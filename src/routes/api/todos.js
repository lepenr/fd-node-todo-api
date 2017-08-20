const express = require('express');
const router = express.Router();

const inMemoryTodoDB = [
  {id:0,name:'todo 0',description:'description here', done:false},
  {id:1,name:'todo 1',description:'description here', done:true}
];

router.get('/',(req,res)=>{
  res.status(200).json(inMemoryTodoDB);
});

router.get('/:id',(req,res)=>{
  
  const { id } = req.params;
  
  const todoItem = inMemoryTodoDB.filter((todo)=> todo.id==id)[0];

  if(!todoItem){
    res.status(404).json({error:'Todo  task not found.'});
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
    res.send(404);
    return;
  }
  inMemoryTodoDB.splice(inMemoryTodoDB.indexOf((todo)=>todo.id==id),1);
  
  res.send(200);
  
});


module.exports = router;