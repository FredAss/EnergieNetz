define([
    'services/errorhandler',
    'services/unitofwork',
    'services/appsecurity',
    'lodash',
    'commands/cancel',
    'commands/saveUserInvitation'
  ],
  function(errorhandler, unitofwork, appsecurity, _, cancelCommand, saveUserInvitationCommand) {

    var viewmodel = function(company, invitations) {
      var self = this;
      self.invitations = ko.observableArray(invitations);
      self.company = company;
      self.displayName = language.getValue('addUser');
      self.saveChangesCommand = new saveUserInvitationCommand(self);
      self.cancelChangesCommand = new cancelCommand(self);
      
      self.attached = function (view, parent) {
        initializeInvitationsTagsInput();
        initializeView();
        $('.selectpicker').selectpicker();
      };

      function initializeView() {
        var dialogHeightInPercent = 0.9;
        var dialogHeaderHeight = $('.modal-header').outerHeight(true);
        var dialogSearchHeight = $('.modal-body .row:first-child').outerHeight(true);
        var dialogFooterHeight = $('.modal-footer').outerHeight(true);
        var dialogBodyPadding = 40;
        var height = ($(window).height() * dialogHeightInPercent) - dialogHeaderHeight - dialogSearchHeight - dialogFooterHeight - dialogBodyPadding;
        $(".modal-body").height(height);
      }

      function initializeInvitationsTagsInput() {
        $('#invitations').tagsinput();

        _.forEach(self.invitations(), function (invitation) {
          $('#invitations').tagsinput('add', invitation.email());
        });

        $('#invitations').on('beforeItemAdd', function (event) {
          var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
          event.cancel = !pattern.test(event.item);
        });

        $('#invitations').on('itemAdded', function (event) {
          createInvitation(event.item);
        });

        $('#invitations').on('beforeItemRemove', function (event) {

          // Prevent Backspace deleting
          if (window.event.keyCode === 8) {
            event.cancel = true;
          }

        });

        $('#invitations').on('itemRemoved', function (event) {
          var invitation = _.find(self.invitations(), function (invitation) {
            return invitation.email() === event.item;
          });
          invitation.entityAspect.setDeleted();
          self.invitations.remove(invitation);
        });

        function createInvitation(email) {
          if (email.length > 0) {
            self.invitations.push(
              unitofwork.invitationRepository.create({
                email: email,
                invitedFrom: appsecurity.userInfo().name(),
                message: language.getValue('invitationMail_content'),
                date: new Date(),
                companyId: self.company().companyId()
          })
            );
          }
        };

      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;

  });