const express = require('express');
const router = express.Router();

let inMemoryTodoDB = [
  {name:'todo 0',description:'description here', done:false},
  {name:'todo 1',description:'description here', done:true}
];

router.get('/',(req,res)=>{

  const {done,name} = req.query;

  const output = inMemoryTodoDB
    .filter((todo)=>{
      if(done)
        return (todo.done.toString().toLocaleLowerCase() == done.toLocaleLowerCase());
      return true; 
    })
    .filter((todo)=>{
      if(name)
        return (todo.name === name);
      return true; 
    });

  res.json(output).status(200);
});

router.get('/:id',(req,res)=>{

  const {id} = req.params;

  const output = inMemoryTodoDB[id];

  if(output){
    res.json(output).status(200);
  }
  else{
    res.send(404);
  }
});

router.post('/',(req,res)=>{

  const { name,description,done } = req.body;

  const newTodo = { name,description,done };

  inMemoryTodoDB.push(newTodo);

  res.json(newTodo).status(201);
});

router.put('/:id/name',(req,res)=>{

  const {id} =req.params;
  const {name} =req.body;

  if(!inMemoryTodoDB[id]){
    res.status(404);
    return;
  }

  inMemoryTodoDB[id].name = name || inMemoryTodoDB[id].name;

  const output = inMemoryTodoDB[id].name;

  res.json(output).status(200);
});

router.put('/:id/description',(req,res)=>{

  const {description } = req.body;
  const {id} = req.params;

  if(!inMemoryTodoDB[id]){
    res.status(404);
    return;
  }

  inMemoryTodoDB[id].description = description || inMemoryTodoDB[id].description;

  const output = inMemoryTodoDB[id].description;

  res.json(output).status(200);
});

router.put('/:id/done',(req,res)=>{

  let {done } = req.body;
  const {id} = req.params;

  if(!inMemoryTodoDB[id]){
    res.status(404);
    return;
  }

  done = ( 'true' == done.toLocaleLowerCase() || 'false' == done.toLocaleLowerCase() ) 
    ? Boolean(req.body.done) 
    : undefined;

  if(!done){
    res.send(400);
    return;
  }

  inMemoryTodoDB[id].done = done ;

  const output = inMemoryTodoDB[id].done;

  res.json(output).status(200);
});

router.delete('/:id',(req,res)=>{

  const {id} = req.params;

  if(!inMemoryTodoDB[id])
  {
    res.send(404);
    return;
  }

  inMemoryTodoDB.splice(id,1);

  res.send(200);

});


module.exports = router;