define([
    'plugins/dialog',
    'services/unitofwork',
    'services/errorhandler',
    'lodash',
    'services/routeconfig',
    'services/appsecurity',
    'services/logger'
  ],
  function(dialog, unitofwork, errorhandler, _, routeconfig, appsecurity, logger) {

    var viewmodel = function(parentObj, type) {
      var self = this;
      self.displayName = ko.observable("");
      self.saveBtnText = ko.observable("");
      self.infoText = ko.observable( language.getValue('afterSaving_info') );
      self.parentObj = parentObj;
      self.email = ko.observable().extend({ required: true, multiemail: true });
      self.message = ko.observable(language.getValue('invitationMail_content')).extend({ required: true });

      self.canActivate = function() {
        switch (type) {
          case 'Network':
            self.displayName( language.getValue('inviteCompany') );
            self.saveBtnText( language.getValue('save') );
            break;
          case 'Company':
            self.displayName( language.getValue('inviteUser') );
            self.saveBtnText( language.getValue('send') );
            self.infoText("");
            break;
          case 'User':
            self.displayName( language.getValue('inviteUser') );
            self.saveBtnText( language.getValue('send') );
            self.infoText("");
            break;
        };
        return true;
      };

      self.attached = function(view, parent) {
      };

      self.close = function() {
        dialog.close(this, 'close');
      };

      self.save = ko.asyncCommand({
        execute: function(complete) {
          self.createInvitation();

          if (['Company', 'User'].indexOf(type) > -1) {
            unitofwork.commit();
          }

          self.close();
        },
        canExecute: function(isExecuting) {
          return !isExecuting && self.email.isValid() && self.message.isValid();
        }
      });

      self.createInvitation = function() {
        _.forEach(self.email().split(";"), function(mail) {
          mail = mail.trim();
          if (mail.length > 0) {
            var newInvitation = unitofwork.invitationRepository.create({
              email: mail,
              message: self.message(),
              date: new Date()
            });
            switch (type) {
              case 'Network':
                newInvitation.network(self.parentObj);
                break;
              case 'Company':
                newInvitation.company(self.parentObj);
                self.sendInvitation(newInvitation);
                break;
              case 'User':
                unitofwork.manager.addEntity(newInvitation);
                self.parentObj.push(newInvitation);
                self.sendInvitation(newInvitation);
                break;
            }
          }
        });
      };

      self.sendInvitation = function(invitation) {
        $.ajax(routeconfig.invitationUrl, {
          type: "GET",
          data: { id: invitation.invitationId(), email: invitation.email(), message: invitation.message() },
          headers: appsecurity.getSecurityHeaders()
        }).done(function(data) {
          logger.logSuccess(language.getValue('invitationFor') + ' <strong>' + data + '</strong> ' + language.getValue('mailed_successMessage'), data, null, true);
        }).fail(function(data) {
          logger.logError(language.getValue('invitationFor') + ' <strong>' + data + '</strong> ' + language.getValue('mailed_errorMessage'), data, null, true);
        });
      };

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });