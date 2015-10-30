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
            viewmodel.checkSurveys();
            sendInvitations();
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

      function sendInvitations() {

        _.forEach(viewmodel.model.invitations(), function (invitation) {
          if (invitation.entityAspect.entityState.name == 'Added') {
            $.ajax(routeconfig.invitationUrl, {
              type: "GET",
              data: { id: invitation.invitationId(), email: invitation.email(), message: invitation.message() },
              headers: appsecurity.getSecurityHeaders()
            }).done(function (data) {
              logger.logSuccess(language.getValue('invitationFor') + ' <strong>' + data + '</strong> ' + language.getValue('mailed_successMessage'), data, null, true);
            }).fail(function (data) {
              logger.logError(language.getValue('invitationFor') + ' <strong>' + data + '</strong> ' + language.getValue('mailed_errorMessage'), data, null, true);
            });
          }
        });
      };
      
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