define([
    'lodash'
  ],
  function(_) {

    var hideElementInNavBar = function(element) {
      if (element.nodeType === 1) {
        $(element).parent().css('height', 'auto');
        $(element).slideUp(function() {
          $(element).remove();
        });
      }
    };

    var showElementInNavBar = function(element) {
      if (element.nodeType === 1) {
        $(element).hide().slideDown();
        $(element).parent().css('height', 'auto');
      }
    };

    var geocodeAddress = function(streetAndHouseNumber, postalCode, city) {
      var re = /([a-zA-ZäöüÄÖÜß \.]+) ([0-9\-]+[a-zA-Z]?)/ig;
      var result = re.exec(streetAndHouseNumber);
      var housenumber = result ? result[2] : "";
      var street = result ? result[1] : streetAndHouseNumber;
      var query = "format=json&street=" + housenumber + " " + street + "&postalcode=" + postalCode + "&city=" + city;
      var basestring = "http://nominatim.openstreetmap.org/search?";
      var url = basestring + query;

      var latLon;
      $.ajax({
        url: url,
        dataType: "json",
        async: false,
        success: function(results) {
          if (results.length < 1) {
            latLon = null;
            return;
          }
          results = _.sortBy(results, function(match) {
            return match.importance;
          });
          var bestResult = results[0];
          var lat = bestResult.lat;
          var lon = bestResult.lon;
          latLon = [lat, lon];
        }
      });
      return latLon;
    };

    return {
      hideElementInNavBar: hideElementInNavBar,
      showElementInNavBar: showElementInNavBar,
      geocodeAddress: geocodeAddress
    };
  })