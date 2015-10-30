define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork'
],
  function (logger, dialog, unitofwork) {

    var command = function (measureEditViewModel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (energySavingViewModel, complete) {

          measureEditViewModel.energySavingViewModels.remove(energySavingViewModel);
          unitofwork.energySavingRepository.delete(energySavingViewModel.model);
          complete();

        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      return cmd;

    };

    return command;
  });