using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class Change
  {
    [Key]
    [DataMember]
    public virtual Guid ChangeId { get; set; }

    [DataMember]
    public virtual string ActionType { get; set; }

    [DataMember]
    public virtual string Property { get; set; }
      
    [DataMember]
    public virtual string PropertyType { get; set; }

    [DataMember]
    public virtual string OldValue { get; set; }

    [DataMember]
    public virtual string NewValue { get; set; }

    [DataMember]
    public virtual string EType { get; set; }

    [DataMember]
    public virtual string EId { get; set; }

    [DataMember]
    public virtual Guid ChangeSetId { get; set; }

    [ForeignKey("ChangeSetId")]
    [DataMember]
    public virtual ChangeSet ChangeSet { get; set; }
  
  }
}