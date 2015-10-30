define([
    'plugins/router',
    'services/errorhandler',
    'services/unitofwork',
    'viewmodels/home/product',
    'commands/addProduct',
    'commands/deleteProduct'
],
  function(router, errorhandler, unitofwork, productViewModel, addProductCommand, deleteProductCommand) {

    var viewmodel = function(products, survey) {
          var self = this;
          self.survey = survey;
          self.products = products;
          self.productViewModels = ko.observableArray();
          self.outputUnits = ko.observableArray();
          self.deleteProductCommand = new deleteProductCommand(self);
          self.addProductCommand = new addProductCommand(self);

          self.isValid = ko.computed(function() {
            var hasErrors = false;
            _.forEach(self.productViewModels(), function(productVM) {
              if (productVM.model.hasValidationErrors())
                hasErrors = true;
            });
            return !hasErrors;
          });

          self.isFilled = ko.computed(function() {
            return self.productViewModels().length > 0;
          });

          function initializeView() {
            var outputUnitQuery = unitofwork.outputUnitRepository.all("name").then(function (data) {
              self.outputUnits(data);
            });

            Q.all([outputUnitQuery]).then(function () {
              if (self.productViewModels().length > 0)
                return;
              _.forEach(self.products(), function (product) {
                self.productViewModels.push(new productViewModel(product, survey, self.outputUnits, self.deleteProductCommand));
              });
            });
          }

          initializeView();

      };
      errorhandler.includeIn(viewmodel);

      viewmodel["errors"] = ko.validation.group(viewmodel);

      return viewmodel;
  });