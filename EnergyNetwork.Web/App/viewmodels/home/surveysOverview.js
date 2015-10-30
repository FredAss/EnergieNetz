define([
    'plugins/dialog',
    'viewmodels/home/surveyEdit'
  ],
  function(dialog, surveyEditViewModel) {

    var viewmodel = function(model, network) {
      var self = this;
      self.title = "";
      self.parentId = ko.observable();
      self.collapseId = breeze.core.getUuid();
      self.panelId = breeze.core.getUuid();
      self.model = model;
      self.network = network;

      self.attached = function() {
        selectLastTab();

        self.network().endDate.subscribe(function () {
          selectLastTab();
        });

        self.network().startDate.subscribe(function () {
          selectLastTab();
        });

        function selectLastTab() {
          $('#' + self.collapseId + ' a:last').tab('show');
        }
      };

      self.openSurveyCommand = ko.asyncCommand({
        execute: function(dataContext, complete) {
          dialog.show(new surveyEditViewModel(dataContext));
        },
        canExecute: function(isExecuting) {
          return true;
        }
      });

    };

    return viewmodel;
  });