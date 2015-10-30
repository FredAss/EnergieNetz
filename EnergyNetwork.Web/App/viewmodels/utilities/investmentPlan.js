define([
    'services/unitofwork',
    'plugins/router'
  ],
  function(unitofwork, router) {

    var viewmodel = function() {
      var self = this;
      this.model = ko.observable();
      this.activate = function(investmentPlanId) {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });


        var investmentPlan = unitofwork.investmentPlanRepository.withId(investmentPlanId)
          .then(self.model);
        return Q.all([investmentPlan]).fail(self.handleError);

      };

      this.attached = function() {
        self.initializeView();
      };
      this.initializeView = function() {
        self.initializeTable();
      };

      this.goto = function(comparison) {
        router.navigate('utilities/investmentmanagement/investmentplan/' + comparison.investmentPlan().investmentPlanId() + '/comparison/' + comparison.comparisonId());
      };

      this.initializeTable = function() {
        $("#investmentPlanTable").tablesorter({
          // this will apply the bootstrap theme if "uitheme" widget is included
          // the widgetOptions.uitheme is no longer required to be set
          theme: "bootstrap",
          widthFixed: true,
          headers: {
            3: { sorter: "savings" },
            5: { sorter: false } //disbale sorting
          },
          headerTemplate: '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!
          // widget code contained in the jquery.tablesorter.widgets.js file
          // use the zebra stripe widget if you plan on hiding any rows (filter widget)
          widgets: ["zebra", "uitheme", "resizable"],
          widgetOptions: {
            zebra: ["even", "odd"],
          }
        });
      };


    };
    return viewmodel;
  });