define(['lodash'], function(_) {

  var fillChartDetail = function(data) {

    return reachEnergySources(data);

    function reachEnergySources(data) {
      _.forEach(data[1], function(energySource) {
        reachCompanies(data, energySource);
      });
      return data;
    }

    function reachCompanies(data, energySource) {
      _.forEach(energySource.values, function(company) {
        reachYears(data, company);
      });
      return energySource;
    }

    function reachYears(data, company) {
      _.forEach(data[0], function(year) {
        company = fillCompanyValues(company, year);
      });
      company.values = _.sortBy(company.values, function(o) {
        return o.year;
      });

      for (var i = company.values.length - 1; i > 0; i--) {
        if (company.values[i].year === company.values[i - 1].year) {
          company.values[i - 1].value += company.values[i].value;
          company.values.splice(i);
        }
      }

      return company;
    }

    function fillCompanyValues(company, year) {
      var dataMissing = !(_.some(company.values, function(reading) {
        return year.year == reading.year;
      }));

      if (dataMissing) {
        company.values.push({ year: year.year, value: '-' });
      }
      return company;
    }

  };

  return fillChartDetail;
})