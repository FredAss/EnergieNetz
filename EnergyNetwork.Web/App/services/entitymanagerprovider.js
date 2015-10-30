/** 
 * @module Provides the Breeze Entity Manager
 * @requires app
*/

define([
    'durandal/app',
    'services/routeconfig',
    'services/appsecurity',
    'services/constants',
    'services/breeze.validationMessageTemplate'
  ],
  function(app, routeconfig, appsecurity, constants, validationMessageTemplate) {

    breeze.NamingConvention.camelCase.setAsDefault();
    breeze.Validator.messageTemplates = validationMessageTemplate;
    // get the current default Breeze AJAX adapter
    var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
    // set fixed headers
    ajaxAdapter.defaultSettings = {
      headers: appsecurity.getSecurityHeaders()
    };

    var postBaseUrl = constants.postBaseUrl();
    var serviceName = postBaseUrl + '/breeze';
    var masterManager = new breeze.EntityManager(serviceName);


/**
		 * Entity Manager ctor
		 * @constructor
		 */
    var EntityManagerProvider = (function() {

      var entityManagerProvider = function() {
        var manager;

        this.manager = function() {
          if (!manager) {
            manager = masterManager.createEmptyCopy();

            // Populate with lookup data
            manager.importEntities(masterManager.exportEntities());

            // Subscribe to events
            manager.hasChangesChanged.subscribe(function(args) {
              app.trigger('hasChanges');
            });
          }

          return manager;
        };
      };

      return entityManagerProvider;
    })();

    var self = {
      prepare: prepare,
      create: create
    };

    return self;

    /**
		 * Get a new Entity Manager instance
		 * @method
		 * @return {EntityManagerProvider}
		*/
    function create() {
      return new EntityManagerProvider();
    }

    /**
		 * Prepare Entity Manager
		 *  - Fetch Metadata from server
		 *  - Get lookup data
		 * @method
		 * @return {promise}
		*/
    function prepare() {
      return masterManager.fetchMetadata()
        .then(function() {
          if (self.modelBuilder) {
            self.modelBuilder(masterManager.metadataStore);
          }

          return masterManager;
        })
        .fail(function(error) {
          console.log(error);
        });
    }
  });