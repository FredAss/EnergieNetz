/** 
	* @module Derived repository for the Article entity
*/

define(['services/repository', 'services/appsecurity', "services/routeconfig"], function(repository, appsecurity, routeconfig) {

  /**
	 * Repository ctor
	 * @constructor
	*/
  var MeasureRepository = (function() {

    var measurerepository = function(entityManagerProvider, entityTypeName, resourceName, fetchStrategy) {
      repository.getCtor.call(this, entityManagerProvider, entityTypeName, resourceName, fetchStrategy);

      /**
			 * Get all entities with its companies and ordered by startdate
			 * @method
			 * @return {promise}
			*/
      this.all = function() {
        var query = breeze.EntityQuery
          .from(resourceName)
          .orderBy("index");

        return executeQuery(query);
      };

      this.find = function(predicate, page, count) {
        var query = breeze.EntityQuery
          .from(resourceName)
          .where(predicate)
          .orderBy("index");

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

    measurerepository.prototype = repository.create();
    return measurerepository;
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
    return new MeasureRepository(entityManagerProvider, entityTypeName, resourceName, fetchStrategy);
  }
});