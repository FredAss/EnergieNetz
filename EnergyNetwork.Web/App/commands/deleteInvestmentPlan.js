define([
    'services/unitofwork',
    'bootbox',
    'plugins/router'
],
  function (unitofwork, bootbox, router) {

    var command = function (viewmodel) {
      var self = this;

      var cmd = ko.asyncCommand({
        execute: function (complete) {

          bootbox.confirm(language.getValue('delete_confirmationMessage'), function (result) {
            if (result) {
              delInvestmentPlan();
            }
            complete();
          });

        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      function delInvestmentPlan() {
        var investmentPlan = viewmodel.model;
        for (var i = investmentPlan.comparisons().length - 1; i >= 0; i--) {
          unitofwork.manager.detachEntity(investmentPlan.comparisons()[i]);
        }
        investmentPlan.entityAspect.setDeleted();
        
        unitofwork.commit().done(function () {
          router.navigate('utilities/investmentmanagement/investmentplans');
          location.reload();
        });
      }

      return cmd;
    };

    return command;
  });