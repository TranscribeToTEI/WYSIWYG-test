app.controller("XMLtoHTMLCtrl", function ($scope, $http, $sce) {
    $scope.loading = true;
    $scope.modal_content = "";
    $scope.xmlTextarea = "";
    $scope.liveRender = "";
    $scope.choice_orig_modal_orig = "";
    $scope.choice_orig_modal_reg = "";


    var config = YAML.load('XMLtoHTML/config.yml');
    $scope.buttons = config.tei; //console.log($scope.buttons);
    $scope.buttonsGroups = config.buttonsGroups; //console.log($scope.buttonsGroups);
    var textarea = angular.element(document.querySelector('#xmlTextarea'));

    function insertTag(tag) {
        var selectionStart = document.getElementById("xmlTextarea").selectionStart,
            selectionEnd = document.getElementById("xmlTextarea").selectionEnd,
            startString = $scope.xmlTextarea.substr(0, selectionStart),
            endString = $scope.xmlTextarea.substr(selectionEnd, $scope.xmlTextarea.length-1),
            actionCaret = true,
            tagStart = "",
            tagEnd = "",
            middleString = "";

        //console.log(selectionStart + " <> " + selectionEnd);
        if(tag.xml.unique === "true") {
            tagStart = "<"+tag.xml.name+" />";
            $scope.xmlTextarea = startString+tagStart+endString;
        } else if(tag.xml.unique === "false") {
            /* If we need to insert 2 tags : */
            middleString = $scope.xmlTextarea.substr(selectionStart, (selectionEnd-selectionStart));
            //console.log(selectionStart+"<>"+middleString+"<>"+selectionEnd);

            tagStart = "<"+tag.xml.name+">";
            tagEnd = "</"+tag.xml.name+">";
            $scope.xmlTextarea = startString+tagStart+middleString+tagEnd+endString;
        }

        $scope.$watch('position', function(position) {
            // Definition of the caret's position
            //console.log('position > ', position);
            if(actionCaret === true) {
                $scope.cursor = (startString.length)+(tagStart.length)+(middleString.length);
                actionCaret = false;
            }
        });
    }

    function insertAttribute(attribute) {
        var selectionStart = document.getElementById("xmlTextarea").selectionStart,
            selectionEnd = document.getElementById("xmlTextarea").selectionEnd,
            startString = $scope.xmlTextarea.substr(0, selectionStart),
            endString = $scope.xmlTextarea.substr(selectionEnd, $scope.xmlTextarea.length-1),
            actionCaret = true,
            attributeStart = "<hi "+attribute.xml.name+"=\""+attribute.xml.value+"\">",
            attributeEnd = "</hi>",
            middleString = $scope.xmlTextarea.substr(selectionStart, (selectionEnd-selectionStart));

        //console.log(selectionStart+"<>"+middleString+"<>"+selectionEnd);
        $scope.xmlTextarea = startString+attributeStart+middleString+attributeEnd+endString;
        $scope.$watch('position', function(position) {
            // Definition of the caret's position
            //console.log('position > ', position);
            /*if(actionCaret === true) {
                $scope.cursor = (startString.length)+(attributeStart.length)+(middleString.length);
                actionCaret = false;
            }*/
        });
    }

    /**
     * Actions on keyPress
     */
    $scope.keyPress = function(keyEvent) {
        //console.log(keyEvent);
        if (keyEvent.key === "Enter" && keyEvent.ctrlKey === false) {
            insertTag(config.tei["br"]);
        } else if((keyEvent.key === "Enter" && keyEvent.ctrlKey === true)) {
            var caretAwareCtrl = textarea.controller('caretAware');
            caretAwareCtrl.setPosition($scope.xmlTextarea.length);

            insertTag(config.tei["paragraph"]);
        }
    };

    /**
     * Actions on addTag
     */
    $scope.addTag = function(tagName) {
        //console.log(tagName);
        var tag = config.tei[tagName];

        insertTag(tag);
    };

    /**
     * Actions on addTag
     */
    $scope.addAttribute = function(attributeName) {
        //console.log(attributeName);
        var attribute = config.tei[attributeName];

        insertAttribute(attribute);
    };

    function encodeHTML(encodeLiveRender, button) {
        var regex = "",
            html = "";

        if(button.type === "tag") {
            var attributesHtml = "";
            if(button.html.attributes !== undefined) {
                for(var attribute in button.html.attributes) {
                    attributesHtml += " "+attribute+"=\""+button.html.attributes[attribute]+"\"";
                }
            }

            if (button.xml.unique === "false") {
                regex = new RegExp("<" + button.xml.name + ">(.*)</" + button.xml.name + ">", "g");
                html = "<"+button.html.name+attributesHtml+" >$1</"+button.html.name+">";
            } else if (button.xml.unique === "true") {
                regex = new RegExp("<" + button.xml.name + " />", "g");
                html = "<"+button.html.name+" />";
            }
            encodeLiveRender = encodeLiveRender.replace(regex, html);
        } else if(button.type === "key") {
            regex = new RegExp("<" + button.xml.name + " />", "g");
            html = "<"+button.html.name+" />";
            encodeLiveRender = encodeLiveRender.replace(regex, html);
        } else if(button.type === "attribute") {
            if (button.xml.type === "inline") {
                regex = new RegExp("<hi "+button.xml.name+"=\""+button.xml.value+"\">(.*)</hi>", "g");
                html = "<span "+button.html.name+"=\""+button.html.value+"\" >$1</span>";
            } else if (button.xml.type === "block") {
                regex = new RegExp("<hi "+button.xml.name+"=\""+button.xml.value+"\">(.*)</hi>", "g");
                html = "<div "+button.html.name+"=\""+button.html.value+"\" >$1</div>";
            }
            encodeLiveRender = encodeLiveRender.replace(regex, html);
        }

        return encodeLiveRender;
    }
    /**
     * Live Render
     */
    $scope.render = function() {
        var xmlParse = $.parseXML('<tei>'+$scope.xmlTextarea+'</tei>');
        //console.log(xmlParse);

        var encodeLiveRender = $scope.xmlTextarea;

        for(var buttonId in config.tei) {
            encodeLiveRender = encodeHTML(encodeLiveRender, config.tei[buttonId]);
        }
        console.log(encodeLiveRender);
        $scope.liveRender = $sce.trustAsHtml(encodeLiveRender);
    };
    /* End live render */

    /* Caret management */
    //---- https://github.com/leodido/ng-caret-aware
    $scope.$watch('cursor', function(cursor) {
        var caretController = textarea.controller('caretAware');
        //console.log('Position of caret named "cursor" (input element) changed', cursor, caretController.getPosition());
        $scope.position = cursor;
    });

    $scope.positionCaret = function() {
        //console.log("click render");

        var caretAwareCtrl = textarea.controller('caretAware');
        caretAwareCtrl.setPosition(0);
    };
    /* End caret management */

    $scope.modal = function(id_modal) {
        $('#choice-modal, #choice-abbr-modal, #choice-orig-modal, #choice-sic-modal').modal('hide');
        // Reset variables :
        $scope.choice_orig_modal_reg = ""; $scope.choice_orig_modal_orig = "";

        var selectionStart = document.getElementById("xmlTextarea").selectionStart,
            selectionEnd = document.getElementById("xmlTextarea").selectionEnd,
            middleString = $scope.xmlTextarea.substr(selectionStart, (selectionEnd-selectionStart));

        if(id_modal === "choice-orig-modal") {
            $scope.choice_orig_modal_orig = middleString;
        }

        $("#"+id_modal).modal('show');
        $(".modal-backdrop").appendTo("#transcript");
        $("body").removeClass();
    };

    $scope.validModal = function(id_validation) {
        $('#choice-modal, #choice-abbr-modal, #choice-orig-modal, #choice-sic-modal').modal('hide');
        if(id_validation === "choice-orig-modal") {
            var selectionStart = document.getElementById("xmlTextarea").selectionStart,
                selectionEnd = document.getElementById("xmlTextarea").selectionEnd,
                startString = $scope.xmlTextarea.substr(0, selectionStart),
                endString = $scope.xmlTextarea.substr(selectionEnd, $scope.xmlTextarea.length-1),
                actionCaret = true,
                orig_insertHTML = "",
                reg_insertHTML = "";

            if($scope.choice_orig_modal_orig !== "") {orig_insertHTML = "<orig>"+$scope.choice_orig_modal_orig+"</orig>";}
            else {orig_insertHTML = "<orig />";}
            if($scope.choice_orig_modal_reg !== "") {reg_insertHTML = "<reg>"+$scope.choice_orig_modal_reg+"</reg>";}
            else {reg_insertHTML = "<reg />";}

            var insertXML = "<choice>"+orig_insertHTML+reg_insertHTML+"</choice>";
            $scope.xmlTextarea = startString+insertXML+endString;

            $scope.$watch('position', function(position) {
                // Definition of the caret's position
                //console.log('position > ', position);
                if(actionCaret === true) {
                    $scope.cursor = (startString.length)+(insertXML.length);
                    actionCaret = false;
                }
            });
        }
    }
});