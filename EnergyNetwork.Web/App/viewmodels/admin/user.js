define([
    'durandal/app',
    'services/appsecurity',
    'plugins/router',
    'services/errorhandler',
    'services/logger',
    'lodash'
  ],
  function(app, appsecurity, router, errorhandler, logger, _) {

    var viewmodel = function(user, roles, companies) {
      var self = this;
      self.model = user;
      self.roles = roles;
      self.companies = companies;
      language.selectedLanguage.subscribe(function () {
        $('.selectpicker').selectpicker();
      });

      var role = _.find(roles(), function(role) {
        return role.roleId == user.roleId;
      });

      var company = _.find(companies(), function(company) {
        return company.companyId() == user.companyId;
      });

      self.selectedRole = ko.observable(role);
      self.selectedCompany = ko.observable(company);
      self.firstName = ko.observable(user.firstName).extend({ required: true });
      self.lastName = ko.observable(user.lastName).extend({ required: true });
      self.email = ko.observable(user.email).extend({ required: true, email: true });
      self.phoneNumber = ko.observable(user.phoneNumber).extend({});
      self.activated = ko.observable(user.activated).extend({ required: true });

      self.errors = ko.validation.group(self);

      self.activate = function() {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
      };

      self.attached = function(view, parent) {

        $('.selectpicker').selectpicker();
      };

      self.save = ko.asyncCommand({
        execute: function(complete) {
          var oldValue = user.roleId;
          if (this.errors().length != 0) {
            this.errors.showAllMessages();
            return;
          }

          user.firstName = self.firstName();
          user.lastName = self.lastName();
          user.email = self.email();
          user.phoneNumber = self.phoneNumber();
          user.activated = self.activated();

          if (self.selectedRole() != undefined) {
            user.roleId = self.selectedRole().roleId;
          }
          else {
            user.roleId = null;
            self.selectedCompany(null);
          }
          if (self.selectedCompany() != undefined) {
            user.companyId = self.selectedCompany().companyId();
          }
          else {
            user.companyId = null;
          }

          appsecurity.updateUser(user).done(function(data) {
            if (user.roleId != oldValue)
              app.trigger('Event:_eventRoleOfUserChanged');
            logger.logSuccess(language.getValue('save_successMessage'), data, null, true);
            complete();
          }).fail(function(data) {
            logger.logError(language.getValue('save_errorMessage'), data, null, true);
            complete();
          });
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      self.cancel = function() {
        router.navigate("admin/usermanagement/users");
      }

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });