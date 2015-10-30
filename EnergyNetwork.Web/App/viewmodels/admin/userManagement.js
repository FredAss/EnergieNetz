define([
    'durandal/app',
    'services/appsecurity',
    'services/unitofwork',
    'viewmodels/admin/user',
    'viewmodels/admin/users',
    'lodash',
    'services/helpers',
    'plugins/router',
    'commands/openUserAddDialog'
  ],
  function(app, appsecurity, unitofwork, userViewModel, usersViewModel, _, helpers, router, openUserAddDialogCommand) {

    var openInvitations = ko.observableArray();

    
    var viewmodel = {
      roles: ko.observableArray(),
      usersGroupedByRoles: ko.observableArray(),
      nonCollapsedRoles: ko.observableArray(),
      companies: ko.observableArray(),
      filterOptions: ko.observableArray([language.getValue('notEnabled')]),
      selectedRole: ko.observable("all"),
      selectedFilters: ko.observableArray(),
      searchText: ko.observable(""),
      selectedItem: ko.observable(""),
      selectedUser: ko.observable(""),
      usersViewModel: usersViewModel,
      canShowCompanyEditButton: ko.observable(false),
      mouseOverCompany: ko.observable(""),
      openInvitations: openInvitations,

      canActivate: function() {
        var self = this;
        if (self.roles().length > 0) {
          return true;
        } else {
          return Q.all([self.loadRoles(), self.loadCompanies(), self.loadOpenInvitations(), self.loadUsersGroupedByRoles()]).then(function() {
            return true;
          });
        }
      },

      activate: function() {
        var self = this;
        ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
        var path = window.location.pathname;
        if (path !== null && typeof path != 'undefined') {
          var parts = path.split("/");
          if (parts.length === 5) {
            var userId = parts[4];
            var sRole,
              sUser;
            _.forEach(self.usersGroupedByRoles(), function(role) {
              sRole = role;
              sUser = _.find(role.users, function(user) {
                return user.id === userId;
              });
              if (sUser) {
                return false; //break
              }
            });
            if (sUser) {
              self.selectedRole(sRole);
              self.selectedUser(new userViewModel(sUser, self.roles, self.companies));
            } else {
              navigateToUsers();
            }
          } else {
            navigateToUsers();
          }
        } else {
          navigateToUsers();
        }

        function navigateToUsers() {
          self.selectedUser("");
          self.usersViewModel.usersGroupedByRole([]);
          self.usersViewModel.usersGroupedByRole(self.usersGroupedByRoles());
          self.selectedRole('all');
          router.navigate("admin/usermanagement/users");
        }
      },

      attached: function() {
        var self = this;
        self.initializeView();

        self.selectedFilters.subscribe(function(newValue) {
          if (newValue.length > 0) {
            _.forEach(newValue, function(filter) {
              self.addFilter(filter);
            });
          } else {
            self.addFilter('remove');
          }
        });

        app.on('Event:_eventRoleOfUserChanged').then(function() {
          self.loadUsersGroupedByRoles();
        });
      },

      initializeView: function() {
        Stashy.OffCanvas("#userpanel .st-offcanvas", {
          closeOnClickOutside: true
        }).layout();
        $("#userpanel .st-offcanvas").animate({ opacity: 1 }, 500);
        $('#userpanel .st-offcanvas-menu').click(function(event) {
          event.stopPropagation();
          if ($(event.target).hasClass('glyphicon-filter') || $(event.target).hasClass('multiselect')) {
            $(event.target).closest($(".btn-group")).toggleClass("open");
          }
        });

        var multiSelectConfig = {
          templates: {
            button: '<button type="button" class="multiselect dropdown-toggle btn-sm pull-right tools filter" data-toggle="dropdown">' +
              '<span class="glyphicon glyphicon-filter"></span>' +
              '</button>'
          },
          dropRight: true
        };

        $('.multiselect').multiselect(multiSelectConfig);
      },

      loadOpenInvitations: function() {
        var self = this;
        var invitations = unitofwork.invitationRepository.all().then(function(data) {
          self.openInvitations(data);
          self.usersViewModel.openInvitations = self.openInvitations;
        });
        return invitations;
      },

      loadUsersGroupedByRoles: function() {
        var self = this;
        var ugbr = appsecurity.getUsersGroupedByRoles().then(function(usersGroupedByRoles) {
          _.forEach(usersGroupedByRoles, function(role) {
            role.users = _.sortBy(role.users, _.property('userName'));
            role.filteredUsers = ko.computed(function () {
              if (self.searchText().length > 0 || self.selectedFilters()) {
                return ko.utils.arrayFilter(role.users, function(user) {
                  return self.searchForUser(self, user);
                });
              }
            });
          });
          self.usersGroupedByRoles(usersGroupedByRoles);
          self.usersViewModel.usersGroupedByRole(self.usersGroupedByRoles());
        });
        return ugbr;
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

      hideUser: helpers.hideElementInNavBar,

      showUser: helpers.showElementInNavBar,

      loadRoles: function() {
        var self = this;
        var roles = appsecurity.getRoles().then(function(roles) {
          self.roles(roles);
        });
        return roles;
      },

      loadCompanies: function() {
        var self = this;
        var companies = unitofwork.companyRepository.all("name", "Address").then(function(data) {
          self.companies(data);
          self.usersViewModel.companies(self.companies());
        });
        return companies;
      },


      addFilter: function(type) {
        var self = this;
        switch (type) {
          case language.getValue('notEnabled'):
            $('.filter').removeClass('tools');
            break;
          case 'remove':
            $('.filter').addClass('tools');
            break;
        }
      },

      changeSelectedRole: function(data, parent) {
        var self = this;

        if (self.selectedRole() != data) {
          self.selectedUser("");
          self.usersViewModel.usersGroupedByRole([]);
          self.usersViewModel.usersGroupedByRole(data === 'all' ? self.usersGroupedByRoles() : data);
          self.selectedRole(data);
          router.navigate('admin/usermanagement/users');
        }
        if (_.contains(self.nonCollapsedRoles(), data)) {
          self.nonCollapsedRoles.remove(data);
        } else {

          self.nonCollapsedRoles.push(data);
        }
      },

      changeSelectedUser: function(data, parent) {
        var self = this;
        if (self.selectedRole() != parent) {
          self.selectedRole(parent);
        }
        //self.selectedUser(new userViewModel(data, self.roles, self.companies));
        router.navigate('admin/usermanagement/user/' + data.id);
      },

      canShowUsers: function(data) {
        var self = this;
        if (_.contains(self.nonCollapsedRoles(), data)) {
          return true;
        }
        return false;
      },

      searchForUser: function(self, user) {
        var searchText = self.searchText().toLowerCase();

        var searchTextIsInUserName = (_.contains(user.userName.toLowerCase(), searchText) || _.contains(user.firstName.toLowerCase(), searchText) || _.contains(user.lastName.toLowerCase(), searchText));

        var company = _.find(self.companies(), function(company) {
          return company.companyId() == user.companyId;
        });

        var searchTextIsInUsersCompanyName = (company && _.contains(company.name().toLowerCase(), searchText));

        var filterMatchesUser = _.every(self.selectedFilters(), function(filter) {
          if (filter === language.getValue('notEnabled')) {
            return user.activated === false;
          }
          return false;
        });

        return (searchTextIsInUserName || searchTextIsInUsersCompanyName) && filterMatchesUser;

      },

      hideElement: helpers.hideElementInNavBar,

      showElement: helpers.showElementInNavBar,

    };

    viewmodel.openUserAddDialog = new openUserAddDialogCommand(viewmodel, function(invitations) {
      _.forEach(invitations(), function(invitation) {
        viewmodel.openInvitations.push(invitation);
      });

    });

    return viewmodel;
  });