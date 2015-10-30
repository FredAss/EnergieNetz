define([
    'plugins/router',
    'services/appsecurity',
    'services/errorhandler',
    'services/utils',
    'services/languagehandler'
  ],
  function(router, appsecurity, errorhandler, utils, lang) {

    var viewmodel = {
      router: router,
      lang: lang,

      appsecurity: appsecurity,

      selectedLanguage: function() {
        window.language.selectedLanguage(); // force reevaluation after language change
        return window.language.languageString();
      },

      logout: function() {
        var self = this;
        $('.st-toast-container').remove();
        appsecurity.logout()
          .done(function() {
            appsecurity.clearAuthInfo();
            router.navigate('home/index');
          })
          .fail(self.handlevalidationerrors);
      }
    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });