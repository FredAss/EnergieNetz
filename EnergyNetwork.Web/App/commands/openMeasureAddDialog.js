define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/home/measureEdit',
    'commands/openMeasureEditDialog'
],
  function (logger, dialog, unitofwork, measureEditViewModel, openMeasureEditDialogCommand) {

    var command = function (viewmodel) {
      var self = this;
      self.openMeasureEditDialog = new openMeasureEditDialogCommand(viewmodel);

      var cmd = ko.asyncCommand({
        execute: function (complete) {
          createMeasure();
          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function createMeasure() {

        var predicate = breeze.Predicate.create("index", "==", 0);
        self.measureState = ko.observable();

        var measureStatesQuery = unitofwork.measureStateRepository.firstOrDefault(predicate).then(self.measureState);

        Q.all([measureStatesQuery]).then(function () {
          var measure = unitofwork.measureRepository.create({
            networkCompany: viewmodel.parentObj,
            state: self.measureState()[0]
          });
          self.openMeasureEditDialog(measure);
        }).fail(function (data) {
          logger.logError(language.getValue('errorMessage'), data, null, true);
        });

      };

      return cmd;

    };

    return command;
  });