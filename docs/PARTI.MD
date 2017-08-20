Hi dev.to! I've been learning  Node.js on my free time and I thought this would be a good place to share my experience and maybe help some of you. 

We will build a simple Todo **REST API** and along the way I'll try to cover some additional software development topics like **unit testing**, **Authentication**, **continuous delivery / continuous integration**, etc.

I will try to do everything step by step so you can all do it without much difficulty. This part will probably be a bit boring for those of you that already have some `node.js` or `javascript` experience.

Before we start hacking lets setup our development environment. 

---

# **Environment**

Lets starts with as little as we can and add things as we need it. 

### **Node.Js**
I'll be using the latest Node.Js version ( 8.2.1 ) if you don't have it already you can get it **[here](https://nodejs.org)**.

### **IDE - Visual Studio Code**
I'll be using Visual Studio code(VSCode) with some basic extensions but feel free to use the IDE you are most confortable with. 
You can get VSCode **[here](https://code.visualstudio.com/)**.

### **Project structure**
I'll be adapting the project structure as we go but for now lets start really basic.
![structure](https://thepracticaldev.s3.amazonaws.com/i/mltjaj5hqtfi4874fjz2.JPG)
As you can see nothing extraordinary here. 
A **docs** directory so we can add any kind of documentation, a **src** directory where we'll put all our source code and finally our **tests** directory.

---

# **Lets get to the good stuff!**

Ok, now that we have a nice setup lets get the show started.

### **npm**
Npm is a javascript package manager. It comes with Node.js installation and we will use it to manager our project dependencies. You can find more information on npm [here](https://www.npmjs.com/)


Lets start by opening the command line on the root directory of the project and typing:

```bash

npm init


```
It will ask you some questions, if you don't know what to answer just press enter for now. At the end you'll get a package.json file that will look something like this:
```json
{
  "name": "fd-node-todo-api",
  "version": "1.0.0",
  "description": "expressjs todo API for dev.to",
  "main": "index.js",
  "directories": {
    "doc": "docs",
    "test": "tests"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
```

---
### **Eslint**
We will use [Eslint](http://eslint.org/) as our linting tool. Lets add our first development dependency to the project! On the command line type:
```bash
npm install eslint --save-dev
```
Easy as that. When it finishes your package.json file will have our first dependency. It will look like this:
```json
//...
"devDependencies": {
    "eslint": "^4.4.1"
  }
//...

```
Now we can setup our linting rules. On the command line type:
```bash
eslint --init
```
You can pick some popular style guide or configure it as you like. It will create a .eslintrc.js file with your rules. I'll post mine if you want to you it:
```javascript
module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "no-console":0,
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};

```
( yeah im a #2spaces and #allwaysUseSemiCollons programmer, don't hate me. )

If you are using VSCode i strongly recommend the Eslint extension. It integrates eslint into vscode perfectly and helps a lot with its **auto fix on save option**. If you need more help on this just let me know.

---
### **Express**
[Express](https://expressjs.com/) is a web application framework for Node.js and we'll be using it to server our API.

Lets start by adding the dependency:
```bash
npm install express --save
```
This will add Express to our dependencies on package.json file.
```json
 "dependencies": {
    "express": "^4.15.4"
  }

```
Notice that we've used `--save` and not `--save-dev`. This will add the dependency as a required dependency for our application to run, using `--save-dev` on the other hand will save it as development dependency only.


Lets create our entry point. Create a `app.js` file on our `src` directory and start importing our first dependency.
```javascript
const express = require('express');
```
Easy right? Now lets create our server and start it up:
```javascript
const app = express();


app.listen(port,  function() {
  console.log(`Express server listening on port 3001`);
});


```
You can add a variable to setup the connection port so you can easily change it and configure it.

In the end you should have something similar to this:


```javascript
// Dependencies
const express = require('express');

// configs
const port = process.env.PORT ||  3001;

// ExpressJs Setup
const app = express();


// Starting up the server
app.listen(port,  function() {
  console.log(`Express server listening on port ${port}`);
});

module.exports = app; 
```
Now on our `package.json` file lets add our start script to get our server up and running. Add this to the scripts :
```json
"scripts": {
    "start": "node src/app.js"
  }
```

Lets try to run the script. On the command line type:
```shell
npm start
```

If you see something like this
```shell
Express server listening on port 3001
```

Good job!! you've made it! You've completed the 1st part of our journey!

-------
If you want to check my solution for this part you can check it on my github [@FilipeDominguesGit](https://github.com/FilipeDominguesGit/fd-node-todo-api).


On the next part we will add our first routes and probably talk a bit about REST APIs in general.

**Meanwhile you can help me decide what database you want to see on this project, [MongoDb](https://www.mongodb.com/) or [PostgreSQL](https://www.postgresql.org/)?**

Hope you liked the 1st part! If you have any question or suggestion leave me a comment and i'll get back to you as soon as possible.
