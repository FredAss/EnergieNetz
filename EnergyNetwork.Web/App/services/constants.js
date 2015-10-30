define(function() {

  var baseUrl = '';

  function post() {
    if (baseUrl.length != 0) {
      return '/' + baseUrl;
    }
    return '';
  };

  function pre() {
    if (baseUrl.length != 0) {
      return baseUrl + '/';
    }
    return '';
  };


  return {
    baseUrl: baseUrl,
    postBaseUrl: post,
    preBaseUrl: pre,
    TOTAL_CONSUMPTION_LINECHART: 'line_TotalConsumption',
    ENERGY_CONSUMPTION_PIECHART: 'pie_EnergyConsumption',
    ENERGY_CONSUMPTION_LINECHART: 'line_EnergyConsumption',
    ENERGY_CONSUMPTION_BARCHART: 'bar_EnergyConsumption',
    CARBONDIOXIDEMISSION_PIECHART: 'pie_CarbonDioxideEmission',
    CARBONDIOXIDEMISSION_LINECHART: 'line_CarbonDioxideEmission',
    CARBONDIOXIDEMISSION_BARCHART: 'bar_CarbonDioxideEmission',
    TOTAL_CONSUMPTION_LINECHART_TITLE: 'developmentOfEnergyEfficiency',
    ENERGY_CONSUMPTION_PIECHART_TITLE: 'energyConsumption',
    ENERGY_CONSUMPTION_LINECHART_TITLE: 'developmentOfEnergyConsumption',
    ENERGY_CONSUMPTION_BARCHART_TITLE: 'developmentOfEnergyConsumption',
    CARBONDIOXIDEMISSION_PIECHART_TITLE: 'carbonDioxideEmissions',
    CARBONDIOXIDEMISSION_LINECHART_TITLE: 'developmentOfCarbonDioxideEmissions',
    CARBONDIOXIDEMISSION_BARCHART_TITLE: 'developmentOfCarbonDioxideEmissions',

    //Tooltips
    EXCEL_EXPORT: 'exportData',

  };


});