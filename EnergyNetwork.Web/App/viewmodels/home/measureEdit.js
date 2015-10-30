define([
    'services/errorhandler',
    'lodash',
    'viewmodels/home/energySaving',
    'viewmodels/optionselector',
    'viewmodels/datetimepicker',
    'commands/saveMeasure',
    'commands/cancel',
    'commands/deleteMeasure',
    'commands/deleteEnergySaving',
    'commands/addEnergySaving'
  ],
  function(errorhandler, _, energySavingViewModel, optionselector, dateTimePickerViewModel, saveMeasureCommand, cancelCommand, deleteMeasureCommand, deleteEnergySavingCommand, addEnergySavingCommand) {

    var viewmodel = function(model, measureStates, energySources) {
      var self = this;

      self.model = model;
      self.displayName = self.model.entityAspect.entityState.name === "Added" ? language.getValue('addMeasure') : language.getValue('editMeasure');
      
      self.canShowDeleteButton = ko.observable(self.model.entityAspect.entityState != 'Added');

      self.saveChangesCommand = new saveMeasureCommand(self);
      self.cancelChangesCommand = new cancelCommand(self);
      self.deleteCommand = new deleteMeasureCommand(self);
      self.addEnergySavingCommand = new addEnergySavingCommand(self);

      var stateselector = new optionselector(language.getValue('status'), measureStates, 'title', 'id', self.model.state().id());
      self.stateselector = ko.observable(stateselector);
      stateselector.selectedValue.subscribe(function(newValue) {
        var value = _.find(measureStates, function(state) {
          return state.id() === newValue;
        });

        self.model.state(value);
      });

      var dateTimePickerOptions = {
        pickTime: false,
        todayBtn: true,
        showToday: true,
        viewMode: "months",
        minViewMode: "months",
        language: window.language.languageString(),
        format: 'MMMM YYYY',
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down"
        }
      };

      var startDateTimePicker = new dateTimePickerViewModel(language.getValue('start'), dateTimePickerOptions, self.model.relatedDuration);
      self.startDateTimePicker = ko.observable(startDateTimePicker);

      self.energySources = ko.observableArray(energySources);
      self.energySavingViewModels = ko.observableArray();

      self.activate = function() {
        _.forEach(self.model.energySavings(), function(energySaving) {
          self.energySavingViewModels.push(new energySavingViewModel(energySaving, self.energySources, new deleteEnergySavingCommand(self)));
        });
      };

      self.attached = function(view, parent) {
        self.initializeView();
      };

      self.initializeView = function() {

      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;

  });