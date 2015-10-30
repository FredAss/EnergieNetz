define([
    'plugins/dialog',
    'services/logger',
    'services/extractChartData',
    'factories/chartFactory'
  ],
  function(dialog, logger, extractChartData, chartFactory) {
    var viewmodel = function(title, type, data) {
      var self = this;
      self.title = title;
      self.chartId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.collapseId = breeze.core.getUuid();
      self.chartFactory = new chartFactory();
      self.extractedData = extractChartData.extractChartData(data, type);
      self.selectedYear = ko.observable(this.extractedData.maxYear);
      self.maxYear = ko.observable(this.extractedData.maxYear);
      self.minYear = ko.observable(this.extractedData.minYear);

      self.attached = function(view, parent) {
          if ($("#" + self.chartId).width() !== 0) {
              self.chartFactory.plotChartBy(type, self.extractedData, self.selectedYear(), self.chartId, self.panelId, data);
          }
      };

      self.forwardYear = function() {

        self.selectedYear(self.selectedYear() + 1);
        self.chartFactory.plotChartBy(type, self.extractedData, self.selectedYear(), self.chartId, self.panelId, data);
      };

      self.backwardYear = function() {

        self.selectedYear(self.selectedYear() - 1);
        self.chartFactory.plotChartBy(type, self.extractedData, self.selectedYear(), self.chartId, self.panelId, data);
      };
    };

    return viewmodel;
  });