define([
    'services/unitofwork',
    'plugins/router',
    'viewmodels/home/changeLog',
    'commands/openCompanyEditDialog',
    'commands/openUserAddToCompanyDialog',
    'commands/exportCompanyData'
  ],
  function (unitofwork, router, changeLogViewModel, openCompanyEditDialogCommand, openUserAddToCompanyDialogCommand, exportCompanyDataCommand) {

    var networkCompanies = ko.observableArray();

    var childRouter = router.createChildRouter()
      .makeRelative({
        moduleId: 'viewmodels',
        fromParent: true
      }).map([
        { route: 'network/:networkid/company/:companyid', moduleId: 'home/company', title: 'Unternehmen', nav: false },
      ]).buildNavigationModel();

    var viewmodel = {
      router: childRouter,
      convertRouteToHash: router.convertRouteToHash,
      selectedItem: ko.observable(null),
      fladdvisible: ko.observable(false),
      networkCompanies: networkCompanies,
      changeLogViewModel: changeLogViewModel,
      submenu: ko.observable(),
      canActivate: function() {
        var self = this;
        return self.loadNetworkCompany().then(function() {
          return true;
        });
      },

      activate: function() {
        var self = this;
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });

        var path = window.location.pathname;
        if (typeof path != 'undefined') {
          var parts = path.split("/");


          function changeContext(dataContext) {

            var buttonLabel;
            var submenuCommands = [];

            if (dataContext !== null) {

              buttonLabel = dataContext.company().name;
              submenuCommands.push({
                label: 'edit',
                icon: 'glyphicon glyphicon-pencil',
                command: function () {
                  self.openCompanyEditDialog(dataContext.company());
                }
              }, {
                label: 'inviteUser',
                icon: 'glyphicon glyphicon-user',
                command: function () {
                  self.openUserAddDialog(dataContext.company());
                }
              }, {
                label: 'downloadCompanyData',
                icon: 'glyphicon glyphicon-download',
                command: function () {
                  self.exportCompanyData(dataContext);
                }
              });

              var submenu = {
                buttonLabel: buttonLabel,
                commands: submenuCommands
              };
              self.submenu(submenu);
            } else {
              self.submenu(null);
            }
          };

          self.selectedItem.subscribe(changeContext);

          if (parts.length >= 6) {
            var networkCompanyId = parts[6];

            var networkCompany = _.find(networkCompanies(), function (networkCompany) {
              return networkCompany.networkCompanyId() === networkCompanyId;
            });

            self.selectedItem(networkCompany);
          } else {
            var networkCompany = networkCompanies()[0];
            self.selectedItem(networkCompany);
            self.router.navigate('user/dashboard/network/' + networkCompany.networkId() + '/company/' + networkCompany.networkCompanyId());
          }
         
        }
      },

      openCompanyEditDialog: null,
      openUserAddDialog: null,
      exportCompanyData: null,

      attached: function () {
        Stashy.OffCanvas("#dashboard .st-offcanvas", {
          closeOnClickOutside: true
        }).layout();

        $("#dashboard .st-offcanvas").animate({ opacity: 1 }, 500);

        $('#dashboard .st-offcanvas-menu').click(function (event) {
          event.stopPropagation();
        });
        $('#dashboard .st-offcanvas-additional').click(function (event) {
          event.stopPropagation();
        });
      },

      loadNetworkCompany: function() {
        var self = this;
        var query = unitofwork.networkCompanyRepository.all().then(function(data) {
          networkCompanies(data);
        });

        return Q.all([query]).fail(self.handleError);
      },

      changeSelectedNetwork: function (network) {
        var self = this;
        if (self.selectedItem() != network) {
          self.router.navigate('user/dashboard/network/' + network.networkId() + '/company/' + network.networkCompanyId());
        }
      }

    };

    viewmodel.openCompanyEditDialog = new openCompanyEditDialogCommand(viewmodel);
    viewmodel.openUserAddDialog = new openUserAddToCompanyDialogCommand(viewmodel);
    viewmodel.exportCompanyData = new exportCompanyDataCommand(viewmodel);

    return viewmodel;
  });