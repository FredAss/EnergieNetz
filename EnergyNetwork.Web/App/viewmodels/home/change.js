define([
    'moment'
  ],
  function(moment) {

    var viewmodel = function(model) {
      var self = this;
      self.model = model;
      self.formatedTimeAgo = function (date) {
        window.language.selectedLanguage(); // force reevaluation of lang
        var now = new Date();
        var _MS_PER_HOUR = 1000 * 60 * 60;
        date = date();

        // a and b are javascript Date objects
        function dateDiffInHours(a, b) {
          // Discard the time and time-zone information.
          var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
          var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

          return Math.floor((utc2 - utc1) / _MS_PER_HOUR);
        }

        var difference = dateDiffInHours(date, now);
        if (difference < 24) {
          return moment(date).fromNow();
        }
        else {
          return moment(date).format("L");
        }
      }

      self.formatedDate = function (dateString) {
          window.language.selectedLanguage(); // force reevaluation of lang
          return moment(dateString).format('MMMM YYYY');
      }
    };

    return viewmodel;
  });