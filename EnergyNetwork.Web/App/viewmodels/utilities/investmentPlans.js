define([
    'plugins/router',
    'commands/openInvestmentPlanAddDialog'
],
  function (router, openInvestmentPlanAddDialogCommand) {

      var viewmodel = {
          investmentPlans: ko.observable(),
          companies: ko.observable(),
          openInvestmentPlanAddDialog: null,

          activate: function () {
              ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
          },

          routeToInvestmentPlan: function (investmentPlan) {
              router.navigate('utilities/investmentmanagement/investmentplan/' + investmentPlan.investmentPlanId());
          }
      };

      viewmodel.openInvestmentPlanAddDialog = new openInvestmentPlanAddDialogCommand(viewmodel, function (investmentPlan) {
        if (investmentPlan.entityAspect.entityState != 'Detached') {
          viewmodel.investmentPlans.push(investmentPlan);
        }
      });

      return viewmodel;
  });