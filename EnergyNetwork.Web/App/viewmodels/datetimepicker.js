define([
    'durandal/system',
    'datetimepicker'
  ],
  function (system, datetimepicker) {

    var viewmodel = function(label, options, date) {
      var self = this;
      self.id = ko.observable(breeze.core.getUuid());
      self.label = ko.observable(label);
      self.options = options;
      self.options.defaultDate = date();
      self.date = date;

      self.attached = function(view, parent) {
        self.initializeView();
      };

      self.initializeView = function() {
        $('#' + self.id()).datetimepicker(self.options);
        $('#' + self.id()).on("dp.change", function(event) {
          changeDate(event);
        });
      };

      function changeDate(event) {
        self.date(event.date['_d']);
      }
    };

    return viewmodel;
  });