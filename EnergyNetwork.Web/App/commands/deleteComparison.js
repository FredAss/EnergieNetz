define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'bootbox',
    'plugins/router'
],
  function (logger, dialog, unitofwork, bootbox, router) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
            if (result == false)
              return;
            var comparison = viewmodel.model;
            var investmentPlanId = comparison.investmentPlanId();
            unitofwork.comparisonRepository.delete(comparison);

            unitofwork.commit().then(saveSucceeded).fail(saveFailed).fin(saveFinished);
            router.navigate('utilities/investmentmanagement/investmentplan/' + investmentPlanId);
          });

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
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

      var closeEditor = function () {
        dialog.close(viewmodel, 'close');
      };

      return cmd;
    };

    return command;
  });