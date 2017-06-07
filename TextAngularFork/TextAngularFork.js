app.controller("TextAngularForkCtrl", function ($scope, $http, $sce) {
    $scope.loading = true;
    $scope.xmlTextarea = "";

    $scope.$watch('htmlVariable', function(htmlVariable) {
        console.log(htmlVariable);
        $scope.xmlTextarea = $sce.trustAsHtml($scope.htmlVariable);
    });
});

app.config(function($provide){
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
        taRegisterTool('p-tei', {
            buttontext: "P",
            action: function(){
                this.$editor().wrapSelection('formatBlock', '<div class="tei-p" title="Ceci est un paragraphe"></div>');
            },
            activeState: function(){
                //return this.$editor().queryCommandState('div.tei-head');
            }
        });
        taOptions.toolbar[1].push('p-tei');


        taRegisterTool('head', {
            buttontext: "H",
            action: function(){
                this.$editor().wrapSelection('formatBlock', '<div class="tei-head" title="Ceci est un head"></div>');
            },
            activeState: function(){
                //return this.$editor().queryCommandState('div.tei-head');
            }
        });
        taOptions.toolbar[1].push('head');

        taRegisterTool('signed', {
            buttontext: "SL",
            action: function(){
                this.$editor().wrapSelection('formatBlock', '<div class="tei-signed" title="Ceci est une ligne de signature"></div>');
            }
        });
        taOptions.toolbar[1].push('signed');

        taRegisterTool('dateline', {
            buttontext: "DL",
            action: function(){
                this.$editor().wrapSelection('formatBlock', '<div class="tei-dateline" title="Ceci est une ligne de date"></div>');
            }
        });
        taOptions.toolbar[1].push('dateline');

        taRegisterTool('postscript', {
            buttontext: "PS",
            action: function(){
                this.$editor().wrapSelection('formatBlock', '<div class="tei-postscript" title="Ceci est un postscriptum"></div>');
            }
        });
        taOptions.toolbar[1].push('postscript');

        // -- Semantic tags
        taRegisterTool('address', {
            buttontext: "A",
            action: function(){
                //this.$editor().wrapSelection('formatBlock', '<span class="tei-address" title="Ceci est une adresse"></span>');
                var classApplier = rangy.createClassApplier("tei-address", {
                    tagNames: ["*"],
                    normalize: true
                });
                classApplier.toggleSelection();
            }
        });
        taOptions.toolbar[1].push('address');

        taRegisterTool('person', {
            iconclass: "fa fa-user",
            //buttontext: "Personne",
            action: function(){
                //this.$editor().wrapSelection('formatBlock', '<span class="tei-user" title="Ceci est un nom de personne"></span>');
                var classApplier = rangy.createClassApplier("tei-user", {
                    tagNames: ["*"],
                    normalize: true
                });
                classApplier.toggleSelection();
            }
        });
        taOptions.toolbar[1].push('person');
        // -- Semantic tags

        // -- Format tags
        taRegisterTool('superscript', {
            iconclass: "fa fa-superscript",
            //buttontext: "Exposant",
            action: function(){
                this.$editor().wrapSelection('superscript');
            }
        });
        taOptions.toolbar[1].push('superscript');

        taRegisterTool('add', {
            iconclass: "fa fa-plus",
            //buttontext: "Ajout",
            action: function(){
                var classApplier = rangy.createClassApplier("tei-add", {
                    tagNames: ["*"],
                    normalize: true
                });
                classApplier.toggleSelection();
            },
            activeState: function(){return false;}
        });
        taOptions.toolbar[1].push('add');

        taRegisterTool('subst', {
            iconclass: "fa fa-exchange",
            //buttontext: "Remplacement",
            action: function(){
                this.$editor().wrapSelection('insertHTML', '<subst><del>supp</del> <span class="tei-add">add</span></subst>');
            }
        });
        taOptions.toolbar[1].push('subst');

        taRegisterTool('foreign', {
            iconclass: "fa fa-globe",
            //buttontext: "Remplacement",
            action: function(){
                var classApplier = rangy.createClassApplier("tei-foreign", {
                    tagNames: ["*"],
                    normalize: true
                });
                classApplier.toggleSelection();
            }
        });
        taOptions.toolbar[1].push('foreign');
        // -- Format tags

        return taOptions;
    }]);
});

