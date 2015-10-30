using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using Microsoft.AspNet.Identity.EntityFramework;

namespace EnergyNetwork.Domain.Model
{
  /// <summary>
  ///  User Profile entity
  /// </summary>
  [DataContract(IsReference = true)]
  public class UserProfile: IdentityUser
  {
    [Key]
    [DataMember]
    public override string Id { get; set; }

    [Required]
    [StringLength(30)]
    [DataMember]
    public virtual string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    [DataMember]
    public virtual string LastName { get; set; }

    [DataMember]
    public override string Email { get; set; }

    [DataMember]
    public override string PhoneNumber { get; set; }

    [DataMember]
    public virtual Guid? CompanyId { get; set; }

    [ForeignKey("CompanyId")]
    [DataMember]
    public virtual Company Company { get; set; }

    [DataMember]
    public virtual bool Activated { get; set; }
  }
}