define([
    'services/errorhandler',
    'services/unitofwork',
    'viewmodels/home/reading',
    'commands/addReading',
    'commands/deleteReading'
],
  function(errorhandler, unitofwork, readingViewModel, addReadingCommand, deleteReadingCommand) {

    var viewmodel = function(readings, survey) {
          var self = this;
          self.survey = survey;
          self.readings = readings;
          self.energySources = null;
          self.readingViewModels = ko.observableArray();
          self.deleteReadingCommand = new deleteReadingCommand(self);
          self.addReadingCommand = new addReadingCommand(self);
          self.isValid = ko.computed(function() {
            var hasErrors = false;
            _.forEach(self.readings(), function(reading) {
              if (reading.hasValidationErrors())
                hasErrors = true;
            });
            return !hasErrors;
          });

          self.isFilled = ko.computed(function() {
              return self.readings().length > 0;
          });

          self.activate = function() {
            if (self.readingViewModels().length === 0)
              loadData();
          };

          function loadData() {
              var energySourcesQuery = unitofwork.energySourceRepository.all("name").then(function (data) {
                  self.energySources = data;
              });

              Q.all([energySourcesQuery]).then(function() {
                _.forEach(readings(), function(reading) {
                      self.readingViewModels.push(new readingViewModel(reading, survey, self.energySources, self.deleteReadingCommand));
                  });
              });
          };

      };
      errorhandler.includeIn(viewmodel);

      viewmodel["errors"] = ko.validation.group(viewmodel);

      return viewmodel;
  });