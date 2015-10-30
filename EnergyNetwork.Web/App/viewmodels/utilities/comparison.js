define([
    'services/unitofwork',
    'services/routeconfig',
    'services/appsecurity',
    'viewmodels/home/_chart',
    'viewmodels/utilities/additionalInvestment',
    'viewmodels/utilities/additionalAnnualCostsAndRevenues',
    'viewmodels/utilities/additionalOperatingLife'
  ],
  function(unitofwork, routeconfig, appsecurity, chartViewModel, additionalInvestmentViewModel, additionalAnnualCostsAndRevenuesViewModel, additionalOperatingLifeViewModel) {

    var viewmodel = function() {
      var self = this;
      this.model = ko.observable();
      this.financialCalculation = ko.observable();
      this.hasError = ko.observable(false);

      this.timeChart = ko.observable();
      this.zinsenChart = ko.observable();
      this.capitalChart = ko.observable();
      this.zeitChart = ko.observable();

      this.additionalInvestment = ko.observable();
      this.additionalAnnualCostsAndRevenues = ko.observable();
      this.additionalOperatingLife = ko.observable();

      this.additionalInvestmentTabId = breeze.core.getUuid();
      this.additionalAnnualCostsAndRevenuesTabId = breeze.core.getUuid();
      this.additionalOperatingLifeTabId = breeze.core.getUuid();


      this.activate = function(investmentPlanId, comparisonId) {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        loadData(comparisonId);
      };

      this.compositionComplete = function () {
        self.initializeView();
      };

      this.attached = function() {
        self.initializeView();
      };

      this.initializeView = function() {
        
        initializeTable();
        initializeSlider();
      };

      function initializeSlider() {
        //$("input.slider").slider();
      }

      function initializeTable() {
        $("#zahlungsplanTable").tablesorter({
          // this will apply the bootstrap theme if "uitheme" widget is included
          // the widgetOptions.uitheme is no longer required to be set
          theme: "bootstrap",
          widthFixed: true,
          headers: {
            3: { sorter: "savings" }

          },
          headerTemplate: '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!
          // widget code contained in the jquery.tablesorter.widgets.js file
          // use the zebra stripe widget if you plan on hiding any rows (filter widget)
          widgets: ["zebra", "uitheme", "resizable"],
          widgetOptions: {
            zebra: ["even", "odd"],
          }
        });
      };

    

      function initializeCharts() {
        plotZinsen();
        plotCapital();
        plotZeit();
        plotZusätzlicheInvestition();
      };

      function plotZusätzlicheInvestition() {
        var additionalInvestmentVm = new additionalInvestmentViewModel(self.financialCalculation);
        var additionalAnnualCostsAndRevenues = new additionalAnnualCostsAndRevenuesViewModel(self.financialCalculation);
        var additionalOperatingLife = new additionalOperatingLifeViewModel(self.financialCalculation);
        self.additionalInvestment(additionalInvestmentVm);
        self.additionalAnnualCostsAndRevenues(additionalAnnualCostsAndRevenues);
        self.additionalOperatingLife(additionalOperatingLife);
      };

      function plotZinsen() {
        var data = [
          {
            label:  language.getValue('imputedInterestRate'),
            data: [[0, self.financialCalculation().interestRate]]
          },
          {
            label: language.getValue('internalInterestRate'),
            data: [[1, self.financialCalculation().interneVerzinsung * 100]]
          }
        ];
        var options = {
          grid: {
            borderWidth: 0,
            hoverable: true,
            clickable: true
          },
          series: {
            bars: {
              fill: true,
              fillColor: {
                colors: [
                  { opacity: 1 }, { opacity: 1 }
                ]
              },
              barWidth: 0.95,
              align: 'center',
              lineWidth: 0.2,
              show: true
            }
          },
          legend: { show: false },
          xaxis: { show: false }
        };

        var size = { height: '300px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[%]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.zinsenChart(chartVm);
      };

      function plotCapital() {

        var data = [
          {
            label: language.getValue('investmentSum'),
            data: [[0, self.financialCalculation().kreditFürInvestition]],
          },
          {
            label: language.getValue('capitalValue'),
            data: [[1, self.financialCalculation().kapitalwert]],
          }
        ];
        var options = {
          grid: {
            borderWidth: 0,
            hoverable: true,
            clickable: true
          },
          series: {
            bars: {
              fill: true,
              fillColor: {
                colors: [
                  { opacity: 1 }, { opacity: 1 }
                ]
              },
              barWidth: 0.95,
              align: 'center',
              lineWidth: 0.2,
              show: true
            }
          },
          legend: { show: false },
          xaxis: { show: false }
        };

        var size = { height: '300px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[€]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.capitalChart(chartVm);
      };

      function plotZeit() {

        var data = [
          {
            label: language.getValue('dynamicAmortization'),
            data: [[0, self.financialCalculation().amortisation10Percent]],
          },
          {
            label: language.getValue('lifetime'),
            data: [[1, self.financialCalculation().lifetime]],
          }
        ];
        var options = {
          grid: {
            borderWidth: 0,
            hoverable: true,
            clickable: true
          },
          series: {
            bars: {
              fill: true,
              fillColor: {
                colors: [
                  { opacity: 1 }, { opacity: 1 }
                ]
              },
              barWidth: 0.95,
              align: 'center',
              lineWidth: 0.2,
              show: true
            }
          },
          legend: { show: false },
          xaxis: { show: false }
        };
        var size = { height: '300px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[a]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.zeitChart(chartVm);
      };

      function loadData(comparisonId) {
        $.ajax({
          data: { id: comparisonId },
          url: routeconfig.financialCalculationUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders(),
          success: function(data) {
            if (data.hasOwnProperty("error")) {
              self.hasError(true);
            } else {
              self.financialCalculation(data);
              initializeCharts();
            }
          }
        });
      };
    };
    return viewmodel;
  });