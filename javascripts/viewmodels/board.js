define(["vendors/knockout-2.1.0", "viewmodels/column"], function(ko, Column) {

    var stored = JSON.parse(localStorage.getItem("board") || "[]"),
        columns = ko.observableArray([]),
        state = ko.computed(function() {
            var _columns = columns();

            return _columns.map(function(column) {
                return {
                    name: column.name(),
                    tasks: column.tasks().map(function(task){
                        return task.data();
                    })
                };
            })
        }),
        todo = ko.computed(function(){
            return columns().map(function(column){
                return column.tasks();
            }).reduce(function(acc, tasks){
                return acc + tasks.filter(function(task){
                    return !task.done();
                }).length;
            }, 0);
        }),
        jsonState = ko.computed(function() {
            console.log("save");
            localStorage.setItem("board", JSON.stringify(state()));
        }).extend({ throttle: 1000 });

        stored.forEach(function(column){
            addColumn(column);
        });

    function addColumn(column) {
            column.parent = columns;
            columns.push(new Column(column));
    }

    return {
        columns: columns,
        wrapperSize: ko.computed(function() {
            return (columns().length + 1) * 310;
        }),
        addColumn: addColumn,
        todo: todo
    };

});