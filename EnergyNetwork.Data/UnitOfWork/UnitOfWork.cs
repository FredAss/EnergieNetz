using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using EnergyNetwork.Data.Repositories;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.Repositories;
using EnergyNetwork.Domain.UnitOfWork;
using EnergyNetwork.Domain.Validators;
using EntityFramework.Audit;
using EntityFramework.Extensions;
using Newtonsoft.Json.Linq;

namespace EnergyNetwork.Data.UnitOfWork
{
  /// <summary>
  ///   Implementation for the UnitOfWork in the current app
  /// </summary>
  public class UnitOfWork: IUnitOfWork
  {
    private readonly AuditLogger _audit;
    private readonly EFContextProvider<EnergyNetworkDbContext> _contextProvider;

    /// <summary>
    ///   ctor
    /// </summary>
    public UnitOfWork(IBreezeValidator breezevalidator)
    {
      _contextProvider = new EFContextProvider<EnergyNetworkDbContext>();
      _contextProvider.BeforeSaveEntitiesDelegate = breezevalidator.BeforeSaveEntities;
      _contextProvider.BeforeSaveEntityDelegate = breezevalidator.BeforeSaveEntity;

      _audit = _contextProvider.Context.BeginAudit(AuditLoggerConfig.GetConfiguredAuditLogger());

      NetworkRepository = new Repository<Network>(_contextProvider.Context);
      CompanyRepository = new Repository<Company>(_contextProvider.Context);
      NetworkCompanyRepository = new Repository<NetworkCompany>(_contextProvider.Context);
      MeasureRepository = new Repository<Measure>(_contextProvider.Context);
      InvitationRepository = new Repository<Invitation>(_contextProvider.Context);
      MeasureStateRepository = new Repository<MeasureState>(_contextProvider.Context);
      EnergySourceRepository = new Repository<EnergySource>(_contextProvider.Context);
      OutputUnitRepository = new Repository<OutputUnit>(_contextProvider.Context);
      EnergySavingRepository = new Repository<EnergySaving>(_contextProvider.Context);
      SurveyRepository = new Repository<Survey>(_contextProvider.Context);
      UserProfileRepository = new Repository<UserProfile>(_contextProvider.Context);
      DocumentContentRepository = new Repository<DocumentContent>(_contextProvider.Context);
      DocumentRepository = new Repository<Document>(_contextProvider.Context);
      InvestmentPlanRepository = new Repository<InvestmentPlan>(_contextProvider.Context);
      ComparisonRepository = new Repository<Comparison>(_contextProvider.Context);
      AreaRepository = new Repository<Area>(_contextProvider.Context);
      ProductRepository = new Repository<Product>(_contextProvider.Context);
      ProductionTimeRepository = new Repository<ProductionTime>(_contextProvider.Context);
      ReadingRepository = new Repository<Reading>(_contextProvider.Context);
      ImportantTopicRepository = new Repository<ImportantTopic>(_contextProvider.Context);
      ChangeSetRepository = new Repository<ChangeSet>(_contextProvider.Context);
      ChangeRepository = new Repository<Change>(_contextProvider.Context);
      CompanySizeRepository = new Repository<CompanySize>(_contextProvider.Context);
      FiscalYearRepository = new Repository<FiscalYear>(_contextProvider.Context);
      OperationTimeRepository = new Repository<OperationTime>(_contextProvider.Context);
    }

    /// <summary>
    ///   Reporitories
    /// </summary>
    public IRepository<Network> NetworkRepository { get; private set; }
    public IRepository<Measure> MeasureRepository { get; private set; }
    public IRepository<Invitation> InvitationRepository { get; private set; }
    public IRepository<MeasureState> MeasureStateRepository { get; private set; }
    public IRepository<EnergySource> EnergySourceRepository { get; private set; }
    public IRepository<InvestmentPlan> InvestmentPlanRepository { get; private set; }
    public IRepository<Comparison> ComparisonRepository { get; private set; }
    public IRepository<OutputUnit> OutputUnitRepository { get; private set; }
    public IRepository<EnergySaving> EnergySavingRepository { get; private set; }
    public IRepository<Survey> SurveyRepository { get; private set; }
    public IRepository<Company> CompanyRepository { get; private set; }
    public IRepository<NetworkCompany> NetworkCompanyRepository { get; private set; }
    public IRepository<UserProfile> UserProfileRepository { get; private set; }
    public IRepository<DocumentContent> DocumentContentRepository { get; private set; }
    public IRepository<Document> DocumentRepository { get; private set; }
    public IRepository<Area> AreaRepository { get; private set; }
    public IRepository<Product> ProductRepository { get; private set; }
    public IRepository<ProductionTime> ProductionTimeRepository { get; private set; }
    public IRepository<Reading> ReadingRepository { get; private set; }
    public IRepository<ImportantTopic> ImportantTopicRepository { get; private set; }
    public IRepository<ChangeSet> ChangeSetRepository { get; private set; }
    public IRepository<Change> ChangeRepository { get; private set; }
    public IRepository<CompanySize> CompanySizeRepository { get; private set; }
    public IRepository<FiscalYear> FiscalYearRepository { get; private set; }
    public IRepository<OperationTime> OperationTimeRepository { get; private set; }


    /// <summary>
    ///   Get breeze Metadata
    /// </summary>
    /// <returns>String containing Breeze metadata</returns>
    public string Metadata()
    {
      return _contextProvider.Metadata();
    }

    /// <summary>
    ///   Save a changeset using Breeze
    /// </summary>
    /// <param name="changeSet"></param>
    /// <returns></returns>
    public SaveResult Commit(JObject changeSet)
    {
      return _contextProvider.SaveChanges(changeSet);
    }

    /// <summary>
    ///   Save Context using traditional Entity Framework operation
    /// </summary>
    public void Commit()
    {
      _contextProvider.Context.SaveChanges();
    }

    public AuditLogger AuditLogger
    {
      get
      {
        return _audit;
      }
    }
  }
}