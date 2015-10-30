/** 
  * @module Manage registering users
  * @requires appsecurity
  * @requires router
  * @requires errorHandler
*/

define([
    'services/appsecurity',
    'plugins/router',
    'services/errorhandler',
    'services/helpers'
  ],
  function(appsecurity, router, errorhandler, helpers) {

    var companyName = ko.observable("").extend({ required: true }),
        street = ko.observable("").extend({ required: true }),
        postalCode = ko.observable("").extend({ required: true }),
        city = ko.observable("").extend({ required: true }),
        website = ko.observable("").extend({}),
        lat = ko.observable("0").extend(),
        lon = ko.observable("0").extend();

    var viewmodel = function(next) {
      var self = this;
      self.displayName = ko.observable("companyData");
      self.next = next;
      self.companyName = companyName;
      self.street = street;
      self.postalCode = postalCode;
      self.city = city;
      self.website = website;
      self.lat = lat;
      self.lon = lon;

      self.attached = function(view, parent) {
        $("#street, #postalCode, #city").on("change", geocode);
      };

      function geocode() {
        var latLon = helpers.geocodeAddress(self.street(), self.postalCode(), self.city());
        if (latLon !== null) {
          self.lat(latLon[0]);
          self.lon(latLon[1]);
        }
      }

      self.activate = function() {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
      };
      errorhandler.includeIn(self);

      self["errors"] = ko.validation.group(self);
    };


    return viewmodel;
  });