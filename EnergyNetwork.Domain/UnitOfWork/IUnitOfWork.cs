using Breeze.ContextProvider;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Domain.Repositories;
using EntityFramework.Audit;
using Newtonsoft.Json.Linq;

namespace EnergyNetwork.Domain.UnitOfWork
{
  /// <summary>
  /// Contract for the UnitOfWork
  /// </summary>
  public interface IUnitOfWork
  {
    IRepository<Network> NetworkRepository { get; }
    IRepository<Company> CompanyRepository { get; }
    IRepository<NetworkCompany> NetworkCompanyRepository { get; }
    IRepository<Measure> MeasureRepository { get; }
    IRepository<Invitation> InvitationRepository { get; }
    IRepository<MeasureState> MeasureStateRepository { get; }
    IRepository<EnergySource> EnergySourceRepository { get; }
    IRepository<Survey> SurveyRepository { get; }
    IRepository<InvestmentPlan> InvestmentPlanRepository { get; }
    IRepository<Comparison> ComparisonRepository { get; }
    IRepository<OutputUnit> OutputUnitRepository { get; }
    IRepository<EnergySaving> EnergySavingRepository { get; }
    IRepository<UserProfile> UserProfileRepository { get; }
    IRepository<DocumentContent> DocumentContentRepository { get; }
    IRepository<Document> DocumentRepository { get; }
    IRepository<Area> AreaRepository { get; }
    IRepository<Product> ProductRepository { get; }
    IRepository<ProductionTime> ProductionTimeRepository { get; }
    IRepository<Reading> ReadingRepository { get; }
    IRepository<ImportantTopic> ImportantTopicRepository { get; }
    IRepository<ChangeSet> ChangeSetRepository { get; }
    IRepository<Change> ChangeRepository { get; }
    IRepository<CompanySize> CompanySizeRepository { get; }
    IRepository<FiscalYear> FiscalYearRepository { get; }
    IRepository<OperationTime> OperationTimeRepository { get; }

    void Commit();

    //Breeze specific
    string Metadata();
    SaveResult Commit(JObject changeSet);

    AuditLogger AuditLogger { get; }
  }
}