using ClosedXML.Excel;

namespace EnergyNetwork.Web.Helpers
{
  public class XmlGenerator
  {
    public static XLWorkbook GenerateWorkBook()
    {
      var workbook = new XLWorkbook();
      var worksheet = workbook.Worksheets.Add("Invoice");

      // Header
      worksheet.Cell("A1").Value = "ID";
      worksheet.Cell("B1").Value = "Description";
      worksheet.Cell("C1").Value = "Quantity";
      worksheet.Cell("D1").Value = "Unit price";
      worksheet.Range("A1:D1")
               .Style.Font.SetBold(true)
               .Font.SetFontSize(14)
               .Fill.SetBackgroundColor(XLColor.LightGray);

      // Data
     

      // Footer
      var lastRow = worksheet.LastRowUsed().RowNumber() + 1;
      worksheet.Range(lastRow, 1, lastRow, 4)
               .Style.Alignment.SetHorizontal(XLAlignmentHorizontalValues.Right)
               .Font.SetBold(true)
               .Font.SetFontSize(14);

      worksheet.Range(lastRow, 1, lastRow, 2)
               .Merge()
               .SetValue("Total:");

      worksheet.Cell(lastRow, 3)
               .SetFormulaA1("SUM(C1:C" + (lastRow - 1) + ")")
               .SetDataType(XLCellValues.Number)
               .Style.NumberFormat.SetFormat("#,##0");

      worksheet.Cell(lastRow, 4)
               .SetFormulaA1("SUM(D1:D" + (lastRow - 1) + ")")
               .SetDataType(XLCellValues.Number)
               .Style.NumberFormat.SetFormat("#,##0");


      worksheet.Columns().AdjustToContents();
      return workbook;
    }
  }
}