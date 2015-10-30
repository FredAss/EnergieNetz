define([
    'plugins/dialog',
    'services/logger',
    'services/unitofwork',
    'services/extractChartData',
    'factories/chartFactory',
    'viewmodels/home/chartDetail'
  ],
  function(dialog, logger, unitofwork, extractChartData, chartFactory, chartDetailsViewModel) {

    var viewmodel = function(title, type, data, parent) {
      var self = this;
      self.title = title;
      self.chartId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.collapseId = breeze.core.getUuid();
      self.chartFactory = new chartFactory();
      self.extractedData = extractChartData.extractChartData(data, type);

      self.attached = function(view, parent) {
          if ($("#" + self.chartId).width() !== 0) {
              self.chartFactory.plotChartBy(type, self.extractedData, null, self.chartId, self.panelId, data);
          }
      };

      self.showDetails = function() {
        switch (parent.entityType.shortName) {
          case 'NetworkCompany':
            unitofwork.networkCompanyRepository.networkCompanyChartDataDetailsBy(parent.networkCompanyId(), type).then(function(data) {
              showDialog(data);
            });
            break;
          case 'Network':
            unitofwork.networkRepository.networkChartDataDetailsBy(parent.networkId(), type).then(function(data) {
              showDialog(data);
            });
            break;
        }
      };

      function showDialog(tableData) {
        return dialog.show(new chartDetailsViewModel(title, type, data, tableData)).then(function(dialogResult) {

        });
      }
    };

    return viewmodel;
  });