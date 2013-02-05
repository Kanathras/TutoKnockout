define(["vendors/knockout-2.1.0", "viewmodels/task"], function(ko, Task) {
	
	function Column(options) {
		var self = this;
		self.name = ko.observable(options.name || "new column");
		self.id = ko.computed(function () {
			var _parent = options.parent();
			return _parent.indexOf(self);
		});
		self.tasks = ko.observableArray(function() {
		    var _tasks = options.tasks || [];

		    return _tasks.map(function(task) {
		        return new Task(task);
		    });
		}());
		self.addTaskAction = ko.computed(function() {
            return "#/columns/" + self.id();
        });
	}

	Column.prototype.addTask = function(task) {
	    this.tasks.push(new Task(task));
	}

	return Column;

});