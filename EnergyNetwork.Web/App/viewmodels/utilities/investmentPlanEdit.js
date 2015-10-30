define([
    'viewmodels/datetimepicker',
    'lodash',
    'commands/cancel',
    'commands/deleteInvestmentPlan',
    'commands/saveInvestmentPlan'
  ],
  function(dateTimePickerViewModel, _, cancelCommand, deleteInvestmentPlanCommand, saveInvestmentPlanCommand) {

    var viewmodel = function(model, companies) {
      var self = this;
       
      self.model = model;
      self.title = self.model.entityAspect.entityState.name === "Added" ? language.getValue('newInvestment') : language.getValue('editInvestment');
      self.cancel = new cancelCommand(self);
      self.del = new deleteInvestmentPlanCommand(self);
      self.save = new saveInvestmentPlanCommand(self);
      self.companies = companies;

      var company = _.find(companies(), function(company) {
        return company.companyId() == model.companyId();
      });

      self.selectedCompany = ko.observable(company);

      self.selectedCompany.subscribe(function(newValue) {
        if (newValue != undefined) {
          self.model.companyId(newValue.companyId());
        } else {
          self.model.companyId = null;
        }
      });
      self.attached = function() {
        $('.selectpicker').selectpicker();
      };

      var dateTimePickerOptions = {
        pickTime: false,
        todayBtn: false,
        showToday: false,
        minViewMode: "years",
        viewMode: "years",
        language: 'de',
        format: 'YYYY',
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down"
        },
      };

      var startYearTimePicker = new dateTimePickerViewModel(language.getValue('start'), dateTimePickerOptions, self.model.startYear);
      self.startYearTimePicker = ko.observable(startYearTimePicker);
    };

    return viewmodel;
  });