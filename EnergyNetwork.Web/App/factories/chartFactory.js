
define(['services/appsecurity', 'services/errorhandler', 'plugins/router', 'lodash'], function(appsecurity, errorhandler, router, _) {
  var factory = function() {

    this.plots = [];

    $("<div id='chartTooltip' class='tooltip tooltip-inner'></div>").css({
      position: 'absolute',
      display: "none",
      "z-index": 2000,
      opacity: 0.9
    }).appendTo("body");

    this.plotChartBy = function(type, extractedData, selectedYear, chartId, panelId, data, zoomable) {
      switch (type) {
        case 'line_EnergyConsumption':
          plotLineChart(extractedData, chartId, zoomable);
          addChartToolTip(chartId, '%');
          break;
        case 'pie_EnergyConsumption':
          plotPieChartBy(extractedData, selectedYear, chartId, panelId, data);
          addPieChartToolTip(chartId, "MWh");
          break;
        case 'bar_EnergyConsumption':
          plotMultiBarChartBy(extractedData, chartId, zoomable, "MWh");
          addChartToolTip(chartId, 'MWh');
          break;
        case 'line_CarbonDioxideEmission':
          plotLineChart(extractedData, chartId, zoomable);
          addChartToolTip(chartId, '%');
          break;
        case 'pie_CarbonDioxideEmission':
          plotPieChartBy(extractedData, selectedYear, chartId, panelId, data);
          addPieChartToolTip(chartId, "t");
          break;
        case 'pie_MeasureStates':
          plotMeasureStatesPieChart(extractedData, chartId);
          break;
        case 'bar_CarbonDioxideEmission':
          plotMultiBarChartBy(extractedData, chartId, zoomable, "t");
          addChartToolTip(chartId, 't');
          break;
        case 'line_TotalConsumption':
          plotLineChart(extractedData, chartId, zoomable, window.language.getValue("developmentOfEnergyEfficiencyComparedTo"));
          addChartToolTip(chartId, '%');
          break;
      }
    };

    function addChartToolTip(chartElementId, unit) {
      $('#' + chartElementId).bind("plothover", function(event, pos, item) {
        if (item) {
          var y = valueFormatter(item.datapoint[1]);
          $("#chartTooltip").html(item.series.label + "</br>" + y + '&nbsp;' + unit)
            .css({ top: pos.pageY - 5, left: pos.pageX + 5 })
            .fadeIn(200);
        } else {
          $("#chartTooltip").hide();
        }
      });
    };

    function addPieChartToolTip(chartElementId, unit) {
      $('#' + chartElementId).bind("plothover", function(event, pos, item) {
        if (item) {
          var y = valueFormatter(item.datapoint[1][0][1]);
          $("#chartTooltip").html(item.series.label + "</br>" + y + '&nbsp;' + unit)
            .css({ top: pos.pageY - 5, left: pos.pageX + 5 })
            .fadeIn(200);
        } else {
          $("#chartTooltip").hide();
        }
      });
    };

    function checkCompleteData(completeData, panelId, data) {
      if ($('#' + panelId + 'InfoIcon')[0]) {
        $('#' + panelId + 'InfoIcon')[0].remove();
      }
      var toolTipInfo = language.getValue('incompleteSurveys') + ":";
      var foundMissingData = false;
      for (year in completeData) {
        if (Object.keys(completeData[year]).length < data.length) {
          for (company in data) {
            if (completeData[year][data[company].company] != 0) {
              toolTipInfo = toolTipInfo + "<br/> " + year + " " + data[company].company;
              foundMissingData = true;
            }
          }
        }
      }
      if (foundMissingData) {
        var infoIcon = '<span id="' + panelId + 'InfoIcon" href="#" class="glyphicon glyphicon-exclamation-sign" style="color: goldenrod;" data-toggle="tooltip"></span>';
        $('#' + panelId + " .panel-title")[0].insertAdjacentHTML("BeforeEnd", infoIcon);
        $('#' + panelId + 'InfoIcon').tooltip({ html: true, title: toolTipInfo });
      }
    };

    function measureLabels(label, series) {
      var value = series.data[0][1];
      return "<div style='font-size:7pt; padding: 2px; color:black;'>" + label + ": " + value + "</div>";
    };

    function valueFormatter(value) {
      var number = '' + Math.round(value, 0);
      if (number.length > 3) {
        var mod = number.length % 3;
        var output = (mod > 0 ? (number.substring(0, mod)) : '');
        for (var i = 0; i < Math.floor(number.length / 3); i++) {
          if ((mod == 0) && (i == 0))
            output += number.substring(mod + 3 * i, mod + 3 * i + 3);
          else
            output += '.' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return output;
      } else
        return number;
    };

    function plotPieChartBy(extractedData, selectedYear, chartId, panelId, data) {
      if (!extractedData.chartData) {
        return;
      }
      var selectedData = [];
      selectedData[selectedYear] = extractedData.completeData[selectedYear];
      checkCompleteData(selectedData, panelId, data);

      var plot = $.plot($('#' + chartId), extractedData.chartData[selectedYear], {
        series: {
          pie: {
            show: true,
            radius: 1,
          }
        },
        grid: {
          hoverable: true
        },
        legend: {
          show: true,
        }
      });
    };

    function plotMeasureStatesPieChart(extractedData, chartId) {
      if (!extractedData.chartData) {
        return;
      }

      $.plot($('#' + chartId), extractedData.chartData, {
        series: {
          pie: {
            hoverable: true,
            show: true,
            radius: 1,
            innerRadius: 0.5,
          }
        },
        legend: {
          show: true,
          labelFormatter: measureLabels
        }
      });
    };

    function plotLineChart(extractedData, chartId, zoomable, legendAddition) {
      if (!extractedData.chartData) {
        return;
      }
      if (legendAddition) {

        _.forEach(extractedData.chartData, function(datum) {
            if (datum.label.indexOf(legendAddition) === -1) {
                datum.label = legendAddition + datum.label;
            }
        });
      }
      var plot = $.plot($('#' + chartId), extractedData.chartData, {
        grid: {
          hoverable: true,
          borderWidth: 0,
        },
        zoom: {
          interactive: zoomable
        },
        pan: {
          interactive: zoomable
        },
        yaxis: {
          tickFormatter: function(value) {
            return value + " %";
          }
        },
        xaxes: [{ tickSize: 1, tickDecimals: 0, tickLength: 0, }],
      });
      var yAxis = plot.getYAxes()[0];
      yAxis.options.panRange = [yAxis.datamin * 0.9, yAxis.datamax * 1.1];

      var xAxis = plot.getXAxes()[0];
      xAxis.options.panRange = [xAxis.datamin - 0.5, xAxis.datamax + 0.5];

      plot.draw();
    };

    function plotMultiBarChartBy(extractedData, chartId, zoomable, unit) {
      if (!extractedData.chartData) {
        return;
      }
      var chartData = extractedData.chartData;

      for (var i = 0; i < chartData.length; i++) {
        chartData[i].bars = {
          fill: true,
          fillColor: {
            colors: [
              { opacity: 1 }, { opacity: 1 }
            ]
          },
          order: i,
          barWidth: 0.15,
          lineWidth: 0.2,
          show: true
        };
      }

      var plot = $.plot($('#' + chartId), chartData, {
        grid: {
          borderWidth: 0,
          hoverable: true,
          clickable: true
        },
        zoom: {
          interactive: zoomable
        },
        pan: {
          interactive: zoomable
        },
        yaxis: {
          tickFormatter: function(value) {
            return value + " " + unit;
          }
        },
        xaxes: [{ tickSize: 1, tickDecimals: 0, tickLength: 0, }],
      });

      var yAxis = plot.getYAxes()[0];
      yAxis.options.panRange = [0, yAxis.datamax * 1.1];

      var xAxis = plot.getXAxes()[0];
      xAxis.options.panRange = [xAxis.datamin - 0.5, xAxis.datamax + 0.5];


      plot.draw();

    }

  };
  return factory;
});