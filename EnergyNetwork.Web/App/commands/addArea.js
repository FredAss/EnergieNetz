define([
    'services/unitofwork',
    'viewmodels/home/area',
    'commands/deleteArea'
],
  function (unitofwork, areaViewModel, deleteAreaCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.areaRepository.create({
            survey: viewmodel.survey
          });
          viewmodel.areaViewModels.push(new areaViewModel(newEntity, viewmodel.survey, new deleteAreaCommand(viewmodel)));
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