define([
    'plugins/dialog',
    'services/unitofwork',
    'services/routeconfig',
    'commands/openMeasureEditDialog',
    'commands/openMeasureAddDialog',
    'commands/exportMeasureData'
  ],
  function(dialog, unitofwork, routeconfig, openMeasureEditDialogCommand, openMeasureAddDialogCommand, exportMeasureDataCommand) {
    var viewmodel = function(tableData, type, parentId, parentObj, filter) {
      var self = this;

      self.title = "";
      self.tableData = tableData;
      self.type = type;
      self.parentId = parentId;
      self.parentObj = parentObj;
      self.search = ko.observable(filter);
      self.filteredMeasures = ko.observableArray();
      self.possibleSaving = null;
      self.openMeasureEditDialog = new openMeasureEditDialogCommand(self);
      self.openMeasureAddDialog = new openMeasureAddDialogCommand(self);
      self.exportMeasures = new exportMeasureDataCommand(self);

      self.attached = function(view, parent) {
        ko.computed(function() {
          calculatePossibleSaving(self.tableData());
        });
        self.searchMeasures();
        self.initializeView();
      };

      self.initializeView = function() {
        $.tablesorter.addParser({
          id: 'savings',
          is: function(s) {
            // return false so this parser is not auto detected 
            return false;
          },
          format: function(s) {
            // format your data for normalization 
            return s.match(/([\d.]+)/)[0].replace(/\./g, "");
          },
          // set type, either numeric or text 
          type: 'numeric'
        });

        var dialogHeightInPercent = 0.9;
        var dialogHeaderHeight = $('.modal-header').outerHeight(true);
        var dialogSearchHeight = $('.modal-body .row:first-child').outerHeight(true);
        var dialogFooterHeight = $('.modal-footer').outerHeight(true);
        var dialogBodyPadding = 40;
        var height = ($(window).height() * dialogHeightInPercent) - dialogHeaderHeight - dialogSearchHeight - dialogFooterHeight - dialogBodyPadding;
        $("#measuresTable").parent().height(height);


        $("#measuresTable").tablesorter({
          // this will apply the bootstrap theme if "uitheme" widget is included
          // the widgetOptions.uitheme is no longer required to be set
          theme: "bootstrap",
          widthFixed: true,
          headers: {
            2: { sorter: self.type === "Network" ? "" : "savings" },
            3: { sorter: self.type !== "Network" ? "" : "savings" },
            //5: { sorter: false } //disbale sorting
          },
          headerTemplate: '{content} {icon}', // new in v2.7. Needed to add the bootstrap icon!
          // widget code contained in the jquery.tablesorter.widgets.js file
          // use the zebra stripe widget if you plan on hiding any rows (filter widget)
          widgets: ["zebra", "uitheme", "resizable", "stickyHeaders"],
          widgetOptions: {
            zebra: ["even", "odd"],
            stickyHeaders_attachTo: $("#measuresTable").parent()
          }
        }).bind("sortEnd", function() {
          self.filteredMeasures([]);
        });

      };

      function calculatePossibleSaving(measures) {
        var grouped = _.groupBy(measures, function(measure) {
          return measure.state().index();
        });
        if (!grouped.hasOwnProperty(0))
          grouped[0] = [];
        _.forEach(grouped[1], function(value) {
          grouped[0].push(value);
        });
        _.forEach(grouped[2], function(value) {
          grouped[0].push(value);
        });
        self.possibleSaving = _.reduce(grouped[0], function(memo, measure) {
          return memo + self.calculateSaving(measure);
        }, 0);
        _.forEach(measures, function(measure) {
          measure.possibleSavingInPercent = ko.observable(measure.state().index() != 3 ? self.calculateSaving(measure) / self.possibleSaving : '--');
        });
      };

      self.calculateSaving = function(measure) {
        return _.reduce(measure.energySavings(), function(memo, energySaving) {
          return memo + energySaving.value();
        }, 0);
      };

      self.searchMeasures = function() {

        var filtered = self.tableData().filter(filterMeasures);

        $("#measuresTable").find('tbody').empty();
        self.filteredMeasures([]);
        self.filteredMeasures(filtered);
        $("#measuresTable").trigger("update");


        function filterMeasures(measure) {
          var query = self.search().toLowerCase();
          if (_.contains(measure.title().toLowerCase(), query)) {
            return true;
          }
          if (_.contains(measure.description().toLowerCase(), query)) {
            return true;
          }

          if (_.contains(measure.networkCompany().company().name().toLowerCase(), query)) {
            return true;
          }

          return false;
        }
      };

      self.close = function() {
        dialog.close(this, 'close');
      };
    };

    return viewmodel;


  });