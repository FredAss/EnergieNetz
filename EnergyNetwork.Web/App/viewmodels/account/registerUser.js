define([
    'services/appsecurity',
    'plugins/router',
    'services/errorhandler'
  ],
  function(appsecurity, router, errorhandler) {

    var username = ko.observable().extend({ required: true, uniqueUsername: true }),
        firstName = ko.observable().extend({ required: true }),
        lastName = ko.observable().extend({ required: true }),
        email = ko.observable().extend({ required: true, email: true, uniqueEmail: true }),
        phoneNumber = ko.observable().extend({ required: true }),
        password = ko.observable().extend({ required: true, minLength: 6 }),
        confirmpassword = ko.observable().extend({ required: true, minLength: 6, equal: password });

    var viewmodel = function() {
      var self = this;
      self.displayName = ko.observable("userData");
      self.username = username;
      self.firstName = firstName;
      self.lastName = lastName;
      self.email = email;
      self.phoneNumber = phoneNumber;
      self.password = password;
      self.confirmpassword = confirmpassword;

      self.activate = function() {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
      };

      self.attached = function (view, parent) {
        var self = this;
      };

      errorhandler.includeIn(self);

      self["errors"] = ko.validation.group(self);

    };

    return viewmodel;
  });