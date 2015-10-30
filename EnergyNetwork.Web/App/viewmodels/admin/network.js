define([
    'services/appsecurity',
    'services/unitofwork',
    'services/errorhandler',
    'services/routeconfig',
    'plugins/router',
    'plugins/dialog',
    'factories/chartFactory',
    'viewmodels/home/measures',
    'viewmodels/admin/networkInfo',
    'viewmodels/home/chartDetail',
    'viewmodels/home/chart',
    'viewmodels/home/pieChart',
    'viewmodels/admin/surveysOverview',
    'viewmodels/admin/companyRanking',
    'services/constants'
  ],
  function(appsecurity, unitofwork, errorhandler, routeconfig, router, dialog, chartFactory, measuresViewModel, networkInfoViewModel, chartDetailViewModel, chartViewModel, pieChartViewModel, surveysOverviewViewModel, companyRankingViewModel, constants) {

    var viewmodel = function() {
      var self = this;
      this.model = ko.observable();
      this.chartFactory = new chartFactory();
      this.convertRouteToHash = router.convertRouteToHash;
      this.measuresViewModel = ko.observable();
      this.networkInfoViewModel = ko.observable();
      this.mapViewModel = ko.observable();
      this.surveysOverviewViewModel = ko.observable();
      this.totalConsumptionChart = ko.observable();
      this.energyConsumptionPieChart = ko.observable();
      this.energyConsumptionLineChart = ko.observable();
      this.energyConsumptionBarChart = ko.observable();
      this.carbonDioxideEmissionPieChart = ko.observable();
      this.carbonDioxideEmissionLineChart = ko.observable();
      this.carbonDioxideEmissionBarChart = ko.observable();
      this.companyRanking = ko.observable();

      this.activate = function(networkId) {

        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });

        var network = unitofwork.networkRepository.byId(networkId);

        return Q.all([network]).then(function (data) {
            self.model(data[0][0]);
        }).fail(self.handleError);
      };

      this.attached = function(view, parent) {
        self.loadChartData();
        self.loadCompanyRanking();
        self.measuresViewModel(new measuresViewModel(self.model()));
        self.networkInfoViewModel(new networkInfoViewModel(self.model()));
        self.surveysOverviewViewModel(new surveysOverviewViewModel(self.orderSurveys(self.model()), self.model));

        self.model().networkCompanies().arrayChanged.subscribe(function() {
          self.surveysOverviewViewModel(new surveysOverviewViewModel(self.orderSurveys(self.model()), self.model));

          subscribeLast();
        });

        if (self.model().networkCompanies().length > 0) {
          subscribeLast();
        }

        function subscribeLast() {
          _.last(self.model().networkCompanies()).surveys().arrayChanged.subscribe(function () {
            self.surveysOverviewViewModel(new surveysOverviewViewModel(self.orderSurveys(self.model()), self.model));
          });
        }

      };

      this.orderSurveys = function(network) {
        var surveys = ko.observableArray();
        _.forEach(network.networkCompanies(), function(networkCompany) {
          _.forEach(networkCompany.surveys(), function(survey) {
            surveys.push(survey);
          });
        });
        var groupedSurveys = _.groupBy(surveys(), function(survey) {
          return survey.title();
        });
        var sortedSurveys = _.sortBy(_.toArray(groupedSurveys), function(group) {
          return group[0].title();
        });
        return sortedSurveys;
      };

      this.loadChartData = function() {
        unitofwork.networkRepository.networkChartDataBy(self.model().networkId())
          .then(function(data) {
            return data;
          })
          .then(function (data) {
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

      this.loadCompanyRanking = function() {
        unitofwork.networkRepository.companyRanking(self.model().networkId())
          .then(function(data) {
            self.companyRanking(new companyRankingViewModel(data));
          });
      };

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });