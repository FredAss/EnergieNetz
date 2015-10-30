define([
    'viewmodels/datetimepicker',
    'lodash',
    'commands/cancel',
    'commands/deleteComparison',
    'commands/saveComparison'
  ],
  function(dateTimePickerViewModel, _, cancelCommand, deleteComparisonCommand, saveComparisonCommand) {

    var viewmodel = function(model, base) {
      var self = this;
      self.model = model;
      self.title = self.model.entityAspect.entityState.name === "Added" ? language.getValue('newComparison') : language.getValue('editComparison');
      self.base = base;
      self.cancel = new cancelCommand(self);
      self.del = new deleteComparisonCommand(self);
      self.save = new saveComparisonCommand(self);

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

      var startYearTimePicker = new dateTimePickerViewModel('Startjahr', dateTimePickerOptions, self.base.startYear);
      self.startYearTimePicker = ko.observable(startYearTimePicker);
    };

    return viewmodel;
  });