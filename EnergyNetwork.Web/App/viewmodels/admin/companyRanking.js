define([
    'plugins/dialog',
    'services/appsecurity',
    'viewmodels/admin/companyRankingByEmployee',
    'viewmodels/admin/companyRankingByTotalRevenue',
    'viewmodels/admin/companyRankingByAreaSize'
  ],
  function(dialog, appsecurity, companyRankingByEmployeeViewModel, companyRankingByTotalRevenueViewModel, companyRankingByAreaSizeViewModel) {

    var viewmodel = function(model) {
      var self = this;
      self.title = "";
      self.model = model;
      self.parentId = ko.observable();
      self.collapseId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.rankingTypes = [
        {
          title: '<abbr title="' + language.getValue('totalEnergyConsumption') + '">' + language.getValue('totalEnergyConsumption_abbreviation') + '</abbr>/' + language.getValue('totalRevenue'),
          id: breeze.core.getUuid()
        }, {
          title: '<abbr title="' + language.getValue('totalEnergyConsumption') + '">' + language.getValue('totalEnergyConsumption_abbreviation') + '</abbr>/' + language.getValue('staff'),
          id: breeze.core.getUuid()
        },
        {
          title: '<abbr title="' + language.getValue('totalEnergyConsumption') + '">' + language.getValue('totalEnergyConsumption_abbreviation') + '</abbr>/' + language.getValue('sizeOfEnterprise'),
          id: breeze.core.getUuid()
        }
      ];
      _.forEach(model, function(relatedYear) {
        relatedYear.rankingByEmployee = ko.computed(function() {
          return _.sortBy(relatedYear.companies, function(company) {
            return company.energyConsumptionPerEmployee;
          });
        });
        relatedYear.rankingByTotalRevenue = ko.computed(function() {
          return _.sortBy(relatedYear.companies, function(company) {
            return company.energyConsumptionPerTotalRevenue;
          });
        });
        relatedYear.rankingByAreaSize = ko.computed(function() {
          return _.sortBy(relatedYear.companies, function(company) {
            return company.energyConsumptionPerAreaSize;
          });
        });
      });

      self.companyRankingByTotalRevenue = ko.observable(new companyRankingByTotalRevenueViewModel(self.model));
      self.companyRankingByEmployee = ko.observable(new companyRankingByEmployeeViewModel(self.model));
      self.companyRankingByAreaSize = ko.observable(new companyRankingByAreaSizeViewModel(self.model));


      self.attached = function() {
        $('#' + self.collapseId + ' a:first').tab('show');
      };


    };

    return viewmodel;
  });