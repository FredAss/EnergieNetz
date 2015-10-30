using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Measure
  {
    [Key]
    [DataMember]
    public virtual Guid MeasureId { get; set; }

    [DataMember]
    public virtual DateTime RelatedDuration { get; set; }

    [DataMember]
    [Required]
    [StringLength(200)]
    public virtual string Title { get; set; }

    [DataMember]
    [Required]
    [StringLength(500)]
    [DataType(DataType.MultilineText)]
    public virtual string Description { get; set; }

    [DataMember]
    public virtual ICollection<EnergySaving> EnergySavings { get; set; }

    [DataMember]
    public virtual double Investment { get; set; }

    [DataMember]
    public virtual int Duration { get; set; }

    [DataMember]
    public virtual Guid StateId { get; set; }

    [ForeignKey("StateId")]
    [DataMember]
    public virtual MeasureState State { get; set; }

    [DataMember]
    public virtual DateTime LastChange { get; set; }

    [DataMember]
    public virtual Guid NetworkCompanyId { get; set; }

    [ForeignKey("NetworkCompanyId")]
    [DataMember]
    public virtual NetworkCompany NetworkCompany { get; set; }
  }
}