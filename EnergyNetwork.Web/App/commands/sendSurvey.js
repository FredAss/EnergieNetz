define([
    'services/logger',
    'plugins/dialog',
    'bootbox',
    'services/unitofwork'
],
  function (logger, dialog, bootbox, unitofwork) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          bootbox.confirm(language.getValue('sendSurvey_confirmationMessage'), function (result) {
            if (result) {
              sendSurvey();
            }
            complete();
          });

          function sendSurvey() {
            viewmodel.model.fulfilled(true);
            unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
          }

        },
        canExecute: function (isExecuting) {
          return !isExecuting && viewmodel.isFilled() && !viewmodel.model.fulfilled() && viewmodel.isValid();
        }
      });

      function saveSucceeded(data) {
        logger.logSuccess(language.getValue('sendSurvey_successMessage'), data, null, true);
      }

      function saveFailed() {
        logger.logError(language.getValue('sendSurvey_errorMessage'), data, null, true);
      }

      function saveFinished() {
        complete();
        dialog.close(viewmodel, 'close');
      }

      return cmd;

    };

    return command;
  });