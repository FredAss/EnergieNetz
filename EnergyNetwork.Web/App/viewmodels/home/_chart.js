define([
    'services/logger'
  ],
  function(logger) {

    var viewmodel = function(data, options, size, axesLabel) {
      var self = this;
      this.id = breeze.core.getUuid();
      this.size = size;
      this.plot = '';
      
      this.attached = function(view, parent) {
        plotChart();
      };

      this.acitvate = function() {
      };

      function plotChart() {
        var container = $('#' + self.id);
        self.plot = $.plot(container, data, options);
        var xaxisLabel = $("<div class='axisLabel xaxisLabel'></div>")
          .text(axesLabel.xaxisLabel)
          .appendTo(container);
        var yaxisLabel = $("<div class='axisLabel yaxisLabel'></div>")
          .text(axesLabel.yaxisLabel)
          .appendTo(container);
        self.plot.draw();
      };
    };
    return viewmodel;
  });