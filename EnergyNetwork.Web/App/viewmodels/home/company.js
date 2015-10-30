define([
    'services/appsecurity',
    'plugins/dialog',
    'services/logger',
    'services/unitofwork',
    'services/errorhandler',
    'plugins/router',
    'services/routeconfig',
    'factories/chartFactory',
    'viewmodels/home/chart',
    'viewmodels/home/pieChart',
    'viewmodels/home/measures',
    'viewmodels/home/map',
    'viewmodels/home/surveysOverview',
    'viewmodels/admin/companyRanking',
    'viewmodels/home/companyEdit',
    'services/constants'
  ],
  function(appsecurity, dialog, logger, unitofwork, errorhandler, router, routeconfig, chartFactory, chartViewModel, pieChartViewModel, measuresViewModel, mapViewModel, surveysOverviewViewModel, companyRankingViewModel, companyEditViewModel, constants) {

    var viewmodel = function() {
      var self = this;
      self.model = ko.observable();
      self.editItem = ko.observable(null);
      self.measures = ko.observable();
      self.surveysOverviewViewModel = ko.observable();
      self.chartFactory = new chartFactory();
      self.convertRouteToHash = router.convertRouteToHash;
      self.totalConsumptionChart = ko.observable();
      self.energyConsumptionPieChart = ko.observable();
      self.energyConsumptionLineChart = ko.observable();
      self.energyConsumptionBarChart = ko.observable();
      self.carbonDioxideEmissionPieChart = ko.observable();
      self.carbonDioxideEmissionLineChart = ko.observable();
      self.carbonDioxideEmissionBarChart = ko.observable();
      self.companyRanking = ko.observable();
      self.chartElementId = 'chart';
      self.router = router;

      self.exportCompanyDataBy = function() {
        $.fileDownload(routeconfig.exportCompanyDataByUrl, {
          type: 'GET',
          data: { id: self.model().networkCompanyId() }
        });
      };

      self.activate = function(networkId, networkCompanyId) {

        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });

        var company = unitofwork.networkCompanyRepository.byId(networkCompanyId).then(function(model) {
          self.model(model[0]);
          self.measures(new measuresViewModel(self.model()));
          self.surveysOverviewViewModel(new surveysOverviewViewModel(self.orderSurveys(self.model()), self.model().network));
          self.loadChartData();
          self.loadCompanyRanking();
        });
        Q.all([company]).fail(self.handleError);
      };

      self.attached = function(view, parent) {

      };

      self.orderSurveys = function(networkCompany) {
        var groupedSurveys = _.groupBy(networkCompany.surveys(), function(survey) {
          return survey.date();
        });
        var sortedSurveys = _.sortBy(_.toArray(groupedSurveys), function(group) {
          return group[0].date();
        });
        return sortedSurveys;
      };

      self.loadCompanyRanking = function() {

        unitofwork.networkCompanyRepository.companyRanking(self.model().networkId(), self.model().companyId)
          .then(function(data) {
            self.companyRanking(new companyRankingViewModel(data));
          });
      };

      self.loadChartData = function() {
        unitofwork.networkCompanyRepository.networkCompanyChartDataBy(self.model().networkCompanyId()).then(
          function (data) {
              ko.computed(function () {
                  self.totalConsumptionChart(new chartViewModel(constants.TOTAL_CONSUMPTION_LINECHART_TITLE, constants.TOTAL_CONSUMPTION_LINECHART, data, self.model(), false));
                  self.energyConsumptionPieChart(new pieChartViewModel(constants.ENERGY_CONSUMPTION_PIECHART_TITLE, constants.ENERGY_CONSUMPTION_PIECHART, data, self.model(), false));
                  self.energyConsumptionLineChart(new chartViewModel(constants.ENERGY_CONSUMPTION_LINECHART_TITLE, constants.ENERGY_CONSUMPTION_LINECHART, data, self.model(), false));
                  self.energyConsumptionBarChart(new chartViewModel(constants.ENERGY_CONSUMPTION_BARCHART_TITLE, constants.ENERGY_CONSUMPTION_BARCHART, data, self.model(), false));
                  self.carbonDioxideEmissionPieChart(new pieChartViewModel(constants.CARBONDIOXIDEMISSION_PIECHART_TITLE, constants.CARBONDIOXIDEMISSION_PIECHART, data, self.model(), false));
                  self.carbonDioxideEmissionLineChart(new chartViewModel(constants.CARBONDIOXIDEMISSION_LINECHART_TITLE, constants.CARBONDIOXIDEMISSION_LINECHART, data, self.model(), false));
                  self.carbonDioxideEmissionBarChart(new chartViewModel(constants.CARBONDIOXIDEMISSION_BARCHART_TITLE, constants.CARBONDIOXIDEMISSION_BARCHART, data, self.model(), false));
              });
          });
      };

      self.showMap = function () {
          showDialog();
      };

      function showDialog() {
          return dialog.show(new mapViewModel(self.model().network().networkCompanies(), self.model().company().companyId())).then(function (dialogResult) {
          });
      }

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });