using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace EnergyNetwork.Web.Controllers
{
  [RoutePrefix("api/Utils")]
  public class UtilsController: ApiController
  {
    private readonly IUnitOfWork _unitOfWork;
    private ApplicationUserManager _userManager;

    public UtilsController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    public ApplicationUserManager UserManager
    {
      get
      {
        return _userManager ?? HttpContext.Current.GetOwinContext().
          GetUserManager<ApplicationUserManager>();
      }
      private set
      {
        _userManager = value;
      }
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [Route("companyRanking")]
    public Object CompanyRanking(string id)
    {
      Guid networkId;

      if (!Guid.TryParse(id,
        out networkId))
      {
        return BadRequest();
      }
      var network = _unitOfWork.NetworkRepository.First(n => n.NetworkId == networkId,
        "NetworkCompanies.Surveys.CompanySize, NetworkCompanies.Surveys.Areas, NetworkCompanies.Surveys.Readings, NetworkCompanies.Surveys.NetworkCompany.Company");

      if (network == null)
      {
        return NotFound();
      }

      var ranking = from networkCompany in network.NetworkCompanies
        from survey in networkCompany.Surveys
        where survey.Fulfilled
        group survey by survey.Title
        into relatedYear
        select new{
                    RelatedYear = relatedYear.Key,
                    AdminMode = true,
                    Companies = from survey in relatedYear
                      let totalEnergyConsumption = (from reading in survey.Readings select reading.Value).Sum()
                      let totalAreaSize = (from area in survey.Areas select area.Size).Sum()
                      select new{
                                  IsSelectedCompany = false,
                                  HasPermission = true,
                                  CompanyName = survey.NetworkCompany.Company.Name,
                                  survey.NetworkCompany.CompanyId,
                                  Id = survey.SurveyId,
                                  survey.CompanySize.NumberOfEmployees,
                                  survey.CompanySize.TotalRevenue,
                                  TotalAreaSize = totalAreaSize,
                                  TotalEnergyConsumption = totalEnergyConsumption,
                                  EnergyConsumptionPerEmployee = totalEnergyConsumption / survey.CompanySize.NumberOfEmployees,
                                  EnergyConsumptionPerTotalRevenue = totalEnergyConsumption / survey.CompanySize.TotalRevenue,
                                  EnergyConsumptionPerAreaSize = totalEnergyConsumption / totalAreaSize
                                }
                  };

      return ranking.OrderBy(x => x.RelatedYear,
        new SemiNumericComparer());
    }

    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [Route("companyRankingByCompany")]
    public Object CompanyRankingByCompany(string id, string selectedCompanyId)
    {
      Guid networkId;
      Guid companyId;
      if (!Guid.TryParse(id,
        out networkId) || !Guid.TryParse(selectedCompanyId,
          out companyId))
      {
        return BadRequest();
      }
      var network = _unitOfWork.NetworkRepository.First(n => n.NetworkId == networkId,
        "NetworkCompanies.Surveys.CompanySize, NetworkCompanies.Surveys.Areas, NetworkCompanies.Surveys.Readings, NetworkCompanies.Surveys.NetworkCompany.Company");

      if (network == null)
      {
        return NotFound();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var ranking = from networkCompany in network.NetworkCompanies
        from survey in networkCompany.Surveys
        where survey.Fulfilled
        group survey by survey.Title
        into relatedYear
        select new{
                    RelatedYear = relatedYear.Key,
                    AdminMode = false,
                    Companies = from survey in relatedYear
                      let permission = UserManager.HasPermission(userProfile,
                        survey.NetworkCompany.CompanyId)
                      let totalEnergyConsumption = (from reading in survey.Readings select reading.Value).Sum()
                      let totalAreaSize = (from area in survey.Areas select area.Size).Sum()
                      select new{
                                  IsSelectedCompany = (companyId == survey.NetworkCompany.CompanyId),
                                  HasPermission = permission,
                                  CompanyName = permission ? survey.NetworkCompany.Company.Name : "...",
                                  survey.NetworkCompany.CompanyId,
                                  Id = survey.SurveyId,
                                  NumberOfEmployees = permission ? survey.CompanySize.NumberOfEmployees : 0,
                                  TotalRevenue = permission ? survey.CompanySize.TotalRevenue : 0,
                                  TotalAreaSize = permission ? totalAreaSize : 0,
                                  TotalEnergyConsumption = permission ? totalEnergyConsumption : 0,
                                  EnergyConsumptionPerEmployee = totalEnergyConsumption / survey.CompanySize.NumberOfEmployees,
                                  EnergyConsumptionPerTotalRevenue = totalEnergyConsumption / survey.CompanySize.TotalRevenue,
                                  EnergyConsumptionPerAreaSize = totalEnergyConsumption / totalAreaSize
                                }
                  };

      return ranking.OrderBy(x => x.RelatedYear,
        new SemiNumericComparer());
    }

    public class SemiNumericComparer: IComparer<string>
    {
      public int Compare(string s1, string s2)
      {
        if (IsNumeric(s1) && IsNumeric(s2))
        {
          return Convert.ToInt32(s1) - Convert.ToInt32(s2);
        }

        if (IsNumeric(s1) && !IsNumeric(s2))
        {
          return 1;
        }

        if (!IsNumeric(s1) && IsNumeric(s2))
        {
          return -1;
        }

        return string.Compare(s1,
          s2,
          true);
      }

      public static bool IsNumeric(object value)
      {
        int isNumber;
        return Int32.TryParse(value.ToString(),
          out isNumber);
      }
    }

    /// <summary>
    ///   Get all Data to create network charts
    /// </summary>
    /// <returns>Object</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [Route("networkChartDataBy")]
    public Object NetworkChartDataBy(string id)
    {
      Guid networkId = Guid.Parse(id);
      Network network;
      try
      {
        network = _unitOfWork.NetworkRepository.Get(n => n.NetworkId == networkId,
          null,
          "NetworkCompanies.Surveys.Readings.EnergySource, NetworkCompanies.Company").
          First();
      }
      catch
      {
        return null;
      }
      var chartDataQuery = from networkCompany in network.NetworkCompanies
        select new{
                    Company = networkCompany.Company.Name,
                    Values = from survey in networkCompany.Surveys
                      where survey.Fulfilled
                      from reading in survey.Readings
                      select new{
                                  survey.Date.Year,
                                  EnergyConsume = reading.Value,
                                  CarbonDioxideEmission = (reading.Value * reading.EnergySource.CO2Equivalent) / 1000,
                                  EnergySource = reading.EnergySource.Name,
                                  EnergySourceColor = reading.EnergySource.Color
                                }
                  };

      return chartDataQuery;
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [Route("networkChartDataDetailsBy")]
    public Object NetworkChartDataDetailsBy(string id, string type)
    {
      Guid networkId = Guid.Parse(id);
      Network network;
      try
      {
        network = _unitOfWork.NetworkRepository.Get(n => n.NetworkId == networkId,
          null,
          "NetworkCompanies.Surveys.Readings.EnergySource, NetworkCompanies.Company").
          First();
      }
      catch
      {
        return null;
      }

      var chartDataQuery = new object[2];

      chartDataQuery[0] = (from networkCompany in network.NetworkCompanies
        from survey in networkCompany.Surveys
        where survey.Fulfilled
        from reading in survey.Readings
        orderby survey.Date.Year
        group survey by survey.Date.Year
        into years
        select new{
                    Year = years.Key
                  });

      chartDataQuery[1] = (from networkCompany in network.NetworkCompanies
        from survey in networkCompany.Surveys
        where survey.Fulfilled
        from reading in survey.Readings
        orderby reading.EnergySource.Name
        group reading by reading.EnergySource
        into energySources
        select new{
                    energySources.Key.Name,
                    Values = from networkCompany in network.NetworkCompanies
                      group networkCompany by networkCompany
                      into networkCompanies
                      select new{
                                  Company = networkCompanies.Key.Company.Name,
                                  Values = from networkCompany in networkCompanies
                                    from survey in networkCompany.Surveys
                                    where survey.Fulfilled
                                    from reading in survey.Readings
                                    orderby networkCompanies.Key.Company.Name, survey.Date.Year
                                    where reading.EnergySource == energySources.Key
                                    select new{
                                                survey.Date.Year,
                                                Value = reading.Value / 1000
                                              }
                                }
                  });


      return chartDataQuery;
    }

    /// <summary>
    ///   Get all Data to create company charts
    /// </summary>
    /// <returns>Object</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [Route("networkCompanyChartDataBy")]
    public Object NetworkCompanyChartDataBy(string id)
    {
      Guid networkCompanyId = Guid.Parse(id);
      NetworkCompany networkCompany;
      try
      {
        networkCompany = _unitOfWork.NetworkCompanyRepository.Get(c => c.NetworkCompanyId == networkCompanyId,
          null,
          "Surveys.Readings.EnergySource, Company").
          First();
      }
      catch
      {
        return null;
      }

      var chartDataQuery = new object[1];
      chartDataQuery[0] = new{
                               Company = networkCompany.Company.Name,
                               Values = from survey in networkCompany.Surveys
                                 where survey.Fulfilled
                                 from reading in survey.Readings
                                 select new{
                                             survey.Date.Year,
                                             EnergyConsume = reading.Value,
                                             CarbonDioxideEmission = (reading.Value * reading.EnergySource.CO2Equivalent) / 1000,
                                             EnergySource = reading.EnergySource.Name,
                                             EnergySourceColor = reading.EnergySource.Color
                                           },
                             };

      return chartDataQuery;
    }

    /// <summary>
    ///   Get all Data to create network charts
    /// </summary>
    /// <returns>Object</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [Route("networksTotalEnergyConsumption")]
    public Object NetworksTotalEnergyConsumption()
    {
      IEnumerable<Network> networks;
      try
      {
        networks = _unitOfWork.NetworkRepository.All().
          Include("NetworkCompanies.Surveys.Readings.EnergySource");
      }
      catch
      {
        return null;
      }

      var chartDataQuery = from network in networks
        orderby network.Name
        select new{
                    NetworkName = network.Name,
                    Values = from networkCompany in network.NetworkCompanies
                      from survey in networkCompany.Surveys
                      where survey.Fulfilled
                      from reading in survey.Readings
                      orderby survey.Date.Year
                      group reading by new{
                                            survey.Date.Year
                                          }
                      into groupedReadings
                      select new{
                                  EnergyConsume = groupedReadings.Sum(s => s.Value),
                                  CarbonDioxideEmission = groupedReadings.Sum(s => (s.Value * s.EnergySource.CO2Equivalent) / 1000)
                                }
                  };

      return chartDataQuery;
    }


    [HttpGet]
    [Authorize(Roles = "Administrator,User")]
    [Route("networkCompanyChartDataDetailsBy")]
    public Object NetworkCompanyChartDataDetailsBy(string id, string type)
    {
      Guid networkCompanyId = Guid.Parse(id);
      NetworkCompany networkCompany;
      try
      {
        networkCompany = _unitOfWork.NetworkCompanyRepository.Get(n => n.NetworkCompanyId == networkCompanyId,
          null,
          "Surveys.Readings.EnergySource, Company").
          First();
      }
      catch
      {
        return null;
      }

      var chartDataQuery = new object[2];

      chartDataQuery[0] = from survey in networkCompany.Surveys
        where survey.Fulfilled
        from reading in survey.Readings
        orderby survey.Date.Year
        group survey by survey.Date.Year
        into years
        select new{
                    Year = years.Key
                  };

      chartDataQuery[1] = from survey in networkCompany.Surveys
        where survey.Fulfilled
        from reading in survey.Readings
        orderby reading.EnergySource.Name
        group reading by reading.EnergySource
        into energySources
        select new{
                    energySources.Key.Name,
                    Values = from reading in energySources.Key.Name
                      group networkCompany by networkCompany.Company.Name
                      into company
                      select new{
                                  Company = company.Key,
                                  Values = from survey in networkCompany.Surveys
                                    where survey.Fulfilled
                                    from reading in survey.Readings
                                    orderby survey.Date.Year
                                    where reading.EnergySource == energySources.Key
                                    select new{
                                                survey.Date.Year,
                                                Value = reading.Value / 1000
                                              }
                                }
                  };

      return chartDataQuery;
    }
    
    [HttpGet]
    [Authorize(Roles = "Administrator,User")]
    [Route("financialCalculation")]
    public Object FinancialCalculation(string id)
    {
      Guid comparisonId;

      if (!Guid.TryParse(id,
        out comparisonId))
      {
        return BadRequest();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      Comparison comparison = _unitOfWork.ComparisonRepository.First(c => c.ComparisonId == comparisonId,
        "InvestmentPlan");

      if (comparison == null)
      {
        return NotFound();
      }

      var companyId = comparison.InvestmentPlan.CompanyId.GetValueOrDefault();

      if (!UserManager.HasPermission(userProfile,
        companyId))
      {
        return null;
      }


      var financialCalculation = new FinancialCalculation(comparison.InvestmentPlan,
        comparison);

      var calculation = new object();

      try
      {
        calculation = new
        {
          financialCalculation.DynamicAmortization,
          financialCalculation.DynamicAmortizationPercentage,
          financialCalculation.InterneVerzinsung,
          financialCalculation.JahreskostenAltNeu,
          financialCalculation.JahreskostenVergleich,
          financialCalculation.Kapitalwert,
          financialCalculation.Kostenersparnis,
          financialCalculation.KreditFürInvestition,
          financialCalculation.StaticAmortization,
          financialCalculation.StaticAmortizationPercentage,
          financialCalculation.KapitalwertArrayInvestition,
          financialCalculation.KapitalwertArrayKosten,
          financialCalculation.KapitalwertArrayNutzungsdauer,
          financialCalculation.Payments,
          financialCalculation.ComparisonName,
          Amortisation10Percent = financialCalculation.DynamicAmortization,
          Amortisation10PercentPercentage = financialCalculation.DynamicAmortizationPercentage,
          JährlicheKostenUndErträge = financialCalculation.KapitalwertArrayKosten[500,
            0],
          CapitalValue10Percent = financialCalculation.Kapitalwert,
          CapitalValue10PercentPercentage = financialCalculation.Kapitalwert,
          InterestRate =
            financialCalculation.InvestmentPlanModel == null
              ? 0
              : financialCalculation.InvestmentPlanModel.ImputedInterestRate*100,
          Lifetime =
            financialCalculation.InvestmentPlanModel == null ? 0 : financialCalculation.InvestmentPlanModel.Lifetime
        };
      }
      catch (NullReferenceException e)
      {
        calculation = new {error = true};
      }

      return calculation;
    }
  }
}