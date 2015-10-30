define([
    'services/unitofwork',
    'plugins/router',
    'viewmodels/utilities/investmentPlans',
    'services/helpers',
    'commands/openInvestmentPlanAddDialog',
    'commands/openInvestmentPlanEditDialog',
    'commands/openComparisonEditDialog',
    'commands/openComparisonAddDialog'
  ],
  function(unitofwork,
           router,
           investmentPlansViewModel,
           helpers,
           openInvestmentPlanAddDialogCommand,
           openInvestmentPlanEditDialogCommand,
           openComparisonEditDialogCommand,
           openComparisonAddDialogCommand
  ) {
    var searchText = ko.observable("");
    var investmentPlans = ko.observableArray();
    var companies = ko.observableArray();
    var filterComparisons = function(comparisons, searchText) {
      return _.filter(comparisons, function(comparison) {
        var query = searchText.toLowerCase();
        if (_.contains(comparison.investmentPlan().investmentName().toLowerCase(), query)) {
          return true;
        }
        if (_.contains(comparison.comparisonName().toLowerCase(), query)) {
          return true;
        }
        return false;
      });
    };

    var filteredInvestmentPlans = ko.computed(function () {
      var sortedInvestmentPlans = _.sortBy(investmentPlans(), function(investmentPlan) {
        investmentPlan.filteredComparisons = ko.computed(function () {
          var filteredComparisons = filterComparisons(investmentPlan.comparisons(), searchText());
          return _.sortBy(filteredComparisons, function(comparison) {
            if (comparison.comparisonName() === null) {
              return "";
            }
            return comparison.comparisonName();
          });
        });
        return investmentPlan.investmentName().toLowerCase();
      });
      return _.filter(sortedInvestmentPlans, function(plan) {
        return (_.contains(plan.investmentName().toLowerCase(), searchText().toLowerCase())
                || plan.filteredComparisons().length > 0);
      });
    });

    var childRouter = router.createChildRouter()
      .makeRelative({
        moduleId: 'viewmodels',
        fromParent: true
      }).map([
        { route: 'investmentplan/:investmentplanid', moduleId: 'utilities/investmentPlan', title: 'Investition', nav: false },
        { route: 'investmentplan/:investmentplanid/comparison/:comparisonid', moduleId: 'utilities/comparison', title: 'Vergleich', nav: false },
        { route: 'investmentplans', moduleId: 'utilities/investmentPlans', title: 'Investitionen', nav: false }
      ]).buildNavigationModel();

    var canActivate = function() {
      return loadData().then(function() {
        return true;
      });
    };

    var loadData = function() {
      var investmentPlansQuery = unitofwork.investmentPlanRepository.all(null, 'Company, Comparisons').then(function(investments) {
        investmentPlans(investments);
      });
      var companiesQuery = unitofwork.companyRepository.all().then(function(cs) {
        companies(cs);
      });
      return Q.all([investmentPlansQuery, companiesQuery]).fail(this.handleError);
    };

    var nonCollapsedInvestmentPlans = ko.observableArray();


    var viewmodel = {
      router: childRouter,
      convertRouteToHash: router.convertRouteToHash,
      investmentPlans: investmentPlans,
      
      companies: companies,
      filteredInvestmentPlans: filteredInvestmentPlans,
      investmentPlansViewModel: investmentPlansViewModel,
      fladdvisible: ko.observable(false),
      searchText: searchText,
      backText: ko.computed(function () {
        return searchText().length;
      }),
      canActivate: canActivate,
      selectedInvestmentPlan: ko.observable(''),
      selectedComparison: ko.observable(''),
      editItem: ko.observable(),
      selectedItem: ko.observable(null),
      canShowComparisons: function(investmentPlan) {
        var self = this;
        if (_.contains(nonCollapsedInvestmentPlans(), investmentPlan)) {
          return true;
        }
        return false;
      },
      
      activate: function() {
        var self = this;
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        var path = window.location.pathname;
        if (typeof path != 'undefined') {
          var parts = path.split("/");
          var investmentPlanId;
          var investmentPlan;

          function changeContext(dataContext) {
           
            var buttonLabel;
            var commands = [];

            if (dataContext !== null) {

              switch (dataContext.entityType.shortName) {
                case 'Comparison':
                  buttonLabel = dataContext.comparisonName;
                  commands.push({
                    label: 'edit',
                    icon: 'glyphicon glyphicon-pencil',
                    command: function() {
                      self.openComparisonEditDialog(dataContext);
                    }
                  });
                  break;
                default:
                  buttonLabel = dataContext.investmentName;
                  commands.push({
                    label: 'edit',
                    icon: 'glyphicon glyphicon-pencil',
                    command: function() {
                      self.openInvestmentPlanEditDialog(dataContext);
                    }
                  });
                  commands.push({
                    label: 'addComparison',
                    icon: 'glyphicon glyphicon-copy',
                    command: function() {
                      self.openComparisonAddDialog(dataContext);
                    }
                  });
                  break;
              }

              var submenu = {
                buttonLabel: buttonLabel,
                commands: commands
              };
              self.submenu(submenu);
            } else {
              self.submenu(null);
            }
          };

          self.selectedItem.subscribe(changeContext);

          switch (parts.length) {
            case 5:
              investmentPlanId = parts[4];
              investmentPlan = _.find(investmentPlans(), function (investment) {
                return investment.investmentPlanId() === investmentPlanId;
              });

              if (!_.contains(nonCollapsedInvestmentPlans(), investmentPlan)) {
                nonCollapsedInvestmentPlans.push(investmentPlan);
              }
              self.selectedComparison('');
              self.selectedInvestmentPlan(investmentPlan);
              self.selectedItem(investmentPlan);

              break;
            case 7:
              investmentPlanId = parts[4];
              investmentPlan = _.find(investmentPlans(), function (investmentPlan) {
                return investmentPlan.investmentPlanId() === investmentPlanId;
              });
              var comparisonId = parts[6];
              var comparison = _.find(investmentPlan.comparisons(), function (comparison) {
                return comparison.comparisonId() === comparisonId;
              });
              if (!_.contains(nonCollapsedInvestmentPlans(), investmentPlan)) {
                nonCollapsedInvestmentPlans.push(investmentPlan);
              }
              self.selectedInvestmentPlan(investmentPlan);
              self.selectedComparison(comparison);
              self.selectedItem(comparison);
              break;
            default:
              self.investmentPlansViewModel.companies = self.companies;
              self.investmentPlansViewModel.investmentPlans = self.investmentPlans;
              self.router.navigate('utilities/investmentmanagement/investmentplans');
              break;
          }
        }
      },

      attached: function(view, parent) {
        var self = this;
        Stashy.OffCanvas("#investmentPlan .st-offcanvas", {
          closeOnClickOutside: true
        }).layout();

        $("#investmentPlan .st-offcanvas").animate({ opacity: 1 }, 500);
        $('#investmentPlan .st-offcanvas-menu').click(function (event) {
            event.stopPropagation();
        });
      },

      compositionComplete: function (view, parent) {
        var self = this;
        nonCollapsedInvestmentPlans.removeAll();
        self.activate();
      },

      evaluateKey: function() {
        if (event.type == "keypress" && event.keyCode == 13) {
          this.searchInvestmentPlans(false);
        }
        return true;
      },

      changeSelectedInvestmentPlan: function(investmentPlan) {
        var self = this;

          if (investmentPlan === 'all') {
              self.router.navigate('utilities/investmentmanagement/investmentplans');
              self.selectedItem(null);
              self.selectedInvestmentPlan(null);
              return;
          }

        if (self.selectedItem() != investmentPlan) {
          self.router.navigate('utilities/investmentmanagement/investmentplan/' + investmentPlan.investmentPlanId());
        } else {
          if (_.contains(nonCollapsedInvestmentPlans(), investmentPlan)) {
            nonCollapsedInvestmentPlans.remove(investmentPlan);
          } else {
            nonCollapsedInvestmentPlans.push(investmentPlan);
          }
        }
      },
      changeSelectedComparison: function(comparison) {
        var self = this;
        if (self.selectedComparison() != comparison) {
          self.router.navigate('utilities/investmentmanagement/investmentplan/' + comparison.investmentPlan().investmentPlanId() + '/comparison/' + comparison.comparisonId());
        }
      },
      openInvestmentPlanAddDialog: null,

      openInvestmentPlanEditDialog: null,

      openComparisonEditDialog: null,

      openComparisonAddDialog: null,

      submenu: ko.observable(),

      hideElement: helpers.hideElementInNavBar,

      showElement: helpers.showElementInNavBar,

    };

    viewmodel.openInvestmentPlanAddDialog = new openInvestmentPlanAddDialogCommand(viewmodel, function (investmentPlan) {
      if (investmentPlan.entityAspect.entityState != 'Detached') {
        viewmodel.investmentPlans.push(investmentPlan);
      }
    });

    viewmodel.openInvestmentPlanEditDialog = new openInvestmentPlanEditDialogCommand(viewmodel);

    viewmodel.openComparisonEditDialog = new openComparisonEditDialogCommand(viewmodel);

    viewmodel.openComparisonAddDialog = new openComparisonAddDialogCommand(viewmodel);

    return viewmodel;

  });