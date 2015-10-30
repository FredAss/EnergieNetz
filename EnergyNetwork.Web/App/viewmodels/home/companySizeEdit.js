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
      self.model = model() !== null ? model : ko.observable(createCompanySize());

      self.isValid = ko.computed(function() {
        return !self.model().hasValidationErrors();
      });

      self.isFilled = ko.computed(function() {
        return self.model().numberOfEmployees() > 0 && self.model().totalRevenue() > 0 && self.model().totalEnergyCosts() > 0;
      });

      function createCompanySize() {
        var newCompanySize = unitofwork.companySizeRepository.create();
        survey.companySize(newCompanySize);
        return newCompanySize;
      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });