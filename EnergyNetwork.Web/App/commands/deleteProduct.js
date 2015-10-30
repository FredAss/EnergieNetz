define([
],
  function () {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          dataContext.model.entityAspect.setDeleted();

          viewmodel.productViewModels.remove(dataContext);

          complete();

        },
        canExecute: function (isExecuting) {
          return true;
        }
      });

      return cmd;

    };

    return command;
  });