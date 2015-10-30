define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/utilities/investmentPlanEdit'
],
  function (logger, dialog, unitofwork, investmentPlanEditViewModel) {

    var command = function (viewmodel, afterCloseEditor) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          var newEntity = unitofwork.investmentPlanRepository.create();
          openEditor(newEntity);

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor(entity) {
        var editViewModel = new investmentPlanEditViewModel(entity, viewmodel.companies);

        return dialog.show(editViewModel)
            .then(function() {
          if (afterCloseEditor !== undefined) {
            afterCloseEditor(entity);
          }
        });
      }

      return cmd;

    };

    return command;
  });