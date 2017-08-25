

const TodosService = function(todoRepository){
  
  const _getAllTodos = async () => {
    const result = await todoRepository.getAll({});
    return result;
  };


  return {
    getAllTodos:_getAllTodos
  };

};

module.exports = TodosService;