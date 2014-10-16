/// <reference path="//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js">
/// <reference path="//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js">
/// <reference path="../JavaScript/ObjectPrototypes.js">
/// <reference path="../JavaScript/BankModuleReference.js">

bankModuleReference.controller("bankController", ["$scope", "$http", function ($scope, $http) {
    this.bankers = [];
    this.customers = [];

    thisReference = this;
    
    $http.get("Data/Bankers.json").success(function (data) {
        thisReference.bankers = data.Bankers;
    });

    $http.get("Data/Customers.json").success(function (data) {
        thisReference.customers = data.Customers;
    });

    this.tempEntities = {};
    this.tempEntity = {};
    this.editableEntityIds = {};
    this.entityInputTitle = "";
    this.addingMode = false;
    this.message = "";
    this.searchBankersValue = "";
    this.searchCustomersValue = "";
    this.searchServicesValue = "";
    this.notificationSignal = false;

    this.resetTempEntity = function (entity, inputTitle) {
        this.addingMode = true;
        this.tempEntity = {};
        this.entityInputTitle = inputTitle;
        this.tempEntities[entity.constructor.name] = this.tempEntity;
        this.idVirgin = true;
        this.idOK = true;
    };
    this.setEditableEntity = function (entity, entityType, inputTitle) {
        this.addingMode = false;
        this.tempEntity = {};
        for (var index in entity) {
            this.tempEntity[index] = entity[index];
        }
        this.editableEntityIds[entityType.constructor.name] = entity.id;
        this.entityInputTitle = inputTitle;
        this.tempEntities[entityType.constructor.name] = this.tempEntity;
        this.idVirgin = true;
        this.idOK = true;
    };
    this.saveEntity = function (ownerArray, entityType) {
        if (this.addingMode) {
            if (!ownerArray) {
                ownerArray = [];
            }

            for (var i in this.tempEntity) {
                entityType[i] = this.tempEntity[i];
            }
            ownerArray.unshift(entityType);
            this.setEditableEntity(ownerArray[0], entityType);
            this.message = entityType.constructor.name.concat(" ", "Was Successfully Added");
            this.notificationSignal = !this.notificationSignal;
        }
        else {
            var index = ownerArray.map(function (item) {
                return item.id;
            }).indexOf(this.editableEntityIds[entityType.constructor.name]);
            if (index != -1) {
                for (var i in this.tempEntities[entityType.constructor.name]) {
                    ownerArray[index][i] = this.tempEntities[entityType.constructor.name][i];
                }
            }

            if (entityType.constructor.name == "Banker") {
                for (var customerIndex in this.customers) {
                    var idArray = this.customers[customerIndex].services.map(function (service) {
                        return service.bankerId;
                    });


                    var searchResult = idArray.indexOf(this.editableEntityIds[entityType.constructor.name]);

                    while (searchResult != -1) {
                        this.customers[customerIndex].services[searchResult].bankerId = ownerArray[index].id;
                        searchResult = idArray.indexOf(this.editableEntityIds[entityType.constructor.name], searchResult + 1);
                    }
                }
            }

            this.setEditableEntity(ownerArray[index], entityType);
            this.message = entityType.constructor.name.concat(" ", "Was Successfully Updated");
            this.notificationSignal = !this.notificationSignal;
        }
    };
    this.deletableEntityIndex = -1;
    this.deletableEntityType = "";
    this.currentArray = {};

    this.setDeletableIndex = function (index, currentArray, type) {
        this.deletableEntityIndex = index;
        this.currentArray = currentArray;
        this.deletableEntityType = type;
    }
    this.deleteEntity = function (ownerArray) {
        this.message = this.deletableEntityType.constructor.name.concat(" ", "Was Successfully Deleted");

        if (this.deletableEntityIndex != -1) {
            ownerArray.splice(this.deletableEntityIndex, 1);
        }

        this.notificationSignal = !this.notificationSignal;
    };

    this.getBankerFullName = function (bankerId) {
        var foundBankerIndex = this.bankers.map(function (item) {
            return item.id
        }).indexOf(bankerId);

        if (foundBankerIndex != -1) {
            return this.bankers[foundBankerIndex].firstName.concat(" ", this.bankers[foundBankerIndex].lastName);
        }
    };

    this.createEmptyBanker = function () {
        return new Banker();
    };
    this.createEmptyService = function () {
        return new Service();
    };
    this.createEmptyCustomer = function () {
        var theNewCustomer = new Customer();
        theNewCustomer.services = [];
        return theNewCustomer;
    };

    this.currentActivePanel = -1;
    this.previousActivePanel = -1;
    this.currentActiveTab = 0;
    this.previousActiveTab = 0;

    this.setActive = function ($index, tab) {
        if (this.currentActivePanel != $index || tab == 2)
        {
            this.previousActiveTab = this.currentActiveTab;
            this.currentActiveTab = tab;
        }
        this.previousActivePanel = this.currentActivePanel;
        if (this.currentActivePanel == $index && tab == 0) {
            this.currentActivePanel = -1
            this.previousActiveTab = this.currentActiveTab;
        } else {
            this.currentActivePanel = $index;
        }
    };
    this.setActiveTab = function (tab) {
        this.previousActiveTab = this.currentActiveTab;
        this.currentActiveTab = tab;
    }
    this.isPanelActive = function (value) {
        return this.currentActivePanel == value ? true : false;
    };
    this.isTabActive = function (value) {
        return this.currentActiveTab == value ? true : false;
    };
    this.isTabPrevious = function (value) {
        return this.previousActiveTab == value ? true : false;
    };
    this.isCurrentPanel = function (value) {
        return (this.currentActivePanel == value);
    };
    this.isPreviousActivePanel = function (value) {
        return (this.previousActivePanel == value);
    };
    this.sortedArray = [];
    this.sortArray = function (theArray, property, type) {
        this.sortedArray = theArray.sort(function (item1, item2) {
            switch (type) {
                case 'asc':
                default:
                    return item1[property] > item2[property];
                    break;
                case 'desc':
                    return item1[property] < item2[property];
                    break;
            }
        });
    };
    this.idOK = true;
    this.idVirgin = true;
    this.setIdStatus = function (source, type) {
        if (source.map(function (item) {
            return item.id.toLowerCase();
        }).indexOf(this.tempEntities[type.constructor.name].id ? this.tempEntities[type.constructor.name].id.toLowerCase() : this.tempEntities[type.constructor.name].id) != -1) {
            this.idOK = false;

            if (!this.addingMode && (this.tempEntities[type.constructor.name].id == this.editableEntityIds[type.constructor.name])) {
                this.idOK = true;
            }
        }
        else {
            this.idOK = true;
        }
        
        this.idVirgin = this.tempEntities[type.constructor.name].id || !this.idVirgin ? false : true;
    };
    this.setVirginity = function () {
        this.idVirgin = false;
    };
    this.generateJSON = function (source) {
        return JSON.stringify(source);
    }
}]);
