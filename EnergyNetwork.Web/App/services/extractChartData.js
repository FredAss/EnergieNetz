define(['lodash'], function(_) {
  return {
    extractChartData: extractChartData,

  };

  function extractChartData(data, type) {

    var extractedData;

    switch (type) {
      case 'line_EnergyConsumption':
        extractedData = extractLineChartData(data, "energyConsume");
        break;
      case 'pie_EnergyConsumption':
        extractedData = extractPieChartData(data, "energyConsume");
        break;
      case 'pie_MeasureStates':
        extractedData = extractMeasureStatesPieChartData(data);
        break;
      case 'bar_EnergyConsumption':
        extractedData = extractBarChartData(data, "energyConsume");
        break;
      case 'line_CarbonDioxideEmission':
        extractedData = extractLineChartData(data, "carbonDioxideEmission");
        break;
      case 'pie_CarbonDioxideEmission':
        extractedData = extractPieChartData(data, "carbonDioxideEmission");
        break;
      case 'bar_CarbonDioxideEmission':
        extractedData = extractBarChartData(data, "carbonDioxideEmission");
        break;
      case 'line_TotalConsumption':
        extractedData = extractChartDataForTotalConsumption(data, "energyConsume");
        break;
    }
    return extractedData;
  }

  function extractLineChartData(data, type) {
    var self = this;
    var chartData = [];
    var minX = 0;
    var sourceValues = [],
        sourceColors = [];
    var foundData = false;
    _.forEach(data, function(company) {
        _.forEach(company.values, function (value) {
            var energySourceTranslated = language.getValue(value.energySource);
        if (energySourceTranslated in sourceValues) {
          if (value.year in sourceValues[energySourceTranslated]) {
            sourceValues[energySourceTranslated][value.year] += value[type];
          } else {
            sourceValues[energySourceTranslated][value.year] = value[type];
            sourceColors[energySourceTranslated] = value.energySourceColor;
          }
        } else {
          sourceValues[energySourceTranslated] = [];
          sourceValues[energySourceTranslated][value.year] = value[type];
          sourceColors[energySourceTranslated] = value.energySourceColor;
        }

        if (minX > value.year || minX == 0) {
          minX = value.year;
        }
        foundData = true;
      });
    });
    if (!foundData) {
      return { chartData: false };
    };
    var sourceData = [];
    var valueRelativToBaseYear;
    for (source in sourceValues) {
      sourceData[source] = [];
      for (year in sourceValues[source]) {
        valueRelativToBaseYear = (sourceValues[source][year] / sourceValues[source][minX] * 100);
        if (year == minX) {
          sourceData[source].push([year, 100]);
        } else {
          sourceData[source].push([year, valueRelativToBaseYear]);
        }
      }
      sourceData[source].sort();
    }

    for (key in sourceData) {
      chartData.push({ 'label': key, 'data': sourceData[key], 'lines': { show: true }, 'color': sourceColors[key] });
    }

    return { chartData: chartData };
  }

  function extractBarChartData(data, type) {
    var self = this;
    var chartData = [],
        sourceColors = [];
    var sourceValues = [];
    var foundData = false;
    _.forEach(data, function(company) {
      _.forEach(company.values, function(value) {
          var energySourceTranslated = language.getValue(value.energySource);
        if (energySourceTranslated in sourceValues) {
          if (value.year in sourceValues[energySourceTranslated]) {
            sourceValues[energySourceTranslated][value.year] += value[type] / 1000;
          } else {
            sourceValues[energySourceTranslated][value.year] = value[type] / 1000;
            sourceColors[energySourceTranslated] = value.energySourceColor;
          }
        } else {
          sourceValues[energySourceTranslated] = [];
          sourceValues[energySourceTranslated][value.year] = value[type] / 1000;
          sourceColors[energySourceTranslated] = value.energySourceColor;
        }
        foundData = true;
      });
    });
    if (!foundData) {
      return { chartData: false };
    };
    var sourceData = [];
    for (source in sourceValues) {
      sourceData[source] = [];
      for (year in sourceValues[source]) {
        sourceData[source].push([year, sourceValues[source][year]]);
      }
    }

    for (key in sourceData) {
      chartData.push({ 'label': key, 'data': sourceData[key], 'color': sourceColors[key] });
    }

    return { chartData: chartData };
  }

  function extractChartDataForTotalConsumption(data, type) {
    var self = this;
    var chartData = [];
    var minX = 0;
    var energy = [];
    var carbondioxide = [];
    var foundData = false;
    var completeData = [];
    _.forEach(data, function(company) {
      _.forEach(company.values, function(value) {
        if (value.year in energy) {
          energy[value.year] += value.energyConsume;
          completeData[value.year][company.company] = 0;
        } else {
          energy[value.year] = value.energyConsume;
          completeData[value.year] = [];
          completeData[value.year][company.company] = 0;
        }

        if (value.year in carbondioxide)
          carbondioxide[value.year] += value.carbonDioxideEmission;
        else
          carbondioxide[value.year] = value.carbonDioxideEmission;

        if (minX > value.year || minX == 0) {
          minX = value.year;
        }
        foundData = true;
      });

    });
    if (!foundData) {
      return { chartData: false };
    };
    pushDataToChart("", carbondioxide, "#BF0000");
    pushDataToChart("", energy, "#0000BF");

    function pushDataToChart(label, values, color) {
      var yearlyValues = [];
      yearlyValues.label = label + minX;
      yearlyValues.color = color;
      yearlyValues.data = [];
      var base = values[minX];
      for (year in values) {
        if (year == minX)
          yearlyValues.data.push([year, 100]);
        else
          yearlyValues.data.push([year, (values[year] / base * 100)]);
      }
      yearlyValues.data.sort();
      chartData.push(yearlyValues);
    }

    for (var i = 0; i < chartData.length; i++) {
      chartData[i].lines = {
        show: true
      };
    }

    return { chartData: chartData };
  }

  function extractPieChartData(data, type) {
    var chartData = [];
    var yearlyValues = [];
    var sourceColors = [];
    var foundData = false;
    var completeData = [];

    _.forEach(data, function(company) {
      _.forEach(company.values, function(value) {
          var energySourceTranslated = language.getValue(value.energySource);
        if (value.year in yearlyValues) {
          if (energySourceTranslated in yearlyValues[value.year]) {
            yearlyValues[value.year][energySourceTranslated] += value[type] / 1000;;
          } else {
            yearlyValues[value.year][energySourceTranslated] = [];
            yearlyValues[value.year][energySourceTranslated] = value[type] / 1000;;
            sourceColors[energySourceTranslated] = value.energySourceColor;
          }
          completeData[value.year][company.company] = 0;
        } else {
          chartData[value.year] = [];
          completeData[value.year] = [];
          completeData[value.year][company.company] = 0;
          yearlyValues[value.year] = [];
          yearlyValues[value.year][energySourceTranslated] = [];
          yearlyValues[value.year][energySourceTranslated] = value[type] / 1000;;
          sourceColors[energySourceTranslated] = value.energySourceColor;
        }
        foundData = true;
      });
    });


    if (!foundData) {
      return { chartData: false };
    };

    for (year in yearlyValues) {
      for (source in yearlyValues[year]) {
        chartData[year].push({ "label": source, "data": yearlyValues[year][source], "color": sourceColors[source] });
      }
    }

    chartData = _.map(chartData, function(yearlyValues) {
      return _.sortBy(yearlyValues, function(value) {
        return value.label;
      });
    });

    var allYears = Object.keys(yearlyValues);
    var minYear = _.min(allYears);
    var maxYear = _.max(allYears);

    return { chartData: chartData, yearlyValues: yearlyValues, foundData: foundData, completeData: completeData, minYear: minYear, maxYear: maxYear };
  }

  function extractMeasureStatesPieChartData(measureDetailExtractor) {
    var chartData = [];

    chartData.push({ "label": language.getValue('open'), "data": measureDetailExtractor.openMeasures(), "color": "#f0854e" });
    chartData.push({ "label": language.getValue('inProgress'), "data": measureDetailExtractor.inProgressMeasures(), "color": "#428bca" });
    chartData.push({ "label": language.getValue('finished'), "data": measureDetailExtractor.completedMeasures(), "color": "#539d44" });
    chartData.push({ "label": language.getValue('rejected'), "data": measureDetailExtractor.rejectedMeasures(), "color": "#a2a2a2" });

    return { chartData: chartData };
  }
});