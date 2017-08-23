---
title: Learning Node.js building a simple Express API - Part II
published: false
description: 
tags: 
cover_image: https://clsimplex.com/images/releases/headers/quality-code.jpg
---

Hi again!
Before we start I would like to say a big thank you for all the feedback on the first Part hope you like this one too. You can read the first part [here](https://dev.to/filipedomingues/learning-nodejs-building-a-simple-express-api-part-i---project-setup) and the solution for all the parts on my github [@FilipeDominguesGit](https://github.com/FilipeDominguesGit/fd-node-todo-api).

On this part I'll focus mainly on `routes`, the `REST` architecture and how to take advantage of it on an `Express` project. I wont focus too much on each route logic for now, so keep in mind that there will be some bugs and missing validations. We will be using an in memory Mock Database for now and on the next part we will start using `MongoDB` since all of you voted for it.

---
# **REST**
So before we start hacking lets talk a bit about REST and some basic principles we will use on our project. I won't go into too much details here so feel free to post some questions on the comments.

REST (**Re**presentational **S**tate **T**ransfer) is an Architectural style defined by [Roy Fielding in his 2000 PhD dissertation](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). This architecture is not restricted to `HTTP` but it is commonly associated with it. An HTTP web service that *implements* a REST architecture is called a **RESTful** web service.
Having this in mind lets talk about some principle and architectural constraints of a RESTful service.

### **Resource-based**
REST is a resource-based architecture, that in contrast with the classic RCP web services, **focus on the resources** instead of the actions. For example:

| RPC API (verbs)                 	| REST API (nouns)           	|
|---------------------------------	|----------------------------	|
| www.example.com/api/createUser 	| www.example.com/api/Users 	|
| www.example.com/api/getTodos   	| www.example.com/api/Todos 	|

Every resource should have an identifier so it can be accessed by its URI. For example:
www.example.com/api/todos/1
www.example.com/api/users/1337


### **Uniform interface**
Using HTTP protocol as our server-client communication interface makes our architecture decoupled and simplified.
On the API requests **we should use `HTTP verbs`** to give them meaning. For example: 
- `GET` - Read a specific resource or a collection of resources.
- `PUT` - Update a specific resource or a collection of resources. Can also be used to create a resource if the resource identifier is known.
- `DELETE` - Delete a resource by an identifier.
- `POST` - Create a new resource and used for operations that don't fit into the other verbs.

On our API responses we should always **use the correct `HTTP status codes`**. The most commonly used are:
- 2xx for Success responses.
- 4xx for Request errors ( Unauthenticated request, missing parameter, requested resource not found, etc..)
- 5xx for Server Errors.

### **Communicate statelessly**
The requests should have enough information that the server should be able to process it without needing to keep state. If you need to keep any kind of state save it on the client side or as a server side resource. This will make it easier to scale and this way changes on the Server side will not affect the client.

### **Multiple representations**
Your resource  should be independent of their representations therefore you should be able to provide multiple representations of the same resource (xml,json,csv,etc..). Using the HTTP Headers `Accept` and `Content-Type` we can easily do this. This mechanism is defined on [HTTP RFC](https://tools.ietf.org/html/rfc2616#section-12) and its called `Content Negotiation`.

### **Link resources**
You can and should link your resources with its sub-resources and possible actions. It facilitates the way the client can navigate and discovers your API. This is known as `Hypermedia as the Engine of Application State` or `HATEOAS`. For example:
```json
{
  "content": [{
    "amout": "500",
    "orderId": "123",
    "_links":{
      "_rel": "self",
      "href": "/orders/123"
    }
  }],
  "_links": [{
    "_rel": "order.product",
    "href": "/products/1"
  }]
}
``` 
I will leave `HATEOAS`for a future blog post so don't worry too much about it for now.

Keep in mind that this is a very simplified definition of REST but should get you started and help you through this article. Now lets start coding our routes!

---

# **Routes**

Lets start by creating a new directory on the project `src` called `routes` and a `home.js` file. On this file we will define the handler for our home route like this :
```javascript
// src/routes/home.js

const express = require('express');

// create router
const router = express.Router();

// GET http://localhost:3001/ 
router.get('/',(req,res) => {
  res.send('Hello Dev.to!');
});

module.exports = router;
```
Nothing very fancy here right? We are just creating a router object that will manage our routes and adding an handler for the `GET /` request.

The arrow function notation can be a bit tricky if you are new to it. To make this a bit clearer :

```javascript
const getHandler = function(request,response){
  response.send('Hello Dev.to!');
};

router.get('/',getHandler);
```

Now to add this route to our Api lets first create an `index.js` file on our `routes` directory and add the following code:

```javascript
// src/routes/index.js

const express = require('express');
const router = express.Router();

const homeRoute = require('./home');

router.use('/', homeRoute);

module.exports = router;
```

We will use this `index.js` file to make importing other routes easy and clean. 

Ok now we are just missing one step. On the `app.js` file we need to import our routes and add them to our express server.
```javascript
// src/app.js

...

const routes = require('./routes'); 
app.use(routes);

...
```
Now lets test this! Just start the server typing `npm start` on the command line and open your browser on [http://localhost:3001/](http://localhost:3001/).
If all went well you should see the message **`Hello Dev.to!`** on your browser!

Now that we know how to setup routes lets start implementing our `todos route`. Create an `api` directory on `src/routes` and add a `todos.js` file.

Lets start with listing all our todo items.

```javascript
// src/routes/api/todos.js

const express = require('express');
const router = express.Router();

const inMemoryTodoDB = [
    {id:0,name:'Part I',description:'Write Part I', done:true},
    {id:1,name:'Part II',description:'Write Part II', done:false}
];

router.get('/',(req,res)=>{
  res.status(200)
    .json(inMemoryTodoDB);
});


module.exports = router;
```

So here we have our in memory mock Database `inMemoryTodoDB` and the `GET` handler for `/api/todos/` request. The only difference this time is on our response, we are now sending a `200 http status code` response indicating success and the todos list as a json object.
Easy right?

Lets add this route to the `src\routes\index.js` file so we can test it.
```javascript
// src/routes/index.js
...
  const homeRoute = require('./home');
  const todosRoute = require('./api/todos');

  router.use('/', homeRoute);
  router.use('/api/todos', todosRoute);
...
```
Pretty straight forward and clean. 
We can now test the route we have just created by starting the server as usual and open the browser on [http://localhost:3001/api/todos](http://localhost:3001/api/todos). You should see a `json` object with all the todo items.
Now lets add a route so we can get a specific todo item! Lets add the `GET /api/todos/:id` route.

```javascript
// src/routes/api/todos.js

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

```

As you can see now we are passing the `id` on the uri. We can access this on the req.params object. I've used a bit of `Object destructuring`here to make it cleaner . 
```javascript
// this:
const { id } = req.params;
// is the same as this:
const id = req.params.id;

``` 
***I will probably do a post about `destructuring` in javascript one the next few days.***
Now that we have the `id` we will try to find it on our Mock DB using `Array.filter`. (*If you have any doubts about filter just let me know on the comments.*)
This time our response will depend on if we find the item or not. If we find the todo item we can just send it back as a json object and a 200 status code like we did before. If we don't find a item with the given `id` we're going to send a `404 Not Found`.

Now that we can list all todo items and get a specific todo item, lets create one!

```javascript
// src/routes/api/todos.js

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
```
So we have a lot of new things here! 
We are now using `POST` instead of `GET` which allow us to send data on the request's body.
This time I'm getting the information we need to create a new `todo` from the request's body (`req.body`) instead of the `req.params`.
Now on the response we send a HTTP Status code `201 created` indicating we have created a new resource with success, we add the location Header with the new resource endpoint and lastly we return the new resource as Json object.


Now before we can test this route we need to add one `Express` middleware that will parse the requests bodies and make it available under the `req.body` property.
Lets first install the dependency:
```bash
npm i body-parser --save
```
and on `src\index.js` and add it like this:
```javascript
// src/index.js

const express = require('express');

// Import body-parser
const bodyParser = require('body-parser');

const port = process.env.PORT ||  3001;

const app = express();
// add body-parser middleware
app.use(bodyParser.json());
...
```
You can now start the server and test it using [Postman](https://www.getpostman.com/) or with `Curl` like this:
```bash
curl -XPOST -H "Content-type: application/json" -d '{"name":"todo 3","description":"description here 3", "done":false}' 'http://localhost:3001/api/todos/'
```
Nice, we can now add new todo tasks! 

Now lets add our delete route:
```javascript
// src/routes/api/todos.js
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
```
Nothing new here we are just removing the `todo` if we find it or returning a `404 Not Found` if we don't. Let me know if you have any doubts on this route.

Now lets add a route to set our todo task as done or not done:
```javascript
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
```
The only think different here is the boolean type checking on the input here:
```javascript
  if(typeof(done) != 'boolean' )
  {
    res.sendStatus(400);
    return;
  }
```
If the client sends a non boolean we are replying with a `400 Bad Request` indicating that there is something wrong with the request. If the input is valid and we can find a todo with the given `id` we just update its value and reply with a `200 OK`.

---

### **Summary**

So what have we learned today?
- Basic REST principles
- How to setup basic routes
- How to use `HTTP verbs` to give meaning to our Requests
- How to use `HTTP status` codes to indicate status of our responses

And our API looks like this:

| Verb   	| Route              	|                                                                 	|
|--------	|--------------------	|-----------------------------------------------------------------	|
| GET    	| api/todos          	| Lists all the todos collection                                  	|
| GET    	| api/todos/:id      	| Returns a representation of the todo task with given `:id`      	|
| POST   	| api/todos          	| Adds a new todo to the collection                                 	|
| PUT    	| api/todos/:id/done 	| Updates the `done` property value of the todo task with given `:id` 	|
| DELETE 	| api/todos/:id      	| Deletes the todo task with given `:id`                          	|

I left *content negotiation*, *hypermedia* and *versioning* out of this part because I would like to go into this topics with a bit more detail. 

This will be it for today. On the next part I will start implementing our Database module so if you want you can start installing `MongoDB`. You can check my solution for this part on my Github repository [@FilipeDominguesGit](https://github.com/FilipeDominguesGit/fd-node-todo-api).

---
Feel free to leave some feedback or suggestions! I'm still new to blog posting so all help is welcome!
