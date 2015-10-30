define([
  'plugins/router',
    'services/unitofwork',
    'services/routeconfig',
    'services/appsecurity',
    'services/logger',
    'viewmodels/account/registerUser',
    'viewmodels/account/registerCompany',
    'viewmodels/account/invitationNotFound'
  ],
  function(router, unitofwork, routeconfig, appsecurity, logger, registerUserViewModel, registerCompanyViewModel, invitationNotFoundViewModel) {

    var viewmodel = {
      currentStep: ko.observable(1),
      isNextButtonVisible: ko.observable(false),
      isPreviousButtonVisible: ko.observable(false),
      isPreviousButtonEnable: ko.observable(false),
      isSubmitButtonVisible: ko.observable(true),
      context: ko.observable(),
      invitation: ko.observable(),
      registerUserViewModel: ko.observable(),
      registerCompanyViewModel: ko.observable(),
      next: function() {
        var self = this;
        self.context(self.registerCompanyViewModel());
        self.currentStep(self.currentStep() + 1);
        self.isPreviousButtonEnable(true);
        self.isNextButtonVisible(false);
        self.isSubmitButtonVisible(true);
      },
      previous: function() {
        var self = this;
        self.context(self.registerUserViewModel());
        self.currentStep(self.currentStep() - 1);
        self.isPreviousButtonEnable(false);
        self.isNextButtonVisible(true);
        self.isSubmitButtonVisible(false);
      },
      submit: function() {
        var self = this;
        if (self.registerUserViewModel().errors().length != 0) {
          self.registerUserViewModel().errors.showAllMessages();
          self.currentStep(1);
          self.isPreviousButtonEnable(false);
          self.isNextButtonVisible(true);
          self.isSubmitButtonVisible(false);
          self.context(self.registerUserViewModel());
          return;
        }
        if (self.registerCompanyViewModel() !== undefined) {
          if (self.registerCompanyViewModel().errors().length != 0) {
            self.registerCompanyViewModel().errors.showAllMessages();
            self.currentStep(2);
            self.isPreviousButtonEnable(true);
            self.isNextButtonVisible(false);
            self.isSubmitButtonVisible(true);
            self.context(self.registerCompanyViewModel());
            return;
          }
        }

        appsecurity.register({
          invitationId: self.invitation().invitationId,
          userName: self.registerUserViewModel().username(),
          firstName: self.registerUserViewModel().firstName(),
          lastName: self.registerUserViewModel().lastName(),
          phoneNumber: self.registerUserViewModel().phoneNumber(),
          eMail: self.registerUserViewModel().email(),
          password: self.registerUserViewModel().password(),
          confirmPassword: self.registerUserViewModel().confirmpassword(),
          networkId: self.invitation().networkId,
          companyId: self.invitation().companyId,
          companyName: self.registerCompanyViewModel() ? self.registerCompanyViewModel().companyName() : null,
          street: self.registerCompanyViewModel() ? self.registerCompanyViewModel().street() : null,
          postalCode: self.registerCompanyViewModel() ? self.registerCompanyViewModel().postalCode() : null,
          city: self.registerCompanyViewModel() ? self.registerCompanyViewModel().city() : null,
          website: self.registerCompanyViewModel() ? self.registerCompanyViewModel().website() : null,
          lat: self.registerCompanyViewModel() ? self.registerCompanyViewModel().lat() : 0,
          lon: self.registerCompanyViewModel() ? self.registerCompanyViewModel().lon() : 0
        }).done(function (data) {
          logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
          router.navigate('account/registrationcomplete');
        }).fail(function(data) {
          logger.logError(language.getValue('save_errorMessage'), data, null, true);
          router.navigate('account/registrationfailed');
        });
      },

      activate: function(id) {
        var self = this;
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });

        $.ajax(routeconfig.getInvitationByIdUrl, {
          type: "GET",
          data: { id: id }
        }).done(function(data) {
          if (data === false) {
            self.context(invitationNotFoundViewModel);
            self.currentStep(0);
          } else {
            self.invitation(data);
            self.registerUserViewModel(new registerUserViewModel());
            if (data.networkId !== null) {
              self.isPreviousButtonVisible(true);
              self.isNextButtonVisible(true);
              self.isSubmitButtonVisible(false);
              self.registerCompanyViewModel(new registerCompanyViewModel());
            }
            self.context(self.registerUserViewModel());
          }
        }).fail(function(data) {
          logger.logError(language.getValue('databaseNotAvailable'), data, null, true);
        });
      },
    };

    return viewmodel;
  });