
requirejs.config({
  baseUrl: "/App",
  paths: {
    'text': '../bower_components/text/text',
    'durandal': '../bower_components/durandal/js',
    'plugins': '../bower_components/durandal/js/plugins',
    'transitions': '../bower_components/durandal/js/transitions',
    'leaflet': '../bower_components/leaflet/dist/leaflet',
    'leaflet-omnivore': '../bower_components/leaflet-omnivore/leaflet-omnivore.min',
    'lodash': '../bower_components/lodash/lodash.min',
    'moment': '../bower_components/moment/min/moment-with-locales.min',
    'datetimepicker': '../Scripts/bootstrap-datetimepicker.min',
    'bootbox': '../bower_components/bootbox/bootbox'

  }
});

define('jquery', function() {
  return jQuery;
});
define('knockout', ko);

define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'services/appsecurity', 'services/routeconfig', 'services/knockout.bindings', 'services/languagehandler'],
  function(app, viewLocator, system, appsecurity, routeconfig) {

    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'EnergieNetz';

    //specify which plugins to install and their configuration
    app.configurePlugins({
      router: true,
      dialog: true,
      widget: {
        kinds: ['expander']
      }
    });

    app.start().then(function() {

      //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
      //Look for partial views in a 'views' folder in the root.
      viewLocator.useConvention();

      //Loading indicator

      var loader = new Stashy.Loader("body");

      $(document).ajaxStart(function() {
        loader.on("fixed", "-5px", "#FFF", "prepend");
      }).ajaxComplete(function() {
        loader.off();
      });

      // Configure ko validation
      ko.validation.init({
        decorateElement: true,
        errorElementClass: "has-error",
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        parseInputAttributes: true,
        messageTemplate: null
      });

      ko.validation.rules['multiemail'] = {
        validator: function(val, validate) {
          if (!validate) {
            return true;
          }

          var isValid = true;
          if (!ko.validation.utils.isEmptyVal(val)) {
            // use the required: true property if you don't want to accept empty values
            var values = val.split(';');
            $(values).each(function(index) {
              isValid = ko.validation.rules['email'].validator($.trim(this), validate);
              return isValid; // short circuit each loop if invalid
            });
          }
          return isValid;
        },
        message: 'Bitte geben Sie eine gültige Email-Adresse ein (mehrere Email-Adressen werden durch Semikolon getrennt).'
      };
      ko.validation.addExtender('multiemail');

      ko.validation.rules['fileSize'] = {
        validator: function (val, validate) {
          if (!validate) {
            return true;
          }

          var isValid = true;
          if (!ko.validation.utils.isEmptyVal(val)) {
            isValid = val.size < 50000000;
          }
          return isValid;
        }
      };
      ko.validation.addExtender('fileSize');

      ko.validation.rules['uniqueUsername'] = {
        validator: function (val, validate) {
          if (!validate) {
            return true;
          }
          var result = $.ajax(routeconfig.isUsernameInUseUrl, {
            data: { username: val },
            type: "GET",
            async: false
          }).responseText;
          return result === "true" ? false : true;
        }
      };
      ko.validation.addExtender('uniqueUsername');

      ko.validation.rules['uniqueEmail'] = {
        validator: function (val, validate) {
          if (!validate) {
            return true;
          }
          var result = $.ajax(routeconfig.isEmailInUseUrl, {
            data: { email: val },
            type: "GET",
            async: false
          }).responseText;
          return result === "true" ? false : true;
        }
      };
      ko.validation.addExtender('uniqueEmail');

      ko.computed(function() {
        language.selectedLanguage();
        ko.validation.localize({
          required: language.getValue('required_validation'),
          min: language.getValue('min_validation'),
          max: language.getValue('max_validation'),
          minLength: language.getValue('minLength_validation'),
          maxLength: language.getValue('maxLength_validation'),
          pattern: language.getValue('pattern_validation'),
          step: language.getValue('step_validation'),
          email: language.getValue('email_validation'),
          date: language.getValue('date_validation'),
          dateISO: language.getValue('dateISO_validation'),
          number: language.getValue('number_validation'),
          digit: language.getValue('digit_validation'),
          phoneUS: language.getValue('phoneUS_validation'),
          equal: language.getValue('equal_validation'),
          notEqual: language.getValue('notEqual_validation'),
          unique: language.getValue('unique_validation'),
          fileSize: language.getValue('fileSize_validation'),
          uniqueUsername: language.getValue('uniqueUsername_validation'),
          uniqueEmail: language.getValue('uniqueEmail_validation')
        });
      });
      

      // Automatic resizing for textareas
      // auto adjust the height of
      $(document).on('keyup', '.auto-height-textarea', function(e) {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
      });

      //Show the app by setting the root view model for our application with a transition.
      appsecurity.initializeAuth()
        .then(function(data) {
          app.setRoot('viewmodels/shell');
        });
    });
  });