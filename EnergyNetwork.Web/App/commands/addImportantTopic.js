define([
    'services/unitofwork',
    'viewmodels/home/importantTopic',
    'commands/deleteImportantTopic'
],
  function (unitofwork, importantTopicViewModel, deleteImportantTopicCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.importantTopicRepository.create({
            survey: viewmodel.survey
          });
          viewmodel.importantTopicViewModels.push(new importantTopicViewModel(newEntity, viewmodel.survey, new deleteImportantTopicCommand(viewmodel)));
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