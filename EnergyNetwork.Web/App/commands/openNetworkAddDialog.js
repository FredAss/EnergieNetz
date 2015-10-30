define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/admin/networkEdit'
],
  function (logger, dialog, unitofwork, networkEditViewModel) {

    var command = function (viewmodel, afterCloseEditor) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          var newNetwork = unitofwork.networkRepository.create();
          openEditor(newNetwork);

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor(network) {
        var editViewModel = new networkEditViewModel(network);

        return dialog.show(editViewModel)
            .then(function() {
          if (afterCloseEditor !== undefined) {
            afterCloseEditor(network);
          }
        });
      }

      return cmd;

    };

    return command;
  });