using EntityFramework.Audit;

namespace EnergyNetwork.Web.Helpers
{
  public interface IApplicationManager
  {
    AuditLogger AuditLogger { get; }
  }
}