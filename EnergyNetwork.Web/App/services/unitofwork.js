/** 
	* @module UnitOfWork containing all repositories
	* @requires app
	* @requires entitymanagerprovider
	* @requires repository 
*/

define([
    'durandal/app',
    'services/entitymanagerprovider',
    'services/repository',
    'services/networkcompanyrepository',
    'services/networkrepository',
    'services/measurerepository',
    'services/changesetrepository',
    'services/routeconfig',
    'services/changeTracker'
  ],
  function(app, entityManagerProvider, repository, networkcompanyrepository, networkrepository, measurerepository, changesetrepository, routeconfig, changeTracker) {


    var provider = entityManagerProvider.create();
    var manager = provider.manager();
    var metadataStore = manager.metadataStore;

    var hasChanges = ko.observable(false);

    provider.manager().hasChangesChanged.subscribe(function(eventArgs) {
      hasChanges(eventArgs.hasChanges);
    });

    var commit = function() {
      changeTracker.createLog();

      var saveOptions = new breeze.SaveOptions({ resourceName: routeconfig.saveChangesUrl });

      return provider.manager().saveChanges(null, saveOptions)
        .then(function(saveResult) {
          app.trigger('saved', saveResult.entities);
        });
    };

    var rollback = function() {
      provider.manager().rejectChanges();
    };

    // Repositories
    var networkRepository = networkrepository.create(provider, "Network", routeconfig.networksUrl);
    var networkCompanyRepository = networkcompanyrepository.create(provider, "NetworkCompany", routeconfig.networkCompaniesUrl);
    var measureRepository = measurerepository.create(provider, "Measure", routeconfig.measuresUrl);
    var companyRepository = repository.create(provider, "Company", routeconfig.companiesUrl);
    var invitationRepository = repository.create(provider, "Invitation", routeconfig.invitationsUrl);
    var measureStateRepository = repository.create(provider, "MeasureState", routeconfig.measureStatesUrl);
    var outputUnitRepository = repository.create(provider, "OutputUnit", routeconfig.outputUnitUrl);
    var energySavingRepository = repository.create(provider, "EnergySaving", routeconfig.energySavingUrl);
    var surveyRepository = repository.create(provider, "Survey", routeconfig.surveyUrl);
    var energySourceRepository = repository.create(provider, "EnergySource", routeconfig.energySourcesUrl);
    var changeSetRepository = changesetrepository.create(provider, "ChangeSet", routeconfig.changeSetsUrl);
    var changeRepository = repository.create(provider, "Change", routeconfig.changesUrl);
    var investmentPlanRepository = repository.create(provider, "InvestmentPlan", routeconfig.investmentPlansUrl);
    var comparisonRepository = repository.create(provider, "Comparison", routeconfig.comparisonsUrl);
    var documentRepository = repository.create(provider, "Document", routeconfig.documentsUrl);
    var areaRepository = repository.create(provider, "Area", routeconfig.areasUrl);
    var productRepository = repository.create(provider, "Product", routeconfig.productsUrl);
    var productionTimeRepository = repository.create(provider, "ProductionTime", routeconfig.productionTimesUrl);
    var readingRepository = repository.create(provider, "Reading", routeconfig.readingsUrl);
    var importantTopicRepository = repository.create(provider, "ImportantTopic", routeconfig.importantTopicsUrl);
    var companySizeRepository = repository.create(provider, "CompanySize", routeconfig.companySizesUrl);
    var fiscalYearRepository = repository.create(provider, "FiscalYear", routeconfig.fiscalYearsUrl);
    var operationTimeRepository = repository.create(provider, "OperationTime", routeconfig.operationTimesUrl);

    var unitofwork = {
      manager: manager,
      metadataStore: metadataStore,
      commit: commit,
      rollback: rollback,
      hasChanges: hasChanges,
      companyRepository: companyRepository,
      networkRepository: networkRepository,
      networkCompanyRepository: networkCompanyRepository,
      measureRepository: measureRepository,
      measureStateRepository: measureStateRepository,
      outputUnitRepository: outputUnitRepository,
      invitationRepository: invitationRepository,
      energySavingRepository: energySavingRepository,
      surveyRepository: surveyRepository,
      energySourceRepository: energySourceRepository,
      changeSetRepository: changeSetRepository,
      changeRepository: changeRepository,
      investmentPlanRepository: investmentPlanRepository,
      comparisonRepository: comparisonRepository,
      documentRepository: documentRepository,
      areaRepository: areaRepository,
      productRepository: productRepository,
      productionTimeRepository: productionTimeRepository,
      readingRepository: readingRepository,
      importantTopicRepository: importantTopicRepository,
      companySizeRepository: companySizeRepository,
      fiscalYearRepository: fiscalYearRepository,
      operationTimeRepository: operationTimeRepository,
    };

    changeTracker.unitofwork = unitofwork;

    return unitofwork;
  });