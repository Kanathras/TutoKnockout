define(["vendors/knockout-2.1.0"], function(ko) {

	function Task(options) {
	    var self = this;
	    self.name = ko.observable(options.name || "todo");
	    self.edit = ko.observable(false);
	    self.done = ko.observable(options.done || false);
	    self.data = ko.computed(function() {
            return {
                "name": self.name(),
                "done": self.done()
            };
        });
	}

	Task.prototype.enableEdit = function(task, event) {
        this.edit(true);
        $(event.target).find('input').select();
    }

    Task.prototype.disableEdit = function(task, event) {
        this.edit(false);
    }

	return Task;

});