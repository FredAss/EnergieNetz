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

      this.statischeAmzZusätzlicheKostenChartViewModel = ko.observable();
      this.dynamischeAmzZusätzlicheKostenChartViewModel = ko.observable();
      this.kapitalWertZusätzlicheKostenChartViewModel = ko.observable();
      this.interneVerzinsungZusätzlicheKostenChartViewModel = ko.observable();

      this.statischeAmzZusätzlicheKostenPanelId = breeze.core.getUuid();
      this.statischeAmzZusätzlicheKostenCollapseId = breeze.core.getUuid();
      this.dynamischeAmzZusätzlicheKostenPanelId = breeze.core.getUuid();
      this.dynamischeAmzZusätzlicheKostenCollapseId = breeze.core.getUuid();
      this.kapitalWertZusätzlicheKostenPanelId = breeze.core.getUuid();
      this.kapitalWertZusätzlicheKostenCollapseId = breeze.core.getUuid();
      this.interneVerzinsungZusätzlicheKostenPanelId = breeze.core.getUuid();
      this.interneVerzinsungZusätzlicheKostenCollapseId = breeze.core.getUuid();

      this.tableData = ko.observableArray();
      this.tableId1 = breeze.core.getUuid();
      this.tableId2 = breeze.core.getUuid();
      this.tableId3 = breeze.core.getUuid();
      this.tableId4 = breeze.core.getUuid();

      //this.attached = function(view, parent) {
      //  plotCharts();
      //  $('#' + self.inputSlider).slider();
      //};

      //this.activate = function () {
       
      //};

      this.compositionComplete = function () {
        self.selectedValue(30);
        plotCharts();
        $('#' + self.inputSlider).slider();
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

     

      function plotCharts() {
        plotKapitalWertZusätzlicheKosten();
        plotInterneVerzinsungZusätzlicheKosten();
        plotDynamischeAmzZusätzlicheKosten();
        plotStatischeAmzZusätzlicheKosten();

      };

      function createTableData() {
        var kapitalwertArrayInvestition = self.financialCalculation().kapitalwertArrayInvestition;
        var data = [];

        var index = -self.selectedValue() * 10;
        for (var i = 0; i <= 10; i++) {
          if (index == 500) {
            index = 499;
          }
          data.push({
            value1: kapitalwertArrayInvestition[500 + index][0],
            value2: kapitalwertArrayInvestition[500 + index][1],
            value3: kapitalwertArrayInvestition[500 + index][2],
            value4: kapitalwertArrayInvestition[500 + index][3],
            value5: kapitalwertArrayInvestition[500 + index][4],
          });
          index = index + (self.selectedValue() / 5) * 10;
        }
        self.tableData(data);
      };


      function plotStatischeAmzZusätzlicheKosten() {

        var kapitalwertArrayInvestition = self.financialCalculation().kapitalwertArrayInvestition;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayInvestition.length; i++) {
          var x = kapitalwertArrayInvestition[i][0];
          var y = kapitalwertArrayInvestition[i][4];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayInvestition[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayInvestition[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayInvestition[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayInvestition[500][0] * (1 - newValue / 100);
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
        self.statischeAmzZusätzlicheKostenChartViewModel(chartVm);
      };

      function plotDynamischeAmzZusätzlicheKosten() {

        var kapitalwertArrayInvestition = self.financialCalculation().kapitalwertArrayInvestition;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayInvestition.length; i++) {
          var x = kapitalwertArrayInvestition[i][0];
          var y = kapitalwertArrayInvestition[i][3];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayInvestition[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayInvestition[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayInvestition[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayInvestition[500][0] * (1 - newValue / 100);
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
        self.dynamischeAmzZusätzlicheKostenChartViewModel(chartVm);
      };

      function plotInterneVerzinsungZusätzlicheKosten() {

        var kapitalwertArrayInvestition = self.financialCalculation().kapitalwertArrayInvestition;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayInvestition.length; i++) {
          var x = kapitalwertArrayInvestition[i][0];
          var y = kapitalwertArrayInvestition[i][2] * 100;

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayInvestition[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayInvestition[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayInvestition[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayInvestition[500][0] * (1 - newValue / 100);
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
        self.interneVerzinsungZusätzlicheKostenChartViewModel(chartVm);
      };

      function plotKapitalWertZusätzlicheKosten() {

        var kapitalwertArrayInvestition = self.financialCalculation().kapitalwertArrayInvestition;
        var chartData = [];
        for (var i = 0; i < kapitalwertArrayInvestition.length; i++) {
          var x = kapitalwertArrayInvestition[i][0];
          var y = kapitalwertArrayInvestition[i][1];

          chartData[i] = [x, y];
        }

        var max = kapitalwertArrayInvestition[500][0] * (1 + self.selectedValue() / 100);
        var min = kapitalwertArrayInvestition[500][0] * (1 - self.selectedValue() / 100);

        self.selectedValue.subscribe(function(newValue) {
          $.each(chartVm.plot.getXAxes(), function(_, axis) {
            var opts = axis.options;
            opts.max = kapitalwertArrayInvestition[500][0] * (1 + newValue / 100);
            opts.min = kapitalwertArrayInvestition[500][0] * (1 - newValue / 100);
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
        self.kapitalWertZusätzlicheKostenChartViewModel(chartVm);
      };
    };
    return viewmodel;
  });