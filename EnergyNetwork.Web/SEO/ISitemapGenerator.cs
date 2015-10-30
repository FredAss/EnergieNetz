using System.Collections.Generic;
using System.Xml.Linq;

namespace EnergyNetwork.Web.SEO
{
    public interface ISitemapGenerator
    {
        XDocument GenerateSiteMap(IEnumerable<ISitemapItem> items);
    }
}