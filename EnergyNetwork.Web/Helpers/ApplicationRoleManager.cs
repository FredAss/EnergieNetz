using EnergyNetwork.Data;
using EntityFramework.Audit;
using EntityFramework.Extensions;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace EnergyNetwork.Web.Helpers
{
  public class ApplicationRoleManager: RoleManager<IdentityRole>, IApplicationManager
  {
    private static AuditLogger _audit;

    public ApplicationRoleManager(IRoleStore<IdentityRole, string> roleStore)
      : base(roleStore)
    {
    }

    public static ApplicationRoleManager Create(IdentityFactoryOptions<ApplicationRoleManager> options, IOwinContext context)
    {
      var dbContext = context.Get<EnergyNetworkDbContext>();
      _audit = dbContext.BeginAudit(AuditLoggerConfig.GetConfiguredAuditLogger());

      return new ApplicationRoleManager(new RoleStore<IdentityRole>(context.Get<EnergyNetworkDbContext>()));
    }

    public AuditLogger AuditLogger { get; private set; }
  }
}