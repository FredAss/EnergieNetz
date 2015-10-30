define([
    'services/errorhandler',
    'viewmodels/home/importantTopic',
    'commands/addImportantTopic',
    'commands/deleteImportantTopic'
  ],
  function(errorhandler, importantTopicViewModel, addImportantTopicCommand, deleteImportantTopicCommand) {

    var viewmodel = function(survey) {
      var self = this;
      self.survey = survey;
      self.importantTopics = survey.importantTopics;
      self.importantTopicViewModels = ko.observableArray();
      self.deleteImportantTopicCommand = new deleteImportantTopicCommand(self);
      self.addImportantTopicCommand = new addImportantTopicCommand(self);

      self.isValid = ko.computed(function() {
        var hasErrors = false;
        _.forEach(self.importantTopics(), function(importantTopic) {
          if (importantTopic.hasValidationErrors())
            hasErrors = true;
        });
        return !hasErrors;
      });

      self.isFilled = ko.computed(function() {
        return self.importantTopics().length > 0;
      });

      self.activate = function() {
        if (self.importantTopicViewModels().length > 0)
          return;
        _.forEach(self.importantTopics(), function(importantTopic) {
          self.importantTopicViewModels.push(new importantTopicViewModel(importantTopic, survey, self.deleteImportantTopicCommand));
        });
      };

    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });