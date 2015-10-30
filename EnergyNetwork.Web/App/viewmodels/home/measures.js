define([
    'plugins/dialog',
    'services/logger',
    'services/unitofwork',
    'viewmodels/home/measuresDetail',
    'services/measuresdetailextractor'
  ],
  function(dialog, logger, unitofwork, measuresDetailsViewModel, measuresDetailExtractor) {

    var viewmodel = function(parentObj) {
      var self = this;
      self.title = "";
      self.model = parentObj;
      self.parentId = ko.observable();
      self.collapseId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.stateCSS = {};
      self.stateDescriptions = {};
      self.measuresDetailExtractor = new measuresDetailExtractor(parentObj);

      self.activate = function() {
      };

      self.attached = function() {
        $('.chart').easyPieChart({
          lineWidth: 5,
          barColor: function(percent) {
            percent /= 100;
            return "rgb(" + Math.round(255 * (1 - percent)) + ", " + Math.round(255 * percent) + ", 0)";
          },
        });
      };

      self.showDetails = function() {
        showDialog(self.measuresDetailExtractor.measures, parentObj.entityType.shortName, self.parentId(), self.model);
      };

      function showDialog(tableData, type, parentId, parentObj) {
        return dialog.show(new measuresDetailsViewModel(tableData, type, parentId, parentObj, "")).then(function(dialogResult) {

        });
      }

    };

    return viewmodel;
  });