using System;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class MeasureState
  {
    [Key]
    [DataMember]
    public virtual Guid Id { get; set; }

    [DataMember]
    [Required]
    public virtual int Index { get; set; }

    [DataMember]
    [Required]
    [StringLength(200)]
    public virtual string Title { get; set; }
  }
}