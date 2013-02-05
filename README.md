TutoKnockout
============

Presentation
------------

The goal of this tutorial is to provide a basic project manager (a simplier version of trello : https://trello.com/).

We'll have a board in which we'll store columns. These columns could represent a state (Urgent, Can Wait, To define, etc.).
Each columns has several tasks. These could be everything (do the cleaning, buy milk, teach you dog how to bark, go to the fistiniere, ...).
The tasks can be passed from a column to another. The tasks can be undone or done (with a checkbox).
We can freely add/remove columns and tag.
The board should be saved in the local storage (since we don't have a server side nor a database)

---

Technologies used
-----------------

The intention of this code is to provide a small tutorial for famous javascript frameworks.

- Knockout (http://knockoutjs.com/)
- Sammy (http://sammyjs.org/)
- Require (http://requirejs.org/)
- Bootstrap (http://twitter.github.com/bootstrap/)
- Jquery UI (http://jqueryui.com/)
- Font Awesome (http://fortawesome.github.com/Font-Awesome/)

We'll also use LESS, a framework helping writing CSS (http://lesscss.org/)

Requirements
------------

To work with sammy and LESS, i highly suggest you to create your own http web server. It's very simple. 
- On linux/macOS, simply install python and launch 
```console
$ python -m SimpleHTTPServer
```
More details on : http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python
- On windows, go for IIS or more simply Tiny : http://www.commentcamarche.net/faq/4500-web-un-minuscule-serveur-web-sous-windows

---

Where to start
--------------

Project should be empty with only libraries and some js files with nothing in it.
viewmodels/board, viewmodels/column, viewmodels/task, router, main

There is many steps to achieve this projet.

---

Step 1 : Display columns
=======================

First of all, we need to edit the model of a column :
File : column.js
----------------
We use require.js. It checks what the file require (in term of dependency) and load needed files. For columns, we only need knockout
so we have 
```javascript
define(["vendors/knockout-2.1.0"], function(ko) {
});
```
A column is a class in javascript, and it could take some options to be build with. So inside the define, we have
```javascript
function Column(options) {
  var self = this;
}
```
The self = this is a good practice way to define attributes for a js class. 

A column is defined by a name and an id. The id will be given by the collection which stores the columns (we'll come to that later in board.js).
The name should be a simple ko.observable() with a default value at "new column".
The id is a computed (observable based on other observables) that will look at its index on the parent collection.

```javascript
function Column(options) {
  var self = this;
  this.name = ko.observable("new column");
  this.id = ko.computed(function() {
    var _parent = options.parent();
    return _parent.indexOf(self);
  });
}
```

Don't forget to return the Column at the end of the js !

```javascript
function Column(options) {
  /** leave as it is **/
}

return Column;
```

So far we have defined a Column. Now we need to store our future columns in a new class : a board (the main panel).

File : board.js
----------------
Just as Column.js, we are compeled to define the requirement of a board.
A board need knockout (of course) and a reference to the Column class (or we won't be able to instantiate columns...)
```javascript
define(["vendors/knockout-2.1.0", "viewmodels/column"], function(ko, Column) {
});
```

A board is based on columns. There would be more than one column, so we need an array of observable :
```javascript
var columns = ko.observableArray([]);

return {
  columns: columns
};
```
Some precisions :
- the {} inside the observableArray means we instantiate it empty by default
- the return columns: columns will be useful later when we'll need to return several objects

File : main.js
----------------
main.js will be the base of our application. It'll bind the viewmodel to the DOM.
So the requirements for this file will be knockout and board

```javascript
define(["vendors/knockout-2.1.0", "viewmodels/board"], function(ko, board) {
});
```

Inside, 2 simple line will do the job. Look for the right DOM element to bind the viewmodel, and apply the knockout bindings to it

```javascript
var boardDOMElement = document.getElementById("main");

ko.applyBindings(board, boardDOMElement);
```

Now let's display the columns in the view !

File: index.html
----------------

Since our main.js is not referenced to the page, let's add
```html
<script data-main="javascripts/main.js" src="javascripts/require.js" type="text/javascript" ></script>
```
data-main means the main.js file is the base script of our app. Everything we'll be build with it (even the dependencies)
src refers to the js framework require that defines the requirements for each other js file.

Now let's add a section between the header and the footer to display the columns !
I already write some LESS/CSS code to make the page pretty, so don't bother with it (just put the same classes as me). 

```html
<section id="board">
    <div class="wrapper" data-bind="foreach: columns">
        <section class="column">
            <header>
                <span data-bind="text: name" />
            </header>
            <footer>
            </footer>
        </section>
    </div>
</section>
```

The wrapper is here to ensure that the columns that cannot be displayed on the screen won't go below but on the right of the screen (with a horizontal scrollbar)
We'll set the wrapper width later.
The foreach binding will iterate on each element of the columns observable and apply the dom elements below (section, header, etc.)
The text binding is simplier as it only display the name of the column (we'll make editable later !)


We can now display columns on the view, but unfortunately, our observableArray is empty. We need an action to push some data into the observable.

Add Columns
===========

File: board.js
--------------

We need a function that add a column to the array "columns". A simple push will do the job.

```javascript
function addColumn(column) {
  column.parent = columns;
  columns.push(new Column(column));
}
```

Note that in order to the created object to now it's place in the array, we set the parent of the new object as the array.

The parameters column represents the new column that should be added. With the button to add column, this parameter will be empty, but later we'll want to rebuild the array with cached datas.
new Column(); just call the constructor of Column;

Don't forget to return the function along with the columns at the end of the file :

```javascript
return {
    columns: columns,
    addColumn: addColumn
};
```

Right now, the only thing missing is a button to add a new column.

Before we add it, just take a second to think about the implementation. We have several ways to add an action that'll call addColumn function.
We can simply add a js event OnClick on the button and bind it to the function.
We can also call a web api that'll call the function.

The good point about the web api is that we need to call the server. So the server can store by itself the new data and send back the new column (so we can push it on the array of columns).
In that case, there is merely no desynchronization between the client and the server. It's a way more secure to avoid troubles.

As you might understand, we'll go for the web api.
A simple post request in a form will do the job.

To catch the request and stay inside our single page application, we use sammy.js. It's a routing javascript framework (more infos : http://sammyjs.org/)

File: router.js
---------------

This file will catch the different routes that are used with this app.

It requires sammy and the board to work, so defines this :

```javascript
define(["vendors/sammy", "viewmodels/board"], function(sammy, board) {
};
```

Then write our first route

```javascript
return sammy("#main", function() {
  this.post("#/columns", function(context) {
      board.addColumn({});
  });
});
```

The "#" (hashtag) are here to define routes. When a request is send, sammy catch the type of request (here POST) and the tag associate (here #/columns).
Once it's done, you can define some action to do. Here, we'll call the addColumn function of the board.

One last step before sammy is operational, main.js must start the routing.

Go to main.js and add a dependency in the define :

```javascript
require(["vendors/knockout-2.1.0", "viewmodels/board", "router"], function(ko, board, router) {
```

Then, at the bottom of the script :

```javascript
router.run("#/");
```

We can finally add our button !

Go to the index.html

File: index.html
----------------

I choose to add the button in the navbar and put some cool boostrap design on it.

```html
<form method="POST" action="#/columns">
    <button type="submit" class="btn btn-primary pull-right"><i class="icon-plus-sign"></i>Add Column</button>
</form>
```

As previously said, the form has the POST method and the action is bind with the route #/columns. Uppon submit, it'll be catch by sammy.
The class of button is based on bootstrap and fontawesome frameworks.

Run your http server, go to localhost and enjoy the possibility of adding columns \o/
Yipiiii !

As you'll probably see, if you add enough columns, the last ones will be moved under the first ones. It's not pretty !
To add an horizontal scrollbar, we'll use our wrapper.

We must know set the width of the wrapper depending on the number of columns and the size of a column.
So go to board.js and change the return { } to also return the size of our wrapper (we can name it wrapperSize) :

```javascript
return {
    columns: columns,
    wrapperSize: ko.computed(function() {
        return (columns().length + 1) * 310;
    }),
    addColumn: addColumn
};
```

It is that simple. just return the size of the array (+ 1) and multiply by the width of one column (310px, defined in the css)

In index.html, we now need to update the width of the wrapper. But how can we dynamically update a css attribute of a DOM element ?
There is a knockout binding for that : attr {}

```html
<div class="wrapper" data-bind="foreach: columns, style: { width: wrapperSize }">
```

As you can see, we bind the width attribute of the wrapper to the wrapperSize observable. Isn't it beautiful ? The width will automatically update when we'll add columns !

We can now peacely go for step 2 : adding some taks.

---

Step 2 : Manage tasks
=====================

As for the columns, we need to define the model of our tasks first.

File: task.js
-------------

As usual, begin by set the requirements of our file. Since the tasks doesn't have particuliar dependency, just add knockout

```javascript
define(["vendors/knockout-2.1.0"], function(ko) {
});
```

A task is only made of a name ("todo" by default) and a bool specifying if the task is done or not (false by default).
So inside the define, build our class :

```javascript
function Task(options) {
    var self = this;
    self.name = ko.observable("todo");
    self.done = ko.observable(false);
}

return Task;
```

Don't forget to return the Task at the end of the define.

Now that we've defined the model, we can add an array of tasks to our column class :

File: column.js
---------------

Before going into big trouble, add the task dependency inside the define of the file !

```javascript
define(["vendors/knockout-2.1.0", "viewmodels/task"], function(ko, Task) {
```

Now we can add our array

```javascript
this.tasks = ko.observableArray(function() {
    var _tasks = options.tasks || [];

    return _tasks.map(function(task) {
        return new Task(task);
    });
}());
```

It seems complicated, but it's not, i sware. In some time, we'll use localstorage to store our columns/tasks and load them at the start of our app.
So we can pass some existing tasks inside the constructor of Column. It's the "options". So we store either options.tasks or an empty array.

Then we map each task passed with options to a new Task. So each task passed in option will populate the array of tasks. 

Once that tiny little task is done, we can update our view to display tasks of each column.

File: index.html
----------------

Between the header and the footer or our section "column", we add :

```html
<div class="wrapper" data-bind="foreach: tasks">
    <input type="checkbox" data-bind="checked: done" />
    <span data-bind="text: name">
</div>
```

As for the column, we wrap the tasks to manage the height and the scrollbar (we'll get to that later on).

Our tasks are now dynamically displayed in our view !

But since we don't have any tasks, it's useless... there's time to add some tasks !

Add Tasks
=========

We'll work as we did with tasks. A post request caught by sammy.
But there is some adjustement to make.

First, code a function in column.js to add tasks :

File: column.js
---------------

The function will not be inside the constructor of the class. The reason is that we don't want the function to be copyied again and again in each instance of the class.
We want to define it once and for all. 

For that, just use prototype after the function Column(options){}

```javascript
Column.prototype.addTask = function(task) {
    this.tasks.push(new Task(task));
}
```

Now we want to create the route. But there is a problem. We want to add the task to only one of the column, so we need to pass its id in the route.
To do so, we need to define an observable that'll be unique for each column and that'll define the action of our form.

Inside function Column(options){}, add an observable :

```javascript
this.addTaskAction = ko.computed(function() {
    return "#/columns/" + self.id();
});
```

This defines the route as #/columns/the_id_of_the_column. Remember, the id is based upon the index of the column in the array of columns (board.js)

Now we can create the route.

File: router.js
---------------

After the previous route (add column), add

```javascript
this.post("#/columns/:id", function(context) {
    board.columns()[context.params.id].addTask({});
});
```

The context will store every params given inside the request, so we can get the id of the column in which we want to add the task !
Then we call the addTask function of the column (with an empty new task).

The last thing to do is to add a button in our view.

File: index.html
----------------

I choose to add the button in the footer of each column.

```html
<form method="POST" class="pull-right" data-bind="attr: { action: addTaskAction }">
    <button type="submit" class="btn btn-primary"><i class="icon-plus-sign"></i>Add todo</button>
</form>
```

It works exactly as the button to add columns. The only difference is that the action is given by an observable (which ensure the unicity of the action).

Refresh your page and now you can add tasks to your columns ! Yeah baby ! \o/ o// \\o ~o~

To do even better, i created a class to show that a task is done.

In the div that englobe the task (inside the wrapper), you can add a data bind:

```html
<div data-bind="css:{done: done}">
```

The css data bind will add the css class if the condition are met. Here we test the observable boolean "done" of the task. If it's done, it'll add the class "done" to the div.
Try it out !

The core or the app is done. But a project is never finished, and we can add some very cool features !

---

Step 3 : Add a counter of undone tasks
======================================

To show the power of knockout, i suggest you to add a complex computed observable. For example, a counter of todos that are not done.

File: board.js
--------------

We'll add a new computed observable named todoLeft after the array columns

```javascript
todoLeft = ko.computed(function(){
    return columns().map(function(column){
        return column.tasks();
    }).reduce(function(acc, tasks){
        return acc + tasks.filter(function(task){
            return !task.done();
        }).length;
    }, 0);
});
```

Here is some really good code !

There is 3 steps to count the number of undone tasks.
- The first one is to map every column in the array columns to return the tasks associated with the column.
- The second is to reduce the tasks returned. To explain briefly, we'll use an accumulator that start at 0 and is incremented by 1 each time the reduce is hit.
- The final step is to filter the tasks to only get the undone tasks.

So finally we get the number of tasks unfinished as a result.

Don't forget to return it !

```javascript
return {
    columns: columns,
    wrapperSize: ko.computed(function() {
        return (columns().length + 1) * 310;
    }),
    addColumn: addColumn,
    todoLeft : todoLeft
};
```

We can now simply display that number on the view :)

File: index.html
----------------

In the footer navbar, add a simple span :

```html
<footer class="navbar navbar-inverse">
    <div class="navbar-inner">
        <span class="pull-right">Still <span data-bind="text:todoLeft"></span> tasks left</span>
    </div>
</footer>
```

















