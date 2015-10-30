define([
    'plugins/dialog',
    'viewmodels/utilities/comparisonEdit'
],
  function (dialog, comparisonEditViewModel) {

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
        
        var comparisonEdit = new comparisonEditViewModel(entity, entity.investmentPlan());

        return dialog.show(comparisonEdit);
      }

      return cmd;

    };

    return command;
  });