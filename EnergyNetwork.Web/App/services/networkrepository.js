/** 
	* @module Derived repository for the Article entity
*/

define(['services/repository', 'services/appsecurity', "services/routeconfig"], function(repository, appsecurity, routeconfig) {

  /**
	 * Repository ctor
	 * @constructor
	*/
  var NetworkRepository = (function() {

    var networkrepository = function(entityManagerProvider, entityTypeName, resourceName, fetchStrategy) {
      repository.getCtor.call(this, entityManagerProvider, entityTypeName, resourceName, fetchStrategy);

      /**
			 * Get all entities with its companies and ordered by startdate
			 * @method
			 * @return {promise}
			*/
      this.all = function() {
        var query = breeze.EntityQuery
          .from(resourceName)
          .orderBy("name")
          .expand("NetworkCompanies, NetworkCompanies/Company");
          //"NetworkCompanies, NetworkCompanies/Company, NetworkCompanies/Company/Address, NetworkCompanies/Company/Employees, NetworkCompanies/Surveys, NetworkCompanies/Surveys/Readings, NetworkCompanies/Surveys/OperationTime, NetworkCompanies/Surveys/CompanySize, NetworkCompanies/Surveys/FiscalYear, NetworkCompanies/Surveys/ProductionTimes, NetworkCompanies/Surveys/Areas, NetworkCompanies/Surveys/Products, NetworkCompanies/Surveys/Products/OutputUnit, NetworkCompanies/Surveys/ImportantTopics, NetworkCompanies/Surveys/Documents, NetworkCompanies/Measures/State, NetworkCompanies/Measures/EnergySavings, Invitations"
        return executeQuery(query);
      };

      this.find = function(predicate, page, count) {
        var query = breeze.EntityQuery
          .from(resourceName)
          .where(predicate)
          .orderBy("name")
          .expand("NetworkCompanies, NetworkCompanies/Company, NetworkCompanies/Company/Address, NetworkCompanies/Company/Employees, NetworkCompanies/Surveys, NetworkCompanies/Surveys/Readings, NetworkCompanies/Surveys/OperationTime, NetworkCompanies/Surveys/CompanySize, NetworkCompanies/Surveys/FiscalYear, NetworkCompanies/Surveys/ProductionTimes, NetworkCompanies/Surveys/Areas, NetworkCompanies/Surveys/Products, NetworkCompanies/Surveys/Products/OutputUnit, NetworkCompanies/Measures/State, NetworkCompanies/Measures/EnergySavings, NetworkCompanies/Measures/EnergySavings/EnergySource");

        return executeQuery(query);
      };

      this.byId = function (id) {
          var query = breeze.EntityQuery
            .from(resourceName)
            .where(new breeze.Predicate('networkId', '==', id))
            .orderBy("name")
            .expand("Invitations, NetworkCompanies, NetworkCompanies/Company, NetworkCompanies/Company/Address, NetworkCompanies/Company/Employees, NetworkCompanies/Surveys, NetworkCompanies/Surveys/Readings, NetworkCompanies/Surveys/OperationTime, NetworkCompanies/Surveys/CompanySize, NetworkCompanies/Surveys/FiscalYear, NetworkCompanies/Surveys/ProductionTimes, NetworkCompanies/Surveys/Areas, NetworkCompanies/Surveys/Documents, NetworkCompanies/Surveys/Products, NetworkCompanies/Surveys/Products/OutputUnit, NetworkCompanies/Measures/State, NetworkCompanies/Measures/EnergySavings, NetworkCompanies/Measures/EnergySavings/EnergySource");

          return executeQuery(query);
      };

      this.companyRanking = function(id) {
        return $.ajax({
          data: { id: id },
          url: routeconfig.companyRankingUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };

      this.networkChartDataBy = function(id) {
        return $.ajax({
          data: { id: id },
          url: routeconfig.networkChartDataByUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };

      this.networkChartDataDetailsBy = function(id, type) {
        return $.ajax({
          data: { id: id, type: type },
          url: routeconfig.networkChartDataDetailsByUrl,
          type: "GET",
          headers: appsecurity.getSecurityHeaders()
        });
      };

      this.networksTotalEnergyConsumption = function() {
        return $.ajax({
          url: routeconfig.networksTotalEnergyConsumptionUrl,
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

    networkrepository.prototype = repository.create();
    return networkrepository;
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
    return new NetworkRepository(entityManagerProvider, entityTypeName, resourceName, fetchStrategy);
  }
});