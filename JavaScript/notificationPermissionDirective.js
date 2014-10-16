/// <reference path="../JavaScript/BankModuleReference.js">

bankModuleReference.directive("notificationPermission", function () {
    return {
        link: function (scope, element, attrs) {
            scope.$watch(attrs.notificationPermission, function (newValue, oldValue) {
                element.triggerHandler("notificationGo");
            });
        }
    };
});