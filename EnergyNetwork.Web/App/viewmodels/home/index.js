define([
    'services/appsecurity',
    'plugins/router',
    'services/errorhandler',
    'services/utils',
    'services/logger'
  ],
  function(appsecurity, router, errorhandler, utils, logger) {

    var username = ko.observable().extend({ required: true }),
        password = ko.observable().extend({ required: true, minLength: 6 }),
        rememberMe = ko.observable(false),
        returnUrl = ko.observable(null),
        isAuthenticated = ko.observable(false);

    var viewmodel = {
      convertRouteToHash: router.convertRouteToHash,

      username: username,

      password: password,

      rememberMe: rememberMe,

      returnUrl: returnUrl,

      appsecurity: appsecurity,

      activate: function(splat) {
        var self = this;

        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });

        if (splat && splat.returnUrl) {
          self.returnUrl(splat.returnUrl);
        }
      },

      login: function() {
        var self = this;

        if (this.errors().length != 0) {
          this.errors.showAllMessages();
          return;
        }

        appsecurity.login({
          grant_type: "password",
          username: self.username(),
          password: self.password()
        }).done(function(data) {
          if (data.userName && data.access_token) {
            appsecurity.setAuthInfo(data.userName, data.roles, data.emailConfirmed == "true" ? true : false, data.isActivated == "true" ? true : false, data.access_token, self.rememberMe());

            // get the current default Breeze AJAX adapter
            var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
            // set fixed headers
            ajaxAdapter.defaultSettings = {
              headers: appsecurity.getSecurityHeaders()
            };

            self.username("");
            self.password("");
            self.rememberMe(false);

            self.errors.showAllMessages(false);

            // Avoid redirect attacks
            if (self.returnUrl() && utils.isExternal(self.returnUrl())) {
              logger.logError(language.getValue('externalUrlNotAllowed'), self.returnUrl(), null, true);
              return false;
            }

            if (self.returnUrl()) {
              router.navigate(self.returnUrl());
            } else if (data.isActivated == "true") {
              $('.st-toast-container').remove();
              if (appsecurity.isUserInRole(['Administrator'])) {
                router.navigate("admin/networkManagement");
              } else {
                router.navigate("user/dashboard");
              }
            }
          }
        }).fail(self.handleauthenticationerrors);
      }

    };

    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;

  });