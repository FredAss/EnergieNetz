define([
    'services/routeconfig'
],
  function (routeconfig) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          $.fileDownload(routeconfig.exportCompanyDataByUrl, {
            type: 'GET',
            data: { id: dataContext.networkCompanyId() }
          });

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