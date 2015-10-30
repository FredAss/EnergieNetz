define([
    'plugins/dialog',
    'services/unitofwork',
    'services/extractChartData',
    'services/logger',
    'factories/chartFactory',
    'services/fillChartDetail'
  ],
  function(dialog, unitofwork, extractChartData, logger, chartFactory, fillChartDetail) {

    var viewmodel = function(title, type, data, tableData) {
      var self = this;
      self.title = language.getValue(title);;
      self.chartId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.collapseId = breeze.core.getUuid();
      self.chartFactory = new chartFactory();
      self.tableData = tableData;
      self.extractedData = extractChartData.extractChartData(data, type);

      self.activate = function() {
        self.tableData = fillChartDetail(tableData);
      };

      self.attached = function(view, parent) {
        self.chartFactory.plotChartBy(type, self.extractedData, null, self.chartId, self.panelId, null, true);
        self.configureTable();
      };

      self.configureTable = function() {
        $.tablesorter.addParser({
          id: 'number',
          is: function(s) {
            // return false so this parser is not auto detected 
            return false;
          },
          format: function(s) {
            // format your data for normalization 
            var matches = s.match(/([\d.]+)/);
            return matches !== null ? matches[0].replace(/\./g, "") : 0;
          },
          // set type, either numeric or text 
          type: 'numeric'
        });


        var totalYears = self.tableData[0].length;
        var headers = {};
        for (var i = 1; i <= totalYears; i++) {
          headers[i] = { sorter: "number" };
        }


        $(".table").tablesorter({
          // this will apply the bootstrap theme if "uitheme" widget is included
          // the widgetOptions.uitheme is no longer required to be set
          theme: "bootstrap",

          widthFixed: true,
          headers: headers,

          headerTemplate: '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!

          // widget code contained in the jquery.tablesorter.widgets.js file
          // use the zebra stripe widget if you plan on hiding any rows (filter widget)
          widgets: ["zebra", "uitheme", "resizable"],
          widgetOptions: {
            zebra: ["even", "odd"],
          }


        });


      };

      self.close = function() {
        dialog.close(self, 'close');
      };
    };

    return viewmodel;
  });