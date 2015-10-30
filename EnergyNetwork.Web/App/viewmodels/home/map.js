define([
    'plugins/dialog',
    'services/errorhandler',
    'plugins/router',
    'services/logger',
    'factories/mapFactory',
    'lodash'
  ],
  function(dialog, errorhandler, router, logger, mapFactory, _) {


    var viewmodel = function(networkCompanies, openPopupForId) {
      var self = this;
      self.networkCompanies = networkCompanies;
      self.openPopupForId = openPopupForId;
      self.displayName = language.getValue('map');
      self.convertRouteToHash = router.convertRouteToHash;
      self.mapFactory = new mapFactory();
      self.mapElementId = breeze.core.getUuid();
      self.map = "";
      self.markers = [];

      self.activate = function () {
      };

      self.attached = function (view, parent) {
          self.createMap(self.networkCompanies);
      };

      self.createMap = function(networkCompanies) {
        if (networkCompanies.length > 0) {
          var map,
              markers,
              group;
          map = self.mapFactory.createMap(self.mapElementId);
          markers = self.mapFactory.createMarkers(networkCompanies);
          group = self.mapFactory.generateGroupForMarkers(markers);
          group.addTo(map);

          setTimeout(function() {
            map.fitBounds(group.getBounds());
          }, 0);
          self.map = map;
          self.markers = markers;
        } else {
            $("#" + self.mapElementId).text( language.getValue('noCompaniesInNetwork_info') );
        }
      };

      self.compositionComplete = function () {
          if (self.openPopupForId !== undefined) {
              window.marker = self.markers[self.openPopupForId];
              self.markers[self.openPopupForId].openPopup();
          }
      };

      self.close = function () {
          dialog.close(this, 'close');
      };

    };

    return viewmodel;
  });