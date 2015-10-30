define([
    'services/errorhandler'
  ],
  function(errorhandler) {

    var viewmodel = function(model, energySources, del) {
      var self = this;
      self.model = model;
      self.energySources = energySources;
      self.value = ko.observable(model.value());

      self.selectedEnergySource = ko.observable(self.model.energySource().energySourceId());
      self.selectedEnergySource.subscribe(function(newValue) {
        var value = _.find(self.energySources(), function(energySource) {
          return energySource.energySourceId() === newValue;
        });
        self.model.energySource(value);
      });
      self.del = del;
      self.unit = ko.observable("kWh");
      self.unit.subscribe(function(unit) {
          updateValue(unit);
      });

      self.value.subscribe(function () {
          updateValue(self.unit());
      });

      function updateValue(unit) {
        switch (unit) {
          case "MWh":
            var value = self.value() * 1000;
            self.model.value(value);
            break;
          case "kWh":
            self.model.value(self.value());
            break;
        }
      }
        
      };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });