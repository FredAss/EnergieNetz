define([
    'services/errorhandler'
  ],
  function(errorhandler) {

    var viewmodel = function(model, survey, del) {
      var self = this;
      self.survey = survey;
      self.model = model;
      self.del = del;

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });