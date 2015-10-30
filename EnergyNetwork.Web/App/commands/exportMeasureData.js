define([
    'services/routeconfig'
],
  function (routeconfig) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {
          var contextId;
          if (dataContext.entityType.shortName === "NetworkCompany") {
            contextId = dataContext.networkCompanyId();
          } else {
            contextId = dataContext.networkId();
          }
          $.fileDownload(routeconfig.exportMeasureDataByUrl, {
            type: 'GET',
            data: { id: contextId }
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