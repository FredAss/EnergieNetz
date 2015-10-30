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
      self.model = model() !== null ? model : ko.observable(createFiscalYear());

      function createFiscalYear() {
        var newFiscalYear = unitofwork.fiscalYearRepository.create();
        survey.fiscalYear(newFiscalYear);
        return newFiscalYear;
      };

    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });