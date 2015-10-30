define([
    'plugins/router',
    'lodash',
    'commands/openNetworkAddDialog'
  ],
  function(router, _, openNetworkAddDialogCommand) {

    var viewmodel = {
      networks: ko.observable(),
      currentNetworks: null,
      closedNetworks: null,
      openNetworkAddDialog: null,

      convertRouteToHash: router.convertRouteToHash,

      activate: function() {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        this.currentNetworks = ko.computed(function() {
          return _.filter(this.networks(), function(network) {
            return network.endDate() >= moment();
          });
        });
        this.closedNetworks = ko.computed(function() {
          return _.filter(networks(), function(network) {
            return network.endDate() < moment();
          });
        });
      },

      routeToNetwork: function(network) {
        router.navigate('admin/networkmanagement/network/' + network.networkId());
      }

    };

    viewmodel.openNetworkAddDialog = new openNetworkAddDialogCommand(viewmodel, function(network) {
      if (network.entityAspect.entityState != 'Detached') {
        viewmodel.networks.push(network);
      }
    });

    return viewmodel;
  });