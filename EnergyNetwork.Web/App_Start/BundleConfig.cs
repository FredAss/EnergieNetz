using System;
using System.Web.Optimization;

namespace EnergyNetwork.Web
{
  public class BundleConfig
  {
    public static void RegisterBundles(BundleCollection bundles)
    {
      bundles.IgnoreList.Clear();
      AddDefaultIgnorePatterns(bundles.IgnoreList);

      // js Vendor
      bundles.Add(new ScriptBundle("~/scripts/vendor")
        .Include("~/bower_components/jquery/dist/jquery.min.js")
        .Include("~/bower_components/knockout/dist/knockout.js")
        .Include("~/bower_components/knockout-validation/dist/knockout.validation.min.js")
        .Include("~/bower_components/KoLite/knockout.activity.js")
        .Include("~/bower_components/KoLite/knockout.command.js")
        .Include("~/bower_components/knockstrap/build/knockstrap.min.js")
        .Include("~/bower_components/bootstrap/dist/js/bootstrap.min.js")
        .Include("~/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js")
        .Include("~/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js")
        .Include("~/bower_components/bootstrap-multiselect/dist/js/bootstrap-multiselect.js")
        .Include("~/bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js")
        .Include("~/bower_components/typeahead.js/dist/typeahead.bundle.min.js")
        .Include("~/bower_components/hammer.js/hammer.min.js")
        .Include("~/bower_components/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js")
        .Include("~/bower_components/jquery.fileDownload/src/Scripts/jquery.fileDownload.js")
        //.Include("~/bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js")
        .Include("~/bower_components/jquery.tablesorter/dist/js/jquery.tablesorter.min.js")
        .Include("~/bower_components/jquery.tablesorter/dist/js/jquery.tablesorter.widgets.min.js")
        .Include("~/bower_components/globalize/lib/globalize.js")
        .Include("~/bower_components/globalize/lib/cultures/globalize.culture.de-DE.js")
        .Include("~/bower_components/flot/jquery.flot.js")
        .Include("~/bower_components/flot.orderbars/js/jquery.flot.orderBars.js")
        .Include("~/bower_components/flot/jquery.flot.navigate.js")
        .Include("~/bower_components/flot/jquery.flot.pie.js")
        .Include("~/bower_components/flot/jquery.flot.resize.js")
        .Include("~/bower_components/stashy/dist/js/Stashy.min.js")
        .Include("~/node_modules/q/q.js")
        .Include("~/Scripts/breeze.min.js")
        );

      // css vendor
      bundles.Add(new StyleBundle("~/Content/css")
        .Include("~/Content/ie10mobile.css")
        .Include("~/bower_components/bootstrap/dist/css/bootstrap.min.css")
        //.Include("~/Content/bootstrap-whiteplum.css")
        .Include("~/Content/bootstrap-theme-white-plum-energieNetz/dist/css/bootstrap.min.css")
        .Include("~/bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.css")
        .Include("~/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css")
        .Include("~/bower_components/bootstrap-multiselect/dist/css/bootstrap-multiselect.css")
        //.Include("~/bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css")
        .Include("~/Content/bootstrap-datetimepicker.min.css")
        .Include("~/bower_components/jquery.tablesorter/dist/css/theme.bootstrap.min.css")
        .Include("~/bower_components/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css")
        .Include("~/bower_components/font-awesome/css/font-awesome.min.css")
        .Include("~/bower_components/durandal/css/durandal.css")
        .Include("~/bower_components/toastr/toastr.min.css")
        .Include("~/bower_components/stashy/dist/css/Stashy.min.css")
        .Include("~/bower_components/leaflet/dist/leaflet.css")
        .Include("~/Content/jquery.easy-pie-chart.css")
        .Include("~/Content/vs.css")
        );

      // css custom
      bundles.Add(new StyleBundle("~/Content/custom").Include("~/Content/app.css"));
    }

    public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
    {
      if (ignoreList == null)
      {
        throw new ArgumentNullException("ignoreList");
      }

      ignoreList.Ignore("*.intellisense.js");
      ignoreList.Ignore("*-vsdoc.js");
      ignoreList.Ignore("*.debug.js",
        OptimizationMode.WhenEnabled);
    }
  }
}