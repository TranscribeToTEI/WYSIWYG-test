app.controller("HTMLtoXMLCtrl", function ($scope, $http, $sce) {
    /* -- Scope and variables definition -- */
    $scope.loading = true;
    $scope.xmlTextarea = "";
    $scope.liveRender = "";
    $scope.caretPosition = "";
    var config = YAML.load('HTMLtoXML/config.yml');
    $scope.buttons = config.tei; console.log($scope.buttons);
    $scope.buttonsGroups = config.buttonsGroups; console.log($scope.buttonsGroups);
    var liveRender = angular.element(document.querySelector('#liveRender'));
    // -----------

    /**
     * This function insert the tag in the WYSIWYG interface
     * @param tag
     */
    function insertTag(tag) {
        var content = "",
            attribute = "",
            selectionStart = window.getSelection().anchorOffset,
            selectionEnd = window.getSelection().extentOffset,
            startString = $scope.liveRender.substr(0, selectionStart),
            endString = $scope.liveRender.substr(selectionEnd, $scope.xmlTextarea.length-1);
        console.log(selectionStart); console.log(selectionEnd);

        if(tag.html.tag.unique === 'false') {
            for(attributeName in tag.html.tag.attributes) {
                attribute += attributeName+'="'+tag.html.tag.attributes[attributeName]+'"';
            }

            var value = "";
            if(tag.html.tag["sub"] !== undefined) {
                for(subName in tag.html.tag.sub) {
                    value += "<"+subName+">"+"</"+subName+">";
                }
            } else if(tag.html.tag["value"] !== undefined) {
                value = tag.html.tag.value;
            }

            if(startString === endString) {
                content = startString+"<"+tag.html.tag.name+" "+attribute+">"+value+"</"+tag.html.tag.name+">"+endString;
            } else {
                var middleString = $scope.liveRender.substr(selectionStart, selectionEnd);
                content = startString+"<"+tag.html.tag.name+" "+attribute+">"+middleString+"</"+tag.html.tag.name+">"+endString;
            }
        } else if(tag.html.tag.unique === 'true') {
            for(attributeName in tag.html.tag.attributes) {
                attribute += attributeName+'="'+tag.html.tag.attributes[attributeName]+'"';
            }
            content = selectionStart+"<"+tag.html.tag.name+" "+attribute+" />"+endString;
        }
        $scope.liveRender = content;
    }

    /**
     * Actions on key press
     */
    $scope.keyPress = function(keyEvent) {
        if (keyEvent.which === 13) { //Enter key
            insertTag(config.tei["br"]);
        }
    };

    /**
     * Actions on add tag
     */
    $scope.addTag = function(tagName) {
        console.log(tagName);
        var tag = config.tei[tagName];

        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                console.log(range);
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            console.log(range);
        }
        //insertTag(tag);
    };

    /**
     * This function inserts attributes
     */
    $scope.addAttribute = function(attributeName) {
        console.log(attributeName);
        var attribute = config.tei[attributeName];

        // Range definition
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                console.log(range);
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            console.log(range);
        }

        // Attribute insertion function
        insertAttribute(attribute, range);
    };

    function insertAttribute(attribute, range) {
        var selectionStart = range.startOffset,
            selectionEnd = range.endOffset,
            startString = $scope.liveRender.substr(0, selectionStart),
            endString = $scope.liveRender.substr(selectionEnd, $scope.xmlTextarea.length-1),
            content = "";

        if(attribute.html.type === "inline") {
            if(range.collapsed === true) {

            } else { // Start is different of End
                var middleString = $scope.liveRender.substr(selectionStart, selectionEnd);
                content = startString+"<span "+attribute.html.name+"=\""+attribute.html.value+"\">"+middleString+"</span>"+endString;
            }
        } else if(attribute.html.type === "block") {

        }

        $scope.liveRender = content;
    }

    /**
     * This function watches #liveRender, encodes it and displays it on #xmlTextarea
     */
    $scope.$watch('liveRender', function(liveRender) {
        console.log(liveRender);
        $scope.xmlTextarea = $sce.trustAsHtml($scope.liveRender);
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