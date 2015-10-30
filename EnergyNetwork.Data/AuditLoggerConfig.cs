using EnergyNetwork.Domain.Model;
using EntityFramework.Audit;

namespace EnergyNetwork.Data
{
  public static class AuditLoggerConfig
  {
    public static AuditConfiguration GetConfiguredAuditLogger()
    {
      var auditConfiguration = AuditConfiguration.Default;

      auditConfiguration.IncludeRelationships = true;
      auditConfiguration.LoadRelationships = true;
      auditConfiguration.DefaultAuditable = true;

      auditConfiguration.IsAuditable<Network>();
      //auditConfiguration.IsAuditable<UserProfile>();

      return auditConfiguration;
    }
  }
}