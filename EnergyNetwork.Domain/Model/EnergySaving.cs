using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class EnergySaving
  {
    [Key]
    [DataMember]
    public virtual Guid EnergySavingId { get; set; }

    [DataMember]
    public virtual double Value { get; set; }

    [DataMember]
    public virtual Guid EnergySourceId { get; set; }

    [ForeignKey("EnergySourceId")]
    [DataMember]
    public virtual EnergySource EnergySource { get; set; }

    [DataMember]
    public virtual Guid MeasureId { get; set; }

    [ForeignKey("MeasureId")]
    [DataMember]
    public virtual Measure Measure { get; set; }
  }
}