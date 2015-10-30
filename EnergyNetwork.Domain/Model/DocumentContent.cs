using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class DocumentContent
  {

    [DataMember]
    public virtual Guid DocumentContentId { get; set; }
    
    [DataMember]
    public virtual string ContentType { get; set; }

    [Required]
    [DataMember]
    public virtual byte[] Content { get; set; }
  }
}