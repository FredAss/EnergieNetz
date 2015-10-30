define([
    'plugins/dialog',
    'services/appsecurity',
  ],
  function(dialog, appsecurity) {

    var viewmodel = function(model, companyId) {
      var self = this;
      self.companyId = companyId;
      self.model = model;
      self.appsecurity = appsecurity;
      self.id = breeze.core.getUuid();
      self.tabpanelId = breeze.core.getUuid();
      self.attached = function() {
        $('#' + self.tabpanelId + ' a:last').tab('show');
      };
    };
    return viewmodel;
  });