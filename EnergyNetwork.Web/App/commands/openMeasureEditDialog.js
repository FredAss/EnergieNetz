define([
    'services/logger',
    'plugins/dialog',
    'services/unitofwork',
    'viewmodels/home/measureEdit'
],
  function (logger, dialog, unitofwork, measureEditViewModel) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          openEditor(dataContext);

          complete();
        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      function openEditor(measure) {
        var measureStates;
        var energySources;

        var measureStatesQuery = unitofwork.measureStateRepository.all("index").then(function (data) {
          measureStates = data;
        });

        var energySourcesQuery = unitofwork.energySourceRepository.all("name").then(function (data) {
          energySources = data;
        });

        Q.all([measureStatesQuery, energySourcesQuery]).then(function () {
          var measureEdit = new measureEditViewModel(measure, measureStates, energySources);

          return dialog.show(measureEdit)
            .then(afterCloseEditor);
        });
      }

      function afterCloseEditor() {
        viewmodel.searchMeasures();
      };

      return cmd;

    };

    return command;
  });