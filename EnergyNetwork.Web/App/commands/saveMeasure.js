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

          if (canSave()) {
            unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished(complete));
          } else {
            showAllErrors();
            complete();
          }
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });
      
      function saveSucceeded(data) {
        logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
      };

      function saveFailed() {
        logger.logError(language.getValue('save_errorMessage'), data, null, true);
      };

      function saveFinished(complete) {
        complete();
        afterSaveChanges();
      };

      function canSave() {
        return !viewmodel.model.hasValidationErrors();
      };

      function showAllErrors() {
        return viewmodel.model.errors.showAllMessages();
      };

      function afterSaveChanges() {
        closeEditor();
      };

      function closeEditor() {
        dialog.close(viewmodel, 'close');
      };

      return cmd;

    };

    return command;
  });