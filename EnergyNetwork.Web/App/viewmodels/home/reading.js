define([
    'services/errorhandler'
  ],
  function(errorhandler) {

    var viewmodel = function(model, survey, energySources, del) {
      var self = this;
      self.survey = survey;
      self.model = model;
      self.energySources = energySources;
      self.value = ko.observable(model.value()).extend({ required: true });
      self.unit = ko.observable("kWh");
      self.selectedEnergySource = ko.observable();
      self.del = del;

      self.attached = function(view, parent) {
        self.setSelectedEnergySource();
        ko.computed(function() {
          switch (self.unit()) {
            case "MWh":
              self.model.value(self.value() * 1000);
              break;
            case "kWh":
              self.model.value(self.value());
              break;
          }
        });

        $("#value").on("focusout", function() {
          if ($("#value")[0].value === "") {
            self.model.value(null);
          }
        });
      };

      self.setSelectedEnergySource = function() {
        if (["Deleted", "Detached"].indexOf(self.model.entityAspect.entityState.name) > -1) {
          return;
        }
        var energySource = _.find(self.energySources, function(energySource) {
          return energySource.name() === self.model.energySource().name();
        });
        self.selectedEnergySource(energySource);
        self.selectedEnergySource.subscribe(function(newValue) {
          self.model.energySource(newValue);
        });
      };

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });