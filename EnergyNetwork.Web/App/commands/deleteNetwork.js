define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'bootbox',
    'plugins/router'
],
  function (logger, dialog, unitofwork, bootbox, router) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
            if (result == false) {
              complete();
              return;
            }
            delNetwork();
          });
          
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      function delNetwork() {
        var networkId = viewmodel.model.networkId();

        var networkQuery = unitofwork.networkRepository.byId(networkId);

        return Q.all([networkQuery]).then(function (data) {
          var network = data[0][0];

          for (var i = network.networkCompanies().length - 1; i >= 0; i--) {
            for (var z = network.networkCompanies()[i].measures().length - 1; z >= 0; z--) {
              unitofwork.manager.detachEntity(network.networkCompanies()[i].measures()[z]);
            }
            unitofwork.manager.detachEntity(network.networkCompanies()[i]);
          }

          for (var x = network.invitations().length - 1; x >= 0; x--) {
            network.invitations()[x].entityAspect.setDeleted();
          }

          network.entityAspect.setDeleted();
          unitofwork.commit().done(function () {
            router.navigate('admin/networkmanagement/networks');
            location.reload();
          });
        });
      }

      return cmd;
    };

    return command;
  });