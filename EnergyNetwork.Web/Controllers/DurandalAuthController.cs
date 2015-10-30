using System;
using System.Linq;
using System.Web;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.WebApi2;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Web.Helpers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json.Linq;

namespace EnergyNetwork.Web.Controllers
{
  /// <summary>
  /// Main controller retrieving information from the data store
  /// </summary>
  [BreezeController]
  public class DurandalAuthController: ApiController
  {
    private readonly IUnitOfWork _unitOfWork;
    private ApplicationUserManager _userManager;
    private RoleManager<IdentityRole> _roleManager;


    public RoleManager<IdentityRole> RoleManager
    {
      get
      {
        return _roleManager ?? HttpContext.Current.GetOwinContext().
          Get<ApplicationRoleManager>();
      }
      private set
      {
        _roleManager = value;
      }
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

    public DurandalAuthController(IUnitOfWork unitOfWork)
    {
      _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Get all networks
    /// </summary>
    /// <returns>IQueryable networks</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<Network> Networks()
    {
      return _unitOfWork.NetworkRepository.All();
    }

    /// <summary>
    /// Get all networkCompanies
    /// </summary>
    /// <returns>IQueryable networkCompanies</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<NetworkCompany> NetworkCompanies()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.NetworkCompanyRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.NetworkCompanyRepository.Get(i => i.CompanyId == companyId);
    }

    /// <summary>
    /// Get all changeSets
    /// </summary>
    /// <returns>IQueryable changeSet</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<ChangeSet> ChangeSets()
    {
        if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
        {
            return _unitOfWork.ChangeSetRepository.All();
        }

        UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

        var companyId = userProfile.CompanyId.ToString();
        return _unitOfWork.ChangeSetRepository.Get(i => i.AffectedCompanyId == companyId);
    }

    /// <summary>
    /// Get all changes
    /// </summary>
    /// <returns>IQueryable change</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<Change> Changes()
    {
      return _unitOfWork.ChangeRepository.All();
    }


    /// <summary>
    /// Get all companies
    /// </summary>
    /// <returns>IQueryable companies</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Company> Companies()
    {
        if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
        {
            return _unitOfWork.CompanyRepository.All();
        }

        UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

        var companyId = userProfile.CompanyId;
        return _unitOfWork.CompanyRepository.Get(i => i.CompanyId == companyId);
    }

    /// <summary>
    /// Get all invitations
    /// </summary>
    /// <returns>IQueryable invitations</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Invitation> Invitations()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.InvitationRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.InvitationRepository.Get(i => i.CompanyId == companyId);
    }

    /// <summary>
    /// Get all measures
    /// </summary>
    /// <returns>IQueryable measures</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Measure> Measures()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.MeasureRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.MeasureRepository.Get(i => i.NetworkCompany.CompanyId == companyId);
    }

    /// <summary>
    /// Get all companySizes
    /// </summary>
    /// <returns>IQueryable companySizes</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<CompanySize> CompanySizes()
    {
      return _unitOfWork.CompanySizeRepository.All();
    }

    /// <summary>
    /// Get all fiscalYears
    /// </summary>
    /// <returns>IQueryable fiscalYears</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<FiscalYear> FiscalYears()
    {
      return _unitOfWork.FiscalYearRepository.All();
    }

    /// <summary>
    /// Get all operationTimes
    /// </summary>
    /// <returns>IQueryable operationTimes</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<OperationTime> OperationTimes()
    {
      return _unitOfWork.OperationTimeRepository.All();
    }

    /// <summary>
    /// Get all measureStates
    /// </summary>
    /// <returns>IQueryable measures</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<MeasureState> MeasureStates()
    {
      return _unitOfWork.MeasureStateRepository.All();
    }

    /// <summary>
    /// Get all measures
    /// </summary>
    /// <returns>IQueryable energySource</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<EnergySource> EnergySources()
    {
      return _unitOfWork.EnergySourceRepository.All();
    }

    /// <summary>
    /// Get all OutputUnits
    /// </summary>
    /// <returns>IQueryable outputUnits</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<OutputUnit> OutputUnits()
    {
      return _unitOfWork.OutputUnitRepository.All();
    }

    /// <summary>
    /// Get all EnergySavings
    /// </summary>
    /// <returns>IQueryable energySavings</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<EnergySaving> EnergySavings()
    {
      return _unitOfWork.EnergySavingRepository.All();
    }

    /// <summary>
    /// Get all Surveys
    /// </summary>
    /// <returns>IQueryable survey</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Survey> Surveys()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.SurveyRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.SurveyRepository.Get(i => i.NetworkCompany.CompanyId == companyId);
    }
    
    /// <summary>
    /// Get all Areas
    /// </summary>
    /// <returns>IQueryable area</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Area> Areas()
    {
      return _unitOfWork.AreaRepository.All();
    }

    /// <summary>
    /// Get all Products
    /// </summary>
    /// <returns>IQueryable product</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Product> Products()
    {
      return _unitOfWork.ProductRepository.All();
    }

    /// <summary>
    /// Get all ProductionTimes
    /// </summary>
    /// <returns>IQueryable productionTime</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<ProductionTime> ProductionTimes()
    {
      return _unitOfWork.ProductionTimeRepository.All();
    }

    /// <summary>
    /// Get all Readings
    /// </summary>
    /// <returns>IQueryable reading</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Reading> Readings()
    {
      return _unitOfWork.ReadingRepository.All();
    }

    /// <summary>
    /// Get all ImportantTopics
    /// </summary>
    /// <returns>IQueryable importantTopics</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<ImportantTopic> ImportantTopics()
    {
      return _unitOfWork.ImportantTopicRepository.All();
    }
    
    /// <summary>
    /// Get all Documents
    /// </summary>
    /// <returns>IQueryable document</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [BreezeQueryable(MaxExpansionDepth = 3)]
    public IQueryable<Document> Documents()
    {
      return _unitOfWork.DocumentRepository.All();
    }

    /// <summary>
    /// Get all InvestmentPlans
    /// </summary>
    /// <returns>IQueryable investmentPlans</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<InvestmentPlan> InvestmentPlans()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.InvestmentPlanRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.InvestmentPlanRepository.Get(i => i.CompanyId == companyId);
    }

    /// <summary>
    /// Get all Comparisons
    /// </summary>
    /// <returns>IQueryable comparisons</returns>
    [HttpGet]
    [Authorize(Roles = "Administrator, User")]
    [BreezeQueryable(MaxExpansionDepth = 4)]
    public IQueryable<Comparison> Comparisons()
    {
      if (UserManager.IsInRole(User.Identity.GetUserId(),
        "Administrator"))
      {
        return _unitOfWork.ComparisonRepository.All();
      }

      UserProfile userProfile = UserManager.FindById(User.Identity.GetUserId());

      var companyId = userProfile.CompanyId;
      return _unitOfWork.ComparisonRepository.Get(i => i.InvestmentPlan.CompanyId == companyId);
    }

    /// <summary>
    /// Save changes to data store
    /// </summary>
    /// <param name="saveBundle">The changes</param>
    /// <returns>Save result</returns>
    [HttpPost]
    [Authorize]
    public SaveResult SaveChanges(JObject saveBundle)
    {
      return _unitOfWork.Commit(saveBundle);
    }
  }
}