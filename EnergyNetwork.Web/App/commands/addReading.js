define([
    'services/unitofwork',
    'viewmodels/home/reading',
    'commands/deleteReading'
],
  function (unitofwork, readingViewModel, deleteReadingCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.readingRepository.create({
            survey: viewmodel.survey,
            energySource: _.find(viewmodel.energySources, function(energySource) {
              return energySource.name() === "electricity";
            }),
            value: 0
          });
          viewmodel.readingViewModels.push(new readingViewModel(newEntity, viewmodel.survey, viewmodel.energySources, new deleteReadingCommand(viewmodel)));
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