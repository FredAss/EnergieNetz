using EnergyNetwork.Domain.Model;
using OfficeOpenXml;

namespace EnergyNetwork.Web.Helpers
{
  public interface IExcelExportGenerator
  {
    ExcelPackage ExportNetworkMeasures(Network networkMeasures);
    ExcelPackage ExportCompanyMeasures(NetworkCompany companyMeasures);
    ExcelPackage ExportNetworkData(Network network);
    ExcelPackage ExportCompanyData(NetworkCompany company);
  }
}
