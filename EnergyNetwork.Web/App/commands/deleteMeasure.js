define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'bootbox'
],
  function (logger, dialog, unitofwork, bootbox) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
            if (result) {
              deleteMeasure();
            }
            complete();
          });

        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      function deleteMeasure() {
        var measure = viewmodel.model;
        for (var i = measure.energySavings().length - 1; i >= 0; i--) {
          unitofwork.energySavingRepository.delete(measure.energySavings()[i]);
        }

        unitofwork.measureRepository.delete(measure);
        unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);

      }


      function saveSucceeded(data) {
        logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
      };

      function saveFailed() {
        logger.logError(language.getValue('save_errorMessage'), data, null, true);
      };

      function saveFinished() {
        afterSaveChanges();
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