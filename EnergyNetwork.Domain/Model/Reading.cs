using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Reading
  {
    [Key]
    [DataMember]
    public virtual Guid ReadingId { get; set; }

    [DataMember]
    public virtual Guid EnergySourceId { get; set; }

    [ForeignKey("EnergySourceId")]
    [DataMember]
    public virtual EnergySource EnergySource { get; set; }

    [DataMember]
    public virtual double Value { get; set; }

    [DataMember]
    public virtual Guid SurveyId
    {
      get;
      set;
    }

    [ForeignKey("SurveyId")]
    [DataMember]
    public virtual Survey Survey
    {
      get;
      set;
    }
  }
}