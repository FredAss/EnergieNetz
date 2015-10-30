using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using AuthorizeAttribute = System.Web.Http.AuthorizeAttribute;

namespace EnergyNetwork.Web
{
    public static class AuthConfig
    {
        public static void RegisterMVCAuth(GlobalFilterCollection filters)
        {
            //Show custom error page
            filters.Add(new HandleErrorAttribute());

            //Require Https always
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                //filters.Add(new RequireHttpsAttribute());
            }
        }

        public static void RegisterWebApiAuth(HttpConfiguration config)
        {
            //All routes forbidden by default
            config.Filters.Add(new AuthorizeAttribute());

            //Use only bearer token authentication
            //SuppressDefaultHostAuthentication will register a message handler and set the current principal
            //to anonymous, so no host principal will get passed to Web API. It also suppress default challenges
            //from OWIN middleware
            config.SuppressDefaultHostAuthentication();
            //HostAuthenticationFilter  behaviouu  is te opposite. It will set the principal from specified OWIN authentication middleware
            //In this application, it is the Bearer token middleware, it will also send a challenge to specified middleware when it sees a 401 response.
            //Since this authentication filter is set as global filter, it will apply to all Web APIs so the result is Web API only sees the 
            //authentication principal from the bearer token middleware and any 401 response will add a bearer challenge.
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            //Require Https always
            if (!HttpContext.Current.IsDebuggingEnabled)
            {
                //config.Filters.Add(new Filters.RequireHttpsAttribute());
            }
        }
    }
}