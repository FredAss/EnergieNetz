using System;
using System.Net;
using System.Web;
using System.Web.Mvc;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using EnergyNetwork.Web.Results;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;

namespace EnergyNetwork.Web.Controllers
{
  public class ExcelExportController: Controller
  {
    private ApplicationUserManager _userManager;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IExcelExportGenerator _excelExport;

    public ExcelExportController(IUnitOfWork unitOfWork, IExcelExportGenerator excelExport)
    {
      _unitOfWork = unitOfWork;
      _excelExport = excelExport;
    }

    public ApplicationUserManager UserManager
    {
      get
      {
        return _userManager ?? System.Web.HttpContext.Current.GetOwinContext().
          GetUserManager<ApplicationUserManager>();
      }
      private set
      {
        _userManager = value;
      }
    }

    [HttpGet]
    [Authorize(Roles = "Administrator,User")]
    public ActionResult ExportMeasureDataBy(string id)
    {
      Guid parentId;
      string fname;

      if (!Guid.TryParse(id,
        out parentId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());
      var networkCompany = _unitOfWork.NetworkCompanyRepository.First(c => c.NetworkCompanyId == parentId,
        "Measures.EnergySavings.EnergySource,Measures.State,Company");

      if (networkCompany != null)
      {
        if (!UserManager.HasPermission(userProfile,
          networkCompany.CompanyId))
        {
          return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
        }
        fname = "Maßnahmen " + networkCompany.Company.Name + " " + DateTime.Now;

        try
        {
          return new ExcelResult(_excelExport.ExportCompanyMeasures(networkCompany),
            fname);
        }
        catch (Exception)
        {
          return null;
        }
      }

      var network = _unitOfWork.NetworkRepository.First(n => n.NetworkId == parentId,
        "NetworkCompanies.Measures.EnergySavings.EnergySource, NetworkCompanies.Measures.State, NetworkCompanies.Company");

      if (network == null)
      {
        return new HttpStatusCodeResult(HttpStatusCode.NotFound);
      }

      fname = "Maßnahmen " + network.Name + " " + DateTime.Now;

      try
      {
        return new ExcelResult(_excelExport.ExportNetworkMeasures(network),
          fname);
      }
      catch (Exception)
      {
        return null;
      }
    }

    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    public ActionResult ExportCompanyDataBy(string id)
    {
      Guid networkCompanyId;
      if (!Guid.TryParse(id,
        out networkCompanyId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
      }

      var networkCompany = _unitOfWork.NetworkCompanyRepository.First(c => c.NetworkCompanyId == networkCompanyId,
        "Surveys.Readings.EnergySource, Company, Company.Address, Company.Employees, Measures.EnergySavings ,Measures.State");

      if (networkCompany == null)
      {
        return new HttpStatusCodeResult(HttpStatusCode.NotFound);
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());
      if (!UserManager.HasPermission(userProfile,
        networkCompany.CompanyId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.Forbidden);
      }


      var fname = "Übersicht " + networkCompany.Company.Name + " " + DateTime.Now;

      try
      {
        return new ExcelResult(_excelExport.ExportCompanyData(networkCompany), fname);
      }
      catch (Exception)
      {
        return null;
      }
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public ActionResult ExportNetworkDataBy(string id)
    {
      Guid networkId;
      if (!Guid.TryParse(id,
        out networkId))
      {
        return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
      }


      var network = _unitOfWork.NetworkRepository.First(n => n.NetworkId == networkId,
        "NetworkCompanies, NetworkCompanies.Surveys.Readings.EnergySource, NetworkCompanies.Company, NetworkCompanies.Company.Address, NetworkCompanies.Company.Employees, NetworkCompanies.Measures.EnergySavings ,NetworkCompanies.Measures.State");

      if (network == null)
      {
        return new HttpStatusCodeResult(HttpStatusCode.NotFound);
      }

      var fname = "Übersicht " + network.Name + " " + DateTime.Now;
      try
      {
        return new ExcelResult(_excelExport.ExportNetworkData(network), fname);
      }
      catch (Exception)
      {
        return null;
      }
    }
  }
}