#region License

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. 
// You may obtain a copy of the License at
//  
// http://www.apache.org/licenses/LICENSE-2.0.html
//  
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  
// Copyright (c) 2013, HTW Berlin

#endregion

using System;
using System.Collections.Generic;
using System.Linq;
using EnergyNetwork.Domain.Model;
using Microsoft.VisualBasic;

namespace EnergyNetwork.Web.Helpers
{
  public class FinancialCalculation
  {
    private readonly InvestmentPlan _investmentPlan;
    private double _energieKostenAltNeu = 0;
    private double _energieKostenVergleich = 0;
    private double _investmentAltNeu = 0;
    private double _investmentVergleich = 0;
    private double _kalkulatorischerZinssatz = 0;
    private int _nutzungsdauerAltNeu = 0;
    private int _nutzungsdauerVergleich = 0;
    private double _restWertNachEndeNutzungsdauerAltNeu = 0;
    private double _restWertNachEndeNutzungsdauerVergleich = 0;
    private double _restwertInvestitionHeuteAltNeu = 0;
    private double _restwertInvestitionHeuteVergleich = 0;
    private double _sonstigeErträgeProJahrAltNeu = 0;
    private double _sonstigeErträgeProJahrVergleich = 0;
    private double _sonstigeKostenProJahrAltNeu = 0;
    private double _sonstigeKostenProJahrVergleich = 0;
    private int _startjahr = 0;
    private double _änderungEnergiekostenProJahrAltNeu = 0;
    private double _änderungEnergiekostenProJahrVergleich = 0;
    private double _änderungSonstigeErträgeProJahr = 0;
    private double _änderungSonstigeKostenProJahr = 0;

    public FinancialCalculation()
    {
      KapitalwertArrayInvestition = new double[0, 0];
      KapitalwertArrayKosten = new double[0, 0];
    }

    public FinancialCalculation(InvestmentPlan investmentPlan, Comparison comparison)
    {
      _investmentPlan = investmentPlan;
      //_investmentPlan.PropertyChanged += (s, e) =>
      //                                    {
      //                                      Initialize();
      //                                      Calculate();
      //                                    };
      ComparisonModel = comparison;
      //ComparisonModel.PropertyChanged += (s, e) =>
      //                                   {
      //                                     Initialize();
      //                                     Calculate();
      //                                   };
      Initialize();
      Calculate();
    }

    public InvestmentPlan InvestmentPlanModel
    {
      get
      {
        return _investmentPlan;
      }
    }

    public Comparison ComparisonModel { get; private set; }

    public string ComparisonName
    {
      get
      {
        return ComparisonModel.ComparisonName;
      }
    }

    public double DynamicAmortization { get; private set; }
    public double DynamicAmortizationPercentage { get; private set; }
    public double InterneVerzinsung { get; private set; }
    public double JahreskostenAltNeu { get; private set; }
    public double JahreskostenVergleich { get; private set; }
    public double Kapitalwert { get; private set; }
    public double Kostenersparnis { get; private set; }
    public double KreditFürInvestition { get; private set; }
    public double StaticAmortization { get; private set; }
    public double StaticAmortizationPercentage { get; private set; }
    public IEnumerable<Payment> Payments { get; private set; }

    public double[,] KapitalwertArrayInvestition { get; private set; }
    public double[,] KapitalwertArrayKosten { get; private set; }


    private void Initialize()
    {
      _startjahr = _investmentPlan.StartYear.Year;
      _nutzungsdauerAltNeu = _investmentPlan.Lifetime;
      _kalkulatorischerZinssatz = _investmentPlan.ImputedInterestRate;
      _investmentAltNeu = _investmentPlan.InvestmentSum;
      _restwertInvestitionHeuteAltNeu = _investmentPlan.RecoveryValueToday;
      _restWertNachEndeNutzungsdauerAltNeu = _investmentPlan.RecoveryValueAfterLifetime;
      _energieKostenAltNeu = _investmentPlan.EnergyCostsAnnual;
      _änderungEnergiekostenProJahrAltNeu = _investmentPlan.EnergyCostsChangePA;
      _sonstigeKostenProJahrAltNeu = _investmentPlan.OtherCostsPA;
      _änderungSonstigeKostenProJahr = _investmentPlan.OtherCostsChangePA;
      _sonstigeErträgeProJahrAltNeu = _investmentPlan.OtherRevenuePA;
      _änderungSonstigeErträgeProJahr = _investmentPlan.OtherRevenueChangePA;

      _nutzungsdauerVergleich = ComparisonModel.Lifetime;
      _investmentVergleich = ComparisonModel.InvestmentSum;
      _restwertInvestitionHeuteVergleich = ComparisonModel.RecoveryValueToday;
      _restWertNachEndeNutzungsdauerVergleich = ComparisonModel.RecoveryValueAfterLifetime;
      _energieKostenVergleich = ComparisonModel.EnergyCostsAnnual;
      _änderungEnergiekostenProJahrVergleich = ComparisonModel.EnergyCostsChangePA;
      _sonstigeKostenProJahrVergleich = ComparisonModel.OtherCostsPA;
      _sonstigeErträgeProJahrVergleich = ComparisonModel.OtherRevenuePA;
    }

    private void Calculate()
    {
      try
      {
        StaticAmortization = CalculateStaticAmortization();
        StaticAmortizationPercentage = CalculateStaticAmortizationPercentage();
        KreditFürInvestition = CalculateKreditFürInvestition();
        Payments = CalculatePayments();
        Kapitalwert = CalculateKapitalwert();
        DynamicAmortization = CalculateDynamicAmortization();
        DynamicAmortizationPercentage = CalculateDynamicAmortizationPercentage();
        InterneVerzinsung = CalculateInterneVerzinsung();
        JahreskostenAltNeu = CalculateJahreskostenAltNeu();
        JahreskostenVergleich = CalculateJahreskostenVergleich();
        Kostenersparnis = CalculateKostenersparnis();
        KapitalwertArrayInvestition = CalculateKapitalwertInvestitionArray();
        KapitalwertArrayKosten = CalculateKapitalwertKostenArray();
        KapitalwertArrayNutzungsdauer = CalculateKapitalwertNutzungsdauerArray();
      }
      catch (Exception e)
      {
        Console.WriteLine(e);
      }
    }


    public double[,] KapitalwertArrayNutzungsdauer { get; set; }

    private double CalculateKostenersparnis()
    {
      return JahreskostenAltNeu - JahreskostenVergleich;
    }

    private double CalculateJahreskosten(int nd, double invest, double restwert, double energieK, double ändEP, double sonstigeK, double sonstigeEr)
    {
      double erg = 0;
      if (_kalkulatorischerZinssatz != 0)
      {
        for (var jahr = 1; jahr <= nd; jahr++)
        {
          erg = erg + (energieK * Math.Pow(1 + ändEP,
            jahr - 1) + sonstigeK * Math.Pow(1 + _änderungSonstigeKostenProJahr,
              jahr - 1) - sonstigeEr * Math.Pow(1 + _änderungSonstigeErträgeProJahr,
                jahr - 1)) / Math.Pow(1 + _kalkulatorischerZinssatz,
                  jahr);
        }
        erg = erg * (_kalkulatorischerZinssatz * Math.Pow(1 + _kalkulatorischerZinssatz,
          nd)) / (Math.Pow(1 + _kalkulatorischerZinssatz,
            nd) - 1);
        erg = erg + invest * (_kalkulatorischerZinssatz * Math.Pow(1 + _kalkulatorischerZinssatz,
          nd)) / (Math.Pow(1 + _kalkulatorischerZinssatz,
            nd) - 1);
        erg = erg - restwert / Math.Pow(1 + _kalkulatorischerZinssatz,
          nd) * (_kalkulatorischerZinssatz * Math.Pow(1 + _kalkulatorischerZinssatz,
            nd)) / (Math.Pow(1 + _kalkulatorischerZinssatz,
              nd) - 1);
      }
      else
      {
        for (var jahr = 1; jahr <= nd - 1; jahr++)
        {
          erg = erg + (energieK * Math.Pow(1 + ändEP,
            jahr) + sonstigeK * Math.Pow(1 + _änderungSonstigeKostenProJahr,
              jahr) - sonstigeEr * Math.Pow(1 + _änderungSonstigeKostenProJahr,
                jahr)) / Math.Pow(1 + _kalkulatorischerZinssatz,
                  jahr);
        }
        erg = erg / nd + invest / nd - restwert / nd;
      }
      return erg;
    }

    private double CalculateJahreskostenVergleich()
    {
      return CalculateJahreskosten(_nutzungsdauerVergleich,
        _investmentVergleich - _restwertInvestitionHeuteAltNeu,
        _restWertNachEndeNutzungsdauerVergleich,
        _energieKostenVergleich,
        _änderungEnergiekostenProJahrVergleich,
        _sonstigeKostenProJahrVergleich,
        _sonstigeErträgeProJahrVergleich);
    }

    private double CalculateJahreskostenAltNeu()
    {
      return CalculateJahreskosten(_nutzungsdauerAltNeu,
        _investmentAltNeu,
        _restWertNachEndeNutzungsdauerAltNeu,
        _energieKostenAltNeu,
        _änderungEnergiekostenProJahrAltNeu,
        _sonstigeKostenProJahrAltNeu,
        _sonstigeErträgeProJahrAltNeu);
    }

    private double CalculateInterneVerzinsung()
    {
        if (Payments.Any(p => p.Überschüsse <= 0 && p.JährlicherRückfluss >= 0)) // Fixed crash if investment old > investment new
        {
            var betrag = KreditFürInvestition > 0 ? -KreditFürInvestition : 0;
            var values = new[]{
                            betrag
                          }.Concat(Payments.Select(p => p.JährlicherRückfluss)).
              ToArray();
            try
            {
                return Financial.IRR(ref values);
            }
            catch
            {
                return 0;
            }
        }
      return 0;
     
    }

    private double CalculateDynamicAmortization()
    {
      double dynintv = Payments.Count(p => p.Abzahlungsbetrag != 0);
      var ersterOhneAbzahlungsbetrag = new Payment();
      if (!Payments.Any(p => p.Abzahlungsbetrag == 0))
      {
        var nullPayment = new Payment();
        nullPayment.Abzahlungsbetrag = 0;
        nullPayment.JährlicherRückfluss = 0;
        nullPayment.Tilgung = 0;
        nullPayment.Zins = 0;
        nullPayment.Überschüsse = 0;
        nullPayment.Kapitalwert = 0;
        ersterOhneAbzahlungsbetrag = nullPayment;
      }
      else
      {
        ersterOhneAbzahlungsbetrag = Payments.First(p => p.Abzahlungsbetrag == 0);
      }


      var berechnung = (-ersterOhneAbzahlungsbetrag.Zins - ersterOhneAbzahlungsbetrag.Tilgung) / ersterOhneAbzahlungsbetrag.JährlicherRückfluss;
      if (dynintv > 0 && (ersterOhneAbzahlungsbetrag.Year - _startjahr < _nutzungsdauerAltNeu || (ersterOhneAbzahlungsbetrag.Year - _startjahr == _nutzungsdauerAltNeu && berechnung <= 1)))
      {
        return dynintv + berechnung;
      }
      if (dynintv == 0 && ersterOhneAbzahlungsbetrag.Tilgung < 0)
      {
        return berechnung;
      }
      return double.NaN;
    }

    private double CalculateKapitalwert()
    {
      var betrag = KreditFürInvestition < 0 ? -KreditFürInvestition : 0;
      return Payments.Sum(p => p.Kapitalwert) + betrag;
    }

    private double CalculateStaticAmortization()
    {
      return (_investmentVergleich * _nutzungsdauerAltNeu / _nutzungsdauerVergleich - _investmentAltNeu - _restwertInvestitionHeuteAltNeu + _restWertNachEndeNutzungsdauerAltNeu - _restWertNachEndeNutzungsdauerVergleich * _nutzungsdauerAltNeu / _nutzungsdauerVergleich) / (_energieKostenAltNeu - _energieKostenVergleich + _sonstigeKostenProJahrAltNeu - _sonstigeKostenProJahrVergleich - _sonstigeErträgeProJahrAltNeu + _sonstigeErträgeProJahrVergleich);
    }

    private double CalculateStaticAmortizationPercentage()
    {
      return StaticAmortization / _nutzungsdauerAltNeu * 100;
    }

    private double CalculateDynamicAmortizationPercentage()
    {
      return DynamicAmortization / _nutzungsdauerAltNeu * 100;
    }

    private double CalculateKreditFürInvestition()
    {
      return -Financial.PV(_kalkulatorischerZinssatz,
        _nutzungsdauerAltNeu,
        -Financial.Pmt(_kalkulatorischerZinssatz,
          _nutzungsdauerVergleich,
          _investmentVergleich)) - _investmentAltNeu - Financial.PV(_kalkulatorischerZinssatz,
            _nutzungsdauerAltNeu,
            Financial.Pmt(_kalkulatorischerZinssatz,
              _nutzungsdauerVergleich,
              _restWertNachEndeNutzungsdauerVergleich / Math.Pow((1 + _kalkulatorischerZinssatz),
                _nutzungsdauerVergleich)) - _restwertInvestitionHeuteAltNeu + _restWertNachEndeNutzungsdauerAltNeu / Math.Pow((1 + _kalkulatorischerZinssatz),
                  _nutzungsdauerAltNeu));
    }


    private IEnumerable<Payment> CalculatePayments()
    {
      var payments = new List<Payment>();
      var betrag = KreditFürInvestition > 0 ? -KreditFürInvestition : 0;
      for (var year = 1; year <= _nutzungsdauerAltNeu; year++)
      {
        var payment = new Payment{
                                   Year = _startjahr + year
                                 };
        payment.JährlicherRückfluss = CalculateJährlicherRückfluss(year);

        if (betrag < 0 && payment.JährlicherRückfluss > 0)
        {
          payment.Zins = betrag * _kalkulatorischerZinssatz;
          payment.Tilgung = (betrag < (-payment.JährlicherRückfluss - payment.Zins) ? -payment.JährlicherRückfluss - payment.Zins : betrag);
        }
        else
        {
          payment.Zins = 0;
          payment.Tilgung = 0;
        }

        betrag = betrag - payment.Tilgung < 0 && payment.JährlicherRückfluss > 0 ? betrag - payment.Tilgung : 0;

        payment.Abzahlungsbetrag = betrag;

        payment.Überschüsse = payment.Zins + payment.Tilgung + payment.JährlicherRückfluss;

        var test = CalculateJährlicherRückfluss(year + 1);


        if (payment.Überschüsse > 0)
        {
          payment.Kapitalwert = payment.Überschüsse / Math.Pow((1 + _kalkulatorischerZinssatz),
            year);
        }
        else if (payment.Abzahlungsbetrag < 0 && test == 0)
        {
          payment.Kapitalwert = payment.Abzahlungsbetrag / Math.Pow((1 + _kalkulatorischerZinssatz),
            year);
        }
        else
        {
          payment.Kapitalwert = 0;
        }

        payments.Add(payment);
      }
      return payments;
    }

    private double CalculateJährlicherRückfluss(int year)
    {
      if (year <= _nutzungsdauerAltNeu)
      {
        var abstand = year - 1;
        return _energieKostenAltNeu * Math.Pow((1 + _änderungEnergiekostenProJahrAltNeu),
          abstand) - _energieKostenVergleich * Math.Pow((1 + _änderungEnergiekostenProJahrVergleich),
            abstand) + (_sonstigeKostenProJahrAltNeu - _sonstigeKostenProJahrVergleich) * Math.Pow((1 + _änderungSonstigeKostenProJahr),
              abstand) - (_sonstigeErträgeProJahrAltNeu - _sonstigeErträgeProJahrVergleich) * Math.Pow((1 + _änderungSonstigeErträgeProJahr),
                abstand);
      }
      return 0;
    }


    private double[,] CalculateKapitalwertInvestitionArray()
    {
      var values = new double[1000, 5];


      var investitionAltNeu = _investmentAltNeu;
      var investitionVergleich = _investmentVergleich;
      var restwertHeuteAltNeu = _restwertInvestitionHeuteAltNeu;
      var restwertNutzungsdauerAltNeu = _restWertNachEndeNutzungsdauerAltNeu;
      var restwertNutzungsdauerVergleich = _restWertNachEndeNutzungsdauerVergleich;


      for (var i = 0; i < 1000; i++)
      {
        _investmentAltNeu = investitionAltNeu * (0.5 + i * 0.001);
        _investmentVergleich = investitionVergleich * (0.5 + i * 0.001);
        _restwertInvestitionHeuteAltNeu = restwertHeuteAltNeu * (0.5 + i * 0.001);
        _restWertNachEndeNutzungsdauerAltNeu = restwertNutzungsdauerAltNeu * (0.5 + i * 0.001);
        _restWertNachEndeNutzungsdauerVergleich = restwertNutzungsdauerVergleich * (0.5 + i * 0.001);
        KreditFürInvestition = CalculateKreditFürInvestition();
        Payments = CalculatePayments();

        values[i,
          0] = CalculateKreditFürInvestition();

        values[i,
          1] = CalculateKapitalwert();

        values[i,
          2] = CalculateInterneVerzinsung();

        values[i,
          3] = CalculateDynamicAmortization();

        values[i,
          4] = CalculateStaticAmortization();
      }

      _investmentAltNeu = investitionAltNeu;
      _investmentVergleich = investitionVergleich;
      _restwertInvestitionHeuteAltNeu = restwertHeuteAltNeu;
      _restWertNachEndeNutzungsdauerAltNeu = restwertNutzungsdauerAltNeu;
      _restWertNachEndeNutzungsdauerVergleich = restwertNutzungsdauerVergleich;
      KreditFürInvestition = CalculateKreditFürInvestition();
      Payments = CalculatePayments();
      return values;
    }

    private double[,] CalculateKapitalwertKostenArray()
    {
      var values = new double[1000, 5];

      var energieKostenAltNeu = _energieKostenAltNeu;
      var energieKostenVergleich = _energieKostenVergleich;
      var sonstigeKostenAltNeu = _sonstigeKostenProJahrAltNeu;
      var sonstigeKostenVergleich = _sonstigeKostenProJahrVergleich;
      var sonstigeErträgeAltNeu = _sonstigeErträgeProJahrAltNeu;
      var sonstigeErträgeVergleich = _sonstigeErträgeProJahrVergleich;


      for (var i = 0; i < 1000; i++)
      {
        _energieKostenAltNeu = energieKostenAltNeu * (0.5 + i * 0.001);
        _energieKostenVergleich = energieKostenVergleich * (0.5 + i * 0.001);
        _sonstigeKostenProJahrAltNeu = sonstigeKostenAltNeu * (0.5 + i * 0.001);
        _sonstigeKostenProJahrVergleich = sonstigeKostenVergleich * (0.5 + i * 0.001);
        _sonstigeErträgeProJahrAltNeu = sonstigeErträgeAltNeu * (0.5 + i * 0.001);
        _sonstigeErträgeProJahrVergleich = sonstigeErträgeVergleich * (0.5 + i * 0.001);
        KreditFürInvestition = CalculateKreditFürInvestition();
        Payments = CalculatePayments();

        values[i,
          0] = CalculateJährlicherRückfluss(1);
        
        values[i,
          1] = CalculateKapitalwert();
        
        values[i,
          2] = CalculateInterneVerzinsung();

        values[i,
          3] = CalculateDynamicAmortization();

        values[i,
          4] = CalculateStaticAmortization();
      }
      _energieKostenAltNeu = energieKostenAltNeu;
      _energieKostenVergleich = energieKostenVergleich;
      _sonstigeKostenProJahrAltNeu = sonstigeKostenAltNeu;
      _sonstigeKostenProJahrVergleich = sonstigeKostenVergleich;
      _sonstigeErträgeProJahrAltNeu = sonstigeErträgeAltNeu;
      _sonstigeErträgeProJahrVergleich = sonstigeErträgeVergleich;
      KreditFürInvestition = CalculateKreditFürInvestition();
      Payments = CalculatePayments();
      return values;
    }

    private double[,] CalculateKapitalwertNutzungsdauerArray()
    {
      var values = new double[(_nutzungsdauerAltNeu * 2) + 1, 3];

      var nutzungsdauerAltNeu = _nutzungsdauerAltNeu;
      _nutzungsdauerAltNeu = 0;
      for (var i = 0; i < (nutzungsdauerAltNeu * 2) + 1; i++)
      {
        _nutzungsdauerAltNeu = i;
        Payments = CalculatePayments();

        values[i,
          0] = _nutzungsdauerAltNeu;


        var betrag = KreditFürInvestition > 0 ? -KreditFürInvestition : 0;
        var values2 = new[]{
                             betrag
                           }.Concat(Payments.Select(p => p.JährlicherRückfluss)).
          ToArray();
        var ergebnis = Financial.NPV(_kalkulatorischerZinssatz,
          ref values2) * (1 + _kalkulatorischerZinssatz);
        
        values[i,
          1] = ergebnis;


        values[i,
           2] = CalculateInterneVerzinsung();
        
      }

      _nutzungsdauerAltNeu = nutzungsdauerAltNeu;
      Payments = CalculatePayments();
      return values;
    }
  }

  public struct Payment
  {
    public int Year { get; set; }
    public double JährlicherRückfluss { get; set; }
    public double Zins { get; set; }
    public double Tilgung { get; set; }
    public double Überschüsse { get; set; }
    public double Abzahlungsbetrag { get; set; }
    public double Kapitalwert { get; set; }
  }
}