using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace EnergyNetwork.Web
{
  public class Global: HttpApplication
  {
    private void Application_Start(object sender, EventArgs e)
    {
      AreaRegistration.RegisterAllAreas();

      GlobalConfiguration.Configure(RouteConfig.RegisterWebApiRoutes);
      RouteConfig.RegisterMVCRoutes(RouteTable.Routes);
      BundleConfig.RegisterBundles(BundleTable.Bundles);
      AuthConfig.RegisterMVCAuth(GlobalFilters.Filters);
      AuthConfig.RegisterWebApiAuth(GlobalConfiguration.Configuration);
    }
  }
}