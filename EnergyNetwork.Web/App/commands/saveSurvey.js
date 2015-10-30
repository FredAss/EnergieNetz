define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork'
],
  function (logger, dialog, unitofwork) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          Q.all(viewmodel.documentsEditViewModel().getFileQueries()).then(function () {
            unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
          });

          complete();

        },
        canExecute: function (isExecuting) {
          return !isExecuting && viewmodel.isValid() && !viewmodel.model.fulfilled();
        }
      });

      var saveSucceeded = function (data) {
        logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
      };

      var saveFailed = function () {
        logger.logError(language.getValue('save_errorMessage'), data, null, true);
      };

      var saveFinished = function () {
        
      };

      return cmd;

    };

    return command;
  });