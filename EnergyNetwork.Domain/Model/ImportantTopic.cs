using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  public class ImportantTopic
  {
    [DataMember]
    public Guid ImportantTopicId { get; set; }

    [DataMember]
    public Guid SurveyId { get; set; }

    [ForeignKey("SurveyId")]
    [DataMember]
    public virtual Survey Survey { get; set; }

    [DataMember]
    [Required]
    [DataType(DataType.MultilineText)]
    public virtual string Description { get; set; }
  }
}