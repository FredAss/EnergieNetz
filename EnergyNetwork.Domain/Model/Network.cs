using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
    public class Network
  {
    [Key]
    [DataMember]
    public virtual Guid NetworkId { get; set; }

    [Required]
    [StringLength(200)]
    [DataMember]
    public virtual string Name { get; set; }

    [Required]
    [StringLength(500)]
    [DataType(DataType.MultilineText)]
    [DataMember]
    public virtual string Description { get; set; }

    [Required]
    [DataMember]
    [DataType(DataType.Date)]
    public virtual DateTime StartDate { get; set; }

    [Required]
    [DataMember]
    [DataType(DataType.Date)]
    public virtual DateTime EndDate { get; set; }

    [DataMember]
    public virtual ICollection<NetworkCompany> NetworkCompanies { get; set; }

    [DataMember]
    public virtual ICollection<Invitation> Invitations { get; set; }
  }
}