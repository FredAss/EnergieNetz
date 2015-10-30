using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Migrations;
using System.Linq;
using EnergyNetwork.Domain.Model;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Fakenames = Faker;

namespace EnergyNetwork.Data.Migrations
{
  internal sealed class Configuration: DbMigrationsConfiguration<EnergyNetworkDbContext>
  {
    private static int _energySourceColors;
    private MeasureState _closed;
    private EnergySource _districtHeat;
    private EnergySource _electricity;
    private EnergySource _gas;
    private MeasureState _inProgress;
    private EnergySource _oil;
    private MeasureState _open;
    private MeasureState _rejected;
    private OutputUnit _tons;
    private OutputUnit _piece;
    private OutputUnit _mioPiece;
    private OutputUnit _mioClicks;
    private OutputUnit _pax;
    private OutputUnit _mioEuro;
    private RoleManager<IdentityRole> _roleManager;
    private UserManager<UserProfile> _userManager;

    public Configuration()
    {
      AutomaticMigrationsEnabled = true;
    }

    protected override void Seed(EnergyNetworkDbContext context)
    {
      _userManager = new UserManager<UserProfile>(new UserStore<UserProfile>(context));
      _roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
      CreateEnergySources(context);
      CreateOutputUnits();
      CreateMeasureStates(context);
      CreateRolesAndUserData(context);
      context.SaveChanges();
    }

    private static EnergySource CreateEnergySource(string name, string description, string unit, double co2equivalent)
    {
      var energySource = new EnergySource{
                                           EnergySourceId = Guid.NewGuid(),
                                           Name = name,
                                           Description = description,
                                           Unit = unit,
                                           CO2Equivalent = co2equivalent,
                                           Color = HTMLColor.Colors[_energySourceColors]
                                         };

      if (_energySourceColors < (HTMLColor.Colors.Length - 1))
      {
        _energySourceColors++;
      }

      return energySource;
    }

    private static OutputUnit CreateOutputUnit(string name)
    {
      var outputUnit = new OutputUnit{
                                       OutputUnitId = Guid.NewGuid(),
                                       Name = name
                                     };

      if (_energySourceColors < (HTMLColor.Colors.Length - 1))
      {
        _energySourceColors++;
      }

      return outputUnit;
    }


    private void CreateEnergySources(EnergyNetworkDbContext context)
    {
      _electricity = CreateEnergySource("electricity",
        "Stromheizung m. Netzverlusten, Emissionsfaktor (inkl. Vorketten) für die Wärmebereitstellung",
        "g/kWh",
        626.1);
      _oil = CreateEnergySource("fuelOil",
        "Heizöl-Mix EL + S (Industrie), Emissionsfaktor (inkl. Vorketten) für die Wärmebereitstellung",
        "g/kWh",
        341.4);

      _gas = CreateEnergySource("naturalGas",
        "Erdgas (Industrie), Emissionsfaktor (inkl. Vorketten) für die Wärmebereitstellung",
        "g/kWh",
        276.8);

      _districtHeat = CreateEnergySource("districtHeating",
        "Fernwärme m. Netzverlust, , Emissionsfaktor (inkl. Vorketten) für die Wärmebereitstellung",
        "g/kWh",
        325.4);
    }

    private void CreateOutputUnits()
    {
      _tons = CreateOutputUnit("tons");
      _piece = CreateOutputUnit("piece");
      _mioPiece = CreateOutputUnit("mioPiece");
      _mioClicks = CreateOutputUnit("mioClicks");
      _pax = CreateOutputUnit("pax");
      _mioEuro = CreateOutputUnit("mioEuro");
    }

    private MeasureState CreateMeasureState(string title, int index)
    {
      var measureState = new MeasureState{
                                           Id = Guid.NewGuid(),
                                           Index = index,
                                           Title = title,
                                         };

      return measureState;
    }

    private void CreateMeasureStates(EnergyNetworkDbContext context)
    {
      _open = CreateMeasureState("open",
        0);
      _inProgress = CreateMeasureState("inProgress",
        1);

      _closed = CreateMeasureState("finished",
        2);

      _rejected = CreateMeasureState("rejected",
        3);
    }

    private void CreateRolesAndUserData(EnergyNetworkDbContext context)
    {
      if (!_roleManager.RoleExists("Administrator"))
      {
        _roleManager.Create(new IdentityRole("Administrator"));
      }

      if (!_roleManager.RoleExists("User"))
      {
        _roleManager.Create(new IdentityRole("User"));
      }

      if (_userManager.FindByName("admin") == null)
      {
        var user = new UserProfile{
                                    UserName = "admin",
                                    FirstName = "Max",
                                    LastName = "Mustermann",
                                    Email = "xxxxx@xxxxx.com",
                                    EmailConfirmed = true,
                                    Activated = true
                                  };
        IdentityResult result = _userManager.Create(user,
          "admin1234");
        if (result.Succeeded)
        {
          _userManager.AddToRole(user.Id,
            "Administrator");
        }
      }

    }
  }
}