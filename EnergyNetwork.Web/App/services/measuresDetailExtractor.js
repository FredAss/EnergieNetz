define([
    'lodash'
  ],
  function(_) {
    var measuresDetailExtractor = function(parent) {
      var self = this;

      self.measures = ko.computed(function() {
        switch (parent.entityType.shortName) {
          case 'NetworkCompany':
            return parent.measures();
          case 'Network':
            var measures = new Array();
            _.forEach(parent.networkCompanies(), function(networkCompany) {
              _.forEach(networkCompany.measures(), function(measure) {
                measures.push(measure);
              });
            });
            return measures;
        }
      });

      self.totalMeasures = ko.computed(function() {
        return self.measures().length > 0 ? self.measures().length : '-';
      });

      self.countedMeasuresByState = ko.computed(function() {
        return _.countBy(self.measures(), function(measure) {
          return measure.state() !== null ? measure.state().index() : '';
        });
      });

      self.openMeasures = ko.computed(function() {
        return self.countedMeasuresByState()[0] > 0 ? self.countedMeasuresByState()[0] : '-';
      });

      self.inProgressMeasures = ko.computed(function() {
        return self.countedMeasuresByState()[1] > 0 ? self.countedMeasuresByState()[1] : '-';
      });

      self.completedMeasures = ko.computed(function() {
        return self.countedMeasuresByState()[2] > 0 ? self.countedMeasuresByState()[2] : '-';
      });

      self.rejectedMeasures = ko.computed(function() {
        return self.countedMeasuresByState()[3] > 0 ? self.countedMeasuresByState()[3] : '-';
      });

      self.lastChangedMeasures = ko.computed(function() {
        return _.last(
          _.sortBy(self.measures(), function(measure) {
            return measure.lastChange();
          }), 2);
      });

      self.savedEnergyByMeasures = ko.computed(function() {
        return calculateSavedEnergy(self.measures());
      });

      function calculateSavedEnergy(measures) {
        var grouped = _.groupBy(measures, function(measure) {
          return measure.state() !== null ? measure.state().index() : '';
        });
        var savedEnergy = _.reduce(grouped[2], function(memo, measure) {
          return memo + _.reduce(measure.energySavings(), function(memo, energySaving) {
            return memo + energySaving.value();
          }, 0);
        }, 0);
        _.forEach(grouped[1], function(value) {
          if (!grouped[0]) {
            grouped[0] = [];
          }
          grouped[0].push(value);
        });
        var possibleSave = _.reduce(grouped[0], function(memo, measure) {
          return memo + _.reduce(measure.energySavings(), function(memo, energySaving) {
            return memo + energySaving.value();
          }, 0);
        }, 0) + savedEnergy;
        return (savedEnergy / possibleSave);
      };

    };

    return measuresDetailExtractor;
  });