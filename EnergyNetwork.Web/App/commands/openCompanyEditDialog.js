define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/home/companyEdit'
],
  function (logger, dialog, unitofwork, companyEditViewModel) {

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

      function openEditor(company) {
        
        var companyEdit = new companyEditViewModel(company);

        return dialog.show(companyEdit)
          .then(afterCloseEditor);
      }

      function afterCloseEditor() {
        
      };

      return cmd;

    };

    return command;
  });