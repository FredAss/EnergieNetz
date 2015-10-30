define([
    'plugins/dialog',
    'viewmodels/utilities/investmentPlanEdit'
],
  function (dialog, investmentPlanEditViewModel) {

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

      function openEditor(entity) {
        
        var investmentPlanEdit = new investmentPlanEditViewModel(entity, viewmodel.companies);

        return dialog.show(investmentPlanEdit);
      }

      return cmd;

    };

    return command;
  });