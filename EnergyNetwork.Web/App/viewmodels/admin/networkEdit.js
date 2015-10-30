define([
    'services/unitofwork',
    'services/errorhandler',
    'services/appsecurity',
    'lodash',
    'services/constants',
    'viewmodels/datetimepicker',
    'commands/cancel',
    'commands/deleteNetwork',
    'commands/saveNetwork'
  ],
  function(unitofwork, errorhandler, appsecurity, _, constants, dateTimePickerViewModel, cancelChangesCommand, deleteNetworkCommand, saveNetworkCommand) {

    var viewmodel = function(model) {
      var self = this;

      self.model = model;
      self.displayName = self.model.entityAspect.entityState.name === "Added" ? language.getValue('addNetwork') : language.getValue('editNetwork');
      self.cancel = new cancelChangesCommand(self);
      self.del = new deleteNetworkCommand(self);
      self.save = new saveNetworkCommand(self);
      
      self.stateOptions = ko.observableArray();
      self.networkStates = constants.NETWORK_STATES;
      self.selectedState = ko.observable();
      self.companies = ko.observableArray();

      var startDateTimePickerOptions = {
        pickTime: false,
        todayBtn: true,
        showToday: true,
        viewMode: "months",
        minViewMode: "months",
        language: window.language.languageString(),
        format: 'MMMM YYYY',
        icons: {
          time: "fa fa-clock-o",
          date: "fa fa-calendar",
          up: "fa fa-arrow-up",
          down: "fa fa-arrow-down"
        },
      };
      var startDateTimePicker = new dateTimePickerViewModel(language.getValue('start'), startDateTimePickerOptions, self.model.startDate);
      self.startDateTimePicker = ko.observable(startDateTimePicker);

      var endDateTimePickerOptions = _.cloneDeep(startDateTimePickerOptions); // We need to clone the object because for some
      //reason if we pass the same object the datepickers store the same date

      var endDateTimePicker = new dateTimePickerViewModel(language.getValue('end'), endDateTimePickerOptions, self.model.endDate);
      self.endDateTimePicker = ko.observable(endDateTimePicker);

      self.canActivate = function() {
        var companies = unitofwork.companyRepository.all("name", "Address").then(function(companies) {
          self.companies(companies);
        });
        return Q.all([companies]).fail(self.handleError).then(function() {
          return true;
        });
      };
      self.attached = function(view, parent) {
        self.initializeView();
      };

      function initializeInvitationsTagsInput() {
        $('#invitations').tagsinput();

        _.forEach(self.model.invitations(), function(invitation) {
          $('#invitations').tagsinput('add', invitation.email());
        });

        $('#invitations').on('beforeItemAdd', function(event) {
          var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
          event.cancel = !pattern.test(event.item);
        });

        $('#invitations').on('itemAdded', function(event) {
          createInvitation(event.item);
        });

        $('#invitations').on('beforeItemRemove', function (event) {

          // Prevent Backspace deleting
          if (window.event.keyCode === 8) {
            event.cancel = true;
          }

        });

        $('#invitations').on('itemRemoved', function(event) {
          var invitation = _.find(self.model.invitations(), function (invitation) {
            return invitation.email() === event.item;
          });
          invitation.entityAspect.setDeleted();
        });

      };

      function initializeCompanyTagsInput() {

        var substringMatcher = function(companies) {
          return function findMatches(q, cb) {
            var matches,
                substrRegex;


            substrRegex = new RegExp(q, 'i');
            var companiesInNetwork = _.map(model.networkCompanies(), function(networkCompany) {
              return networkCompany.company();
            });


            matches = _.filter(companies, function(company) {
              return (substrRegex.test(company.name()) && !(_.includes(companiesInNetwork, company)));
            });
            cb(matches);
          };
        };


        var options = {
          allowDuplicates: false,
          itemValue: function(item) {
            return item;
          },
          itemText: function(item) {
            return item.name();
          },
          typeaheadjs: {
            source: substringMatcher(self.companies()),
            displayKey: function(key) {
              return key.name();
            },
            name: 'companies'
          }
        };

        $('#companies').tagsinput(options);


        _.forEach(self.model.networkCompanies(), function(networkCompany) {
          $('#companies').tagsinput('add', networkCompany.company());
        });

        $('#companies').on('beforeItemAdd', function(event) {
          var newNetworkCompany = unitofwork.networkCompanyRepository.create();
          newNetworkCompany.company(event.item);
          handleSurveyCreation(newNetworkCompany);
          newNetworkCompany.network(self.model);
        });

        $('#companies').on('beforeItemRemove', function (event) {

          // Prevent Backspace deleting
          if (window.event.keyCode === 8) {
            event.cancel = true;
          }

        });
        
        $('#companies').on('itemRemoved', function(event) {

          var company = event.item;
          if (company === undefined) {
            return;
          }

          var networkCompany = _.find(self.model.networkCompanies(), function(networkCompany) {
            return networkCompany.company() === company;
          });

          var i;
          for (i = networkCompany.surveys().length - 1; i >= 0; i--) {
            unitofwork.manager.detachEntity(networkCompany.surveys()[i]);
          }
          for (i = networkCompany.measures().length - 1; i >= 0; i--) {
            unitofwork.manager.detachEntity(networkCompany.measures()[i]);
          }

          networkCompany.entityAspect.setDeleted();
        });
      };

      self.initializeView = function() {

        initializeCompanyTagsInput();
        initializeInvitationsTagsInput();
      };

      function createInvitation(email) {
        if (email.length > 0) {
          unitofwork.invitationRepository.create({
            email: email,
            invitedFrom: appsecurity.userInfo().name(),
            message: language.getValue('invitationMail_content'),
            date: new Date(),
            network: self.model
          });
        }
      };

      self.checkSurveys = function() {
        _.forEach(self.model.networkCompanies(), function(networkCompany) {
          handleSurveyCreation(networkCompany);
          disableUnnecessarySurveys(networkCompany);
        });
      }

      function disableUnnecessarySurveys(networkCompany) {
        _.forEach(networkCompany.surveys(), function(survey) {
          if (survey.date().getFullYear() < self.model.startDate().getFullYear() - 1 || survey.date().getFullYear() > self.model.endDate().getFullYear()) {
            survey.fulfilled(false);
          }
        });
      }

      function handleSurveyCreation(networkCompany) {
          var survey;
          var date = new Date(1);
          date.setFullYear(self.model.startDate().getFullYear());
          var eDate = self.model.endDate();
          for (var i = date.getFullYear() - 1; i <= eDate.getFullYear() ; i++) {
            var foundSurvey = false;
            if (networkCompany.surveys().length > 0) {
              _.forEach(networkCompany.surveys(), function(survey) {
                if (survey.title() == i) {
                  foundSurvey = true;
                }
              });
            }

            if (!foundSurvey) {
              survey = createSurvey(i);
              survey.networkCompany(networkCompany);
            }
          }
      };

      function createSurvey(year) {
          var date = new Date(1);
          date.setFullYear(year);
          var newSurvey = unitofwork.surveyRepository.create({
            title: year,
            date: date
          });
          
          return newSurvey;
      };

    };
    errorhandler.includeIn(viewmodel);

    return viewmodel;
  });