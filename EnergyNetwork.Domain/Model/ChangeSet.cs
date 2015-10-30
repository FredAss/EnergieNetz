using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace EnergyNetwork.Domain.Model
{
  [DataContract(IsReference = true)]
  public class ChangeSet
  {
    [Key]
    [DataMember]
    public virtual Guid ChangeSetId { get; set; }

    [DataMember]
    public virtual string Username { get; set; }

    [DataMember]
    [DataType(DataType.Date)]
    public virtual DateTime Date { get; set; }

    [DataMember]
    public virtual string ActionType { get; set; }

    [DataMember]
    public virtual string EType { get; set; }

    [DataMember]
    public virtual string ETitle { get; set; }

    [DataMember]
    public virtual string EId { get; set; }

    [DataMember]
    public virtual string AffectedCompanyId { get; set; }

    [DataMember]
    public virtual ICollection<Change> Changes { get; set; }
  
  }
}