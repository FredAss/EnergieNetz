define([
    'services/unitofwork',
    'viewmodels/home/productionTime',
    'commands/deleteProductionTime'
],
  function (unitofwork, productionTimeViewModel, deleteProductionTimeCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.productionTimeRepository.create({
            survey: viewmodel.survey
          });
          viewmodel.productionTimeViewModels.push(new productionTimeViewModel(newEntity, viewmodel.survey, new deleteProductionTimeCommand(viewmodel)));
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