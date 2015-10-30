define([
    'services/errorhandler',
    'viewmodels/home/area',
    'commands/addArea',
    'commands/deleteArea'
  ],
  function(errorhandler, areaViewModel, addAreaCommand, deleteAreaCommand) {

    var viewmodel = function(areas, survey) {
      var self = this;
      self.survey = survey;
      self.areas = areas;
      self.areaViewModels = ko.observableArray();
      self.deleteAreaCommand = new deleteAreaCommand(self);
      self.addAreaCommand = new addAreaCommand(self);
      self.isValid = ko.computed(function() {
        var hasErrors = false;
        _.forEach(self.areaViewModels(), function(areaVM) {
          if (areaVM.model.hasValidationErrors())
            hasErrors = true;
        });
        return !hasErrors;
      });

      self.isFilled = ko.computed(function() {
        return self.areaViewModels().length > 0;
      });

      self.totalSize = ko.computed(function() {
        return _.reduce(self.areaViewModels(), function(memo, areaViewModel) {
          return memo + areaViewModel.model.size();
        }, 0);
      });

      self.totalHeatedFraction = ko.computed(function() {
        var total = _.reduce(self.areaViewModels(), function(memo, areaViewModel) {
          return memo + areaViewModel.model.heatedFraction() * (areaViewModel.model.size() / self.totalSize());
        }, 0);
        return Math.round(total * 100) / 100;
      });

      self.totalConditionedFraction = ko.computed(function() {
        var total = _.reduce(self.areaViewModels(), function(memo, areaViewModel) {
          return memo + areaViewModel.model.conditionedFraction() * (areaViewModel.model.size() / self.totalSize());
        }, 0);
        return Math.round(total * 100) / 100;
      });

      function initializeView() {
        if (self.areaViewModels().length > 0)
          return;
        _.forEach(self.areas(), function (area) {
          self.areaViewModels.push(new areaViewModel(area, survey, self.deleteAreaCommand));
        });
      }

      initializeView();

    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });