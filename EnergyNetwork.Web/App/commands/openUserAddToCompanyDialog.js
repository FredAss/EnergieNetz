define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/user/userAdd'
],
  function (logger, dialog, unitofwork, userAddViewModel) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          openEditor();

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor() {
        var invitationQuery = unitofwork.invitationRepository.all();

        Q.all([invitationQuery]).done(function(invitations) {
          var editViewModel = new userAddViewModel(viewmodel.networkCompanies()[0].company, invitations[0]);

          return dialog.show(editViewModel);
        });
      }

      return cmd;

    };

    return command;
  });