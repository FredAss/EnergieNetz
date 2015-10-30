define([
    'plugins/router',
    'services/errorhandler',
    'services/helpers',
    'services/unitofwork',
    'viewmodels/home/productionTime',
    'commands/deleteProductionTime',
    'commands/addProductionTime'
  ],
  function(router, errorhandler, helpers, unitofwork, productionTimeViewModel, deleteProductionTimeCommand, addProductionTimeCommand) {

    var viewmodel = function(productionTimes, survey) {
      var self = this;
      self.survey = survey;
      self.productionTimes = productionTimes;
      self.productionTimeViewModels = ko.observableArray();
      self.isValid = ko.computed(function() {
        var hasErrors = false;
        _.forEach(self.productionTimeViewModels(), function(productionTimeVM) {
          if (productionTimeVM.model.hasValidationErrors())
            hasErrors = true;
        });
        return !hasErrors;
      });

      self.isFilled = ko.computed(function() {
        return self.productionTimeViewModels().length > 0;
      });

      self.deleteProductionTimeCommand = new deleteProductionTimeCommand(self);
      self.addProductionTimeCommand = new addProductionTimeCommand(self);

      function initializeView() {
        if (self.productionTimeViewModels().length > 0)
          return;
        _.forEach(self.productionTimes(), function(area) {
          self.productionTimeViewModels.push(new productionTimeViewModel(area, survey, self.deleteProductionTimeCommand));
        });
      }

      initializeView();
    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });