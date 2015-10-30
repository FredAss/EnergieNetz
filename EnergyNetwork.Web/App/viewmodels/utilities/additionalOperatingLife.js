define([
    'viewmodels/home/_chart'
  ],
  function(chartViewModel) {

    var viewmodel = function(financialCalculation) {
      var self = this;

      this.selectedValue = ko.observable();
      this.selectedValue.subscribe(createTableData);

      this.inputSlider = breeze.core.getUuid();

      this.financialCalculation = financialCalculation;

      this.kapitalWertNutzungsdauerChartViewModel = ko.observable();
      this.interneVerzinsungNutzungsdauerChartViewModel = ko.observable();

      this.kapitalWertNutzungsdauerPanelId = breeze.core.getUuid();
      this.kapitalWertNutzungsdauerCollapseId = breeze.core.getUuid();
      this.interneVerzinsungNutzungsdauerPanelId = breeze.core.getUuid();
      this.interneVerzinsungNutzungsdauerCollapseId = breeze.core.getUuid();

      this.tableData = ko.observableArray();
      this.tableId1 = breeze.core.getUuid();
      this.tableId2 = breeze.core.getUuid();


      this.compositionComplete = function() {
        plotCharts();
        $('#' + self.inputSlider).slider();
        self.selectedValue(5);
        
        initializeTable();
      };

      function initializeTable() {
        $(".tablesorter").tablesorter({
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

     

      function createTableData() {
        var kapitalwertArrayNutzungsdauer = self.financialCalculation().kapitalwertArrayNutzungsdauer;
        var data = [];
        var lifetime = self.financialCalculation().lifetime;
        var factor = -1;
        var index = lifetime + (self.selectedValue() * factor);

        for (var i = 0; i <= 10; i++) {
          data.push({
            value1: kapitalwertArrayNutzungsdauer[index][0],
            value2: kapitalwertArrayNutzungsdauer[index][1],
            value3: kapitalwertArrayNutzungsdauer[index][2]

          });
          factor = factor + 0.2;
          index = lifetime + (self.selectedValue() * factor);

        }
        self.tableData(data);
      };

      function plotCharts() {
        plotKapitalWertNutzungsdauer();
        plotInterneVerzinsungNutzungsdauer();

      };

      function plotInterneVerzinsungNutzungsdauer() {

        var kapitalwertArrayNutzungsdauer = self.financialCalculation().kapitalwertArrayNutzungsdauer;
        var lifetime = self.financialCalculation().lifetime;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayNutzungsdauer.length; i++) {
          var x = kapitalwertArrayNutzungsdauer[i][0];
          var y = kapitalwertArrayNutzungsdauer[i][2] * 100;

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayNutzungsdauer[lifetime][0] + self.selectedValue();
        var min = kapitalwertArrayNutzungsdauer[lifetime][0] - self.selectedValue();

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayNutzungsdauer[lifetime][0] + newValue;
            opts.min = kapitalwertArrayNutzungsdauer[lifetime][0] - newValue;
          });
          chartVm.plot.setupGrid();
          chartVm.plot.draw();
        });

        var data = [
          {
            label: language.getValue('internalInterestRate'),
            data: chartData
          }
        ];
        var options = {
          grid: {
            borderWidth: 0,
            hoverable: true,
            clickable: true
          },

          series: {
            lines: { show: true },
            points: { show: false }

          },
          legend: { show: false },
          yaxis: { min: 0 },
          xaxis: {
            show: true,
            tickDecimals: 0,
            min: min,
            max: max,
          },

          //xaxes: [{ show: true, tickSize: 1,  tickLength: 0, }]
        };

        var size = { height: '454px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[a]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.interneVerzinsungNutzungsdauerChartViewModel(chartVm);
      };

      function plotKapitalWertNutzungsdauer() {

        var kapitalwertArrayNutzungsdauer = self.financialCalculation().kapitalwertArrayNutzungsdauer;
        var lifetime = self.financialCalculation().lifetime;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayNutzungsdauer.length; i++) {
          var x = kapitalwertArrayNutzungsdauer[i][0];
          var y = kapitalwertArrayNutzungsdauer[i][1];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayNutzungsdauer[lifetime][0] + self.selectedValue();
        var min = kapitalwertArrayNutzungsdauer[lifetime][0] - self.selectedValue();

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayNutzungsdauer[lifetime][0] + newValue;
            opts.min = kapitalwertArrayNutzungsdauer[lifetime][0] - newValue;
          });
          chartVm.plot.setupGrid();
          chartVm.plot.draw();
        });

        var data = [
          {
            label: language.getValue('capitalValue'),
            data: chartData
          }
        ];
        var options = {
          grid: {
            borderWidth: 0,
            hoverable: true,
            clickable: true
          },

          series: {
            lines: { show: true },
            points: { show: false }

          },
          legend: { show: false },
          yaxis: { min: 0 },
          xaxis: {
            show: true,
            tickDecimals: 0,
            min: min,
            max: max,
          },

          //xaxes: [{ show: true, tickSize: 1,  tickLength: 0, }]
        };

        var size = { height: '454px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[a]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.kapitalWertNutzungsdauerChartViewModel(chartVm);
      };
    };
    return viewmodel;
  });