define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'services/routeconfig',
    'services/appsecurity'
],
  function (logger, dialog, unitofwork, routeconfig, appsecurity) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          if (canSave()) {
            unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
          } else {
            showAllErrors();
          }

          complete();

        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      var saveSucceeded = function (data) {
        logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
      };

      var saveFailed = function () {
        logger.logError(language.getValue('save_errorMessage'), data, null, true);
      };

      var saveFinished = function () {
        afterSaveChanges();
      };
      var afterSaveChanges = function () {
        closeEditor();
      };

      function canSave() {
        return !viewmodel.model.hasValidationErrors();
      };

      function showAllErrors() {
        return viewmodel.model.errors.showAllMessages();
      };

      function closeEditor() {
        dialog.close(viewmodel, 'close');
      };

      return cmd;

    };

    return command;
  });