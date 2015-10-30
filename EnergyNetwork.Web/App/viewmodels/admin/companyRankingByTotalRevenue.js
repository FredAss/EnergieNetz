define([
    'plugins/dialog'
  ],
  function(dialog) {

    var viewmodel = function(model) {
      var self = this;
      self.model = model;
      self.id = breeze.core.getUuid();
      self.tabpanelId = breeze.core.getUuid();
      self.attached = function() {
        $('#' + self.tabpanelId + ' a:last').tab('show');
      };
    };
    return viewmodel;
  });