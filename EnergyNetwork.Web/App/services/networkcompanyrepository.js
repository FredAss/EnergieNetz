/** 
	* @module Derived repository for the Article entity
*/

define(['services/repository', 'services/appsecurity', "services/routeconfig"], function(repository, appsecurity, routeconfig) {

  /**
	 * Repository ctor
	 * @constructor
	*/
  var networkCompanyRepository = (function() {

    var networkCompanyrepository = function(entityManagerProvider, entityTypeName, resourceName, fetchStrategy) {
      repository.getCtor.call(this, entityManagerProvider, entityTypeName, resourceName, fetchStrategy);

      /**
			 * Get all entities with its companies and ordered by startdate
			 * @method
			 * @return {promise}
			*/
      this.all = function() {
        var query = breeze.EntityQuery
          .from(resourceName)
          .expand("Company, Company/Address, Company/Employees, Company/Invitations, Surveys, Surveys/Readings, Surveys/Areas, Surveys/ImportantTopics, Surveys/Documents, Measures, Measures/State, Measures/EnergySavings, Measures/EnergySavings/EnergySource , Network/NetworkCompanies/Company/Address");
        //.orderBy("name");

        return executeQuery(query);
      };

      this.find = function(predicate, page, count) {
        var query = breeze.EntityQuery
          .from(resourceName)
          .where(predicate)
          //.orderBy("Company.name")
          .expand("Company, Company/Address, Company/Employees, Company/Invitations, Surveys, Surveys/Readings, Surveys/Areas, Surveys/ImportantTopics, Surveys/Documents, Measures, Measures/State, Measures/EnergySavings, Measures/EnergySavings/EnergySource , Network/NetworkCompanies/Company/Address");

        return executeQuery(query);
      };

      this.byId = function (id) {
          var query = breeze.EntityQuery
            .from(resourceName)
            .where(new breeze.Predicate('networkCompanyId', '==', id))
            .expand("Company, Company/Address, Company/Employees, Company/Invitations, Surveys, Surveys/Readings, Surveys/Areas, Surveys/ImportantTopics, Surveys/Documents, Measures, Measures/State, Measures/EnergySavings, Measures/EnergySavings/EnergySource , Network/NetworkCompanies/Company/Address");

          return executeQuery(query);
      };

      this.networkCompanyChartDataBy = function(id) {
        return $.ajax({
          data: { id: id },
          url: routeconfig.networkCompanyChartDataByUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };

      this.companyRanking = function(id, selectedCompanyId) {
        return $.ajax({
          data: { id: id, selectedCompanyId: selectedCompanyId },
          url: routeconfig.companyRankingByCompanyUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };

      this.networkCompanyChartDataDetailsBy = function(id, type) {
        return $.ajax({
          data: { id: id, type: type },
          url: routeconfig.networkCompanyChartDataDetailsByUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };
      
      function executeQuery(query) {
        return entityManagerProvider.manager()
          .executeQuery(query.using(fetchStrategy || breeze.FetchStrategy.FromServer))
          .then(function(data) {
            return data.results;
          });
      }

    };

    networkCompanyrepository.prototype = repository.create();
    return networkCompanyrepository;
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
    return new networkCompanyRepository(entityManagerProvider, entityTypeName, resourceName, fetchStrategy);
  }
});