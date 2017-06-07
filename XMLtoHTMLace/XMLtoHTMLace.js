app.controller("XMLtoHTMLaceCtrl", function ($scope, $http, $sce) {
    /* -- Scope and variables definition -- */
    $scope.loading = true;
    $scope.xmlTextarea = "";
    $scope.liveRender = "";
    $scope.inputArea = "";
    console.log($scope.inputArea);

    /**
     * This function watches #liveRender, encodes it and displays it on #xmlTextarea
     */
    $scope.$watch('inputArea', function(inputArea) {
        console.log(inputArea);
        //console.log($.parseHTML($scope.inputArea));

        $scope.xmlTextarea = $scope.inputArea;
        $scope.liveRender = $sce.trustAsHtml($scope.inputArea);
    });
});