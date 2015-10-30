define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/home/energySaving',
    'commands/deleteEnergySaving'
],
  function (logger, dialog, unitofwork, energySavingViewModel, deleteEnergySavingCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEnergySaving = unitofwork.energySavingRepository.create({
            measure: viewmodel.model,
            energySource: _.find(viewmodel.energySources(), function (energySource) {
              return energySource.name() === "electricity";
            })
          });
          viewmodel.energySavingViewModels.push(new energySavingViewModel(newEnergySaving, viewmodel.energySources, new deleteEnergySavingCommand(viewmodel)));
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