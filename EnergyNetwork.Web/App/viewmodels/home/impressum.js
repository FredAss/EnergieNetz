define([
    'services/routeconfig',
    'services/logger'
  ],
  function(routeconfig, logger) {

    var name = ko.observable().extend({ required: true }),
        email = ko.observable().extend({ required: true, email: true }),
        subject = ko.observable().extend({ required: true }),
        message = ko.observable().extend({ required: true });

    var viewmodel = {
      name: name,
      email: email,
      subject: subject,
      message: message,

      send: function() {
        var self = this;
        $.ajax(routeconfig.contactUrl, {
          type: "GET",
          data: { name: self.name(), email: self.email(), subject: self.subject(), message: self.message() }
        }).done(function(data) {
            logger.logSuccess(language.getValue('sentEmailSuccessfully'), data, null, true);
        }).fail(function(data) {
            logger.logError(language.getValue('errorWhileSendingEmail'), data, null, true);
        });
      }
    };

    return viewmodel;
  });