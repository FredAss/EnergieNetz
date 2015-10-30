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
        execute: function (dataContext, complete) {

          bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
            if (result) {
              deleteInvitation(dataContext);
            }
            complete();
          });

        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      function deleteInvitation(invitation) {
        viewmodel.openInvitations.remove(invitation);
        unitofwork.invitationRepository.delete(invitation);
        unitofwork.commit().then(saveSucceeded).fail(saveFailed);
      }


      function saveSucceeded(data) {
        logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
      };

      function saveFailed() {
        logger.logError(language.getValue('save_errorMessage'), data, null, true);
      };

      return cmd;
    };

    return command;
  });