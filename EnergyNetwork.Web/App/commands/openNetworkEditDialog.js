define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/admin/networkEdit'
],
  function (logger, dialog, unitofwork, networkEditViewModel) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          openEditor(dataContext);

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor(network) {
        
        var networkEdit = new networkEditViewModel(network);

        return dialog.show(networkEdit)
          .then(afterCloseEditor);
      }

      function afterCloseEditor() {
        
      };

      return cmd;

    };

    return command;
  });