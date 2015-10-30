define([
    'plugins/dialog',
    'services/errorhandler',
    'viewmodels/home/map'
],
  function (dialog, errorhandler, mapViewModel) {

      var viewmodel = function (model) {
          var self = this;

          self.displayName = language.getValue('map');
          self.model = model;

          self.translatedFinished = ko.computed(function () {
            return language.getValue('finished');
          });

          self.attached = function (view, parent) {
              
          };

          self.showMap = function () {
              showDialog();
          };

          function showDialog() {
              return dialog.show(new mapViewModel(self.model.networkCompanies())).then(function (dialogResult) {
              });
          }

      };
      errorhandler.includeIn(viewmodel);

      return viewmodel;
  });