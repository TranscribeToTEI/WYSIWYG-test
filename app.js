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
        .otherwise({
            templateUrl : "XMLtoHTML/XMLtoHTML.html",
            controller : "XMLtoHTMLCtrl"
        });
});