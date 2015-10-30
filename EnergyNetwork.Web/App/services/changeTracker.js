define([
    'services/appsecurity'
],
  function (appsecurity) {

      var additionalChanges = ko.observableArray();
      var changedSurveyId = null;
      var createdChanges = [];

      var changeTracker = {
          unitofwork: null,
          createLog: function () {
              var self = this;              
              additionalChanges.removeAll();
              changedSurveyId = null;
              createdChanges = [];
              var changeSet = self.unitofwork.manager.getChanges();

              measureLog();

              _.forEach(changeSet, function (changedEntity) {
                  var query, survey;
                  var entityType = changedEntity.entityType.shortName;
                  switch (entityType) {
                      case "Network":
                          networkLog(changedEntity);
                          break;
                      case "NetworkCompany":
                          networkCompanyLog(changedEntity);
                          break;
                      case "Survey":
                          surveyLog(changedEntity);
                          break;
                      case "CompanySize":
                          query = breeze.EntityQuery.from('Surveys').where('companySizeId', '==', changedEntity.companySizeId());
                          survey = self.unitofwork.manager.executeQueryLocally(query)[0];
                          if(survey.entityAspect.entityState.name === "Unchanged" && survey.surveyId() !== changedSurveyId) surveyLog(survey);
                          break;
                      case "FiscalYear":
                          query = breeze.EntityQuery.from('Surveys').where('fiscalYearId', '==', changedEntity.fiscalYearId());
                          survey = self.unitofwork.manager.executeQueryLocally(query)[0];
                          if (survey.entityAspect.entityState.name === "Unchanged" && survey.surveyId() !== changedSurveyId) surveyLog(survey);
                          break;
                      case "OperationTime":
                          query = breeze.EntityQuery.from('Surveys').where('operationTimeId', '==', changedEntity.operationTimeId());
                          survey = self.unitofwork.manager.executeQueryLocally(query)[0];
                          if (survey.entityAspect.entityState.name === "Unchanged" && survey.surveyId() !== changedSurveyId) surveyLog(survey);
                          break;
                      case "Area":
                      case "Product":
                      case "Reading":
                      case "ProductionTime":
                      case "Document":
                      case "ImportantTopic":
                          survey = self.unitofwork.manager.getEntityByKey("Survey", changedEntity.surveyId());
                          if (survey.entityAspect.entityState.name === "Unchanged" && survey.surveyId() !== changedSurveyId) surveyLog(survey);
                          break;
                  }

              });

              function measureLog() {
                var measure;
                var energySavingType = self.unitofwork.metadataStore.getEntityType("EnergySaving");
                var changedEnergySavings = self.unitofwork.manager.getChanges(energySavingType);
                if (changedEnergySavings.length > 0) {
                  measure = self.unitofwork.manager.getEntityByKey("Measure", changedEnergySavings[0].measureId());
                  _.forEach(changedEnergySavings, function(energysaving) {
                    if (energysaving.entityAspect.entityState.name === "Deleted" && measure.entityAspect.entityState.name !== "Deleted") {
                      var mId = measure.measureId();
                      var additionalChange = {};
                      additionalChange[mId] = createChange({
                        actionType: 'Deleted',
                        entityType: 'EnergySaving',
                        entityId: energysaving.energySavingId
                      });
                      additionalChanges.push(additionalChange);
                    }
                  });
                } else {
                  var measureType = self.unitofwork.metadataStore.getEntityType("Measure");
                  var changedMeasure = self.unitofwork.manager.getChanges(measureType);
                  if (changedMeasure.length === 0) return;
                  measure = changedMeasure[0];
                }

                var eType = "Measure";
                var eId = measure.measureId();
                var eTitle = measure.title();
                var actionType = measure.entityAspect.entityState.name;
                var nc = self.unitofwork.manager.getEntityByKey("NetworkCompany", measure.networkCompanyId());
                var companyId = nc.company().companyId();
                var changes = [];

                if (["Modified", "Unchanged"].indexOf(actionType) !== -1) {
                  actionType = "Modified";
                  changes = getCollectionChanges(measure, "energySavings");
                  var property, propertyType, oldValue, newValue;
                  for (var key in measure.entityAspect.originalValues) {
                    if (key === "stateId") {
                      property = "state";
                      oldValue = self.unitofwork.manager.getEntityByKey("MeasureState", measure.entityAspect.originalValues[key]).title();
                      propertyType = $.type(oldValue);
                      newValue = measure['state']().title();
                    } else {
                      property = key;
                      oldValue = measure.entityAspect.originalValues[key];
                      propertyType = $.type(oldValue);
                      newValue = measure[key]();
                    }
                    changes.unshift(createChange({
                      actionType: actionType,
                      property: property,
                      propertyType: propertyType,
                      oldValue: oldValue,
                      newValue: newValue
                    }));
                  }
                }
                createdChanges.push(eId);
                createChangeSet({
                  actionType: actionType,
                  eType: eType,
                  eId: eId,
                  eTitle: eTitle,
                  changes: changes,
                  companyId: companyId
                });
                
              }

              function networkLog(network) {
                  var eType = "Network";
                  var eId = network.networkId();
                  var eTitle = network.name();
                  var actionType = network.entityAspect.entityState.name;
                  var changes = [];

                  if (["Modified", "Unchanged"].indexOf(actionType) !== -1) {
                      actionType = "Modified";
                      changes = getCollectionChanges(network, "networkCompanies");
                      var property, propertyType, oldValue, newValue;
                      for (var key in network.entityAspect.originalValues) {
                          property = key;
                          propertyType = $.type(network.entityAspect.originalValues[key]);
                          oldValue = network.entityAspect.originalValues[key];
                          newValue = network[key]();
                          changes.unshift(createChange({
                            actionType: actionType,
                            property: property,
                            propertyType: propertyType,
                            oldValue: oldValue,
                            newValue: newValue
                          }));
                      }
                  }

                  createChangeSet({
                    actionType: actionType, 
                    eType: eType,
                    eId: eId,
                    eTitle: eTitle,
                    changes: changes
              });
              }

              function networkCompanyLog(networkCompany) {
                  var network = self.unitofwork.manager.getEntityByKey("Network", networkCompany.networkId());
                  if (networkCompany.entityAspect.entityState.name === "Deleted") {
                      var nId = network.networkId();
                      var additionalChange = {};
                      additionalChange[nId] = createChange({
                        actionType: 'Deleted',
                        entityType: 'NetworkCompany',
                        entityId: networkCompany.networkCompanyId
                      });
                    
                      additionalChanges.push(additionalChange);
                  }
                  if (network.entityAspect.entityState.name !== 'Unchanged') return;

                  networkLog(network);
              }

              function surveyLog(survey) {
                  changedSurveyId = survey.surveyId();
                  var eType = "Survey";
                  var eId = survey.surveyId();
                  var eTitle = survey.title() + ' - ' + survey.networkCompany().company().name();
                  var actionType = survey.entityAspect.entityState.name;

                  if (["Modified", "Unchanged"].indexOf(actionType) !== -1) {
                      actionType = "Modified";
                  } else if (["Added"].indexOf(actionType) !== -1) {
                    return;
                  }

                  createChangeSet({
                    actionType: actionType,
                    eType: eType,
                    eId: eId,
                    eTitle: eTitle
              });
              }

              function getCollectionChanges(entity, collectionString) {
                  var changes = [];
                  var collections = collectionString.split('.');

                  var actionType, property, propertyType, oldValue, newValue, eType, eId;
                  _.forEach(collections, function (collectionKey) {
                      _.forEach(entity[collectionKey](), function (collectionObject) {
                          actionType = collectionObject.entityAspect.entityState.name;
                          eType = collectionObject.entityType.shortName;
                          eId = collectionObject[eType.charAt(0).toLowerCase() + eType.slice(1) + "Id"]();
                          if (["Added"].indexOf(actionType) !== -1) {
                              changes.push(createChange({
                                actionType: actionType,
                                entityType: eType,
                                entityId: eId
                              }));
                          } else {
                              for (var key in collectionObject.entityAspect.originalValues) {
                                  property = key;
                                  propertyType = $.type(collectionObject.entityAspect.originalValues[key]);
                                  oldValue = collectionObject.entityAspect.originalValues[key];
                                  newValue = collectionObject[key]();
                                  changes.push(createChange({
                                    actionType: actionType,
                                    property: property,
                                    propertyType: propertyType,
                                    oldValue: oldValue,
                                    newValue: newValue,
                                    entityType: eType,
                                    entityId: eId
                                  }));
                              }
                          }
                      });
                  });

                  _.forEach(additionalChanges(), function(additionalChange) {
                      var pType = entity.entityType.shortName;
                      var pId = entity[pType.charAt(0).toLowerCase() + pType.slice(1) + "Id"]();
                      for (var key in additionalChange) {
                          if (key === pId) {
                              changes.push(additionalChange[key]);
                          }
                      }
                  });

                  return changes;
              }

              function createChange(values) {
                  var newChange = self.unitofwork.changeRepository.create({
                      actionType: values.actionType || null,
                      property: values.property || null,
                      propertyType: values.propertyType || null,
                      oldValue: values.oldValue || null,
                      newValue: values.newValue || null,
                      eType: values.entityType || null,
                      eId: values.entityId || null
                  });
                  return newChange;
              }

            // actionType, eType, eId, eTitle, changes, companyId
              function createChangeSet(values) {
                  self.unitofwork.changeSetRepository.create({
                      username: appsecurity.userInfo().name(),
                      actionType: values.actionType || null,
                      eType: values.eType || null,
                      eId: values.eId || null,
                      eTitle: values.eTitle || null,
                      changes: values.changes || [],
                      affectedCompanyId: values.companyId || null
                  });
              }
          }

     };

      return changeTracker;
  });