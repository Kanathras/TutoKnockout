require(["vendors/knockout-2.1.0", "viewmodels/board", "router", "bindings/sortable"], function(ko, board, router) {

    var boardEl = document.getElementById("main");

    ko.applyBindings(board, boardEl);

    router.run("#/");

});