app.controller("XMLtoHTMLcodeCtrl", function ($scope, $http, $sce) {
    /* -- Scope and variables definition -- */
    $scope.loading = true;
    $scope.xmlTextarea = "";
    $scope.liveRender = "";
    $scope.inputArea = "";

    /**
     * This function watches #liveRender, encodes it and displays it on #xmlTextarea
     */
    $scope.$watch('inputArea', function(inputArea) {
        console.log(inputArea);
        console.log($.parseHTML($scope.inputArea));
        $scope.xmlTextarea = $scope.inputArea.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        $scope.liveRender = $sce.trustAsHtml($scope.inputArea.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
    });
});

app.directive('contenteditable', function() {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keyup change', function() {
                scope.$apply(read);
            });
            read(); // initialize

            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if( attrs.stripBr && html === '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});