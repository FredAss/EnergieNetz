using System.Data.Entity;
using EnergyNetwork.Data.Migrations;
using EnergyNetwork.Domain.Model;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EnergyNetwork.Data
{
  public class EnergyNetworkDbContext: IdentityDbContext<UserProfile>
  {
    public EnergyNetworkDbContext()
      : base("EnergyNetworkConnection",
        throwIfV1Schema : false)
    {
      Database.SetInitializer(new MigrateDatabaseToLatestVersion<EnergyNetworkDbContext, Configuration>());
    }

    public DbSet<Network> Networks { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<NetworkCompany> NetworkCompanies { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Survey> Surveys { get; set; }
    public DbSet<Reading> Readings { get; set; }
    public DbSet<Invitation> Invitations { get; set; }
    public DbSet<InvestmentPlan> InvestmentPlans { get; set; }
    public DbSet<Comparison> Comparisons { get; set; }
    public DbSet<DocumentContent> DocumentContent { get; set; }
    public DbSet<ChangeSet> ChangeSets { get; set; }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
      Configuration.LazyLoadingEnabled = false;

      // Very bad idea not doing this :)
      //http://stackoverflow.com/questions/19474662/map-tables-using-fluent-api-in-asp-net-mvc5-ef6
      base.OnModelCreating(modelBuilder);
    }
  }
}