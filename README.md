TutoKnockout
============

Project should be empty with only libraries and some js files with nothing in it.
viewmodels/board, viewmodels/column, viewmodels/task, router, main

There is many steps to achieve this projet.

Step 1 : Manage columns
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






index.html : 
add reference to script js main.js : <script data-main="javascripts/main.js" src="javascripts/require.js" type="text/javascript" ></script>
Important : data-main et src

Columns.js 
ne pas oublier le options dans le constructeur
juste un name
Board
juste des columns
Main : boardElement et ko.applyBindings
index.html : section board, div wrapper, section column, span name

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


