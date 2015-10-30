define([
    'services/errorhandler',
    'lodash',
    'services/routeconfig',
    'services/appsecurity'
  ],
  function(errorhandler, _, routeconfig, appsecurity) {

    var viewmodel = function(model, survey, del) {
      var self = this;
      self.model = model;
      self.inDatabase = ko.observable(self.model.documentContentId() !== null);
      self.survey = survey;
      self.del = del;
      self.newFile = ko.observable(null);
      self.clearFile = ko.observable(false);
      self.isValid = ko.computed(function() {
        var hasErrors = !self.inDatabase();
        if (self.newFile() !== null) {
          hasErrors = self.newFile().size > 50000000;
        }
        return !hasErrors;
      });

      self.removeFile = function() {
        if (self.model.documentContentId() !== null) {
           self.clearFile(true);
        }

          self.newFile(null);
          self.model.fileName(null);
          self.inDatabase(false);
      };

      self.hasDocument = ko.computed(function () {
          return self.model.documentContentId() !== null;
      });

      self.fileDownload = function() {
        $.fileDownload(routeconfig.getFileByUrl, {
          type: 'GET',
          data: { id: self.model.documentContentId() }
        });
      };

      self.attached = function() {
        self.newFile.extend({fileSize: true});

        $('#' + self.model.documentId()).on("change", function () {
            if (this.files.length > 0) {
                var file = this.files[0];
                self.newFile(file);
                self.model.fileName(file.name);
                self.clearFile(false);
            }
        });
      };

      self.getQuery = function () {
          if (self.newFile() !== null) {;
            self.clearFile(false);
            if (self.model.documentContentId() !== null) {
                  return [removeFile(self.model.documentContentId()), saveFile()];
              } else {
                  return [saveFile()];
              }
          } else if (self.clearFile() === true) {
            self.clearFile(false);
              var contentToRemove = self.model.documentContentId();
              self.model.documentContentId(null);
              return [removeFile(contentToRemove)];
          }

          function saveFile() {
              var data = new FormData();
              data.append("file", self.newFile());

               return $.ajax({
                   url: routeconfig.saveFileUrl,
                   type: "POST",
                   contentType: false,
                   processData: false,
                   data: data,
                   headers: appsecurity.getSecurityHeaders()
              }).done(function (documentContentId) {
                self.model.documentContentId(documentContentId);
                 self.inDatabase(true);
               });
          }

          function removeFile(documentContentId) {
              return $.ajax({
                  url: routeconfig.removeFileUrl,
                  type: "GET",
                  data: { id: documentContentId },
                  headers: appsecurity.getSecurityHeaders()
              });
          }
      };

      self.openFileDialog = function(viewmodel, e) {
        if ($(e.target).siblings("input").length === 1) {
          $(e.target).siblings("input").click();
        }
        else {
          $(e.target).parent().siblings("input").click();
        }
      }

    };

    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });