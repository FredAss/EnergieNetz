using System;
using EnergyNetwork.Data;
using EnergyNetwork.Domain.Model;
using EntityFramework.Audit;
using EntityFramework.Extensions;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace EnergyNetwork.Web.Helpers
{
  public class ApplicationUserManager: UserManager<UserProfile>,
    IApplicationManager
  {
    private static AuditLogger _audit;

    public ApplicationUserManager(IUserStore<UserProfile> store)
      : base(store)
    {
    }

    public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
    {
      var dbContext = context.Get<EnergyNetworkDbContext>();

      _audit = dbContext.BeginAudit(AuditLoggerConfig.GetConfiguredAuditLogger());

      var manager = new ApplicationUserManager(new UserStore<UserProfile>(dbContext));
      // Configure validation logic for usernames
      manager.UserValidator = new UserValidator<UserProfile>(manager){
                                                                       AllowOnlyAlphanumericUserNames = true,
                                                                       RequireUniqueEmail = true
                                                                     };
      // Configure validation logic for passwords
      manager.PasswordValidator = new PasswordValidator{
                                                         RequiredLength = 6,
                                                         RequireNonLetterOrDigit = false,
                                                         RequireDigit = false,
                                                         RequireLowercase = false,
                                                         RequireUppercase = false
                                                       };

      manager.UserLockoutEnabledByDefault = true;

      manager.EmailService = new EmailService();

      var dataProtectionProvider = options.DataProtectionProvider;
      if (dataProtectionProvider != null)
      {
        manager.UserTokenProvider = new DataProtectorTokenProvider<UserProfile>(dataProtectionProvider.Create("ASP.NET Identity"));
      }
      return manager;
    }

    public bool HasPermission(UserProfile userProfile, Guid companyId)
    {
      if (userProfile == null || userProfile.Activated == false)
      {
        return false;
      }

      if (userProfile.CompanyId == companyId || this.IsInRole(userProfile.Id,
        "Administrator"))
      {
        return true;
      }
      return false;
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