using System;
using System.IO;
using System.Web.Mvc;
using OfficeOpenXml;

namespace EnergyNetwork.Web.Results
{
  public class ExcelResult: ActionResult
  {
    private readonly ExcelPackage _package;
    private readonly string _fileName;

    public ExcelResult(ExcelPackage package, string fileName)
    {
      _package = package;
      _fileName = fileName;
    }

    public override void ExecuteResult(ControllerContext context)
    {
      var response = context.HttpContext.Response;
      response.Clear();
      response.ContentType = "application/vnd.openxmlformats-officedocument." + "spreadsheetml.sheet";
      response.AddHeader("content-disposition",
        "attachment;filename=\"" + _fileName + ".xlsx\"");

      response.BinaryWrite(_package.GetAsByteArray());

      response.End();
    }
  }
}