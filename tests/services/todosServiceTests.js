const todoRepository = require('../../src/repositories/todosRepository');
const todosService = require('../../src/services/todosService');
const sinon = require('sinon');

describe('#Todos Service Tests',()=>{


  it('Should call repository once', async()=>{

    const service = todosService(todoRepository);
    const mock =  sinon.mock(todoRepository);

    mock.expects('getAll').once().returns([{}]);

    await service.getAllTodos();

    mock.verify();
    mock.restore();
   

  });

  /*
  it('Should call insert', async()=>{
    
    const service = todosService(todoRepository);
    
    const  mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/devto',{
      useMongoClient: true,
    });


    const result = await todoRepository.insert({id:1,name:'asd',description:'',done:false});

    console.log(result.toObject());
    
       
    
  });
*/

});