/** 
 * @module This module has the responsability of creating breeze entities
 *         Add here all your initializers, constructors, ...etc
 * @requires appsecurity
 * @requires utils
 */
define([
    'services/appsecurity',
    'services/utils',
    'moment'
  ],
  function(appsecurity, utils, moment) {

    var foreignKeyInvalidValue = 0;

    var entityNames = {
      network: 'Network',
      networkCompany: 'NetworkCompany',
      company: 'Company',
      measure: 'Measure',
      address: 'Address',
      companySize: 'CompanySize',
      area: 'Area',
      product: 'Product',
      document: 'Document',
      productionTime: 'ProductionTime',
      operationTime: 'OperationTime',
      reading: 'Reading',
      survey: 'Survey',
      importantTopic: 'ImportantTopic',
      energySaving: 'EnergySaving',
      investmentPlan: 'InvestmentPlan',
      comparison: 'Comparison',
      changeSet: 'ChangeSet',
      change: 'Change',
      invitation: 'Invitation',
      fiscalYear: 'FiscalYear'
    };


    var self = {
      extendMetadata: extendMetadata,
      entityNames: entityNames
    };

    return self;

    /**
         * Extend entities
         * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
         */
    function extendMetadata(metadataStore) {
      extendMeasure(metadataStore);
      extendInvitation(metadataStore);
      extendChangeSet(metadataStore);
      extendChange(metadataStore);
      extendInvestmentPlan(metadataStore);
      extendComparison(metadataStore);
      extendEnergySaving(metadataStore);
      extendCompanySize(metadataStore);
      extendFiscalYear(metadataStore);
      extendArea(metadataStore);
      extendProduct(metadataStore);
      extendDocument(metadataStore);
      extendProductionTime(metadataStore);
      extendOperationTime(metadataStore);
      extendReading(metadataStore);
      extendSurvey(metadataStore);
      extendImportantTopic(metadataStore);
      extendNetworkCompany(metadataStore);
      extendCompany(metadataStore);
      extendAddress(metadataStore);
      extendNetwork(metadataStore); //extendNetwork have to be the last one!!!
    };

    /**
        * Extend networks
        * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
        */

    function extendNetwork(metadataStore) {
      var networkCtor = function() {
        this.networkId = ko.observable(breeze.core.getUuid());
        this.name = ko.observable("");
        this.description = ko.observable("");
        this.startDate = new Date(moment());
        this.endDate = new Date(moment().add(4, 'y'));

      };

      var networkInitializer = function(network) {
        addValidationRules(network);
        addhasValidationErrorsProperty(network);

        network.formattedStartDate = ko.computed(function () {
          language.selectedLanguage();
          return moment(network.startDate()).format('MMMM YYYY');
        });
        network.formattedEndDate = ko.computed(function () {
          language.selectedLanguage();
          return moment(network.endDate()).format('MMMM YYYY');
        });
        network.timeProgress = ko.computed(function() {

          var progressUntilToday = Math.round(100 * (new Date() - network.startDate()) / (network.endDate() - network.startDate()));
          if (progressUntilToday >= 100) {
            return 100;
          };
          return progressUntilToday;
        });

        network.unsavedChanges = ko.observable(network.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.network, networkCtor, networkInitializer);
    };

    /**
       * Extend networkCompanies
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendNetworkCompany(metadataStore) {
      var networkCompanyCtor = function() {
        this.networkCompanyId = ko.observable(breeze.core.getUuid());
      };

      var networkCompanyInitializer = function(networkCompany) {
        addValidationRules(networkCompany);
        addhasValidationErrorsProperty(networkCompany);
        networkCompany.unsavedChanges = ko.observable(networkCompany.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.networkCompany, networkCompanyCtor, networkCompanyInitializer);
    };

    /**
       * Extend companies
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendCompany(metadataStore) {
      var companyCtor = function() {
        this.companyId = ko.observable(breeze.core.getUuid());
      };

      var companyInitializer = function(company) {
        addValidationRules(company);
        addhasValidationErrorsProperty(company);
        company.unsavedChanges = ko.observable(company.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.company, companyCtor, companyInitializer);
    };

    function extendAddress(metadataStore) {
      var addressCtor = function() {
        this.addressId = ko.observable(breeze.core.getUuid());
      };

      var addressInitializer = function(address) {
        addValidationRules(address);
        addhasValidationErrorsProperty(address);
        address.unsavedChanges = ko.observable(address.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.address, addressCtor, addressInitializer);
    };

    /**
       * Extend measures
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendMeasure(metadataStore) {
      var measureCtor = function() {
        this.measureId = ko.observable(breeze.core.getUuid());
        this.relatedDuration = new Date();

      };

      var measureInitializer = function(measure) {
        addValidationRules(measure);
        addhasValidationErrorsProperty(measure);
        measure.unsavedChanges = ko.observable(measure.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.measure, measureCtor, measureInitializer);
    };

    /**
       * Extend energySaving
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendEnergySaving(metadataStore) {
      var energySavingCtor = function() {
        this.energySavingId = ko.observable(breeze.core.getUuid());
      };

      var measureInitializer = function(energySaving) {
        addValidationRules(energySaving);
        addhasValidationErrorsProperty(energySaving);
        energySaving.unsavedChanges = ko.observable(energySaving.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.energySaving, energySavingCtor, measureInitializer);
    };

    /**
       * Extend companySize
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendCompanySize(metadataStore) {
      var companySizeCtor = function() {
        this.companySizeId = ko.observable(breeze.core.getUuid());
        this.numberOfEmployees = ko.observable(0);
        this.totalRevenue = ko.observable(0);
        this.totalEnergyCosts = ko.observable(0);
        this.lastYearsEnergyTaxRefund = ko.observable(0);
      };

      var companySizeInitializer = function(companySize) {
        addValidationRules(companySize);
        addhasValidationErrorsProperty(companySize);
        companySize.unsavedChanges = ko.observable(companySize.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.companySize, companySizeCtor, companySizeInitializer);
    };

    /**
       * Extend fiscalYear
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendFiscalYear(metadataStore) {
      var fiscalYearCtor = function() {
        this.fiscalYearId = ko.observable(breeze.core.getUuid());
        this.isCalendarYear = ko.observable(true);
        this.isKMU = ko.observable(true);
      };

      var fiscalYearInitializer = function (fiscalYear) {
        addValidationRules(fiscalYear);
        addhasValidationErrorsProperty(fiscalYear);
        fiscalYear.unsavedChanges = ko.observable(fiscalYear.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.fiscalYear, fiscalYearCtor, fiscalYearInitializer);
    };

    /**
       * Extend Area
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendArea(metadataStore) {
      var areaCtor = function() {
        this.areaId = ko.observable(breeze.core.getUuid());
      };

      var areaInitializer = function(area) {
        addValidationRules(area);
        addhasValidationErrorsProperty(area);
        area.unsavedChanges = ko.observable(area.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.area, areaCtor, areaInitializer);
    };

    /**
       * Extend Product
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendProduct(metadataStore) {
      var productCtor = function() {
        this.productId = ko.observable(breeze.core.getUuid());
      };

      var productInitializer = function(product) {
        addValidationRules(product);
        addhasValidationErrorsProperty(product);
        product.unsavedChanges = ko.observable(product.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.product, productCtor, productInitializer);
    };

    /**
       * Extend ProductionTime
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendProductionTime(metadataStore) {
      var productionTimeCtor = function() {
        this.productionTimeId = ko.observable(breeze.core.getUuid());
      };

      var productionTimeInitializer = function(productionTime) {
        addValidationRules(productionTime);
        addhasValidationErrorsProperty(productionTime);
        productionTime.unsavedChanges = ko.observable(productionTime.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.productionTime, productionTimeCtor, productionTimeInitializer);
    };

    /**
       * Extend OperationTime
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendOperationTime(metadataStore) {
      var operationTimeCtor = function() {
        this.operationTimeId = ko.observable(breeze.core.getUuid());
        this.companyHolidays = ko.observable(0);
        this.shutdownDays = ko.observable(0);
      };

      var operationTimeInitializer = function(operationTime) {
        addValidationRules(operationTime);
        addhasValidationErrorsProperty(operationTime);
        operationTime.unsavedChanges = ko.observable(operationTime.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.operationTime, operationTimeCtor, operationTimeInitializer);
    };

    /**
       * Extend Reading
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendReading(metadataStore) {
      var readingCtor = function() {
        this.readingId = ko.observable(breeze.core.getUuid());
      };

      var readingInitializer = function(reading) {
        addValidationRules(reading);
        addhasValidationErrorsProperty(reading);
        reading.unsavedChanges = ko.observable(reading.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.reading, readingCtor, readingInitializer);
    };

    /**
       * Extend Survey
       * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
       */
    function extendSurvey(metadataStore) {
      var surveyCtor = function() {
        this.surveyId = ko.observable(breeze.core.getUuid());
      };

      var surveyInitializer = function(survey) {
        addValidationRules(survey);
        addhasValidationErrorsProperty(survey);
        survey.unsavedChanges = ko.observable(survey.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.survey, surveyCtor, surveyInitializer);
    };

    /**
      * Extend ImportantTopic
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendImportantTopic(metadataStore) {
      var importantTopicCtor = function() {
        this.importantTopicId = ko.observable(breeze.core.getUuid());
      };

      var importantTopicInitializer = function(importantTopic) {
        addValidationRules(importantTopic);
        addhasValidationErrorsProperty(importantTopic);
        importantTopic.unsavedChanges = ko.observable(importantTopic.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.importantTopic, importantTopicCtor, importantTopicInitializer);
    };

    /**
      * Extend InvestmentPlan
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendInvestmentPlan(metadataStore) {
      var investmentPlanCtor = function() {
        this.investmentPlanId = ko.observable(breeze.core.getUuid());
        this.investmentName = ko.observable("");
        var startDate = new Date(moment().year(), 0,1);
        this.startYear = ko.observable(startDate);
      };

      var investmentPlanInitializer = function(investmentPlan) {
        addValidationRules(investmentPlan);
        addhasValidationErrorsProperty(investmentPlan);
        investmentPlan.unsavedChanges = ko.observable(investmentPlan.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.investmentPlan, investmentPlanCtor, investmentPlanInitializer);
    };

    /**
      * Extend Comparison
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendComparison(metadataStore) {
      var comparisonCtor = function () {
        this.comparisonId = ko.observable(breeze.core.getUuid());
        this.comparisonName = ko.observable("");
        this.lifetime = ko.observable(1);
      };

      var comparisonInitializer = function(comparison) {
        addValidationRules(comparison);
        addhasValidationErrorsProperty(comparison);
        comparison.unsavedChanges = ko.observable(comparison.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.comparison, comparisonCtor, comparisonInitializer);
    };

    function extendDocument(metadataStore) {
      var extendDocumentCtor = function() {
        this.documentId = ko.observable(breeze.core.getUuid());
      };

      var extendDocumentInitializer = function(document) {
        addValidationRules(document);
        addhasValidationErrorsProperty(document);
        document.unsavedChanges = ko.observable(document.entityAspect.entityState.isAddedModifiedOrDeleted());
      };

      metadataStore.registerEntityTypeCtor(entityNames.document, extendDocumentCtor, extendDocumentInitializer);
    };

      /**
      * Extend ChangeSet
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendChangeSet(metadataStore) {
        var changeSetCtor = function () {
            this.changeSetId = ko.observable(breeze.core.getUuid());
            this.date = new Date(moment());
        };

        var changeSetInitializer = function (changeSet) {
            addValidationRules(changeSet);
            addhasValidationErrorsProperty(changeSet);
            changeSet.unsavedChanges = ko.observable(changeSet.entityAspect.entityState.isAddedModifiedOrDeleted());
        };

        metadataStore.registerEntityTypeCtor(entityNames.changeSet, changeSetCtor, changeSetInitializer);
    };

      /**
      * Extend Change
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendChange(metadataStore) {
        var changeCtor = function () {
            this.changeId = ko.observable(breeze.core.getUuid());
        };

        var changeInitializer = function (change) {
            addValidationRules(change);
            addhasValidationErrorsProperty(change);
            change.unsavedChanges = ko.observable(change.entityAspect.entityState.isAddedModifiedOrDeleted());
        };

        metadataStore.registerEntityTypeCtor(entityNames.change, changeCtor, changeInitializer);
    };

      /**
      * Extend Invitation
      * param {BreezeManagerMetadataStore} metadataStore - The breeze metadata store
      */
    function extendInvitation(metadataStore) {
        var invitationCtor = function () {
            this.invitationId = ko.observable(breeze.core.getUuid());
        };

        var invitationInitializer = function (invitation) {
            addValidationRules(invitation);
            addhasValidationErrorsProperty(invitation);
            invitation.unsavedChanges = ko.observable(invitation.entityAspect.entityState.isAddedModifiedOrDeleted());
        };

        metadataStore.registerEntityTypeCtor(entityNames.invitation, invitationCtor, invitationInitializer);
    };

    /**
         * Helper function for ensure the type of an entity is the requested
         * param {object} obj - The entity
         * param {string} entityTypeName - The type name
         */
    function ensureEntityType(obj, entityTypeName) {
      if (!obj.entityType || obj.entityType.shortName !== entityTypeName) {
        throw new Error('Object must be an entity of type ' + entityTypeName);
      }
    };

    /**
         * Add Knockout.Validation rules from the entities metadata
         */
    function addValidationRules(entity) {
      var entityType = entity.entityType,
          i,
          property,
          propertyName,
          propertyObject,
          validators,
          u,
          validator,
          nValidator;

      if (entityType) {
        for (i = 0; i < entityType.dataProperties.length; i += 1) {
          property = entityType.dataProperties[i];
          propertyName = property.name;
          propertyObject = entity[propertyName];
          validators = [];

          for (u = 0; u < property.validators.length; u += 1) {
            validator = property.validators[u];
            nValidator = {
              propertyName: propertyName,
              validator: function(val) {
                var error = this.innerValidator.validate(val, { displayName: this.propertyName });
                this.message = error ? error.errorMessage : "";
                return error === null;
              },
              message: "",
              innerValidator: validator
            };
            validators.push(nValidator);
          }
          propertyObject.extend({
            validation: validators
          });
        }

        for (i = 0; i < entityType.foreignKeyProperties.length; i += 1) {
          property = entityType.foreignKeyProperties[i];
          propertyName = property.name;
          propertyObject = entity[propertyName];

          validators = [];
          for (u = 0; u < property.validators.length; u += 1) {
            validator = property.validators[u];
            nValidator = {
              propertyName: propertyName,
              validator: function(val) {
                var error = this.innerValidator.validate(val, { displayName: this.propertyName });
                this.message = error ? error.errorMessage : "";
                return error === null;
              },
              message: "",
              innerValidator: validator
            };
            validators.push(nValidator);
          }
          propertyObject.extend({
            validation: validators
          });
          if (!property.isNullable) {
            //Bussiness Rule: 0 is not allowed for required foreign keys
            propertyObject.extend({ notEqual: foreignKeyInvalidValue });
          }
        }
      }
    };

    /**
         * Extend the entity with a has errors property
         * param {object} entity - The entity
         */
    function addhasValidationErrorsProperty(entity) {

      var prop = ko.observable(false);

      var onChange = function() {
        var hasError = entity.entityAspect.getValidationErrors().length > 0;
        if (prop() === hasError) {
          // collection changed even though entity net error state is unchanged
          prop.valueHasMutated(); // force notification
        } else {
          prop(hasError); // change the value and notify
        }
      };

      onChange(); // check now ...
      entity.entityAspect // ... and when errors collection changes
        .validationErrorsChanged.subscribe(onChange);

      // observable property is wired up; now add it to the entity
      entity.hasValidationErrors = prop;
      entity.errors = ko.validation.group(entity);
    };
  });