using EnergyNetwork.Web;
using Microsoft.Owin;
using Owin;

[assembly : OwinStartup(typeof (Startup))]

namespace EnergyNetwork.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}