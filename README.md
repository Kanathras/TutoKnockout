TutoKnockout
============

Presentation
------------

The goal of this tutorial is to provide a simple project management.
We'll have a board in which we'll store columns. These columns could represent a state (Urgent, Can Wait, To define, etc.).
Each columns has several tasks. These could be everything (do the cleaning, buy milk, teach you dog how to bark, go to the fistiniere, ...).
The tasks can be passed from a column to another. The tasks can be undone or done (with a checkbox).
We can freely add/remove columns and tag.
The board should be saved in the local storage (since we don't have a server side nor a database)


Requirements
------------

To work with sammy and LESS, i highly suggest you to create your own http web server. It's very simple. 
- On linux/macOS, simply install python and launch 
```console
$ python -m SimpleHTTPServer
```
More details on : http://www.linuxjournal.com/content/tech-tip-really-simple-http-server-python
- On windows, go for IIS or more simply Tiny : http://www.commentcamarche.net/faq/4500-web-un-minuscule-serveur-web-sous-windows

Where to start
--------------

Project should be empty with only libraries and some js files with nothing in it.
viewmodels/board, viewmodels/column, viewmodels/task, router, main

There is many steps to achieve this projet.

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
var columns = ko.observableArray({});

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
        </section>
        <footer>
        </footer>
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
  columns.push(new Column(column));
}
```

The parameters column represents the new column that should be added. With the button to add column, this parameter will be empty, but later we'll want to rebuild the array with cached datas.
new Column(); just call the constructor of Column;

Don't forget to return the function along with the columns at the end of the file :

```javascript
return {
        columns: columns,
        addColumn: addColumn
    };
```















ADD COLUMNS :

rajouter function addColumn(column) --> just un push dans columns
router.js --> return sammy avec this.post("#/columns")
index.html --> form -> button type submit


STEP 2 : wrapper

board.js :
return wrapperSize -> ko.computed de columns.length + 1 * 310
index.html :
data bind style width: wrapperSize

STEP 3 : tasks

task.js :
ne pas oublier le options dans le constructeur
juste un name et bool done
column.js :
this.tasks observable array
index.html :
div class=wrapper foreach tasks
input checkbox checked: done
span name

ADD TASKS

columns.js
function addTask : Column.prototype avec un push(new Task(task))

this.id = computed
_parent = options.parent();
return _parent.indexOf(self);

this.addTaskAction computed return "#/columns/" + self.id();


