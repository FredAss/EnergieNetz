/** 
 * @module Logging errors to the console and showing toasts with Stashy.Notify
 * @requires system
*/

define(['durandal/system'],
  function(system) {
    var logger = {
      log: log,
      logError: logError,
      logSuccess: logSuccess,
      showAccountWarning: showAccountWarning
    };

    return logger;

    /**
         * Log Info message
         * @method
         * @param {string} message
         * @param {object} data - The data object to log into console
         * @param {object} source - The source object to log into console
         * @param {bool} showToast - Show toast using Stashy.Notify
        */
    function log(message, data, source, showToast) {
      logIt(message, data, source, showToast, 'info');
    }

    /**
         * Log Error message
         * @method
         * @param {string} message
         * @param {object} data - The data object to log into console
         * @param {object} source - The source object to log into console
         * @param {bool} showToast - Show toast using Stashy.Notify
        */
    function logError(message, data, source, showToast) {
      logIt(message, data, source, showToast, 'error');
    }

    /**
         * Log Success message
         * @method
         * @param {string} message
         * @param {object} data - The data object to log into console
         * @param {object} source - The source object to log into console
         * @param {bool} showToast - Show toast using Stashy.Notify
        */
    function logSuccess(message, data, source, showToast) {
      logIt(message, data, source, showToast, 'success');
    }

    /**
         * Logs the message from the public methods
         * @method
         * @private
         * @param {string} message
         * @param {object} data - The data object to log into console
         * @param {object} source - The source object to log into console
         * @param {bool} showToast - Show toast using Stashy.Notify
        */
    function logIt(message, data, source, showToast, toastType) {
      source = source ? '[' + source + '] ' : '';
      if (data) {
        system.log(source, message, data);
      } else {
        system.log(source, message);
      }
      if (showToast) {
        if (toastType === 'error') {
          Stashy.Notify({
            title: "<i class='fa fa-warning'></i>   " + language.getValue('error'),
            content: message,
            titleSize: 4,
            style: "error",
            contentType: "inline",
            animDuration: "fast",
            closeArea: "element",
            activeDuration: 5000
          }).toast("right", "bottom", true);
        } else {
          if (toastType === 'success') {
            Stashy.Notify({
              title: "<i class='fa fa-smile-o'></i>   " + language.getValue('success'),
              content: message,
              titleSize: 4,
              style: "success",
              contentType: "inline",
              animDuration: "fast",
              closeArea: "element",
              activeDuration: 5000
            }).toast("right", "bottom", true);
          } else {
            Stashy.Notify({
              title: "<i class='fa fa-info'></i>   " + language.getValue('notification'),
              content: message,
              titleSize: 4,
              style: "info",
              contentType: "inline",
              animDuration: "fast",
              closeArea: "element",
              activeDuration: 5000
            }).toast("right", "bottom", true);
          }
        }
      }
    }

    /**
         * If the account is not confirmed shows the account warning
         * @method
         * @private
         * @param {string} message
        */
    function showAccountWarning(restrictedRoute, type) {
      var text1,
          text2;
      if (type == "emailNotConfirmed") {
          text1 = language.getValue('emailNotConfirmed_info');
          text2 = language.getValue('emailNotConfirmed_infoAlternative');
      } else {
          text1 = language.getValue('accountNotEnabled_info');
          text2 = language.getValue('accountNotEnabled_infoAlternative');
      }
      Stashy.Notify({
        title: "<i class='fa fa-warning'></i>   " + language.getValue('accountNotConfirmed_info'),
        content: restrictedRoute ? text2 : text1,
        titleSize: 4,
        style: "error",
        contentType: "inline",
        animDuration: "fast",
        closeArea: "element"
      }).toast("right", "bottom", true);
    }
  });