define([
    'services/errorhandler'
  ],
  function(errorhandler) {

    var viewmodel = function(model, survey, outputUnits, del) {
      var self = this;
      self.survey = survey;
      self.model = model;
      self.del = del;
      self.outputUnits = outputUnits;
      self.selectedOutputUnit = ko.observable();

      self.attached = function(view, parent) {
        self.setSelectedOutputUnit();
      };

      self.setSelectedOutputUnit = function() {
        if (["Deleted", "Detached"].indexOf(self.model.entityAspect.entityState.name) > -1) {
          return;
        }
        var outputUnit = _.find(self.outputUnits(), function(outputUnit) {
          return outputUnit.name() === self.model.outputUnit().name();
        });
        self.selectedOutputUnit(outputUnit);
        self.selectedOutputUnit.subscribe(function(newValue) {
          self.model.outputUnit(newValue);
        });
      };

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });