/// <reference path="../JavaScript/BankModuleReference.js">

bankModuleReference.directive("idDecision", function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.idDecision, function (newValue, oldValue) {
                if (!newValue) {
                    element.trigger("idNotOK");
                } else {
                    element.trigger("OK");
                    if (element.val() == "") {
                        element.toggleClass("for-trigger");
                    }
                }
            });
        }
    };
});