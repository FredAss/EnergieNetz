define([
    'plugins/router',
    'commands/deleteInvitation'
  ],
  function(router, deleteInvitationCommand) {

    var viewmodel = {
      usersGroupedByRole: ko.observableArray(),
      openInvitations: ko.observable(),
      companies: ko.observableArray(),

      activate: function () {
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
      },

      getCompanyName: function(companyId) {
        var self = this;
        if (companyId === "")
          return "";
        var company = _.find(self.companies(), function(company) {
          return company.companyId() === companyId;
        });
        return company.name();
      },

      routeToUser: function (user) {
        router.navigate('admin/usermanagement/user/' + user.id);
      },

      deleteInvitation: null

    };

    viewmodel.deleteInvitation = new deleteInvitationCommand(viewmodel);

    return viewmodel;
  });