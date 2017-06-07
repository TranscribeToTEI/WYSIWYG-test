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
        .when("/XMLtoHTMLcode", {
            templateUrl : "XMLtoHTMLcode/XMLtoHTMLcode.html",
            controller : "XMLtoHTMLcodeCtrl"
        })
        .otherwise({
            templateUrl : "XMLtoHTML/XMLtoHTML.html",
            controller : "XMLtoHTMLCtrl"
        });
});