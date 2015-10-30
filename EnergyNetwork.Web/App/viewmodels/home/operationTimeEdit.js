define([
    'plugins/router',
    'services/errorhandler',
    'services/helpers',
    'services/unitofwork'
  ],
  function(router, errorhandler, helpers, unitofwork) {

    var viewmodel = function(model, survey) {
      var self = this;
      self.survey = survey;
      self.model = model() !== null ? model : ko.observable(createOperationTime());
      self.isValid = ko.computed(function() {
        return !self.model().hasValidationErrors();
      });

      function createOperationTime() {
        var newOperationTime = unitofwork.operationTimeRepository.create();
        survey.operationTime(newOperationTime);
        return newOperationTime;
      };

    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });