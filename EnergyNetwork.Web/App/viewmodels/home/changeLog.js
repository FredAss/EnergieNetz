define([
    'viewmodels/home/change',
    'services/unitofwork'
  ],
  function(changeViewModel, unitofwork) {

      var self = this;
      self.changeViewModels = ko.observableArray();
      self.lastChanges = ko.observableArray();

      unitofwork.manager.entityChanged.subscribe(function (changeArgs) {
          var action = changeArgs.entityAction;
          var entity = changeArgs.entity;
          if (action.name === "Attach" && entity.entityAspect.entityState.name === "Added" && entity.entityType.shortName === "ChangeSet") {
            self.lastChanges.unshift(entity);
            self.changeViewModels.unshift(new changeViewModel(entity));
          }
      });

      var activate = function () {
          unitofwork.changeSetRepository.all().then(function (data) {
            self.lastChanges(data);
            _.forEach(self.lastChanges(), function (changeSet) {
              self.changeViewModels.push(new changeViewModel(changeSet));
            });
          });        
      }

    var viewmodel = {
        activate: activate,
        changeViewModels: changeViewModels
    };

    return viewmodel;
  });