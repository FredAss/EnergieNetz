/** 
	* @module Derived repository for the Article entity
*/

define(['services/repository', 'services/appsecurity', "services/routeconfig"], function(repository, appsecurity, routeconfig) {

  /**
	 * Repository ctor
	 * @constructor
	*/
  var ChangeSetRepository = (function() {

    var changesetrepository = function(entityManagerProvider, entityTypeName, resourceName, fetchStrategy) {
      repository.getCtor.call(this, entityManagerProvider, entityTypeName, resourceName, fetchStrategy);

      /**
			 * Get all entities
			 * @method
			 * @return {promise}
			*/
      this.all = function() {
          var query = breeze.EntityQuery
            .from(resourceName)
            .orderByDesc("date")
            .expand("Changes")
            .top(50);
         
        return executeQuery(query);
      };

      function executeQuery(query) {
        return entityManagerProvider.manager()
          .executeQuery(query.using(fetchStrategy || breeze.FetchStrategy.FromServer))
          .then(function(data) {
            return data.results;
          });
      }

    };

    changesetrepository.prototype = repository.create();
    return changesetrepository;
  })();

  return {
    create: create
  };

  /**
	 * Create a new Repository
	 * @method
	 * @param {EntityManagerProvider} entityManagerProvider
	 * @param {string} entityTypeName
	 * @param {string} resourceName
	 * @param {FetchStrategy} fetchStrategy
	 * @return {Repository}
	*/
  function create(entityManagerProvider, entityTypeName, resourceName, fetchStrategy) {
    return new ChangeSetRepository(entityManagerProvider, entityTypeName, resourceName, fetchStrategy);
  }
});