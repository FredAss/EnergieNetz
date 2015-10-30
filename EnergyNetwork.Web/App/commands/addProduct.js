define([
    'services/unitofwork',
    'viewmodels/home/product',
    'commands/deleteProduct'
],
  function (unitofwork, productViewModel, deleteProductCommand) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          var newEntity = unitofwork.productRepository.create({
            survey: viewmodel.survey,
            outputUnit: _.find(viewmodel.outputUnits(), function(outputUnit) {
              return outputUnit.name() === "piece";
            })
          });
          viewmodel.productViewModels.push(new productViewModel(newEntity, viewmodel.survey, viewmodel.outputUnits, new deleteProductCommand(viewmodel)));
          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });
      
      return cmd;

    };

    return command;
  });