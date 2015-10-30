define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/utilities/comparisonEdit'
],
  function (logger, dialog, unitofwork, comparisonEditViewModel) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          var newEntity = unitofwork.comparisonRepository.create();
          dataContext.comparisons.push(newEntity);
          openEditor(newEntity);

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor(entity) {
        var editViewModel = new comparisonEditViewModel(entity, entity.investmentPlan());

        return dialog.show(editViewModel);
      }

      return cmd;

    };

    return command;
  });