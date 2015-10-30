define([
    'services/errorhandler',
    'viewmodels/home/document',
    'commands/deleteDocument',
    'commands/addDocument'
  ],
  function(errorhandler, documentViewModel, deleteDocumentCommand, addDocumentCommand) {

    var viewmodel = function(survey) {
      var self = this;
      self.survey = survey;
      self.documents = survey.documents;
      self.documentViewModels = ko.observableArray();

      self.isValid = ko.computed(function() {
        var hasErrors = false;

        _.forEach(self.documents(), function(document) {
          if (document.hasValidationErrors())
            hasErrors = true;
        });

        _.forEach(self.documentViewModels(), function (documentViewModel) {
          if (!documentViewModel.isValid())
            hasErrors = true;
        });

        return !hasErrors;
      });

      self.isFilled = ko.computed(function() {
        return self.documents().length > 0;
      });

      self.activate = function() {
        if (self.documentViewModels().length > 0)
          return;
        _.forEach(self.documents(), function(document) {
          self.documentViewModels.push(new documentViewModel(document, survey, self.deleteDocumentCommand));
        });
      };

      self.deleteDocumentCommand = new deleteDocumentCommand(self);
      self.addDocumentCommand = new addDocumentCommand(self);

      self.getFileQueries = function () {
          var queries = [];
          _.forEach(self.documentViewModels(), function(documentViewModel) {
            var q = documentViewModel.getQuery();
            _.forEach(q, function(query) {
              queries.push(query);
            });
          });
          return queries;
      }

    };
    errorhandler.includeIn(viewmodel);

    viewmodel["errors"] = ko.validation.group(viewmodel);

    return viewmodel;
  });