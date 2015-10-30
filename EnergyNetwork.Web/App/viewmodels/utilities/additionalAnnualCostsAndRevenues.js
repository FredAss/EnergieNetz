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

      this.statischeAmzVeränderteKostenUndErträge = ko.observable();
      this.dynamischeAmzVeränderteKostenUndErträge = ko.observable();
      this.kapitalWertVeränderteKostenUndErträge = ko.observable();
      this.interneVerzinsungVeränderteKostenUndErträge = ko.observable();

      this.statischeAmzVeränderteKostenUndErträgePanelId = breeze.core.getUuid();
      this.statischeAmzVeränderteKostenUndErträgeCollapseId = breeze.core.getUuid();
      this.dynamischeAmzVeränderteKostenUndErträgePanelId = breeze.core.getUuid();
      this.dynamischeAmzVeränderteKostenUndErträgeCollapseId = breeze.core.getUuid();
      this.kapitalWertVeränderteKostenUndErträgePanelId = breeze.core.getUuid();
      this.kapitalWertVeränderteKostenUndErträgeCollapseId = breeze.core.getUuid();
      this.interneVerzinsungVeränderteKostenUndErträgePanelId = breeze.core.getUuid();
      this.interneVerzinsungVeränderteKostenUndErträgeCollapseId = breeze.core.getUuid();

      this.tableData = ko.observableArray();
      this.tableId1 = breeze.core.getUuid();
      this.tableId2 = breeze.core.getUuid();
      this.tableId3 = breeze.core.getUuid();
      this.tableId4 = breeze.core.getUuid();

      this.compositionComplete = function() {
        plotCharts();
        $('#' + self.inputSlider).slider();
        self.selectedValue(30);
        
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
        var kapitalwertArrayKosten = self.financialCalculation().kapitalwertArrayKosten;
        var data = [];

        var index = -self.selectedValue() * 10;
        for (var i = 0; i <= 10; i++) {
          data.push({
            value1: kapitalwertArrayKosten[500 + index][0],
            value2: kapitalwertArrayKosten[500 + index][1],
            value3: kapitalwertArrayKosten[500 + index][2],
            value4: kapitalwertArrayKosten[500 + index][3],
            value5: kapitalwertArrayKosten[500 + index][4],
          });
          index = index + (self.selectedValue() / 5) * 10;
        }
        self.tableData(data);
      };

      function plotCharts() {
        plotKapitalWerVeränderteKostenUndErträge();
        plotInterneVerzinsungVeränderteKostenUndErträge();
        plotDynamischeAmzVeränderteKostenUndErträge();
        plotStatischeAmzVeränderteKostenUndErträge();
      };

      function plotStatischeAmzVeränderteKostenUndErträge() {

        var kapitalwertArrayKosten = self.financialCalculation().kapitalwertArrayKosten;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayKosten.length; i++) {
          var x = kapitalwertArrayKosten[i][0];
          var y = kapitalwertArrayKosten[i][4];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayKosten[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayKosten[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayKosten[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayKosten[500][0] * (1 - newValue / 100);
          });
          chartVm.plot.setupGrid();
          chartVm.plot.draw();
        });

        var data = [
          {
            label: language.getValue('staticAmortization'),
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

          xaxes: [{ show: false, tickSize: 1, tickLength: 0, }]
        };

        var size = { height: '454px', width: '100%' };
        var axesLabel = {
          xaxisLabel: '',
          yaxisLabel: '[a]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.statischeAmzVeränderteKostenUndErträge(chartVm);
      };

      function plotDynamischeAmzVeränderteKostenUndErträge() {

        var kapitalwertArrayKosten = self.financialCalculation().kapitalwertArrayKosten;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayKosten.length; i++) {
          var x = kapitalwertArrayKosten[i][0];
          var y = kapitalwertArrayKosten[i][3];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayKosten[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayKosten[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayKosten[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayKosten[500][0] * (1 - newValue / 100);
          });
          chartVm.plot.setupGrid();
          chartVm.plot.draw();
        });

        var data = [
          {
            label: language.getValue('dynamicAmortization'),
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
        self.dynamischeAmzVeränderteKostenUndErträge(chartVm);
      };

      function plotInterneVerzinsungVeränderteKostenUndErträge() {

        var kapitalwertArrayKosten = self.financialCalculation().kapitalwertArrayKosten;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayKosten.length; i++) {
          var x = kapitalwertArrayKosten[i][0];
          var y = kapitalwertArrayKosten[i][2] * 100;

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayKosten[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayKosten[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayKosten[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayKosten[500][0] * (1 - newValue / 100);
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
          yaxisLabel: '[%]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.interneVerzinsungVeränderteKostenUndErträge(chartVm);
      };

      function plotKapitalWerVeränderteKostenUndErträge() {

        var kapitalwertArrayKosten = self.financialCalculation().kapitalwertArrayKosten;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayKosten.length; i++) {
          var x = kapitalwertArrayKosten[i][0];
          var y = kapitalwertArrayKosten[i][1];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayKosten[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayKosten[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayKosten[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayKosten[500][0] * (1 - newValue / 100);
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
          yaxisLabel: '[€]'
        };
        var chartVm = new chartViewModel(data, options, size, axesLabel);
        self.kapitalWertVeränderteKostenUndErträge(chartVm);
      };
    };
    return viewmodel;
  });