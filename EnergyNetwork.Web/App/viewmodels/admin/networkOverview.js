define([
    'plugins/dialog',
    'services/logger',
    'lodash',
    'plugins/router'
  ],
  function(dialog, logger, _, router) {
    var viewmodel = function(network) {
      var self = this;
      self.network = network;
      self.router = router;

      self.attached = function() {
        
      };

    };

    return viewmodel;
  });