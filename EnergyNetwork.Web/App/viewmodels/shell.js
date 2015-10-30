define([
    'plugins/router',
    'services/appsecurity',
    'services/errorhandler',
    'services/entitymanagerprovider',
    'model/modelBuilder',
    'services/constants',
    'durandal/app'
  ],
  function(router, appsecurity, errorhandler, entitymanagerprovider, modelBuilder, constants, app) {

    entitymanagerprovider.modelBuilder = modelBuilder.extendMetadata;

    var postBaseUrl = constants.postBaseUrl();

    var viewmodel = {
      attached: function() {
        $(document).find("footer").show();
      },

      activate: function() {
        var self = this;

        return entitymanagerprovider
          .prepare()
          .then(function () {


            // override the updateDocumentTitle fuction to use our custom language handler 
            // code taken from http://stackoverflow.com/a/18716839
            router.updateDocumentTitle = function (instance, instruction) {
              if (instance.setTitle)
                document.title = instance.setTitle();
              else if (instruction.config.title) {
                if (app.title) {
                  document.title = window.language.getValue(instruction.config.title) + " | " + app.title;

                } else {
                  document.title = window.language.getValue(instruction.config.title);
                }
              } else if (app.title) {
                document.title = app.title;
              }
            };

            //configure routing
            router.makeRelative({ moduleId: 'viewmodels' });

            // If the route has the authorize flag and the user is not logged in => navigate to login view      
            // If the route has the confirmed flag and the user's email is not confirmed => navigate to login view and display confirmation warning
            router.guardRoute = function(instance, instruction) {
              if (sessionStorage["redirectTo"]) {
                var redirectTo = sessionStorage["redirectTo"];
                sessionStorage.removeItem("redirectTo");
                return redirectTo;
              }

              if (instruction.config.authorize) {
                if (typeof (appsecurity.userInfo()) !== 'undefined') {
                  if (appsecurity.isUserInRole(instruction.config.authorize)) {
                    if (instruction.config.emailConfirmed) {
                      if (appsecurity.userInfo().isEmailConfirmed()) {
                        if (instruction.config.activated) {
                          if (appsecurity.userInfo().isActivated()) {
                            return true;
                          } else {
                            return postBaseUrl + "/home/index?returnUrl=" + encodeURIComponent(instruction.fragment);
                          }
                        } else {
                          return true;
                        }
                      } else {
                        appsecurity.showConfirmationWarning(true);
                        return postBaseUrl + "/home/index?returnUrl=" + encodeURIComponent(instruction.fragment);
                      }
                    } else {
                      return true;
                    }
                  } else {
                    return postBaseUrl + "/home/index?returnUrl=" + encodeURIComponent(instruction.fragment);
                  }
                } else {
                  return postBaseUrl + "/home/index?returnUrl=" + encodeURIComponent(instruction.fragment);
                }
              } else {
                return true;
              }
            };

            // Config Routes
            // Routes with authorize flag will be forbidden and will redirect to login page
            // As this is javascript and is controlled by the user and his browser, the flag is only a UI guidance. You should always check again on 
            // server in order to ensure the resources travelling back on the wire are really allowed

            return router.map([
                // Nav urls
                { route: ['', 'home/index'], moduleId: 'home/index', title: 'home', nav: false, hash: "#home/index" },                
                { route: 'notfound', moduleId: 'notfound', title: 'Not found', nav: false },

                // Admin urls
                { route: 'admin/networkmanagement*details', moduleId: 'admin/networkManagement', title: 'networkmanagement', nav: true, hash: "#admin/networkmanagement", authorize: ["Administrator"], emailConfirmed: true, activated: true },
                { route: 'admin/usermanagement*details', moduleId: 'admin/userManagement', title: 'usermanagement', nav: true, hash: "#admin/usermanagement", authorize: ["Administrator"] },

                // Account Controller urls
                { route: 'account/externalloginconfirmation', moduleId: 'account/externalloginconfirmation', title: 'External login confirmation', nav: false, hash: "#account/externalloginconfirmation" },
                { route: 'account/externalloginfailure', moduleId: 'account/externalloginfailure', title: 'External login failure', nav: false, hash: "#account/externalloginfailure" },
                { route: 'account/register/:id', moduleId: 'account/registerManagement', title: 'Register', nav: false, hash: "#account/registerManagement" },
                { route: 'account/accountmanagement', moduleId: 'account/accountManagement', title: 'Manage account', nav: false, hash: "#account/accountmanagement", authorize: ["User", "Administrator"] },
                { route: 'account/registrationcomplete', moduleId: 'account/registrationcomplete', title: 'Registration complete', nav: false, hash: "#account/registrationcomplete" },
                { route: 'account/registrationfailed', moduleId: 'account/registrationfailed', title: 'Registration failed', nav: false, hash: "#account/registrationfailed" },
                { route: 'account/waitingForActivation', moduleId: 'account/waitingForActivation', title: 'Waiting for activation', nav: false, hash: "#account/waitingForActivation" },
                { route: 'account/forgotpassword', moduleId: 'account/forgotpassword', title: 'Forgot password', nav: false, hash: "#account/forgotpassword" },
                { route: 'account/resetpassword', moduleId: 'account/resetpassword', title: 'Reset password', nav: false, hash: "#account/resetpassword" },

                // User urls
                { route: 'user/dashboard*details', moduleId: 'user/dashboard', title: 'overview', nav: true, hash: "#user/dashboard", authorize: ["User"], emailConfirmed: true , activated: true },

                // Tool urls
                { route: 'utilities/investmentmanagement*details', moduleId: 'utilities/investmentManagement', title: 'investments', nav: false, hash: "#utilities/investmentmanagement", authorize: ["User", "Administrator"] },

                // General urls
                { route: ['home/datenschutz'], moduleId: 'home/datenschutz', title: 'privacy', nav: false, hash: "#home/datenschutz" },
                { route: ['home/impressum'], moduleId: 'home/impressum', title: 'legalInfo', nav: false, hash: "#home/impressum" }


              ])
              .buildNavigationModel()
              .mapUnknownRoutes("notfound", "notfound")
              .activate({ pushState: true });
          })
          .fail(self.handlevalidationerrors);
      }
    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });