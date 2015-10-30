define([
    'plugins/dialog',
    'plugins/router',
    'services/unitofwork',
    'services/routeconfig',
    'services/logger',
    'viewmodels/admin/networkEdit',
    'viewmodels/home/companyEdit',
    'bootbox'
  ],
  function (dialog, router, unitofwork, routeconfig, logger, networkEditViewModel, companyEditViewModel, bootbox) {


    var submenu = function(networkId, networkCompanyId) {
        var self = this;
        self.name = ko.observable("");
        self.actions = ko.observableArray();
        var network;
        var networkCompany;

        function buildData() {
            if (networkCompanyId !== null) {
                networkCompany = unitofwork.manager.getEntityByKey("NetworkCompany", networkCompanyId);
                ko.computed(function() {
                    var name = networkCompany.company() != null ? networkCompany.company().name() : "";
                    self.name(name);
                });
                var edit = [
                    { "title": '<i class="glyphicon glyphicon-pencil"></i><span> ' + language.getValue('edit') + '</span>', "command": openCompanyEditorCommand },
                    { "title": '<i class="glyphicon glyphicon-download"></i><span> ' + language.getValue('downloadCompanyData') + '</span>', "command": exportCompanyData },
                ];
            } else if (networkId !== null) {
                network = unitofwork.manager.getEntityByKey("Network", networkId);
                ko.computed(function () { self.name(network.name()); });
                var edit = [
                    { "title": '<i class="glyphicon glyphicon-pencil"></i><span> ' + language.getValue('edit') + '</span>', "command": openNetworkEditorCommand },
                    { "title": '<i class="glyphicon glyphicon-download"></i><span> ' + language.getValue('downloadNetworkData') + '</span>', "command": exportNetworkData }
                ];
            } else {
                self.name(language.getValue('allNetworks'));
                var edit = [
                    { "title": language.getValue('newNetwork'), "command": openNetworkEditorCommand }
                ];
            }
            self.actions(edit);
        }

        var exportNetworkData =  ko.asyncCommand({
            execute: function (dataContext, complete) {
                $.fileDownload(routeconfig.exportNetworkDataByUrl, {
                    type: 'GET',
                    data: { id: networkId }
                });
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var exportCompanyData = ko.asyncCommand({
            execute: function (dataContext, complete) {
                $.fileDownload(routeconfig.exportCompanyDataByUrl, {
                    type: 'GET',
                    data: { id: networkCompanyId }
                });
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var saveChangesCommand = ko.asyncCommand({
            execute: function (dataContext, complete) {

                function saveSucceeded() {
                    logger.logSuccess(language.getValue('save_successMessage'), dataContext, null, true);
                }

                function saveFailed() {
                    logger.logError(language.getValue('save_errorMessage'), dataContext, null, true);
                }

                function saveFinished() {
                    complete();
                    dataContext.close();
                }

                if (dataContext.model.entityType.shortName === "Company") {
                    if (!dataContext.model.hasValidationErrors() && !dataContext.model.address().hasValidationErrors()) {
                        unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
                    }

                    dataContext.model.errors.showAllMessages();
                    dataContext.model.address().errors.showAllMessages();
                } else {
                    if (!dataContext.model.hasValidationErrors()) {
                        unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
                    }

                    dataContext.model.errors.showAllMessages();
                }
                complete();

            },
            canExecute: function (isExecuting) {
                return !isExecuting && unitofwork.hasChanges();
            }
        });

        var cancelChangesCommand = ko.asyncCommand({
            execute: function (dataContext, complete) {
                if (unitofwork.hasChanges()) {
                    unitofwork.rollback();
                }
                dataContext.close();
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var deleteNetworkCommand = ko.command({
            execute: function (data, complete) {
                bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
                    if (result == false)
                        return;
                    delNetwork();
                });

                function delNetwork() {
                    for (var i = network.networkCompanies().length - 1; i >= 0; i--) {
                        for (var z =network.networkCompanies()[i].measures().length - 1; z >= 0; z--) {
                            unitofwork.manager.detachEntity(network.networkCompanies()[i].measures()[z]);
                        }
                        unitofwork.manager.detachEntity(network.networkCompanies()[i]);
                    }

                    for (var x = network.invitations().length - 1; x >= 0; x--) {
                        unitofwork.manager.detachEntity(network.invitations()[x]);
                    }

                    network.entityAspect.setDeleted();
                    unitofwork.commit().done(function () {
                        router.navigate('admin/networkmanagement/networks');
                        location.reload();
                    });
                }
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var deleteNetworkCompanyCommand = ko.asyncCommand({
            execute: function (data, complete) {
                for (var i = data.surveys().length - 1; i >= 0; i--) {
                    unitofwork.manager.detachEntity(data.surveys()[i]);
                }
                for (var i = data.measures().length - 1; i >= 0; i--) {
                    unitofwork.manager.detachEntity(data.measures()[i]);
                }

                data.entityAspect.setDeleted();

            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var openCompanyEditorCommand = ko.asyncCommand({
            execute: function (dataContext, complete) {
              openEditDialog(new companyEditViewModel(networkCompany.company(), saveChangesCommand, cancelChangesCommand));
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        var openNetworkEditorCommand = ko.asyncCommand({
            execute: function (dataContext, complete) {
                if (networkId === null) {
                    network = unitofwork.networkRepository.create();
                }
                openEditDialog(new networkEditViewModel(network, cancelChangesCommand, deleteNetworkCommand));
            },
            canExecute: function (isExecuting) {
                return true;
            }
        });

        function openEditDialog(dataContext) {
            return dialog.show(dataContext);
        };

        buildData();

    };

    return submenu;
  });