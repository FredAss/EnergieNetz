using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public abstract class Calculation
  {
    [Key]
    [DataMember]
    public virtual Guid Id { get; set; }

    [DataMember]
    public virtual int Lifetime { get; set; }

    [DataMember]
    public virtual float InvestmentSum { get; set; }

    [DataMember]
    public virtual float RecoveryValueToday { get; set; }

    [DataMember]
    public virtual float RecoveryValueAfterLifetime { get; set; }

    [DataMember]
    public virtual float EnergyCostsAnnual { get; set; }

    [DataMember]
    public virtual float EnergyCostsChangePA { get; set; }

    [DataMember]
    public virtual float OtherCostsPA { get; set; }

    [DataMember]
    public virtual float OtherRevenuePA { get; set; }

    [DataMember]
    public virtual Guid CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    [DataMember]
    public virtual Company Company { get; set; }
  }
}