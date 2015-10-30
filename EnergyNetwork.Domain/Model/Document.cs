using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Document
  {
    [DataMember]
    public virtual Guid SurveyId { get; set; }

    [ForeignKey("SurveyId")]
    [DataMember]
    public virtual Survey Survey { get; set; }

    [DataMember]
    public virtual Guid DocumentId { get; set; }

    [Required]
    [DataMember]
    public virtual string Title { get; set; }

    [DataMember]
    public virtual string FileName { get; set; }

    [DataMember]
    public virtual string Description { get; set; }

    [DataMember]
    public virtual string DocumentContentId { get; set; }

  }
}