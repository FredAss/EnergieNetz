using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Invitation
  {
    [Key]
    [DataMember]
    public virtual Guid InvitationId { get; set; }

    [DataMember]
    public virtual string Email { get; set; }

    [DataMember]
    public virtual string InvitedFrom { get; set; }

    [DataMember]
    public virtual Guid? NetworkId { get; set; }

    [ForeignKey("NetworkId")]
    [DataMember]
    public virtual Network Network { get; set; }

    [DataMember]
    public virtual Guid? CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    [DataMember]
    public virtual Company Company { get; set; }

    [Required]
    [StringLength(500)]
    [DataType(DataType.MultilineText)]
    [DataMember]
    public virtual string Message { get; set; }

    [DataMember]
    public virtual DateTime Date { get; set; }
  }
}