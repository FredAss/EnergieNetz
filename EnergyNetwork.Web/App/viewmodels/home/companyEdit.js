define([
    'plugins/dialog',
    'services/unitofwork',
    'services/errorhandler',
    'lodash',
    'services/logger',
    'leaflet',
    'factories/mapFactory',
    'services/helpers',
    'commands/cancel',
    'commands/saveCompany'
  ],
  function(dialog, unitofwork, errorhandler, _, logger, L, MapFactory, helpers, cancelChangesCommand, saveCompanyCommand) {

    var viewmodel = function(model) {
      var self = this;
      self.displayName = "";
      self.model = model;
      self.cancel = new cancelChangesCommand(self);
      self.save = new saveCompanyCommand(self);
      self.map = "";
      
      self.marker = "";
      self.addressNotFound = ko.observable(false);
      var mapFactory = new MapFactory();

      self.attached = function(view, parent) {
        self.map = mapFactory.createMap("map");
        placeMarkerOnMap([self.model.address().lat(), self.model.address().lon()]);

        $("#street, #postalCode, #city").on("change", geocode);

      };

      function geocode() {
        var address = self.model.address();
        var latLon = helpers.geocodeAddress(address.street(), address.postalCode(), address.city());
        if (latLon === null) {
          self.addressNotFound(true);
        } else {
          self.addressNotFound(false);
          placeMarkerOnMap(latLon);
          self.model.address().lat(latLon[0]);
          self.model.address().lon(latLon[1]);
        }
      }


      function placeMarkerOnMap(latLon) {
        if (!self.marker) {
          self.marker = L.marker(latLon).addTo(self.map);
        } else {
          self.marker.setLatLng(latLon);
        }
        self.map.setView(latLon, 11);
      }

      self.close = function() {
        dialog.close(this, 'close');
      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });