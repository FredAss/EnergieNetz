define([
    'services/unitofwork',
    'services/logger',
    'services/routeconfig',
    'services/appsecurity',
    'plugins/router',
    'plugins/dialog',
    'bootbox',
    'viewmodels/admin/networks',
    'viewmodels/admin/network',
    'viewmodels/admin/networkEdit',
    'viewmodels/home/company',
    'viewmodels/home/companyEdit',
    'viewmodels/home/changeLog',
    'services/constants',
    'services/helpers',
    'services/submenuBuilder',
    'commands/openNetworkAddDialog',
    'commands/openNetworkEditDialog',
    'commands/openCompanyEditDialog',
    'commands/exportCompanyData',
    'commands/exportNetworkData'
  ],
  function(unitofwork, logger, routeconfig, appsecurity, router, dialog, bootbox, networksViewModel, networkViewModel, networkEditViewModel, companyViewModel, companyEditViewModel, changeLogViewModel, constants, helpers, submenuBuilder, openNetworkAddDialogCommand, openNetworkEditDialogCommand, openCompanyEditDialogCommand, exportCompanyDataCommand, exportNetworkDataCommand) {

    var self = this;
    self.searchText = ko.observable("");
    self.networks = ko.observableArray();
    self.filteredNetworks = ko.computed(function() {
      var sortedNetworks = _.sortBy(self.networks(), function(network) {
        network.filteredNetworkCompanies = ko.computed(function() {
          return _.sortBy(filterNetworkCompanies(network.networkCompanies(), self.searchText()), function(networkCompany) {
            if (networkCompany.company() === null) {
              return "";
            }
            return networkCompany.company().name();
          });
        });
        return network.name().toLowerCase();
      });

      return ko.utils.arrayFilter(sortedNetworks, function(network) {
        var query = self.searchText().toLowerCase();
        var hasNetworkCompanies = network.filteredNetworkCompanies().length > 0;
        var filterMatchesNetwork = _.contains(network.name().toLowerCase(), query);

        return hasNetworkCompanies || filterMatchesNetwork;
      });

      function filterNetworkCompanies(networkCompanies, searchText) {
        return ko.utils.arrayFilter(networkCompanies, function(networkCompany) {
          var query = searchText.toLowerCase();
          if (networkCompany.company() === null) {
            return false;
          }
          if (_.contains(networkCompany.network().name().toLowerCase(), query)) {
            return true;
          }
          if (_.contains(networkCompany.company().name().toLowerCase(), query)) {
            return true;
          }
          return false;
        });
      }
    });

    var childRouter = router.createChildRouter()
      .makeRelative({
        moduleId: 'viewmodels',
        fromParent: true
      }).map([
        { route: 'network/:networkid', moduleId: 'admin/network', title: language.getValue('network'), nav: false },
        { route: 'network/:networkid/company/:companyid', moduleId: 'home/company', title: language.getValue('company'), nav: false },
        { route: 'networks', moduleId: 'admin/networks', title: language.getValue('networks'), nav: false }
      ]).buildNavigationModel();

    var canActivate = function() {
      return loadNetworks().then(function() {
        return true;
      });
    };

    var loadNetworks = function() {
      var networksQuery = unitofwork.networkRepository.all().then(function(networks) {
        self.networks(networks);
        networksViewModel.networks = self.networks;
      });

      return Q.all([networksQuery]).fail(self.handleError);
    };

    var viewmodel = {
      router: childRouter,
      convertRouteToHash: router.convertRouteToHash,
      networks: networks,
      filteredNetworks: filteredNetworks,
      networksViewModel: networksViewModel,
      changeLogViewModel: changeLogViewModel,
      fladdvisible: ko.observable(false),
      searchText: searchText,
      canShowCompanyEditButton: ko.observable(false),
      mouseOverCompany: ko.observable(""),
      canActivate: canActivate,
      currentContext: ko.observable(null),
      submenu: ko.observable(),
      selectedItem: ko.observable(null),
      editItem: ko.observable(),
      activate: function() {
        var self = this;
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        var path = window.location.pathname;
        if (path !== null) {

          var parts = path.split("/");
          var networkId = parts[4];
          if (parts.length === 3) {
            return;
          } else if (parts.length === 4) {
            self.submenu(null);
            return;
          } else if (parts.length > 5) {
            var companyId = parts[6];
            self.submenu(null);
            self.setCompanyAndNetworkActive(networkId, companyId);
            var buttonLabel;
            var submenuCommands = [];

            var networkCompany;

            _.find(self.networks(), function(network) {
              _.find(network.networkCompanies(), function(nc) {
                if (nc.networkCompanyId() === companyId) {
                  networkCompany = nc;
                }
              });
            });

            buttonLabel = networkCompany.company().name;
            submenuCommands.push({
                label: 'edit',
                icon: 'glyphicon glyphicon-pencil',
                command: function() {
                  self.openCompanyEditDialog(networkCompany.company());
                }
              }, {
                label: 'downloadCompanyData',
                icon: 'glyphicon glyphicon-download',
                command: function() {
                  self.exportCompanyData(networkCompany);
                }
              }
            );

            var submenu = {
              buttonLabel: buttonLabel,
              commands: submenuCommands
            };
            self.selectedItem(networkCompany);
            self.submenu(submenu);
          } else {
            self.setNetworkActive(networkId);
            var buttonLabel;
            var submenuCommands = [];

            var network = _.find(self.networks(), function(network) {
              return network.networkId() === networkId;
            });

            buttonLabel = network.name;
            submenuCommands.push({
                label: 'edit',
                icon: 'glyphicon glyphicon-pencil',
                command: function() {
                  self.openNetworkEditDialog(network);
                }
              }, {
                label: 'downloadNetworkData',
                icon: 'glyphicon glyphicon-download',
                command: function() {
                   self.exportNetworkData(network);
                }
              }
            );

            var submenu = {
              buttonLabel: buttonLabel,
              commands: submenuCommands
            };
            self.selectedItem(network);
            self.submenu(submenu);
          }

        }
      },

      openNetworkEditDialog: null,

      openNetworkAddDialog: null,

      openCompanyEditDialog: null,

      exportCompanyData: null,

      exportNetworkData: null,

      attached: function(view, parent) {
        var self = this;

        var path = window.location.pathname;
        var companyId;
        var parts = path.split("/");
        var networkId = parts[4];
        if (parts.length <= 4) {
          $('#allNetworks').addClass('active');
          self.router.navigate('admin/networkmanagement/networks');
        } else if (parts.length > 5) {
          companyId = parts[6];
          self.setCompanyAndNetworkActive(networkId, companyId);
        } else {
          self.setNetworkActive(networkId);
        }

        Stashy.OffCanvas("#dashboard .st-offcanvas", {
          closeOnClickOutside: true
        }).layout();

        $("#dashboard .st-offcanvas").animate({ opacity: 1 }, 500);

        $('#dashboard .st-offcanvas-menu').click(function(event) {
          event.stopPropagation();
        });
        $('#dashboard .st-offcanvas-additional').click(function(event) {
          event.stopPropagation();
        });
      },

      evaluateKey: function() {
        if (event.type == "keypress" && event.keyCode == 13) {
          this.searchNetworks(false);
        }
        return true;
      },

      setCompanyAndNetworkActive: function(networkId, companyId) {
        var self = this;

        $('#' + companyId).parent().addClass("active");
        $('#' + networkId).css('height', 'auto');
        self.setNetworkActive(networkId);
      },

      setNetworkActive: function(networkId) {
        $('#allNetworks').removeClass('active');
        $('#' + networkId).parent().addClass('active');
      },

      changeSelectedItem: function(data) {
        var self = this;

        var navigateToNetwork = function() {
          self.router.navigate('admin/networkmanagement/network/' + data.networkId());
        };

        var userClickedAllNetworks = data.hasOwnProperty("__moduleId__");

        data.displayCompanies = !data.displayCompanies;


        $('#dashboard .st-offcanvas-menu li').removeClass('active');


        if (userClickedAllNetworks) {
          self.router.navigate('admin/networkmanagement/networks');
          $('#allNetworks').addClass('active');
        } else {
          switch (data.entityType.shortName) { // alternativ auch typeof data === ''
            case "Network":
              var selectedElement = $('#' + data.networkId());
              if (data.displayCompanies) {
                var autoHeight = selectedElement.css('height', 'auto').height();
                selectedElement.height(0).animate({ height: autoHeight }, 'fast', navigateToNetwork);
              } else {
                selectedElement.animate({ height: '0' }, 'fast', navigateToNetwork);
              }
              selectedElement.parent().addClass('active');
              break;
            case "NetworkCompany":
              self.setCompanyAndNetworkActive(data.networkId(), data.networkCompanyId());
              self.router.navigate('admin/networkmanagement/network/' + data.networkId() + '/company/' + data.networkCompanyId());
              break;
          }
        }
        return false;
      },

      hideElement: helpers.hideElementInNavBar,

      showElement: helpers.showElementInNavBar,
    };

    viewmodel.openNetworkEditDialog = new openNetworkEditDialogCommand(viewmodel);

    viewmodel.openNetworkAddDialog = new openNetworkAddDialogCommand(viewmodel, function (network) {
      if (network.entityAspect.entityState != 'Detached') {
        viewmodel.networks.push(network);
      }
    });

    viewmodel.openCompanyEditDialog = new openCompanyEditDialogCommand(viewmodel);

    viewmodel.exportCompanyData = new exportCompanyDataCommand(viewmodel);

    viewmodel.exportNetworkData = new exportNetworkDataCommand(viewmodel);

    return viewmodel;
  });