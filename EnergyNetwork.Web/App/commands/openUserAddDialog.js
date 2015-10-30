define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/admin/userAdd'
],
  function (logger, dialog, unitofwork, userAddViewModel) {

    var command = function (viewmodel, callback) {
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
        var networkQuery = unitofwork.networkRepository.all();

        Q.all([networkQuery]).done(function(networks) {
          var editViewModel = new userAddViewModel(networks[0], viewmodel.companies);

          return dialog.show(editViewModel).then(function() {
            callback(editViewModel.invitations);
          });
        });
      }

      return cmd;

    };

    return command;
  });