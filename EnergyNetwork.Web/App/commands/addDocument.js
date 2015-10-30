define([
    'services/unitofwork',
    'viewmodels/home/document',
    'commands/deleteDocument'
],
  function (unitofwork, documentViewModel, deleteDocumentCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.documentRepository.create({
            survey: viewmodel.survey
          });
          viewmodel.documentViewModels.push(new documentViewModel(newEntity, viewmodel.survey, new deleteDocumentCommand(viewmodel)));
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