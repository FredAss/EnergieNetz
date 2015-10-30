using System;
using System.Drawing;
using System.Linq;
using EnergyNetwork.Domain.Model;
using OfficeOpenXml;
using OfficeOpenXml.Drawing;
using OfficeOpenXml.Drawing.Chart;
using OfficeOpenXml.Style;

namespace EnergyNetwork.Web.Helpers
{
  public class ExcelExportGenerator: IExcelExportGenerator
  {
    public ExcelPackage ExportNetworkMeasures(Network network)
    {
      var package = new ExcelPackage();

      int measuresCount = 0;

      package.Workbook.Properties.Author = "EnergieNetwork";
      package.Workbook.Properties.Title = network.Name + " Maßnahmen";

      foreach (var networkCompany in network.NetworkCompanies)
      {
        string companyName;

        if (networkCompany.Company.Name.Length > 30)
        {
          companyName = networkCompany.Company.Name.Remove(27) + "...";
        }
        else
        {
          companyName = networkCompany.Company.Name;
        }

        ExcelWorksheet worksheet = CreateSheet(package,
          companyName);

        var row = 1;

        worksheet.Cells[row,
          3].Value = network.Name + " Maßnahmen";
        worksheet.Row(row++).
          Height = 23;
        worksheet.Cells[row,
          3].Value = networkCompany.Company.Name;
        worksheet.Row(row++).
          Height = 20;

        ExcelRange rangeHead = worksheet.Cells[1,
          3,
          2,
          3];

        worksheet.Cells[++row,
          2].Value = "Maßnahme";
        worksheet.Cells[row,
          3].Value = "Kennzeichnung";
        worksheet.Cells[row,
          4].Value = "Einsparung \nErdgas kWh";
        worksheet.Cells[row,
          5].Value = "Einsparung \nHeizöl kWh";
        worksheet.Cells[row,
          6].Value = "Einsparung \nFernwärme kWh";
        worksheet.Cells[row,
          7].Value = "Einsparung \nStrom kWh";
        worksheet.Cells[row,
          8].Value = "Einsparung Gesamt \nkWh";
        worksheet.Cells[row,
          9].Value = "Investition \n€";
        worksheet.Cells[row,
          10].Value = "Laufzeit der \nMaßnahme a";
        worksheet.Cells[row,
          11].Value = "Beginn im Jahr";
        worksheet.Cells[row,
          12].Value = "Status";
        worksheet.Cells[row,
          13].Value = "Letzte Änderung";
        ExcelRange rangeTitles = worksheet.Cells[row,
          2,
          row,
          13];

        var beginDataRow = row + 1;

        measuresCount = 0;

        foreach (var measure in networkCompany.Measures)
        {
          measuresCount++;
          var energieeinsparung = from energySaving in measure.EnergySavings
            select new{
                        SourceName = energySaving.EnergySource.Name,
                        SourceSaving = energySaving.Value
                      };
          double savingGas = 0;
          double savingOil = 0;
          double savingHeat = 0;
          double savingVoltage = 0;
          foreach (var energie in energieeinsparung)
          {
            if (energie.SourceName == "naturalGas")
            {
              savingGas += energie.SourceSaving;
            }
            if (energie.SourceName == "fuelOil")
            {
              savingOil += energie.SourceSaving;
            }
            if (energie.SourceName == "districtHeating")
            {
              savingHeat += energie.SourceSaving;
            }
            if (energie.SourceName == "electricity")
            {
              savingVoltage += energie.SourceSaving;
            }
          }

          worksheet.Column(3).
            Width = 75;

          worksheet.Cells[++row,
            2].LoadFromCollection(new[]{
                                         new{
                                              Maßnahme = measure.Title,
                                              Kennzeichnung = measure.Description,
                                              Erdgas = Math.Round(savingGas),
                                              Heizöl = Math.Round(savingOil),
                                              Fernwärme = Math.Round(savingHeat),
                                              Strom = Math.Round(savingVoltage),
                                              Einsparung = Math.Round((from energySaving in measure.EnergySavings select energySaving.Value).Sum(),
                                                0),
                                              Invest = Math.Round(measure.Investment,
                                                2),
                                              Laufzeit = measure.Duration,
                                              Beginn = measure.RelatedDuration,
                                              Status = measure.State.Title,
                                              Änderung = measure.LastChange,
                                            }
                                       });

          worksheet.Cells[row,
            3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
          worksheet.Cells[row,
            4].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
          worksheet.Cells[row,
            4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            5].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
          worksheet.Cells[row,
            5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            6].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
          worksheet.Cells[row,
            6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            7].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
          worksheet.Cells[row,
            7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            8].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
          worksheet.Cells[row,
            8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            9].Style.Numberformat.Format = "#,##0.00 [$€-1];[RED]-#,##0.00 [$€-1]";
          worksheet.Cells[row,
            9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
          worksheet.Cells[row,
            11].Style.Numberformat.Format = "dd-mm-yyyy";
          worksheet.Cells[row,
            13].Style.Numberformat.Format = "dd-mm-yyyy";
        }

        ExcelRange rangeData = worksheet.Cells[beginDataRow,
          2,
          row,
          13];

        ExcelRange rngData = worksheet.Cells[beginDataRow - 1,
          2,
          row,
          13];

        worksheet.Cells[++row,
          3].Value = "Summe";
        worksheet.Cells[row,
          3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          4].Formula = "=SUM(D5:D" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          4].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          5].Formula = "=SUM(E5:E" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          5].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          6].Formula = "=SUM(F5:F" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          6].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          7].Formula = "=SUM(G5:G" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          7].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          8].Formula = "=SUM(H5:H" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          8].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          9].Formula = "=SUM(I5:I" + (measuresCount + 4) + ")";
        worksheet.Cells[row,
          9].Style.Numberformat.Format = "#,##0.00 [$€-1];[RED]-#,##0.00 [$€-1]";
        ExcelRange rangeSummary = worksheet.Cells[row,
          2,
          row,
          13];

        rangeHead.Style.Font.Bold = true;
        rangeHead.Style.Font.Size = 16;

        rangeTitles.Style.Font.Bold = true;
        rangeTitles.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        rangeTitles.Style.VerticalAlignment = ExcelVerticalAlignment.Top;
        rangeTitles.Style.Font.Color.SetColor(Color.White);
        rangeTitles.Style.Fill.PatternType = ExcelFillStyle.Solid;
        rangeTitles.Style.Fill.BackgroundColor.SetColor(Color.DarkOliveGreen);

        rangeSummary.Style.Font.Bold = true;

        rangeTitles.Style.Border.Top.Style = ExcelBorderStyle.Thick;
        rangeTitles.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
        rangeTitles.Style.Border.Left.Style = ExcelBorderStyle.Thick;
        rangeTitles.Style.Border.Right.Style = ExcelBorderStyle.Thick;

        rangeData.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
        rangeData.Style.Border.Left.Style = ExcelBorderStyle.Thick;
        rangeData.Style.Border.Right.Style = ExcelBorderStyle.Thick;
        rangeSummary.Style.Border.Top.Style = ExcelBorderStyle.Thick;
        rangeSummary.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
        rangeSummary.Style.Border.Left.Style = ExcelBorderStyle.Thick;
        rangeSummary.Style.Border.Right.Style = ExcelBorderStyle.Thick;

        worksheet.View.FreezePanes(5,
          3);
        rngData.AutoFilter = true;
        worksheet.Cells.AutoFitColumns();
        worksheet.Column(3).
          Width = 75;
        worksheet.Column(3).
          Style.WrapText = true;
        worksheet.Row(4).
          Height = 30;
        for (int i = 0; i <= 10; i++)
        {
          worksheet.Cells[4,
            3 + i].Style.WrapText = true;
        }

        //ExcelChart chart = worksheet.Drawings.AddChart("Status", eChartType.PieExploded3D);
        //chart.Title.Text = "Status Übersicht";
        //chart.Legend.Position = eLegendPosition.Right;
        //chart.Legend.Add();
        //chart.SetPosition(++row, 5, 3, 0);
        //chart.SetSize(320, 240);
        //chart.Series.Add("L" + (beginDataRow) + ":L" + (row - 2),"L"+ (beginDataRow - 1) +":L"+ (beginDataRow - 1) );
        ////chart.DataLabel.ShowCategory = true;
        ////chart.DataLabel.ShowPercent = true;
        ////chart.DataLabel.ShowLeaderLines = true;
        //chart.Legend.Remove();
        //chart.Style = eChartStyle.Style2;

        //ExcelChart chart1 = worksheet.Drawings.AddChart("Einsparungen", eChartType.Line);
        //chart1.Title.Text = "Energieeinsparungen";
        //chart1.SetPosition(row, 5, 7, 0);
        //chart1.SetSize(320, 240);
        //chart1.Series.Add("D" + (beginDataRow - 1) + ":D" + (row - 2) + ";" +
        //                  "E" + (beginDataRow - 1) + ":E" + (row - 2) + ";" +
        //                  "F" + (beginDataRow - 1) + ":F" + (row - 2) + ";" +
        //                  "G" + (beginDataRow - 1) + ":G" + (row - 2),
        //                  "B" + (beginDataRow - 1) + ":B" + (row - 2)
        //                  );
        //chart1.Style = eChartStyle.Style2;
      }

      return package;
    }

    public ExcelPackage ExportCompanyMeasures(NetworkCompany networkCompany)
    {
      var package = new ExcelPackage();

      int measuresCount = 0;

      package.Workbook.Properties.Author = "EnergieNetwork";
      package.Workbook.Properties.Title = networkCompany.Company.Name + " Maßnahmen";

      string companyName;

      if (networkCompany.Company.Name.Length > 30)
      {
        companyName = networkCompany.Company.Name.Remove(27) + "...";
      }
      else
      {
        companyName = networkCompany.Company.Name;
      }

      ExcelWorksheet worksheet = CreateSheet(package,
        companyName);

      var row = 1;

      worksheet.Cells[row,
        3].Value = networkCompany.Company.Name + " Maßnahmen";
      worksheet.Row(row++).
        Height = 23;
      worksheet.Row(row++).
        Height = 20;

      ExcelRange rangeHead = worksheet.Cells[1,
        3,
        2,
        3];

      worksheet.Cells[++row,
        2].Value = "Maßnahme";
      worksheet.Cells[row,
        3].Value = "Kennzeichnung";
      worksheet.Cells[row,
        4].Value = "Einsparung \nErdgas kWh";
      worksheet.Cells[row,
        5].Value = "Einsparung \nHeizöl kWh";
      worksheet.Cells[row,
        6].Value = "Einsparung \nFernwärme kWh";
      worksheet.Cells[row,
        7].Value = "Einsparung \nStrom kWh";
      worksheet.Cells[row,
        8].Value = "Einsparung Gesamt \nkWh";
      worksheet.Cells[row,
        9].Value = "Investition \n€";
      worksheet.Cells[row,
        10].Value = "Laufzeit der \nMaßnahme a";
      worksheet.Cells[row,
        11].Value = "Beginn im Jahr";
      worksheet.Cells[row,
        12].Value = "Status";
      worksheet.Cells[row,
        13].Value = "Letzte Änderung";
      ExcelRange rangeTitles = worksheet.Cells[row,
        2,
        row,
        13];

      var beginDataRow = row + 1;

      measuresCount = 0;

      foreach (var measure in networkCompany.Measures)
      {
        measuresCount++;
        var energieeinsparung = from energySaving in measure.EnergySavings
          select new{
                      SourceName = energySaving.EnergySource.Name,
                      SourceSaving = energySaving.Value
                    };
        double savingGas = 0;
        double savingOil = 0;
        double savingHeat = 0;
        double savingVoltage = 0;
        foreach (var energie in energieeinsparung)
        {
          if (energie.SourceName == "naturalGas")
          {
            savingGas += energie.SourceSaving;
          }
          if (energie.SourceName == "fuelOil")
          {
            savingOil += energie.SourceSaving;
          }
          if (energie.SourceName == "districtHeating")
          {
            savingHeat += energie.SourceSaving;
          }
          if (energie.SourceName == "electricity")
          {
            savingVoltage += energie.SourceSaving;
          }
        }

        worksheet.Column(3).
          Width = 75;

        worksheet.Cells[++row,
          2].LoadFromCollection(new[]{
                                       new{
                                            Maßnahme = measure.Title,
                                            Kennzeichnung = measure.Description,
                                            Erdgas = Math.Round(savingGas),
                                            Heizöl = Math.Round(savingOil),
                                            Fernwärme = Math.Round(savingHeat),
                                            Strom = Math.Round(savingVoltage),
                                            Einsparung = Math.Round((from energySaving in measure.EnergySavings select energySaving.Value).Sum(),
                                              0),
                                            Invest = Math.Round(measure.Investment,
                                              2),
                                            Laufzeit = measure.Duration,
                                            Beginn = measure.RelatedDuration,
                                            Status = measure.State.Title,
                                            Änderung = measure.LastChange,
                                          }
                                     });

        worksheet.Cells[row,
          3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
        worksheet.Cells[row,
          4].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          5].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          5].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          6].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          7].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          8].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
        worksheet.Cells[row,
          8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          9].Style.Numberformat.Format = "#,##0.00 [$€-1];[RED]-#,##0.00 [$€-1]";
        worksheet.Cells[row,
          9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row,
          11].Style.Numberformat.Format = "dd-mm-yyyy";
        worksheet.Cells[row,
          13].Style.Numberformat.Format = "dd-mm-yyyy";
      }

      ExcelRange rangeData = worksheet.Cells[beginDataRow,
        2,
        row,
        13];

      ExcelRange rngData = worksheet.Cells[beginDataRow - 1,
        2,
        row,
        13];

      worksheet.Cells[++row,
        3].Value = "Summe";
      worksheet.Cells[row,
        3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
      worksheet.Cells[row,
        4].Formula = "=SUM(D5:D" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        4].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      worksheet.Cells[row,
        5].Formula = "=SUM(E5:E" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        5].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      worksheet.Cells[row,
        6].Formula = "=SUM(F5:F" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        6].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      worksheet.Cells[row,
        7].Formula = "=SUM(G5:G" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        7].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      worksheet.Cells[row,
        8].Formula = "=SUM(H5:H" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        8].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      worksheet.Cells[row,
        9].Formula = "=SUM(I5:I" + (measuresCount + 4) + ")";
      worksheet.Cells[row,
        9].Style.Numberformat.Format = "#,##0.00 [$€-1];[RED]-#,##0.00 [$€-1]";
      ExcelRange rangeSummary = worksheet.Cells[row,
        2,
        row,
        13];

      rangeHead.Style.Font.Bold = true;
      rangeHead.Style.Font.Size = 16;

      rangeTitles.Style.Font.Bold = true;
      rangeTitles.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
      rangeTitles.Style.VerticalAlignment = ExcelVerticalAlignment.Top;
      rangeTitles.Style.Font.Color.SetColor(Color.White);
      rangeTitles.Style.Fill.PatternType = ExcelFillStyle.Solid;
      rangeTitles.Style.Fill.BackgroundColor.SetColor(Color.DarkOliveGreen);
      rangeTitles.Style.WrapText = true;

      rangeSummary.Style.Font.Bold = true;

      rangeTitles.Style.Border.Top.Style = ExcelBorderStyle.Thick;
      rangeTitles.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
      rangeTitles.Style.Border.Left.Style = ExcelBorderStyle.Thick;
      rangeTitles.Style.Border.Right.Style = ExcelBorderStyle.Thick;

      rangeData.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
      rangeData.Style.Border.Left.Style = ExcelBorderStyle.Thick;
      rangeData.Style.Border.Right.Style = ExcelBorderStyle.Thick;
      rangeSummary.Style.Border.Top.Style = ExcelBorderStyle.Thick;
      rangeSummary.Style.Border.Bottom.Style = ExcelBorderStyle.Thick;
      rangeSummary.Style.Border.Left.Style = ExcelBorderStyle.Thick;
      rangeSummary.Style.Border.Right.Style = ExcelBorderStyle.Thick;

      worksheet.View.FreezePanes(5,
        3);
      rngData.AutoFilter = true;
      worksheet.Cells.AutoFitColumns();
      worksheet.Column(3).
        Width = 75;
      worksheet.Column(3).
        Style.WrapText = true;
      worksheet.Row(4).
        Height = 30;
      for (int i = 0; i <= 10; i++)
      {
        worksheet.Cells[4,
          3 + i].Style.WrapText = true;
      }

      return package;
    }

    private static ExcelWorksheet CreateSheet(ExcelPackage p, string sheetName)
    {
      ExcelWorksheet ws = p.Workbook.Worksheets.Add(sheetName);
      ws.Name = sheetName; //Setting Sheet's name
      ws.Cells.Style.Font.Size = 11; //Default font size for whole sheet
      ws.Cells.Style.Font.Name = "Calibri"; //Default Font name for whole sheet

      return ws;
    }

    public ExcelPackage ExportNetworkData(Network network)
    {
      var package = new ExcelPackage();

      package.Workbook.Properties.Author = "EnergieNetwork";
      package.Workbook.Properties.Title = network.Name;

      string networkName;

      if (network.Name.Length > 30)
      {
        networkName = network.Name.Remove(27) + "...";
      }
      else
      {
        networkName = network.Name;
      }

      if (network.NetworkCompanies.Count == 0)
      {
        ExcelWorksheet worksheet = CreateSheet(package, networkName);
        worksheet.Cells[1, 2].Value = "Keine Daten vorhanden";
      }

      foreach (var company in network.NetworkCompanies)
      {
        string companyName;

        if (company.Company.Name.Length > 30)
        {
          companyName = company.Company.Name.Remove(27) + "...";
        }
        else
        {
          companyName = company.Company.Name;
        }

        ExcelWorksheet worksheet = CreateSheet(package,
          companyName);

        var row = 1;

        worksheet.Cells[row,
          2].Value = network.Name;
        worksheet.Cells[row,
          2].Style.Font.Bold = true;
        worksheet.Cells[row,
          2].Style.Font.Size = 17;
        worksheet.Cells[row,
          2].Style.VerticalAlignment = ExcelVerticalAlignment.Top;
        worksheet.Row(row++).
          Height = 28;
        worksheet.Cells[row,
          2].Value = company.Company.Name;
        worksheet.Cells[row,
          2].Style.Font.Bold = true;
        worksheet.Cells[row++,
          2].Style.Font.Size = 14;

        row = appendnetworkCompanyToSheet(worksheet,
          company,
          row);
      }

      return package;
    }

    public ExcelPackage ExportCompanyData(NetworkCompany networkCompany)
    {
      var package = new ExcelPackage();

      package.Workbook.Properties.Author = "EnergieNetwork";
      package.Workbook.Properties.Title = networkCompany.Company.Name;

      string companyName;

      if (networkCompany.Company.Name.Length > 30)
      {
        companyName = networkCompany.Company.Name.Remove(27) + "...";
      }
      else
      {
        companyName = networkCompany.Company.Name;
      }

      ExcelWorksheet worksheet = CreateSheet(package,
        companyName);

      var row = 1;

      worksheet.Cells[row,
        2].Value = networkCompany.Company.Name;
      worksheet.Cells[row,
        2].Style.Font.Bold = true;
      worksheet.Cells[row,
        2].Style.Font.Size = 14;
      worksheet.Row(row++).
        Height = 23;

      row = appendnetworkCompanyToSheet(worksheet,
        networkCompany,
        row);

      return package;
    }

    private int appendnetworkCompanyToSheet(ExcelWorksheet worksheet, NetworkCompany networkCompany, int row)
    {
      string companyName;

      if (networkCompany.Company.Name.Length > 30)
      {
        companyName = networkCompany.Company.Name.Remove(27) + "...";
      }
      else
      {
        companyName = networkCompany.Company.Name;
      }

      var headlinesColor = Color.MediumSeaGreen;


      var inprogress = 0;
      var finished = 0;
      var total = 0;
      var saved = 0;
      var denied = 0;

      worksheet.Cells[++row,
        2].Value = "Kontaktinformationen";
      worksheet.Cells[row,
        2].Style.Font.Bold = true;
      worksheet.Cells[row,
        2].Style.Fill.PatternType = ExcelFillStyle.Solid;
      worksheet.Cells[row++,
        2].Style.Fill.BackgroundColor.SetColor(headlinesColor);
      //worksheet.Row(row++).Height = 20;

      //worksheet.Cells[row, 6].Style.Numberformat.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";
      //worksheet.Cells[row, 6].Style.Numberformat.Format ="#0\\.00%";

      worksheet.Cells[row++,
        2].Value = networkCompany.Company.Address.Street;
      worksheet.Cells[row++,
        2].Value = networkCompany.Company.Address.PostalCode + " " + networkCompany.Company.Address.City;
      worksheet.Cells[row++,
        2].Value = networkCompany.Company.Address.Website;

      worksheet.Cells[++row,
        2].Value = "Ansprechpartner";
      worksheet.Cells[row,
        2].Style.Font.Bold = true;
      worksheet.Cells[row,
        2].Style.Fill.PatternType = ExcelFillStyle.Solid;
      worksheet.Cells[row,
        2].Style.Fill.BackgroundColor.SetColor(headlinesColor);
      foreach (var employee in networkCompany.Company.Employees)
      {
        row++;
        worksheet.Cells[row++,
          2].Value = employee.FirstName + " " + employee.LastName;
        worksheet.Cells[row++,
          2].Value = employee.Email;
        worksheet.Cells[row++,
          2].Value = employee.PhoneNumber;
      }

      if (networkCompany.Measures.Any())
      {
        foreach (var measure in networkCompany.Measures)
        {
          total = measure.EnergySavings.Aggregate(total,
            (current, saving) => (int) (current + saving.Value));
          if (measure.State.Title == "abgeschlossen")
          {
            finished++;
            saved = measure.EnergySavings.Aggregate(saved,
              (current, saving) => (int) (current + saving.Value));
          }

          if (measure.State.Title == "abgelehnt")
          {
            denied = measure.EnergySavings.Aggregate(denied,
              (current, saving) => (int) (current + saving.Value));
          }

          if (measure.State.Title == "in Bearbeitung")
          {
            inprogress++;
          }
        }

        total -= denied;

        worksheet.Cells[++row,
          2].Value = "Maßnahmen";
        worksheet.Cells[row,
          2].Style.Font.Bold = true;
        worksheet.Cells[row,
          2,
          row,
          4].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row,
          2,
          row,
          4].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[++row,
          2].Value = "Maßnahmen gesamt";
        worksheet.Cells[row++,
          4].Value = networkCompany.Measures.Count;

        worksheet.Cells[row,
          2].Value = "in Bearbeitung";
        worksheet.Cells[row++,
          4].Value = inprogress;

        worksheet.Cells[row,
          2].Value = "abgeschlossene Maßnahmen";
        worksheet.Cells[row++,
          4].Value = finished;

        worksheet.Cells[row,
          2].Value = "eingesparte Energie";
        worksheet.Cells[row,
          3].Value = "kWh";
        worksheet.Cells[row,
          4].Value = saved;
        worksheet.Cells[row++,
          4].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

        worksheet.Cells[row,
          2].Value = "Potiential abgelehnter Maßnahmen";
        worksheet.Cells[row,
          3].Value = "kWh";
        worksheet.Cells[row,
          4].Value = denied;
        worksheet.Cells[row++,
          4].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

        worksheet.Cells[row,
          2].Value = "gesamt Einsparungspotiential";
        worksheet.Cells[row,
          3].Value = "kWh";
        worksheet.Cells[row,
          4].Value = total;
        worksheet.Cells[row++,
          4].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

        worksheet.Cells[row - 1,
          6].Value = "verbleibendes Potential";
        worksheet.Cells[row - 1,
          8].Value = "kWh";
        worksheet.Cells[row - 1,
          9].Formula = new ExcelCellAddress(row - 1,
            4).Address + "-" + new ExcelCellAddress(row - 3,
              4).Address;

        int chartrowStart;

        if ((row - 15) <= 0)
        {
          chartrowStart = 1;
        }
        else
        {
          chartrowStart = row - 15;
        }

        ExcelChart chartMeasures = worksheet.Drawings.AddChart("Maßnahmen",
          eChartType.Pie);
        chartMeasures.Title.Text = "Maßnahmenpotential";
        chartMeasures.SetPosition(chartrowStart,
          0,
          4,
          20);
        chartMeasures.SetSize(350,
          280);
        var data1Address = "'" + companyName + "'!" + new ExcelCellAddress(row - 1,
          9).Address;
        var data2Address = "'" + companyName + "'!" + new ExcelCellAddress(row - 2,
          4).Address;
        var data3Address = "'" + companyName + "'!" + new ExcelCellAddress(row - 3,
          4).Address;
        var xAddress = "'" + companyName + "'!" + new ExcelCellAddress(row - 1,
          6).Address + "," + "'" + companyName + "'!" + new ExcelCellAddress(row - 2,
            2).Address + "," + "'" + companyName + "'!" + new ExcelCellAddress(row - 3,
              2).Address;
        var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress(row - 1,
          3).Address);
        var seriesMeasures = chartMeasures.Series.Add(data1Address + "," + data2Address + "," + data3Address,
          xAddress);
        seriesMeasures.HeaderAddress = legendAddress;
        chartMeasures.Style = eChartStyle.Style2;
      }

      {
        var effizienzstrom = new double[3000];
        var effizienzerdgas = new double[3000];
        var effizienzheizöl = new double[3000];
        var effizienzfernwärme = new double[3000];
        var effizienz = new double[3000];
        var effiemissstrom = new double[3000];
        var effiemisserdgas = new double[3000];
        var effiemissheizöl = new double[3000];
        var effiemissfernwärme = new double[3000];
        var effiemiss = new double[3000];

        var minYear = 3000;
        var maxYear = 0;

        var isEmpty = networkCompany.Surveys.Count(s => s.Readings.Count > 0) == 0;

        if (networkCompany.Surveys.Count(s => s.Readings.Count > 0) == 0)
        {
          return row;
        }
        foreach (var survey in networkCompany.Surveys)
        {
          var relevantYear = true;

          foreach (var reading in survey.Readings)
          {
            var value = reading.Value / 1000;

            effizienz[survey.Date.Year] += value;
            effiemiss[survey.Date.Year] += value * reading.EnergySource.CO2Equivalent / 1000;

            if (reading.EnergySource.Name == "electricity")
            {
              effizienzstrom[survey.Date.Year] += value;
              effiemissstrom[survey.Date.Year] += value * reading.EnergySource.CO2Equivalent / 1000;
            }
            if (reading.EnergySource.Name == "naturalGas")
            {
              effizienzerdgas[survey.Date.Year] += value;
              effiemisserdgas[survey.Date.Year] += value * reading.EnergySource.CO2Equivalent / 1000;
            }
            if (reading.EnergySource.Name == "fuelOil")
            {
              effizienzheizöl[survey.Date.Year] += value;
              effiemissheizöl[survey.Date.Year] += value * reading.EnergySource.CO2Equivalent / 1000;
            }
            if (reading.EnergySource.Name == "districtHeating")
            {
              effizienzfernwärme[survey.Date.Year] += value;
              effiemissfernwärme[survey.Date.Year] += value * reading.EnergySource.CO2Equivalent / 1000;
            }

            if (minYear > survey.Date.Year)
            {
              minYear = survey.Date.Year;
            }
            if (maxYear < survey.Date.Year)
            {
              maxYear = survey.Date.Year;
            }
            relevantYear = effizienz[survey.Date.Year] != 0;
          }

          if ((!relevantYear) && (minYear == survey.Date.Year))
          {
            minYear++;
          }
          if ((!relevantYear) && (maxYear == survey.Date.Year))
          {
            maxYear--;
          }
        }

        row++;
        var co2Offset = maxYear - minYear + 6;
        var rowOffset = 0;
        for (int index = minYear; index <= maxYear; index++)
        {
          worksheet.Cells[row + 0,
            2].Value = "Energieverbrauch";
          worksheet.Cells[row + 0,
            2].Style.Font.Bold = true;
          worksheet.Cells[row + 0,
            4 + (index - minYear)].Value = index;
          worksheet.Cells[row + 0,
            4 + (index - minYear)].Style.Font.Bold = true;
          worksheet.Cells[row + 1,
            2].Value = "Strom";
          worksheet.Cells[row + 1,
            3].Value = "MWh";
          worksheet.Cells[row + 1,
            4 + (index - minYear)].Value = effizienzstrom[index];
          worksheet.Cells[row + 1,
            4 + (index - minYear)].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
          worksheet.Cells[row + 2,
            2].Value = "Erdgas";
          worksheet.Cells[row + 2,
            3].Value = "MWh";
          worksheet.Cells[row + 2,
            4 + (index - minYear)].Value = effizienzerdgas[index];
          worksheet.Cells[row + 2,
            4 + (index - minYear)].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
          worksheet.Cells[row + 3,
            2].Value = "Heizöl";
          worksheet.Cells[row + 3,
            3].Value = "MWh";
          worksheet.Cells[row + 3,
            4 + (index - minYear)].Value = effizienzheizöl[index];
          worksheet.Cells[row + 3,
            4 + (index - minYear)].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
          worksheet.Cells[row + 4,
            2].Value = "Fernwärme";
          worksheet.Cells[row + 4,
            3].Value = "MWh";
          worksheet.Cells[row + 4,
            4 + (index - minYear)].Value = effizienzfernwärme[index];
          worksheet.Cells[row + 4,
            4 + (index - minYear)].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

          worksheet.Cells[row + 0,
            (co2Offset + 2)].Value = "CO2-Emissionen";
          worksheet.Cells[row + 0,
            (co2Offset + 2)].Style.Font.Bold = true;
          worksheet.Cells[row + 0,
            (co2Offset + 4) + (index - minYear)].Value = index;
          worksheet.Cells[row + 0,
            (co2Offset + 4) + (index - minYear)].Style.Font.Bold = true;
          worksheet.Cells[row + 1,
            (co2Offset + 2)].Value = "CO2 Strom";
          worksheet.Cells[row + 1,
            (co2Offset + 3)].Value = "t";
          worksheet.Cells[row + 1,
            (co2Offset + 4) + (index - minYear)].Value = effiemissstrom[index];
          worksheet.Cells[row + 1,
            (co2Offset + 4) + (index - minYear)].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
          worksheet.Cells[row + 2,
            (co2Offset + 2)].Value = "CO2 Erdgas";
          worksheet.Cells[row + 2,
            (co2Offset + 3)].Value = "t";
          worksheet.Cells[row + 2,
            (co2Offset + 4) + (index - minYear)].Value = effiemisserdgas[index];
          worksheet.Cells[row + 2,
            (co2Offset + 4) + (index - minYear)].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
          worksheet.Cells[row + 3,
            (co2Offset + 2)].Value = "CO2 Heizöl";
          worksheet.Cells[row + 3,
            (co2Offset + 3)].Value = "t";
          worksheet.Cells[row + 3,
            (co2Offset + 4) + (index - minYear)].Value = effiemissheizöl[index];
          worksheet.Cells[row + 3,
            (co2Offset + 4) + (index - minYear)].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
          worksheet.Cells[row + 4,
            (co2Offset + 2)].Value = "CO2 Fernwärme";
          worksheet.Cells[row + 4,
            (co2Offset + 3)].Value = "t";
          worksheet.Cells[row + 4,
            (co2Offset + 4) + (index - minYear)].Value = effiemissfernwärme[index];
          worksheet.Cells[row + 4,
            (co2Offset + 4) + (index - minYear)].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
        }
        worksheet.Cells[row + 0,
          6 + maxYear - minYear].Value = "Summe";
        worksheet.Cells[row + 0,
          6 + maxYear - minYear].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row + 0,
          6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 0,
          2,
          row,
          6 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + 0,
          2,
          row,
          6 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + 1,
          6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 1,
              4,
              row + 1,
              4 + maxYear - minYear).Address);
        worksheet.Cells[row + 1,
          6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 1,
          6 + maxYear - minYear].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
        worksheet.Cells[row + 2,
          6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 2,
              4,
              row + 2,
              4 + maxYear - minYear).Address);
        worksheet.Cells[row + 2,
          6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 2,
          6 + maxYear - minYear].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
        worksheet.Cells[row + 3,
          6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 3,
              4,
              row + 3,
              4 + maxYear - minYear).Address);
        worksheet.Cells[row + 3,
          6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 3,
          6 + maxYear - minYear].Style.Numberformat.Format = "#,##0;[RED] -#,##0";
        worksheet.Cells[row + 4,
          6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 4,
              4,
              row + 4,
              4 + maxYear - minYear).Address);
        worksheet.Cells[row + 4,
          6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 4,
          6 + maxYear - minYear].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

        worksheet.Cells[row + 0,
          co2Offset + 6 + maxYear - minYear].Value = "Summe";
        worksheet.Cells[row + 0,
          co2Offset + 6 + maxYear - minYear].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
        worksheet.Cells[row + 0,
          co2Offset + 6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 0,
          co2Offset + 2,
          row,
          co2Offset + 6 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + 0,
          co2Offset + 2,
          row,
          co2Offset + 6 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + 1,
          co2Offset + 6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 1,
              co2Offset + 4,
              row + 1,
              co2Offset + 4 + maxYear - minYear).Address);
        worksheet.Cells[row + 1,
          co2Offset + 6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 1,
          co2Offset + 6 + maxYear - minYear].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
        worksheet.Cells[row + 2,
          co2Offset + 6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 2,
              co2Offset + 4,
              row + 2,
              co2Offset + 4 + maxYear - minYear).Address);
        worksheet.Cells[row + 2,
          co2Offset + 6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 2,
          co2Offset + 6 + maxYear - minYear].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
        worksheet.Cells[row + 3,
          co2Offset + 6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 3,
              co2Offset + 4,
              row + 3,
              co2Offset + 4 + maxYear - minYear).Address);
        worksheet.Cells[row + 3,
          co2Offset + 6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 3,
          co2Offset + 6 + maxYear - minYear].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";
        worksheet.Cells[row + 4,
          co2Offset + 6 + maxYear - minYear].Formula = string.Format("Sum({0})",
            new ExcelAddress(row + 4,
              co2Offset + 4,
              row + 4,
              co2Offset + 4 + maxYear - minYear).Address);
        worksheet.Cells[row + 4,
          co2Offset + 6 + maxYear - minYear].Style.Font.Bold = true;
        worksheet.Cells[row + 4,
          co2Offset + 6 + maxYear - minYear].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";

        row += 5;
        worksheet.Cells[row,
          2].Value = "Summe";
        worksheet.Cells[row,
          2].Style.Font.Bold = true;
        worksheet.Cells[row,
          3].Value = "MWh";
        worksheet.Cells[row,
          3].Style.Font.Bold = true;
        worksheet.Cells[row,
          co2Offset + 2].Value = "Summe";
        worksheet.Cells[row,
          co2Offset + 2].Style.Font.Bold = true;
        worksheet.Cells[row,
          co2Offset + 3].Value = "t";
        worksheet.Cells[row,
          co2Offset + 3].Style.Font.Bold = true;

        rowOffset = 18;
        worksheet.Cells[++row + rowOffset + 0,
          2].Value = "Entwicklung des Energieverbrauches";
        worksheet.Cells[row + rowOffset + 0,
          2].Style.Font.Bold = true;
        worksheet.Cells[row + rowOffset + 0,
          2,
          row + 18,
          4 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + rowOffset + 0,
          2,
          row + 18,
          4 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + rowOffset + 1,
          2].Value = "Strom";
        worksheet.Cells[row + rowOffset + 2,
          2].Value = "Erdgas";
        worksheet.Cells[row + rowOffset + 3,
          2].Value = "Heizöl";
        worksheet.Cells[row + rowOffset + 4,
          2].Value = "Fernwärme";
        worksheet.Cells[row + rowOffset + 5,
          2].Value = "Gesamt";
        worksheet.Cells[row + rowOffset + 5,
          2].Style.Font.Bold = true;

        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2].Value = "Entwicklung der CO2-Emissionen";
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2].Style.Font.Bold = true;
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2,
          row + rowOffset + 0,
          co2Offset + 4 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2,
          row + rowOffset + 0,
          co2Offset + 4 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + rowOffset + 1,
          co2Offset + 2].Value = "CO2 Strom";
        worksheet.Cells[row + rowOffset + 2,
          co2Offset + 2].Value = "CO2 Erdgas";
        worksheet.Cells[row + rowOffset + 3,
          co2Offset + 2].Value = "CO2 Heizöl";
        worksheet.Cells[row + rowOffset + 4,
          co2Offset + 2].Value = "CO2 Fernwärme";
        worksheet.Cells[row + rowOffset + 5,
          co2Offset + 2].Value = "CO2 Gesamt";
        worksheet.Cells[row + rowOffset + 5,
          co2Offset + 2].Style.Font.Bold = true;

        rowOffset = 42;
        worksheet.Cells[row + rowOffset + 0,
          2].Value = "Anteile am Gesamtenergieverbrauch";
        worksheet.Cells[row + rowOffset + 0,
          2].Style.Font.Bold = true;
        worksheet.Cells[row + rowOffset + 0,
          2,
          row + rowOffset + 0,
          4 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + rowOffset + 0,
          2,
          row + rowOffset + 0,
          4 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + rowOffset + 1,
          2].Value = "Stromanteil";
        worksheet.Cells[row + rowOffset + 2,
          2].Value = "Erdgasanteil";
        worksheet.Cells[row + rowOffset + 3,
          2].Value = "Heizölanteil";
        worksheet.Cells[row + rowOffset + 4,
          2].Value = "Fernwärmeanteil";

        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2].Value = "Anteile an den Gesamtemissionen";
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2].Style.Font.Bold = true;
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2,
          row + rowOffset + 0,
          co2Offset + 4 + maxYear - minYear].Style.Fill.PatternType = ExcelFillStyle.Solid;
        worksheet.Cells[row + rowOffset + 0,
          co2Offset + 2,
          row + rowOffset + 0,
          co2Offset + 4 + maxYear - minYear].Style.Fill.BackgroundColor.SetColor(headlinesColor);
        worksheet.Cells[row + rowOffset + 1,
          co2Offset + 2].Value = "CO2 Stromanteil";
        worksheet.Cells[row + rowOffset + 2,
          co2Offset + 2].Value = "CO2 Erdgasanteil";
        worksheet.Cells[row + rowOffset + 3,
          co2Offset + 2].Value = "CO2 Heizölanteil";
        worksheet.Cells[row + rowOffset + 4,
          co2Offset + 2].Value = "CO2 Fernwärmeanteil";

        for (int index = minYear; index <= maxYear; index++)
        {
          worksheet.Cells[row - 1,
            4 + index - minYear].Formula = string.Format("Sum({0})",
              new ExcelAddress(row - 5,
                4 + index - minYear,
                row - 2,
                4 + index - minYear).Address);
          worksheet.Cells[row - 1,
            4 + index - minYear].Style.Font.Bold = true;
          worksheet.Cells[row - 1,
            4 + index - minYear].Style.Numberformat.Format = "#,##0;[RED] -#,##0";

          worksheet.Cells[row - 1,
            co2Offset + 4 + index - minYear].Formula = string.Format("Sum({0})",
              new ExcelAddress(row - 5,
                co2Offset + 4 + index - minYear,
                row - 2,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row - 1,
            co2Offset + 4 + index - minYear].Style.Font.Bold = true;
          worksheet.Cells[row - 1,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "#,##0.00;[RED] -#,##0.00";

          rowOffset = 18;
          worksheet.Cells[row + rowOffset + 1,
            4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 5,
                4).Address,
              new ExcelCellAddress(row - 5,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 1,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 2,
            4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 4,
                4).Address,
              new ExcelCellAddress(row - 4,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 2,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 3,
            4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 3,
                4).Address,
              new ExcelCellAddress(row - 3,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 3,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 4,
            4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 2,
                4).Address,
              new ExcelCellAddress(row - 2,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 4,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 5,
            4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 1,
                4).Address,
              new ExcelCellAddress(row - 1,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 5,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 5,
            4 + index - minYear].Style.Font.Bold = true;

          worksheet.Cells[row + rowOffset + 1,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 5,
                co2Offset + 4).Address,
              new ExcelCellAddress(row - 5,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 1,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 2,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 4,
                co2Offset + 4).Address,
              new ExcelCellAddress(row - 4,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 2,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 3,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 3,
                co2Offset + 4).Address,
              new ExcelCellAddress(row - 3,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 3,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 4,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 2,
                co2Offset + 4).Address,
              new ExcelCellAddress(row - 2,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 4,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 5,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({0}<>0,Sum({1}/{0}),0)",
              new ExcelCellAddress(row - 1,
                co2Offset + 4).Address,
              new ExcelCellAddress(row - 1,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 5,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";

          rowOffset = 42;
          worksheet.Cells[row + rowOffset + 1,
            4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 5,
                4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 1,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 2,
            4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 4,
                4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 2,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 3,
            4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 3,
                4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 3,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 4,
            4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 2,
                4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 4,
            4 + index - minYear].Style.Numberformat.Format = "0.00%";

          worksheet.Cells[row + rowOffset + 1,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 5,
                co2Offset + 4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 1,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 2,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 4,
                co2Offset + 4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 2,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 3,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 3,
                co2Offset + 4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 3,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
          worksheet.Cells[row + rowOffset + 4,
            co2Offset + 4 + index - minYear].Formula = string.Format("IF({1}<>0,Sum({0}/{1}),0)",
              new ExcelCellAddress(row - 2,
                co2Offset + 4 + index - minYear).Address,
              new ExcelCellAddress(row - 1,
                co2Offset + 4 + index - minYear).Address);
          worksheet.Cells[row + rowOffset + 4,
            co2Offset + 4 + index - minYear].Style.Numberformat.Format = "0.00%";
        }

        ExcelChart chartOverview = worksheet.Drawings.AddChart("Entwicklung der Energieeffizienz",
          eChartType.Line);
        chartOverview.Title.Text = "Entwicklung der Energieeffizienz";
        int chartrowStart;
        int chartrowOffset;
        int chartpixelOffset;
        int chartsizeDelta;
        if (co2Offset < 9)
        {
          chartrowOffset = co2Offset + 1;
          chartpixelOffset = 80;
          chartsizeDelta = 355 + (40 * (maxYear - minYear));
        }
        else
        {
          chartrowOffset = co2Offset + 1;
          chartpixelOffset = 10;
          chartsizeDelta = 315 + (40 * (maxYear - minYear));
        }
        if ((row - 27) <= 0)
        {
          chartrowStart = 1;
        }
        else
        {
          chartrowStart = row - 27;
        }

        chartOverview.SetPosition(chartrowStart,
          0,
          chartrowOffset,
          chartpixelOffset);
        chartOverview.SetSize(chartsizeDelta,
          380);
        {
          var data1Address = new ExcelAddress((row + 23),
            4,
            (row + 23),
            (4 + maxYear - minYear)).Address;
          var data2Address = new ExcelAddress((row + 23),
            4 + co2Offset,
            (row + 23),
            (4 + co2Offset + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 6,
            4,
            row - 6,
            (4 + maxYear - minYear)).Address;
          var series1Overview = chartOverview.Series.Add(data1Address,
            xAddress);
          series1Overview.HeaderAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row + 18),
            2).Address);
          var series2Overview = chartOverview.Series.Add(data2Address,
            xAddress);
          series2Overview.HeaderAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row + 18),
            co2Offset + 2).Address);
        }
        chartOverview.Style = eChartStyle.Style2;

        ExcelChart chartEnergieVerbrauch = worksheet.Drawings.AddChart("Energieverbrauch",
          eChartType.ColumnClustered);
        chartEnergieVerbrauch.Title.Text = "Energieverbrauch";
        chartEnergieVerbrauch.SetPosition(row,
          0,
          1,
          0);
        chartEnergieVerbrauch.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row - 5 + index),
            4,
            (row - 5 + index),
            (4 + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 6,
            4,
            row - 6,
            (4 + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row - 5 + index),
            2).Address);
          var seriesEnergieVerbrauch = chartEnergieVerbrauch.Series.Add(dataAddress,
            xAddress);
          seriesEnergieVerbrauch.HeaderAddress = legendAddress;
        }
        chartEnergieVerbrauch.Style = eChartStyle.Style2;
        chartEnergieVerbrauch.YAxis.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";

        ExcelChart chartEmission = worksheet.Drawings.AddChart("CO2-Emissionen",
          eChartType.ColumnClustered);
        chartEmission.Title.Text = "CO2-Emissionen";
        chartEmission.SetPosition(row,
          0,
          1 + co2Offset,
          0);
        chartEmission.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row - 5 + index),
            4 + co2Offset,
            (row - 5 + index),
            (4 + co2Offset + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 6,
            4 + co2Offset,
            row - 6,
            (4 + co2Offset + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row - 5 + index),
            2 + co2Offset).Address);
          var seriesEmission = chartEmission.Series.Add(dataAddress,
            xAddress);
          seriesEmission.HeaderAddress = legendAddress;
        }
        chartEmission.Style = eChartStyle.Style2;
        chartEmission.YAxis.Format = "#,##0 [$t];[RED] -#,##0 [$t]";

        ExcelChart chartEnergieEntwicklung = worksheet.Drawings.AddChart("Energieffizienzentwicklung",
          eChartType.Line);
        chartEnergieEntwicklung.Title.Text = "Energieentwicklung";
        chartEnergieEntwicklung.SetPosition(row + 24,
          0,
          1,
          0);
        chartEnergieEntwicklung.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row + 24 - 5 + index),
            4,
            (row + 24 - 5 + index),
            (4 + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 6,
            4,
            row - 6,
            (4 + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row + 24 - 5 + index),
            2).Address);
          var seriesEnergieEntwicklung = chartEnergieEntwicklung.Series.Add(dataAddress,
            xAddress);
          seriesEnergieEntwicklung.HeaderAddress = legendAddress;
        }
        chartEnergieEntwicklung.Style = eChartStyle.Style2;

        ExcelChart chartCO2entwicklung = worksheet.Drawings.AddChart("CO2-Emissionenentwicklung",
          eChartType.Line);
        chartCO2entwicklung.Title.Text = "CO2-Entwicklung";
        chartCO2entwicklung.SetPosition(row + 24,
          0,
          1 + co2Offset,
          0);
        chartCO2entwicklung.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row + 24 - 5 + index),
            4 + co2Offset,
            (row + 24 - 5 + index),
            (4 + co2Offset + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 6,
            4 + co2Offset,
            row - 6,
            (4 + co2Offset + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row + 24 - 5 + index),
            2 + co2Offset).Address);
          var seriesCO2entwicklung = chartCO2entwicklung.Series.Add(dataAddress,
            xAddress);
          seriesCO2entwicklung.HeaderAddress = legendAddress;
        }
        chartCO2entwicklung.Style = eChartStyle.Style2;

        row += 47;

        ExcelChart chartAnteilGesamt = worksheet.Drawings.AddChart("Anteile am Gesamtenergieverbrauch",
          eChartType.ColumnStacked100);
        chartAnteilGesamt.Title.Text = "Anteile am Gesamtenergieverbrauch";
        //chartAnteilGesamt.Legend.Position = eLegendPosition.Right;
        //chartAnteilGesamt.Legend.Add();
        chartAnteilGesamt.SetPosition(row,
          0,
          1,
          0);
        chartAnteilGesamt.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row - 4 + index),
            4,
            (row - 4 + index),
            (4 + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 53,
            4,
            row - 53,
            (4 + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row - 4 + index),
            2).Address);
          var seriesAnteilGesamt = chartAnteilGesamt.Series.Add(dataAddress,
            xAddress);
          seriesAnteilGesamt.HeaderAddress = legendAddress;
        }
        //chart.DataLabel.ShowCategory = true;
        //chart.DataLabel.ShowPercent = true;
        //chart.DataLabel.ShowLeaderLines = true;
        //chartAnteilGesamt.Legend.Remove();
        chartAnteilGesamt.Style = eChartStyle.Style2;
        //chartAnteilGesamt.YAxis.Format = "#,##0 [$kWh];[RED] -#,##0 [$kWh]";

        ExcelChart chartAnteilGesEmis = worksheet.Drawings.AddChart("Anteile an den CO2-Emissionen",
          eChartType.ColumnStacked100);
        chartAnteilGesEmis.Title.Text = "Anteile an den CO2-Emissionen";
        chartAnteilGesEmis.SetPosition(row,
          0,
          1 + co2Offset,
          0);
        chartAnteilGesEmis.SetSize(305 + (40 * (maxYear - minYear)),
          315);
        for (int index = 0; index < 4; index++)
        {
          var dataAddress = new ExcelAddress((row - 4 + index),
            4 + co2Offset,
            (row - 4 + index),
            (4 + co2Offset + maxYear - minYear)).Address;
          var xAddress = new ExcelAddress(row - 53,
            4 + co2Offset,
            row - 53,
            (4 + co2Offset + maxYear - minYear)).Address;
          var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress((row - 4 + index),
            2 + co2Offset).Address);
          var seriesAnteilGesEmis = chartAnteilGesEmis.Series.Add(dataAddress,
            xAddress);
          seriesAnteilGesEmis.HeaderAddress = legendAddress;
        }
        chartAnteilGesEmis.Style = eChartStyle.Style2;

        var pieChartsEnergyperYear = new ExcelChart[maxYear - minYear + 1];
        var pieChartsCO2perYear = new ExcelChart[maxYear - minYear + 1];

        for (int index = 0; index <= (maxYear - minYear); index++)
        {
          {
            pieChartsEnergyperYear[index] = worksheet.Drawings.AddChart(("Energieverbrauchsanteile in " + (minYear + index)),
              eChartType.Pie);
            pieChartsEnergyperYear[index].Title.Text = "Energieverbrauchsanteile in " + (minYear + index);
            pieChartsEnergyperYear[index].SetPosition(row + 17 + (17 * index),
              0,
              1,
              0);
            pieChartsEnergyperYear[index].SetSize(305 + (40 * (maxYear - minYear)),
              315);
            var dataAddress = new ExcelAddress(row - 4,
              4 + index,
              row - 1,
              4 + index).Address;
            var xAddress = new ExcelAddress(row - 4,
              2,
              row - 1,
              2).Address;
            var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress(row - 5,
              2).Address);
            var seriespieChartEnergy = pieChartsEnergyperYear[index].Series.Add(dataAddress,
              xAddress);
            seriespieChartEnergy.HeaderAddress = legendAddress;
          }
          {
            pieChartsCO2perYear[index] = worksheet.Drawings.AddChart(("CO2-Emissionsanteile in " + (minYear + index)),
              eChartType.Pie);
            pieChartsCO2perYear[index].Title.Text = "CO2-Emissionsanteile in " + (minYear + index);
            pieChartsCO2perYear[index].SetPosition(row + 17 + (17 * index),
              0,
              co2Offset + 1,
              0);
            pieChartsCO2perYear[index].SetSize(305 + (40 * (maxYear - minYear)),
              315);
            var dataAddress = new ExcelAddress(row - 4,
              co2Offset + 4 + index,
              row - 1,
              co2Offset + 4 + index).Address;
            var xAddress = new ExcelAddress(row - 4,
              co2Offset + 2,
              row - 1,
              co2Offset + 2).Address;
            var legendAddress = new ExcelAddress("'" + companyName + "'!" + new ExcelCellAddress(row - 5,
              co2Offset + 2).Address);
            var seriespieChartCO2 = pieChartsCO2perYear[index].Series.Add(dataAddress,
              xAddress);
            seriespieChartCO2.HeaderAddress = legendAddress;
          }
        }

        worksheet.Column(1).
          Width = 8.43;
        worksheet.Column(2).
          Width = 33.57;
        worksheet.Column(3).
          Width = 7.43;
        for (int index = 0; index <= (maxYear - minYear); index++)
        {
          worksheet.Column(4 + index).
            Width = 10;
        }
        worksheet.Column(5 + maxYear - minYear).
          Width = 0.83;
        worksheet.Column(6 + maxYear - minYear).
          Width = 9.29;

        worksheet.Column(co2Offset + 1).
          Width = 8.43;
        worksheet.Column(co2Offset + 2).
          Width = 16.43;
        worksheet.Column(co2Offset + 3).
          Width = 6.43;
        for (int index = 0; index <= (maxYear - minYear); index++)
        {
          worksheet.Column(co2Offset + 4 + index).
            Width = 10;
        }
        worksheet.Column(co2Offset + 5 + maxYear - minYear).
          Width = 0.83;
        worksheet.Column(co2Offset + 6 + maxYear - minYear).
          Width = 10;

        row += 17;

        return (row);
      }
    }
  }

  public class ExcelHelper
  {
    //The correct method to convert width to pixel is:
    //Pixel =Truncate(((256 * {width} + Truncate(128/{Maximum DigitWidth}))/256)*{Maximum Digit Width})

    //The correct method to convert pixel to width is:
    //1. use the formula =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100 
    //    to convert pixel to character number.
    //2. use the formula width = Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256 
    //    to convert the character number to width.

    private const int MTU_PER_PIXEL = 9525;

    public static void AddImage(ExcelWorksheet ws, int columnIndex, int rowIndex, string filePath)
    {
      //How to Add a Image using EP Plus
      var image = new Bitmap(filePath);
      ExcelPicture picture = null;
      if (image != null)
      {
        picture = ws.Drawings.AddPicture("pic" + rowIndex.ToString() + columnIndex.ToString(),
          image);
        picture.From.Column = columnIndex;
        picture.From.Row = rowIndex;
        picture.From.ColumnOff = Pixel2MTU(2); //Two pixel space for better alignment
        picture.From.RowOff = Pixel2MTU(2); //Two pixel space for better alignment
        picture.SetSize(100,
          100);
      }
    }

    public static int ColumnWidth2Pixel(ExcelWorksheet ws, double excelColumnWidth)
    {
      //The correct method to convert width to pixel is:
      //Pixel =Truncate(((256 * {width} + Truncate(128/{Maximum DigitWidth}))/256)*{Maximum Digit Width})

      //get the maximum digit width
      decimal mdw = ws.Workbook.MaxFontWidth;

      //convert width to pixel
      decimal pixels = decimal.Truncate(((256 * (decimal) excelColumnWidth + decimal.Truncate(128 / (decimal) mdw)) / 256) * mdw);
      //double columnWidthInTwips = (double)(pixels * (1440f / 96f));

      return Convert.ToInt32(pixels);
    }

    public static double Pixel2ColumnWidth(ExcelWorksheet ws, int pixels)
    {
      //The correct method to convert pixel to width is:
      //1. use the formula =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100 
      //    to convert pixel to character number.
      //2. use the formula width = Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256 
      //    to convert the character number to width.

      //get the maximum digit width
      decimal mdw = ws.Workbook.MaxFontWidth;

      //convert pixel to character number
      decimal numChars = decimal.Truncate(decimal.Add((decimal) (pixels - 5) / mdw * 100,
        (decimal) 0.5)) / 100;
      //convert the character number to width
      decimal excelColumnWidth = decimal.Truncate((decimal.Add(numChars * mdw,
        (decimal) 5)) / mdw * 256) / 256;

      return Convert.ToDouble(excelColumnWidth);
    }

    public static int RowHeight2Pixel(double excelRowHeight)
    {
      //convert height to pixel
      decimal pixels = decimal.Truncate((decimal) (excelRowHeight / 0.75));

      return Convert.ToInt32(pixels);
    }

    public static double Pixel2RowHeight(int pixels)
    {
      //convert height to pixel
      double excelRowHeight = pixels * (double) 0.75;

      return excelRowHeight;
    }

    public static int MTU2Pixel(int mtus)
    {
      //convert MTU to pixel
      decimal pixels = decimal.Truncate((decimal) (mtus / MTU_PER_PIXEL));

      return Convert.ToInt32(pixels);
    }

    public static int Pixel2MTU(int pixels)
    {
      //convert pixel to MTU
      int mtus = pixels * MTU_PER_PIXEL;

      return mtus;
    }
  }
}