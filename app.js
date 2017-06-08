var app = angular.module("TdPApp", ["ngRoute", "leodido.caretAware", "textAngular", "ui.ace"]);
app.config(function($routeProvider) {
    $routeProvider
        .when("/XMLtoHTML", {
            templateUrl : "XMLtoHTML/XMLtoHTML.html",
            controller : "XMLtoHTMLCtrl"
        })
        .when("/HTMLtoXML", {
            templateUrl : "HTMLtoXML/HTMLtoXML.html",
            controller : "HTMLtoXMLCtrl"
        })
        .when("/TextAngularFork", {
            templateUrl : "TextAngularFork/TextAngularFork.html",
            controller : "TextAngularForkCtrl"
        })
        .when("/XMLtoHTMLace", {
            templateUrl : "XMLtoHTMLace/XMLtoHTMLace.html",
            controller : "XMLtoHTMLaceCtrl"
        })
        .when("/", {
            templateUrl : "Home/Home.html",
            controller : "HomeCtrl"
        })
        .when("/toolbar", {
            templateUrl : "Toolbar/Toolbar.html",
            controller : "ToolbarCtrl"
        })
        .otherwise({
            templateUrl : "Home/Home.html",
            controller : "HomeCtrl"
        });
});