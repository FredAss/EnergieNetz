define(['services/appsecurity', 'services/errorhandler', 'plugins/router', 'leaflet', 'leaflet-omnivore', "lodash", 'services/constants'], function(appsecurity, errorhandler, router, leaflet, omnivore, _, constants) {
  var factory = function() {

    var mapMarkers = {};

    this.createMap = function(mapElementId) {

      var map = leaflet.map(mapElementId);

      leaflet.Icon.Default.imagePath = constants.postBaseUrl() + '/Content/images/';
      leaflet.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      return map;
    };

    this.createMarkers = function(networkCompanies) {

      _.forEach(networkCompanies, function(networkCompany) {
        var company = networkCompany.company();
        if (company === null) {
          return;
        }
        var coordinates = [company.address().lat(), company.address().lon()];
        var popup = leaflet.popup().setContent(formattedCompanyInfos(company));
        popup.guid = company.companyId();
        var marker = L.marker(coordinates).bindPopup(popup);
        mapMarkers[company.companyId()] = marker;
      });
      return mapMarkers;
    };

    this.generateGroupForMarkers = function(markers) {
      var group = new leaflet.FeatureGroup();
      _.forOwn(markers, function(marker) {
        marker.addTo(group);
      });
      return group;
    };

    function formattedCompanyInfos(company) {
      var info = '<address>' +
        '<strong>' + company.name() + '</strong><br>' +
        '<span>' + company.address().street() + '</span><br>' +
        '<span>' + company.address().postalCode() + ' </span>' +
        '<span>' + company.address().city() + '</span><br>' +
        '<a target="_blank" href="' + company.address().website() + '"><span>' + company.address().website() + '</span></a>' +
        '</address>';
      _.forEach(company.employees(), function(employee) {
        info += '<address>' +
          '<span class="fa fa-user" style="margin-right: 3px;"></span> ' +
          '<strong>' + employee.lastName() + ' ' + employee.firstName() + '</strong><br>' +
          '<a href="#" href:"mailto:' + employee.email() + '" target="_self">' +
          '<span class="glyphicon glyphicon-envelope"></span> ' +
          '<span>' + employee.email() + '</span></a><br>' +
          '<span class="glyphicon glyphicon-earphone"></span> ' +
          '<span>' + employee.phoneNumber() + '</span></a><br>' +
          '</address>';
      });
      return info;
    };
  };
  return factory;
});