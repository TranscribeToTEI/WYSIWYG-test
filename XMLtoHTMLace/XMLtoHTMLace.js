app.controller("XMLtoHTMLaceCtrl", function ($scope, $http, $sce) {
    /* -- Scope and variables definition -- */
    $scope.loading = true;
    $scope.xmlTextarea = "";
    $scope.liveRender = "";
    $scope.inputArea = "";
    var config = YAML.load('XMLtoHTMLace/config.yml');
    $scope.buttons = config.tei; console.log($scope.buttons);
    $scope.buttonsGroups = config.buttonsGroups; console.log($scope.buttonsGroups);

    console.log($scope.inputArea);

    $scope.aceLoaded = function(_editor) {
        $scope.aceEditor = _editor;
        $scope.aceSession = _editor.getSession();

        $scope.aceEditor.commands.addCommand({
            name: 'enterLb',
            bindKey: {win: 'Enter',  mac: 'Enter'},
            exec: function(editor) {
                editor.insert("<lb />\n");
            }
        });
    };

    $scope.addTag = function(tagName) {
        var tag = config.tei[tagName],
            tagInsert = "";

        if(tag.xml.unique === "true") {
            tagInsert = "<"+tag.xml.name+" />";
        } else if(tag.xml.unique === "false") {
            tagInsert = "<" + tag.xml.name + ">"+$scope.aceSession.getTextRange($scope.aceEditor.getSelectionRange())+"</" + tag.xml.name + ">";
        }

        $scope.aceEditor.insert(tagInsert);
    };

    /**
     * Actions on addTag
     */
    $scope.addAttribute = function(attributeName) {
        var attribute = config.tei[attributeName],
            attrInsert = "";

        if($scope.aceSession.getTextRange($scope.aceEditor.getSelectionRange()) !== "") {
            attrInsert = "<hi " + attribute.xml.name + "=\"" + attribute.xml.value + "\">" + $scope.aceSession.getTextRange($scope.aceEditor.getSelectionRange()) + "</hi>";
            $scope.aceEditor.insert(attrInsert);
        }
    };

    /**
     * This function watches #liveRender, encodes it and displays it on #xmlTextarea
     */
    $scope.$watch('inputArea', function(inputArea) {
        console.log(inputArea);
        //console.log($.parseHTML($scope.inputArea));
        //console.log($scope.aceEditor.selection.getCursor());

        $scope.aceSession.selection.on('changeSelection', function(e) {
            //console.log($scope.aceSession.selection);
            console.log($scope.aceSession.getTextRange());
            console.log($scope.aceSession.getTextRange($scope.aceEditor.getSelectionRange()));
        });

        var encodeLiveRender = $scope.inputArea;
        for(var buttonId in config.tei) {
            encodeLiveRender = encodeHTML(encodeLiveRender, config.tei[buttonId]);
        }

        $scope.xmlTextarea = $scope.inputArea;
        $scope.liveRender = $sce.trustAsHtml(encodeLiveRender);
    });

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
});