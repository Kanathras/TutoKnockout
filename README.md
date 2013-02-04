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
The
A column is defined by a name and an id :






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


