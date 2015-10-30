define([
    'services/routeconfig'
],
  function (routeconfig) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (dataContext, complete) {

          $.fileDownload(routeconfig.exportNetworkDataByUrl, {
            type: 'GET',
            data: { id: dataContext.networkId() }
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