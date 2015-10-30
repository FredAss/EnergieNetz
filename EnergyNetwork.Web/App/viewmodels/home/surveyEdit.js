define([
    'services/appsecurity',
    'plugins/dialog',
    'services/errorhandler',
    'services/unitofwork',
    'services/logger',
    'bootbox',
    'viewmodels/home/companySizeEdit',
    'viewmodels/home/readingsEdit',
    'viewmodels/home/productsEdit',
    'viewmodels/home/areasEdit',
    'viewmodels/home/productionTimesEdit',
    'viewmodels/home/operationTimeEdit',
    'viewmodels/home/importantTopicsEdit',
    'viewmodels/home/documentsEdit',
    'viewmodels/home/fiscalYearEdit',
    'commands/cancel',
    'commands/saveSurvey',
    'commands/sendSurvey'
  ],
  function(appsecurity, dialog, errorhandler, unitofwork, logger, bootbox, companySizeEditViewModel, readingsEditViewModel, productsEditViewModel, areasEditViewModel, productionTimesEditViewModel, operationTimeEditViewModel, importantTopicsEditViewModel, documentsEditViewModel, fiscalYearEditViewModel, cancelCommand, saveSurveyCommand, sendSurveyCommand) {

    var viewmodel = function(model) {
      var self = this;
      self.appsecurity = appsecurity;
      self.displayName = "";
      self.model = model;
      self.currentStep = ko.observable(0);
      self.context = ko.observable(null);
      self.companySizeEditViewModel = ko.observable(new companySizeEditViewModel(model.companySize, model));
      self.readingsEditViewModel = ko.observable(new readingsEditViewModel(model.readings, model));
      self.productsEditViewModel = ko.observable(new productsEditViewModel(model.products, model));
      self.areasEditViewModel = ko.observable(new areasEditViewModel(model.areas, model));
      self.productionTimesEditViewModel = ko.observable(new productionTimesEditViewModel(model.productionTimes, model));
      self.operationTimeEditViewModel = ko.observable(new operationTimeEditViewModel(model.operationTime, model));
      self.fiscalYearEditViewModel = ko.observable(new fiscalYearEditViewModel(model.fiscalYear, model));
      self.importantTopicsEditViewModel = ko.observable(new importantTopicsEditViewModel(model));
      self.documentsEditViewModel = ko.observable(new documentsEditViewModel(model));
      self.basicDataIsFilled = ko.computed(function() {
        return (self.companySizeEditViewModel().isFilled()
                && self.areasEditViewModel().isFilled()
                && self.productsEditViewModel().isFilled()
                && self.productionTimesEditViewModel().isFilled()
            );
      }),
      self.basicDataIsValid = ko.computed(function () {
        return (self.companySizeEditViewModel().isValid()
                && self.areasEditViewModel().isValid()
                && self.productsEditViewModel().isValid()
                && self.productionTimesEditViewModel().isValid()
            );
      }),


      self.isValid = ko.computed(function() {
        return self.companySizeEditViewModel().isValid() && self.areasEditViewModel().isValid() && self.productsEditViewModel().isValid() && self.productionTimesEditViewModel().isValid() && self.operationTimeEditViewModel().isValid() && self.readingsEditViewModel().isValid() && self.importantTopicsEditViewModel().isValid() && self.documentsEditViewModel().isValid();
      });

      self.isFilled = ko.computed(function() {
        return self.companySizeEditViewModel().isFilled() && self.areasEditViewModel().isFilled() && self.productsEditViewModel().isFilled() && self.productionTimesEditViewModel().isFilled() && self.readingsEditViewModel().isFilled();
      });

      self.attached = function() {
        self.context(self.fiscalYearEditViewModel());
      };

      self.cancelChangesCommand = new cancelCommand(self);
      self.saveChangesCommand = new saveSurveyCommand(self);
      self.sendCommand = new sendSurveyCommand(self);
      self.releaseAgainSurvey = function() {
        self.model.fulfilled(false);
      };

      self.next = ko.asyncCommand({
        execute: function(complete) {
          self.currentStep((self.currentStep() + 1));
          changeContext();
          complete();
        },
        canExecute: function(isExecuting) {
          return self.currentStep() < 8 && !isExecuting;
        }
      });

      self.previous = ko.asyncCommand({
        execute: function(complete) {
          self.currentStep((self.currentStep() - 1));
          changeContext();
          complete();
        },
        canExecute: function(isExecuting) {
          return self.currentStep() > 0 && !isExecuting;
        }
      });

      self.setContext = function(contextNumber) {
        self.currentStep(contextNumber);
        changeContext();
      };

      function changeContext() {
        switch (self.currentStep()) {
          case 0:
            self.context(self.fiscalYearEditViewModel());
            break;
          case 1:
            self.context(self.companySizeEditViewModel());
            break;
          case 2:
            self.context(self.areasEditViewModel());
            break;
          case 3:
            self.context(self.productsEditViewModel());
            break;
          case 4:
            self.context(self.productionTimesEditViewModel());
            break;
          case 5:
            self.context(self.operationTimeEditViewModel());
            break;
          case 6:
            self.context(self.readingsEditViewModel());
            break;
          case 7:
            self.context(self.importantTopicsEditViewModel());
            break;
          case 8:
            self.context(self.documentsEditViewModel());
            break;
        }
      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });