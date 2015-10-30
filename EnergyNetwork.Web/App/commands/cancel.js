define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork'
],
  function (logger, dialog, unitofwork) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          if (unitofwork.hasChanges()) {
            unitofwork.rollback();
          }
          closeEditor();
          complete();
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      function closeEditor() {
        dialog.close(viewmodel, 'close');
      };

      return cmd;
    };

    return command;
  });