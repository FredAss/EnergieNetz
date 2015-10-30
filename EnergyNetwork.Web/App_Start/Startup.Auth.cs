using System;
using System.Configuration;
using EnergyNetwork.Data;
using EnergyNetwork.Domain.Model;
using EnergyNetwork.Web.Helpers;
using EnergyNetwork.Web.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace EnergyNetwork.Web
{
  public partial class Startup
  {
    //Enable OWIN Bearer Token Middleware	
    static Startup()
    {
      PublicClientId = "self";

      UserManagerFactory = () => new ApplicationUserManager(new UserStore<UserProfile>(new EnergyNetworkDbContext()));

      OAuthOptions = new OAuthAuthorizationServerOptions{
                                                          //Exposes Token endpoint
                                                          TokenEndpointPath = new PathString("/Token"),
                                                          //Use ApplicationOAuthProvider in order to authenticate
                                                          Provider = new ApplicationOAuthProvider(PublicClientId,
                                                            UserManagerFactory),
                                                          AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                                                          AccessTokenExpireTimeSpan = TimeSpan.FromDays(14), //Token expiration => The user will remain authenticated for 14 days
                                                          AllowInsecureHttp = true
                                                        };
    }

    public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

    public static Func<ApplicationUserManager> UserManagerFactory { get; set; }

    public static string PublicClientId { get; private set; }

    public void ConfigureAuth(IAppBuilder app)
    {
      app.CreatePerOwinContext(() => new EnergyNetworkDbContext());
      app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
      app.CreatePerOwinContext<ApplicationRoleManager>(ApplicationRoleManager.Create);

      //Enable Cors support in the Web API. Should go before the activation of Bearer tokens
      //http://aspnetwebstack.codeplex.com/discussions/467315
      app.UseCors(CorsOptions.AllowAll);

      app.UseCookieAuthentication(new CookieAuthenticationOptions());

      app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

      // Enable the application to use bearer tokens to authenticate users
      // Enabling 3 components:
      // 1. Authorization Server middleware. For creating the bearer tokens
      // 2. Application bearer token middleware. Will atuthenticate every request with Authorization : Bearer header
      // 3. External bearer token middleware. For external providers
      app.UseOAuthBearerTokens(OAuthOptions);

      app.UseMicrosoftAccountAuthentication(ConfigurationManager.AppSettings["MicrosoftKey"],
        ConfigurationManager.AppSettings["MicrosoftSecret"]);

      app.UseTwitterAuthentication(ConfigurationManager.AppSettings["TwitterKey"],
        ConfigurationManager.AppSettings["TwitterSecret"]);

      app.UseFacebookAuthentication(ConfigurationManager.AppSettings["FacebookKey"],
        ConfigurationManager.AppSettings["FacebookSecret"]);

      app.UseGoogleAuthentication();
    }

    private static bool IsAjaxRequest(IOwinRequest request)
    {
      IReadableStringCollection query = request.Query;
      if ((query != null) && (query["X-Requested-With"] == "XMLHttpRequest"))
      {
        return true;
      }
      IHeaderDictionary headers = request.Headers;
      return ((headers != null) && (headers["X-Requested-With"] == "XMLHttpRequest"));
    }
  }
}