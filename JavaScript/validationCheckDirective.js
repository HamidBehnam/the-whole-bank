/// <reference path="../JavaScript/BankModuleReference.js">

bankModuleReference.directive("validationCheck", function () {
    return {
        link: function (scope, element, attrs) {
            var virginStatus;
            scope.$watch(attrs.validationCheck, function (newValue, oldValue) {
                virginStatus = newValue;
                if (virginStatus) {
                    element.trigger("OK");
                } else {
                    if (element.val() == "") {
                        element.toggleClass("for-trigger");
                    }
                }
            });
            scope.$watch(function () { return element.attr('class'); }, function (newValue, oldValue) {
                if ((newValue.indexOf("ng-invalid") != -1) && !virginStatus) {
                    if (element.hasClass("for-trigger")) {
                        element.removeClass("for-trigger");
                    }
                    element.trigger("leftEmpty");
                } else {
                    element.trigger("OK");
                }
            });
        }
    };
});