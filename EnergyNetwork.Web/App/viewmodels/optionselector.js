define(['durandal/system'],
  function(system) {

    var viewmodel = function(label, options, optionsText, optionsValue, selectedValue, optionsCaption) {
      var self = this;
      self.label = ko.observable(label);
      self.options = ko.observableArray(options);
      self.optionsText = optionsText;
      self.optionsValue = optionsValue;
      self.optionsCaption = optionsCaption;
      self.selectedValue = ko.observable();

      if (selectedValue !== null) {
        self.selectedValue(selectedValue);
      }

      self.attached = function(view, parent) {
        self.initializeView();
      };

      self.initializeView = function() {
        $('.selectpicker').selectpicker();
      };
    };

    return viewmodel;
  });