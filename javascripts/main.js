define(["vendors/knockout-2.1.0", "viewmodels/board", "router", "bindings/sortable"], function(ko, board, router) {

	var boardElement = document.getElementById("main");

	ko.applyBindings(board, boardElement);

	router.run("#/");

});